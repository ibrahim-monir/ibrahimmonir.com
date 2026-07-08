<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ContentImport extends Command
{
    protected $signature = 'content:import
        {--path= : Override input file path}
        {--mirror : Also delete rows that are absent from the file (per table)}';

    protected $description = 'Import the git-tracked content.json into the DB (add/update only by default)';

    public function handle(): int
    {
        $path = $this->option('path') ?: database_path('content.json');

        if (! is_file($path)) {
            $this->warn("content.json not found at {$path} — nothing to import.");
            return self::SUCCESS;
        }

        $data = json_decode((string) file_get_contents($path), true);
        $tables = $data['tables'] ?? null;

        if (! is_array($tables)) {
            $this->error('content.json is malformed (missing "tables").');
            return self::FAILURE;
        }

        $mirror = (bool) $this->option('mirror');
        $driver = DB::getDriverName();
        $upserted = 0;
        $deleted = 0;

        $this->setForeignKeyChecks($driver, false);

        try {
            DB::transaction(function () use ($tables, $mirror, &$upserted, &$deleted) {
                foreach ($tables as $table => $rows) {
                    if (! Schema::hasTable($table)) {
                        $this->line("  skip {$table} (no such table)");
                        continue;
                    }
                    if (empty($rows)) {
                        // Never wipe a table just because the export was empty.
                        continue;
                    }

                    $cols = Schema::getColumnListing($table);
                    $key = in_array('id', $cols, true) ? 'id' : array_key_first($rows[0]);
                    $seen = [];

                    foreach ($rows as $row) {
                        $row = array_intersect_key($row, array_flip($cols)); // drop unknown cols
                        if (! array_key_exists($key, $row)) {
                            continue;
                        }
                        DB::table($table)->updateOrInsert([$key => $row[$key]], $row);
                        $seen[] = $row[$key];
                        $upserted++;
                    }

                    if ($mirror && $seen) {
                        $deleted += DB::table($table)->whereNotIn($key, $seen)->delete();
                    }

                    $this->line(sprintf('  %-22s %d rows', $table, count($rows)));
                }
            });
        } finally {
            $this->setForeignKeyChecks($driver, true);
        }

        $msg = "Imported {$upserted} rows";
        if ($mirror) {
            $msg .= " (mirror: deleted {$deleted})";
        }
        $this->info($msg);

        return self::SUCCESS;
    }

    private function setForeignKeyChecks(string $driver, bool $on): void
    {
        try {
            if ($driver === 'mysql' || $driver === 'mariadb') {
                DB::statement('SET FOREIGN_KEY_CHECKS=' . ($on ? '1' : '0'));
            } elseif ($driver === 'sqlite') {
                DB::statement('PRAGMA foreign_keys = ' . ($on ? 'ON' : 'OFF'));
            } elseif ($driver === 'pgsql' && ! $on) {
                // Postgres has no global toggle; deferred constraints handle ordering.
            }
        } catch (\Throwable) {
            // Non-fatal: ordering + transaction usually suffice.
        }
    }
}
