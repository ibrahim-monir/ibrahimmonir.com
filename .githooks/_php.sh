#!/bin/sh
# Resolve a PHP >= 8.3 binary. Order: git config content.php, $CONTENT_SYNC_PHP,
# a modern Laragon build (Windows), then plain `php` on PATH.
resolve_php() {
  cfg=$(git config --get content.php 2>/dev/null)
  if [ -n "$cfg" ] && [ -x "$cfg" ]; then echo "$cfg"; return; fi
  if [ -n "$CONTENT_SYNC_PHP" ] && [ -x "$CONTENT_SYNC_PHP" ]; then echo "$CONTENT_SYNC_PHP"; return; fi
  for p in /c/laragon/bin/php/php-8.4*/php.exe \
           /c/laragon/bin/php/php-8.3*/php.exe \
           "C:/laragon/bin/php/php-8.4"*/php.exe; do
    [ -x "$p" ] && { echo "$p"; return; }
  done
  echo "php"
}
