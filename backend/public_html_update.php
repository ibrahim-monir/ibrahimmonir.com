<?php

/**
 * ibrahimmonir.com — backend update endpoint.
 *
 * Deployed to public_html/update.php (root, alongside index.html), while
 * Laravel itself lives in ~/ibrahimmonir-laravel -- see
 * backend/public_html_index.php for why it isn't just "~/laravel" (that name
 * is already upokoron.com's own app, on the same account). Follows Upokoron's deploy/update.php
 * pattern: the deploy pipeline has no SSH access to this account, only the
 * cPanel API for uploading and extracting files, so anything that needs to
 * run WITH the live .env and database (migrations, seeders, cache rebuilds,
 * copying Filament's server-published assets into the web root) happens here,
 * triggered by an authenticated HTTP request from CI right after extraction.
 *
 * Gated on UPDATE_TOKEN in .env, read straight from the file rather than
 * through env(), so blanking that one line switches this off instantly, with
 * no cache to clear and no second step to forget.
 */

$app_root = __DIR__.'/../ibrahimmonir-laravel';
$web_root = __DIR__;

if (! is_file($app_root.'/vendor/autoload.php')) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');

    exit(
        "ibrahimmonir.com's backend is not installed at the expected location.\n\n"
        ."Looked for: ".$app_root."/vendor/autoload.php\n"
        ."This file:  ".__FILE__."\n"
    );
}

require $app_root.'/vendor/autoload.php';

$app = require_once $app_root.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

@set_time_limit(300);

/**
 * Reads a value straight out of .env.
 *
 * Not env(): once caches are rebuilt below, Laravel stops loading the .env
 * file at all and env() returns null. Reading the file keeps the token check
 * working after an update, which is exactly when it is needed again.
 */
function env_file(string $key, string $default = ''): string
{
    static $values = null;

    if ($values === null) {
        $values = [];
        $path = $GLOBALS['app_root'].'/.env';

        foreach (is_file($path) ? file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [] as $line) {
            $line = trim($line);

            if ($line === '' || $line[0] === '#' || ! str_contains($line, '=')) {
                continue;
            }

            [$name, $value] = explode('=', $line, 2);

            $values[trim($name)] = trim(trim($value), "\"'");
        }
    }

    return $values[$key] ?? $default;
}

$token = env_file('UPDATE_TOKEN');
$given = (string) ($_REQUEST['token'] ?? '');
$authorised = $token !== '' && hash_equals($token, $given);

/**
 * Which build is actually on the server.
 *
 * Written by deploy.yml into ibrahimmonir-laravel/build.json. Worth showing before
 * anything runs: if this still reads the previous commit, the upload did
 * not land where expected.
 */
function build_info(): array
{
    $path = $GLOBALS['app_root'].'/build.json';

    if (! is_file($path)) {
        return ['ok' => false, 'detail' => 'no build.json — this bundle predates the update pipeline'];
    }

    $build = json_decode((string) file_get_contents($path), true);

    if (! is_array($build)) {
        return ['ok' => false, 'detail' => 'build.json is unreadable'];
    }

    return [
        'ok' => true,
        'detail' => ($build['commit'] ?? '?').'  ·  built '.($build['built_at'] ?? '?'),
        'commit' => $build['commit'] ?? '?',
    ];
}

/**
 * Does vendor/ match composer.lock?
 */
function vendor_matches_lock(): array
{
    $root = $GLOBALS['app_root'];
    $lockPath = $root.'/composer.lock';
    $installedPath = $root.'/vendor/composer/installed.php';

    if (! is_file($lockPath) || ! is_file($installedPath)) {
        return ['ok' => false, 'detail' => 'cannot compare: composer.lock or vendor/composer/installed.php is missing'];
    }

    $lock = json_decode((string) file_get_contents($lockPath), true);
    $installed = require $installedPath;

    $wanted = [];

    foreach (($lock['packages'] ?? []) as $package) {
        $wanted[$package['name']] = $package['version'];
    }

    $have = [];

    foreach (($installed['versions'] ?? []) as $name => $meta) {
        if (isset($meta['pretty_version'])) {
            $have[$name] = $meta['pretty_version'];
        }
    }

    $missing = [];
    $wrong = [];

    foreach ($wanted as $name => $version) {
        if (! isset($have[$name])) {
            $missing[] = $name;
        } elseif ($have[$name] !== $version) {
            $wrong[] = "{$name} (have {$have[$name]}, want {$version})";
        }
    }

    if ($missing === [] && $wrong === []) {
        return ['ok' => true, 'detail' => count($wanted).' packages, all present at the locked versions'];
    }

    $problems = array_merge(
        $missing ? [count($missing).' missing: '.implode(', ', array_slice($missing, 0, 5))] : [],
        $wrong ? [count($wrong).' at the wrong version: '.implode(', ', array_slice($wrong, 0, 3))] : [],
    );

    return [
        'ok' => false,
        'detail' => implode(' · ', $problems).' — the uploaded bundle is incomplete',
    ];
}

