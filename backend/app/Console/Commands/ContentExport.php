<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ContentExport extends Command
{
    protected $signature = 'content:export {--path= : Override output file path}';

    protected $description = 'Export all syncable DB tables to a git-tracked JSON file';

    /**
     * Transient / device-specific / security tables that must never be synced.
     */
    public const SKIP = [
        'migrations', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs',
        'sessions', 'password_reset_tokens', 'personal_access_tokens',
        // Credentials must not travel between environments — the live admin login
        // is managed by AdminUserSeeder, not by synced dev data.
        'users',
    ];

    public function handle(): int
    {
        $path = $this->option('path') ?: database_path('content.json');
        $database = DB::connection()->getDatabaseName();

        $tables = collect(Schema::getTableListing())
            // getTableListing() can return every schema on the server (`db.table`);
            // keep only tables that belong to THIS database.
            ->map(fn ($t) => $this->scopeToDatabase($t, $database))
            ->filter()
            ->reject(fn ($t) => in_array($t, self::SKIP, true))
            ->reject(fn ($t) => str_starts_with($t, 'wp_')) // leftover WordPress tables
            ->unique()
            ->sort()
            ->values();

        $out = [];
        $total = 0;

        foreach ($tables as $table) {
            try {
                $cols = Schema::getColumnListing($table);
                $orderBy = in_array('id', $cols, true) ? 'id' : ($cols[0] ?? null);

                $query = DB::table($table);
                if ($orderBy) {
                    $query->orderBy($orderBy);
                }

                $rows = $query->get()->map(fn ($r) => (array) $r)->all();
                $out[$table] = $rows;
                $total += count($rows);
                $this->line(sprintf('  %-22s %d', $table, count($rows)));
            } catch (\Throwable $e) {
                $this->warn("  skip {$table}: {$e->getMessage()}");
            }
        }

        // Stable, deterministic output so unchanged data produces no git diff.
        ksort($out);
        $json = json_encode(
            ['tables' => $out],
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );

        file_put_contents($path, $json . "\n");

        $this->info("Exported {$total} rows from {$tables->count()} tables → {$path}");

        return self::SUCCESS;
    }

    /**
     * Return the bare table name if it belongs to $database, else null.
     * Unqualified names (sqlite/pgsql single-db) are kept as-is.
     */
    private function scopeToDatabase(string $table, string $database): ?string
    {
        if (! str_contains($table, '.')) {
            return $table;
        }
        [$schema, $name] = explode('.', $table, 2);

        return $schema === $database ? $name : null;
    }
}
