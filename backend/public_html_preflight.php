<?php
/**
 * ibrahimmonir.com — cPanel preflight check.
 *
 * Adapted from upokoron's deploy/preflight.php (same cPanel account, same
 * shape of problem). Upload THIS ONE FILE to public_html/ and open it in a
 * browser BEFORE running the GitHub Actions deploy for the first time. It
 * answers one question: will this hosting account actually run the app?
 *
 * Deliberately written in old PHP syntax (5.4-compatible, no type hints, no
 * ?? operator, no ::class) so that on a host running something too old it
 * still loads and REPORTS "your PHP is too old" instead of dying with a
 * parse error and showing a blank white page -- which would tell you nothing.
 *
 * DELETE IT when you are done. It reports server details that are nobody
 * else's business. There is a delete button at the bottom.
 */

// ---------------------------------------------------------------- helpers

$results = array();

function check($group, $name, $status, $detail, $fix)
{
    global $results;

    $results[] = array(
        'group'  => $group,
        'name'   => $name,
        'status' => $status, // pass | warn | fail
        'detail' => $detail,
        'fix'    => $fix,
    );
}

function bytes_from_ini($value)
{
    $value = trim($value);

    if ($value === '') {
        return 0;
    }

    $unit = strtolower(substr($value, -1));
    $number = (float) $value;

    if ($unit === 'g') return $number * 1024 * 1024 * 1024;
    if ($unit === 'm') return $number * 1024 * 1024;
    if ($unit === 'k') return $number * 1024;

    return $number;
}

// ------------------------------------------------------------------- PHP

$phpVersion = PHP_VERSION;

if (version_compare($phpVersion, '8.3.0', '>=')) {
    check('PHP', 'PHP version', 'pass', $phpVersion, '');
} elseif (version_compare($phpVersion, '8.0.0', '>=')) {
    check('PHP', 'PHP version', 'fail', $phpVersion . ' — this app needs 8.3 or newer',
        'cPanel → MultiPHP Manager → select this domain → set PHP 8.3 or 8.4 → Apply. '
        . 'If 8.3 is not in the list, the host must add it; ask support.');
} else {
    check('PHP', 'PHP version', 'fail', $phpVersion . ' — far too old',
        'cPanel → MultiPHP Manager → set PHP 8.3+. If the host cannot offer 8.3, '
        . 'this hosting account cannot run the application at all.');
}

check('PHP', 'Architecture', PHP_INT_SIZE >= 8 ? 'pass' : 'warn',
    (PHP_INT_SIZE * 8) . '-bit',
    PHP_INT_SIZE >= 8 ? '' : 'A 32-bit PHP build is unusual on modern cPanel. Ask the host for 64-bit.');

// Extensions Laravel 13 + Filament actually need to boot and serve requests.
$required = array(
    'pdo_mysql' => 'Talking to MySQL.',
    'mbstring'  => 'Multi-byte strings.',
    'openssl'   => 'APP_KEY encryption, HTTPS requests, hashing.',
    'tokenizer' => 'Laravel internals.',
    'xml'       => 'Laravel internals.',
    'ctype'     => 'Laravel internals.',
    'json'      => 'API responses.',
    'fileinfo'  => 'Reading a real MIME type out of an uploaded media file\'s bytes.',
    'curl'      => 'Outgoing HTTP requests.',
    'zip'       => 'Composer, and unzipping the deployment bundle.',
    'session'   => 'Sanctum session authentication (the Filament admin panel).',
    'gd'        => 'Filament\'s image editor/resizing for uploaded media.',
);

foreach ($required as $ext => $why) {
    $loaded = extension_loaded($ext);

    check('PHP extensions', $ext, $loaded ? 'pass' : 'fail',
        $loaded ? 'loaded — ' . $why : 'MISSING — ' . $why,
        $loaded ? '' : 'cPanel → Select PHP Version → Extensions → tick "' . $ext . '" → Save.');
}