/**
 * Migrations that have not run yet, by name.
 */
function pending_migrations(): array
{
    try {
        Artisan::call('migrate:status', ['--pending' => true]);

        $output = trim(Artisan::output());

        if ($output === '' || str_contains($output, 'No pending migrations')) {
            return ['ok' => true, 'detail' => 'none — the schema is current', 'count' => 0];
        }

        $lines = array_values(array_filter(
            array_map('trim', explode("\n", $output)),
            static fn (string $line): bool => str_contains($line, '_') && ! str_starts_with($line, 'Migration'),
        ));

        return ['ok' => true, 'detail' => count($lines).' waiting to run', 'count' => count($lines), 'list' => $lines];
    } catch (Throwable $e) {
        return ['ok' => false, 'detail' => 'could not read migration status: '.$e->getMessage(), 'count' => 0];
    }
}

/**
 * Copies Laravel's public/ directory (Filament's published assets included)
 * into the actual web root at public_html/app/, skipping the front
 * controller and any stock .htaccess so this never clobbers
 * public_html_index.php or hands request routing to a second .htaccess.
 *
 * This has to happen here, not in CI, because filament:upgrade and
 * vendor:publish below write their output into ibrahimmonir-laravel/public/ -- which sits
 * outside the web root by design (see public_html_index.php) -- and there is
 * no SSH access to `cp` it into place afterwards.
 */
function publish_public_assets(string $appRoot, string $webRoot): void
{
    $source = $appRoot.'/public';
    $dest = $webRoot.'/app';
    $skip = ['index.php', '.htaccess'];

    $copy = static function (string $src, string $dst) use (&$copy, $skip, $source) {
        foreach (scandir($src) ?: [] as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            if ($src === $source && in_array($item, $skip, true)) {
                continue;
            }

            $s = $src.'/'.$item;
            $d = $dst.'/'.$item;

            if (is_dir($s)) {
                if (! is_dir($d)) {
                    mkdir($d, 0755, true);
                }
                $copy($s, $d);
            } else {
                copy($s, $d);
            }
        }
    };

    if (is_dir($source)) {
        $copy($source, $dest);
    }
}

$report = [];

if ($authorised) {
    try {
        DB::connection()->getPdo();
        $report['Database'] = ['ok' => true, 'detail' => 'connected to '.DB::connection()->getDatabaseName()];
    } catch (Throwable $e) {
        $report['Database'] = ['ok' => false, 'detail' => $e->getMessage()];
    }

    $report['Build on server'] = build_info();
    $report['Dependencies'] = vendor_matches_lock();
    $report['Pending migrations'] = pending_migrations();
}

$blocked = isset($report['Database']) && ! $report['Database']['ok'];
$blocked = $blocked || (isset($report['Dependencies']) && ! $report['Dependencies']['ok']);

$output = null;
$failed = false;

