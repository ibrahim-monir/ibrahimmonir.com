<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ContentExport extends Command
{
    protected $signature = 'content:export {--path= : Override output file path}';

    protected $description = 'Export the syncable DB tables to a git-tracked JSON file';

    /**
     * Only these tables travel between machines/live via content.json. Everything
     * else (contacts, invoices, clients, experiences, blog_posts, users, ...) is
     * per-environment business data — syncing it risks overwriting real production
     * records with stale local dev data. See commit ebe981b.
     */
    public const ALLOWED = ['services', 'testimonials', 'media'];

    public function handle(): int
    {
        $path = $this->option('path') ?: database_path('content.json');
        $database = DB::connection()->getDatabaseName();

        $tables = collect(Schema::getTableListing())
            // getTableListing() can return every schema on the server (`db.table`);
            // keep only tables that belong to THIS database.
            ->map(fn ($t) => $this->scopeToDatabase($t, $database))
            ->filter()
            ->filter(fn ($t) => in_array($t, self::ALLOWED, true))
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