$optional = array(
    'bcmath'  => 'Not required by this app, but some packages fall back to it.',
    'imagick' => 'Alternative to gd for Filament\'s image editor. Not required.',
    'redis'   => 'Optional cache/queue driver. The app runs fine on the database driver.',
    'intl'    => 'Nicer number and date formatting. Not required.',
    'opcache' => 'Big speed win. Strongly recommended, not required.',
);

foreach ($optional as $ext => $why) {
    $loaded = extension_loaded($ext);

    check('Optional extensions', $ext, $loaded ? 'pass' : 'warn',
        ($loaded ? 'loaded' : 'not loaded') . ' — ' . $why, '');
}

// ------------------------------------------------------- PHP ini settings

$memory = bytes_from_ini(ini_get('memory_limit'));

if ($memory === 0.0 || $memory < 0) {
    check('PHP settings', 'memory_limit', 'pass', 'unlimited', '');
} elseif ($memory >= 256 * 1048576) {
    check('PHP settings', 'memory_limit', 'pass', ini_get('memory_limit'), '');
} elseif ($memory >= 128 * 1048576) {
    check('PHP settings', 'memory_limit', 'warn', ini_get('memory_limit') . ' — enough to serve, tight for composer/vendor:publish',
        'Raise to 256M in cPanel → Select PHP Version → Options.');
} else {
    check('PHP settings', 'memory_limit', 'fail', ini_get('memory_limit') . ' — too low',
        'cPanel → Select PHP Version → Options → memory_limit = 256M.');
}

$upload = bytes_from_ini(ini_get('upload_max_filesize'));
$post   = bytes_from_ini(ini_get('post_max_size'));

check('PHP settings', 'upload_max_filesize',
    $upload >= 8 * 1048576 ? 'pass' : 'warn',
    ini_get('upload_max_filesize') . ' (Filament media uploads)',
    $upload >= 8 * 1048576 ? '' : 'Raise to 16M or more in cPanel → Select PHP Version → Options.');

check('PHP settings', 'post_max_size',
    $post >= 32 * 1048576 ? 'pass' : 'warn',
    ini_get('post_max_size') . ' (limits how many files upload at once)',
    $post >= 32 * 1048576 ? '' : 'Raise to 64M in cPanel → Select PHP Version → Options.');

check('PHP settings', 'max_execution_time',
    ((int) ini_get('max_execution_time') >= 60 || (int) ini_get('max_execution_time') === 0) ? 'pass' : 'warn',
    ini_get('max_execution_time') . 's',
    'Migrations and update.php want at least 60s. Raise it if a deploy step times out.');

// ------------------------------------------------------------ filesystem

$docRoot = isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] : dirname(__FILE__);
$home    = dirname($docRoot);

check('Paths', 'Document root', 'pass', $docRoot,
    'The Next.js static export and public_html/app/ (Laravel\'s front controller) both go here.');

check('Paths', 'Home directory', is_dir($home) ? 'pass' : 'warn', $home,
    'laravel/ goes in ' . $home . ' — one level ABOVE the document root, '
    . 'so .env and the source code are never reachable over the web. This must match '
    . 'dirname(WEB_ROOT) in .github/workflows/deploy.yml exactly.');

$probe = $home . '/.ibrahimmonir-write-probe';
$canWriteHome = @mkdir($probe);

if ($canWriteHome) {
    @rmdir($probe);
    check('Paths', 'Home directory is writable', 'pass', 'yes — /laravel can be created here', '');
} else {
    check('Paths', 'Home directory is writable', 'warn', 'could not create a test directory',
        'Not fatal: PHP often cannot write outside the document root even where File Manager can. '
        . 'The deploy workflow uploads and extracts there via the cPanel API instead, not via PHP.');
}

// storage:link creates public_html/app/storage as a real symlink -- unlike
// upokoron, this app does depend on it (see config/filesystems.php).
$symlinkAvailable = function_exists('symlink') && ! in_array('symlink', array_map('trim', explode(',', ini_get('disable_functions'))));

