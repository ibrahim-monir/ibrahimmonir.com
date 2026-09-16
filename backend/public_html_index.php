<?php

// Lives at public_html/app/index.php now (one level deeper than a plain
// Laravel-only docroot) -- ibrahimmonir.com's public_html root is shared
// with the Next.js static export, so `ibrahimmonir-laravel/` is a sibling of
// public_html/, not of this file. Hence the extra "..".
//
// Named "ibrahimmonir-laravel", not plain "laravel": this account
// (/home/upokoron) already has upokoron.com's own Laravel app at
// ~/laravel. A plain "laravel" sibling here would collide with and
// overwrite it on every deploy.

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../../ibrahimmonir-laravel/storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../../ibrahimmonir-laravel/vendor/autoload.php';

(require_once __DIR__.'/../../ibrahimmonir-laravel/bootstrap/app.php')
    ->handleRequest(Request::capture());