if ($authorised && ! $blocked && ($_POST['action'] ?? '') === 'update') {
    // Two updates running at once would have two migration processes racing
    // for the same tables. The lock is released when the request ends, even
    // if it dies, because the handle goes with it.
    $lockPath = $app_root.'/storage/framework/update.lock';
    $lock = fopen($lockPath, 'c');

    if ($lock === false || ! flock($lock, LOCK_EX | LOCK_NB)) {
        http_response_code(409);

        $output = 'Another update is already running. Wait for it to finish, then reload.';
        $failed = true;
    } else {
        $lines = [];

        // Same order the old SSH-based deploy used. package:discover and
        // filament:upgrade run with --no-scripts skipped during `composer
        // install`, so they have to happen explicitly, against the real
        // .env, before anything else touches the database.
        $steps = [
            'package:discover' => ['--ansi' => true],
            'filament:upgrade' => [],
            'migrate' => ['--force' => true],
            'storage:link' => ['--force' => true],
            'db:seed' => ['--class' => 'Database\\Seeders\\AdminUserSeeder', '--force' => true],
        ];

        // Each additional seeder is its own db:seed call (Artisan::call
        // can't repeat a key), so they're appended rather than declared above.
        $seeders = [
            'WorkSeeder',
            'ArnaFashionWorkSeeder',
            'ImportExistingMediaSeeder',
            'PricingSeeder',
            'ServiceSeeder',
            'SocialLinkSeeder',
        ];

        $tail = [
            'optimize:clear' => [],
            'config:cache' => [],
            'route:cache' => [],
            'view:cache' => [],
            'vendor:publish' => ['--tag' => 'filament-assets', '--force' => true],
        ];

        $runStep = static function (string $command, array $arguments) use (&$lines, &$failed) {
            $lines[] = '$ php artisan '.$command;

            try {
                $status = Artisan::call($command, $arguments);
                $lines[] = trim(Artisan::output());

                if ($status !== 0) {
                    $failed = true;
                    $lines[] = '!! '.$command.' exited with status '.$status;
                }
            } catch (Throwable $e) {
                $failed = true;
                $lines[] = '!! '.$e->getMessage();
            }

            $lines[] = '';
        };

        foreach ($steps as $command => $arguments) {
            $runStep($command, $arguments);
            if ($failed) {
                break;
            }
        }

        if (! $failed) {
            foreach ($seeders as $class) {
                $runStep('db:seed', ['--class' => 'Database\\Seeders\\'.$class, '--force' => true]);
                if ($failed) {
                    break;
                }
            }
        }

        if (! $failed) {
            foreach ($tail as $command => $arguments) {
                $runStep($command, $arguments);
                if ($failed) {
                    break;
                }
            }
        }

        if (! $failed) {
            $lines[] = '$ (copying ibrahimmonir-laravel/public into public_html/app)';

            try {
                publish_public_assets($app_root, $web_root);
                $lines[] = 'done';
            } catch (Throwable $e) {
                $failed = true;
                $lines[] = '!! '.$e->getMessage();
            }

            $lines[] = '';
        }

        // Git-tracked content is synced last and non-fatally, so an import
        // error can never turn an otherwise-successful deploy into a failed one.
        $lines[] = '$ php artisan content:import';

        try {
            $status = Artisan::call('content:import');
            $lines[] = trim(Artisan::output());

            if ($status !== 0) {
                $lines[] = '!! content:import failed (non-fatal)';
            }
        } catch (Throwable $e) {
            $lines[] = '!! content:import failed (non-fatal): '.$e->getMessage();
        }

        $output = implode("\n", $lines);

        flock($lock, LOCK_UN);
        fclose($lock);
    }

    @file_put_contents(
        $app_root.'/storage/logs/update.log',
        sprintf(
            "[%s] %s from %s — build %s\n",
            date('Y-m-d H:i:s'),
            $failed ? 'FAILED' : 'ok',
            $_SERVER['REMOTE_ADDR'] ?? '?',
            build_info()['commit'] ?? '?',
        ),
        FILE_APPEND,
    );
}
?>
<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Update ibrahimmonir.com</title>
<style>
  :root { --bg:#f6f8fb; --card:#fff; --ink:#0f172a; --muted:#64748b; --line:#e2e8f0;
          --ok:#0f8a4c; --warn:#b45309; --bad:#c2261a; --brand:#1e4be0; }
  * { box-sizing:border-box; }
  body { margin:0; padding:32px 16px 64px; background:var(--bg); color:var(--ink);
         font:15px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; }
  .wrap { max-width:760px; margin:0 auto; }
  h1 { font-size:26px; margin:0 0 6px; }
  .sub { color:var(--muted); margin:0 0 28px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:12px;
          padding:20px; margin-bottom:18px; }
  .row { display:flex; gap:12px; padding:9px 0; border-bottom:1px solid #f1f5f9; }
  .row:last-child { border-bottom:0; }
  .tag { flex:none; width:46px; height:22px; text-align:center; font-size:11px; font-weight:700;
         border-radius:4px; text-transform:uppercase; line-height:22px; }
  .ok  { background:#e7f6ee; color:var(--ok); }
  .bad { background:#fdeceb; color:var(--bad); }
  .k { flex:none; width:150px; font-weight:600; }
  .v { flex:1; min-width:0; word-break:break-word; color:var(--muted); }
  button { background:var(--brand); color:#fff; border:0; border-radius:8px; padding:13px 26px;
           font:600 16px system-ui; cursor:pointer; }
  button:disabled { background:#94a3b8; cursor:not-allowed; }
  pre { background:#0f172a; color:#e2e8f0; padding:16px; border-radius:8px; overflow-x:auto;
        font:13px/1.5 ui-monospace, Consolas, monospace; white-space:pre-wrap; }
  .banner { padding:16px 18px; border-radius:10px; margin-bottom:22px; font-weight:600; }
  .banner.good { background:#e7f6ee; color:var(--ok); border:1px solid #bfe6d0; }
  .banner.bad  { background:#fdeceb; color:var(--bad); border:1px solid #f5c8c4; }
  .banner p { font-weight:400; color:var(--ink); margin:8px 0 0; }
  code { background:#eef2f7; padding:2px 6px; border-radius:4px; font-size:13.5px; }
  ul { margin:8px 0 0; padding-left:20px; color:var(--muted); font-size:14px; }
</style>

<div class="wrap">
<?php if (! $authorised): ?>

  <h1>Not available</h1>
  <p class="sub">
    <?php if ($token === ''): ?>
      Updates are switched off. Add <code>UPDATE_TOKEN</code> to <code>.env</code>
      with a long random value to turn them back on.
    <?php else: ?>
      Add <code>?token=</code> and the update token to the address.
    <?php endif; ?>
  </p>

<?php elseif ($output !== null): ?>

  <div class="banner <?= $failed ? 'bad' : 'good' ?>">
    <?= $failed ? 'The update did not finish.' : 'Update applied.' ?>
    <p>
      <?php if ($failed): ?>
        Nothing after the failed step was run. The output below says why. Code
        already uploaded is not rolled back by this page.
      <?php else: ?>
        Migrations ran, seeders and caches rebuilt, and Filament's assets were
        copied into the web root. <a href="<?= htmlspecialchars(getenv('APP_URL') ?: '/') ?>">Open the site</a>.
      <?php endif; ?>
    </p>
  </div>

  <div class="card"><pre><?= htmlspecialchars($output) ?></pre></div>

<?php else: ?>

  <h1>Update ibrahimmonir.com</h1>
  <p class="sub">
    Applies database changes and rebuilds caches for code you have already
    uploaded. It does not upload, change, or delete any application file
    other than copying Laravel's own public/ output into public_html/app/.
  </p>

  <div class="card">
    <?php foreach ($report as $name => $row): ?>
      <div class="row">
        <span class="tag <?= $row['ok'] ? 'ok' : 'bad' ?>"><?= $row['ok'] ? 'ok' : 'check' ?></span>
        <span class="k"><?= htmlspecialchars($name) ?></span>
        <span class="v">
          <?= htmlspecialchars($row['detail']) ?>
          <?php if (! empty($row['list'])): ?>
            <ul>
              <?php foreach (array_slice($row['list'], 0, 12) as $item): ?>
                <li><?= htmlspecialchars($item) ?></li>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>
        </span>
      </div>
    <?php endforeach; ?>
  </div>

  <?php if ($blocked): ?>
    <div class="banner bad">
      Not safe to run yet.
      <p>Fix the item marked <strong>check</strong> above first. Nothing has
      been changed.</p>
    </div>
  <?php endif; ?>

  <form method="post">
    <input type="hidden" name="token" value="<?= htmlspecialchars($given) ?>">
    <button name="action" value="update" type="submit" <?= $blocked ? 'disabled' : '' ?>>
      <?= (($report['Pending migrations']['count'] ?? 0) > 0)
            ? 'Run '.$report['Pending migrations']['count'].' migration(s) and rebuild caches'
            : 'Rebuild caches' ?>
    </button>
  </form>

<?php endif; ?>
</div>