check('Paths', 'symlink() available', $symlinkAvailable ? 'pass' : 'fail',
    $symlinkAvailable ? 'yes' : 'disabled by the host',
    $symlinkAvailable
        ? ''
        : 'REQUIRED: "php artisan storage:link" (run by update.php) needs this to publish uploaded media '
          . 'at /storage/*. Ask the host to remove symlink from disable_functions.');

// ---------------------------------------------------------------- Apache

$rewrite = 'unknown';

if (function_exists('apache_get_modules')) {
    $rewrite = in_array('mod_rewrite', apache_get_modules()) ? 'yes' : 'no';
}

if ($rewrite === 'yes') {
    check('Web server', 'mod_rewrite', 'pass', 'enabled', '');
} elseif ($rewrite === 'no') {
    check('Web server', 'mod_rewrite', 'fail', 'NOT enabled',
        'Both the Next.js clean-URL rewrite and the /api, /admin, /up, /sanctum routing to Laravel need it. '
        . 'Ask the host to enable mod_rewrite.');
} else {
    check('Web server', 'mod_rewrite', 'warn', 'cannot detect from PHP (normal under PHP-FPM)',
        'Verify by hand once the real .htaccess is deployed: load a URL like /admin and confirm it reaches '
        . 'Laravel instead of a plain Apache 404.');
}

check('Web server', 'Server software', 'pass',
    isset($_SERVER['SERVER_SOFTWARE']) ? $_SERVER['SERVER_SOFTWARE'] : 'unknown', '');

