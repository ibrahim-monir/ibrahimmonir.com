# Content Sync (Home PC ⇄ Office PC ⇄ Live server)

DB content travels with git. Code + data stay in sync across all 3 machines
through normal `push` / `pull`.

## How it works

- **`php artisan content:export`** dumps every syncable table into
  `backend/database/content.json` (git-tracked, deterministic).
- **`php artisan content:import`** loads that file back into the DB —
  **add/update only, never deletes** (so live contacts/invoices are safe).
- Uploaded images under `backend/storage/app/public/` are committed too, so
  media travels with the same push/pull.
- Git hooks in `.githooks/` automate both:
  - **pre-commit** → re-export + stage `content.json` and new uploads.
  - **post-merge** (after every `git pull`) → `migrate --force` + `content:import`.

### What is synced
All app tables **except** transient/security ones
(`migrations, cache*, jobs, job_batches, failed_jobs, sessions,
password_reset_tokens, personal_access_tokens`) and leftover `wp_*` tables.

Deletes do **not** propagate by default. To make one machine's state the
exact truth (including deletions): `php artisan content:import --mirror`.

## One-time setup on EACH machine (Home, Office, Live)

```bash
git pull
git config core.hooksPath .githooks
# If `php` on PATH is < 8.3 (e.g. Laragon default), point the hooks at 8.4:
git config content.php "/c/laragon/bin/php/php-8.4.23-Win32-vs17-x64/php.exe"   # Windows
# (Linux/Hostinger: usually just `php` works — skip the line above.)
```

## Daily workflow

```bash
# On whichever machine you edited content (blog, works, etc.):
git add -A && git commit -m "…"    # pre-commit auto-exports content.json + media
git push

# On the other machines / live:
git pull                           # post-merge auto-runs migrate + content:import
```

## Seeding the system the first time

The real content lives on whichever machine currently has it (e.g. the 13
blogs). On **that** machine:

```bash
git pull
php artisan content:export
git add backend/database/content.json backend/storage/app/public
git commit -m "seed content" && git push
```

Then on the others: `git pull` (auto-imports).

## Hostinger (live) note

If you deploy via **SSH `git pull`**, the post-merge hook runs automatically
(after the one-time `core.hooksPath` config above).

If you deploy via **hPanel Git auto-deploy** (which may not run hooks), add this
to your deploy/build step:

```bash
php artisan migrate --force && php artisan content:import
```

> ⚠️ Make sure the live deploy does **not** run `migrate:fresh` / `migrate --seed`
> — that drops all tables and is the likely reason older blogs vanished.
> Use plain `migrate` only.