check('Web server', 'HTTPS',
    (! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'pass' : 'warn',
    (! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'this page loaded over HTTPS' : 'this page loaded over plain HTTP',
    'Sanctum/session cookies should be marked Secure in production. Issue the free AutoSSL certificate '
    . '(cPanel → SSL/TLS Status → Run AutoSSL) before relying on the admin login.');

// --------------------------------------------------------------- MySQL

$dbTested = false;
$dbHost = isset($_POST['db_host']) ? $_POST['db_host'] : 'localhost';
$dbName = isset($_POST['db_name']) ? $_POST['db_name'] : '';
$dbUser = isset($_POST['db_user']) ? $_POST['db_user'] : '';
$dbPass = isset($_POST['db_pass']) ? $_POST['db_pass'] : '';

if ($dbName !== '' && $dbUser !== '') {
    $dbTested = true;

    try {
        $pdo = new PDO('mysql:host=' . $dbHost . ';dbname=' . $dbName, $dbUser, $dbPass,
            array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 5));

        check('Database', 'Connection', 'pass', 'connected to ' . $dbName . ' as ' . $dbUser, '');

        $version = $pdo->query('SELECT VERSION()')->fetchColumn();
        $isMaria = stripos($version, 'maria') !== false;

        preg_match('/(\d+\.\d+\.\d+)/', $version, $m);
        $mv = isset($m[1]) ? $m[1] : '0';

        if ($isMaria) {
            check('Database', 'Version', version_compare($mv, '10.3.0', '>=') ? 'pass' : 'warn',
                $version,
                version_compare($mv, '10.3.0', '>=') ? '' : 'Laravel 13 generally wants MariaDB 10.3+.');
        } else {
            check('Database', 'Version', version_compare($mv, '8.0.0', '>=') ? 'pass' : 'warn',
                $version,
                version_compare($mv, '8.0.0', '>=') ? '' : 'Laravel 13 generally wants MySQL 8.0+.');
        }

        $engines = $pdo->query("SHOW ENGINES")->fetchAll(PDO::FETCH_ASSOC);
        $innodb = 'missing';

        foreach ($engines as $engine) {
            if (strtolower($engine['Engine']) === 'innodb') {
                $innodb = $engine['Support'];
            }
        }

        check('Database', 'InnoDB engine',
            in_array(strtoupper($innodb), array('YES', 'DEFAULT')) ? 'pass' : 'fail',
            $innodb,
            'InnoDB is what Laravel\'s migrations assume for foreign keys and transactions.');

        try {
            $grants = $pdo->query('SHOW GRANTS')->fetchAll(PDO::FETCH_COLUMN);
            $all = false;

            foreach ($grants as $grant) {
                if (stripos($grant, 'ALL PRIVILEGES') !== false) $all = true;
            }

            check('Database', 'Privileges', $all ? 'pass' : 'warn',
                $all ? 'ALL PRIVILEGES' : implode(' | ', $grants),
                $all ? '' : 'Migrations need CREATE, ALTER, DROP, INDEX and REFERENCES. In cPanel → '
                    . 'MySQL Databases → Add User To Database → tick ALL PRIVILEGES.');
        } catch (Exception $e) {
            check('Database', 'Privileges', 'warn', 'could not read grants', '');
        }
    } catch (Exception $e) {
        check('Database', 'Connection', 'fail', $e->getMessage(),
            'Create the database and user in cPanel → MySQL Databases, then add the user to the database '
            . 'with ALL PRIVILEGES. Remember cPanel prefixes both names with your account username.');
    }
}

// ------------------------------------------------------------- verdict

$fails = 0;
$warns = 0;

foreach ($results as $r) {
    if ($r['status'] === 'fail') $fails++;
    if ($r['status'] === 'warn') $warns++;
}

// ------------------------------------------------------- self-destruct

if (isset($_POST['delete_self'])) {
    @unlink(__FILE__);

    echo '<!doctype html><meta charset="utf-8">'
       . '<body style="font:16px system-ui;padding:40px">'
       . '<h1>Deleted.</h1><p>preflight.php has removed itself. Reload to confirm you get a 404.</p>';
    exit;
}

$groups = array();

foreach ($results as $r) {
    $groups[$r['group']][] = $r;
}
?>
<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>ibrahimmonir.com — hosting preflight</title>
<style>
  :root { --bg:#f6f8fb; --card:#fff; --ink:#0f172a; --muted:#64748b; --line:#e2e8f0;
          --pass:#0f8a4c; --warn:#b45309; --fail:#c2261a; --brand:#1e4be0; }
  * { box-sizing: border-box; }
  body { margin:0; padding:24px 16px 64px; background:var(--bg); color:var(--ink);
         font:15px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
  .wrap { max-width: 860px; margin: 0 auto; }
  h1 { font-size:24px; margin:0 0 4px; }
  .sub { color:var(--muted); margin:0 0 24px; }
  .verdict { padding:16px 18px; border-radius:10px; margin-bottom:24px; font-weight:600; }
  .verdict.ok   { background:#e7f6ee; color:var(--pass); border:1px solid #bfe6d0; }
  .verdict.warn { background:#fef4e6; color:var(--warn); border:1px solid #f3ddb5; }
  .verdict.bad  { background:#fdeceb; color:var(--fail); border:1px solid #f5c8c4; }
  .verdict p { font-weight:400; color:var(--ink); margin:8px 0 0; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:10px;
          margin-bottom:16px; overflow:hidden; }
  .card h2 { font-size:13px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted);
             margin:0; padding:12px 16px; border-bottom:1px solid var(--line); background:#fbfcfe; }
  .row { display:flex; gap:12px; padding:11px 16px; border-bottom:1px solid #f1f5f9; align-items:flex-start; }
  .row:last-child { border-bottom:0; }
  .tag { flex:none; width:52px; text-align:center; font-size:11px; font-weight:700; padding:2px 0;
         border-radius:4px; text-transform:uppercase; letter-spacing:.04em; }
  .tag.pass { background:#e7f6ee; color:var(--pass); }
  .tag.warn { background:#fef4e6; color:var(--warn); }
  .tag.fail { background:#fdeceb; color:var(--fail); }
  .name { flex:none; width:190px; font-weight:600; }
  .detail { flex:1; min-width:0; word-break:break-word; }
  .fix { display:block; margin-top:4px; color:var(--muted); font-size:13.5px; }
  form { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:16px; margin-bottom:16px; }
  label { display:block; font-size:13px; font-weight:600; margin:10px 0 4px; }
  input { width:100%; padding:8px 10px; border:1px solid var(--line); border-radius:6px; font:inherit; }
  button { margin-top:14px; background:var(--brand); color:#fff; border:0; border-radius:6px;
           padding:9px 18px; font:600 15px system-ui; cursor:pointer; }
  button.danger { background:var(--fail); }
  .note { color:var(--muted); font-size:13.5px; }
  @media (max-width:640px) { .row { flex-wrap:wrap; } .name { width:auto; } }
</style>

<div class="wrap">
  <h1>ibrahimmonir.com — hosting preflight</h1>
  <p class="sub">Checks whether this cPanel account can run the app. Nothing is installed by this page.</p>

  <?php if ($fails > 0): ?>
    <div class="verdict bad">
      <?php echo $fails; ?> blocking problem<?php echo $fails === 1 ? '' : 's'; ?> found.
      <p>Each one below marked <strong>FAIL</strong> has the exact cPanel fix next to it. Most are a
      setting, not a limitation of the plan — PHP version and missing extensions are both changed from
      cPanel in under a minute.</p>
    </div>
  <?php elseif ($warns > 0): ?>
    <div class="verdict warn">
      No blocking problems. <?php echo $warns; ?> thing<?php echo $warns === 1 ? '' : 's'; ?> to look at.
      <p>The app will run on this host. Read the warnings before running the deploy workflow for real.</p>
    </div>
  <?php else: ?>
    <div class="verdict ok">
      This hosting account can run the app.
      <p>Every requirement is met. Continue with the deploy.yml workflow.</p>
    </div>
  <?php endif; ?>

  <?php if (! $dbTested): ?>
    <form method="post">
      <h2 style="margin:0 0 4px;font-size:16px">Test the database too</h2>
      <p class="note" style="margin:0">
        Create a database and user in cPanel → MySQL Databases first, then enter them here.
        Credentials are used for this one request and never stored.
      </p>
      <label>Host</label>
      <input name="db_host" value="localhost">
      <label>Database name</label>
      <input name="db_name" placeholder="cpaneluser_ibrahimmonir" required>
      <label>Username</label>
      <input name="db_user" placeholder="cpaneluser_ibrahimmonir" required>
      <label>Password</label>
      <input name="db_pass" type="password">
      <button type="submit">Run database check</button>
    </form>
  <?php endif; ?>

  <?php foreach ($groups as $group => $rows): ?>
    <div class="card">
      <h2><?php echo htmlspecialchars($group); ?></h2>
      <?php foreach ($rows as $r): ?>
        <div class="row">
          <span class="tag <?php echo $r['status']; ?>"><?php echo $r['status']; ?></span>
          <span class="name"><?php echo htmlspecialchars($r['name']); ?></span>
          <span class="detail">
            <?php echo htmlspecialchars($r['detail']); ?>
            <?php if ($r['fix'] !== ''): ?>
              <span class="fix"><?php echo htmlspecialchars($r['fix']); ?></span>
            <?php endif; ?>
          </span>
        </div>
      <?php endforeach; ?>
    </div>
  <?php endforeach; ?>

  <div class="card">
    <h2>Remove this file</h2>
    <div class="row">
      <span class="detail">
        This page lists your PHP build, paths, and server software. Delete it as soon as you have read it.
        <form method="post" style="border:0;padding:0;background:none;margin-top:10px">
          <button class="danger" name="delete_self" value="1" type="submit">Delete preflight.php now</button>
        </form>
      </span>
    </div>
  </div>
</div>
