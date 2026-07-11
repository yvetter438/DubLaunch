# Database Scripts

Supabase SQL scripts for DubLaunch. Run these in the Supabase SQL Editor.

## Directory Structure

| Folder | Purpose |
|--------|---------|
| `schema/` | Initial table definitions and full database setup |
| `migrations/` | Incremental schema changes and functions |
| `policies/` | Row Level Security (RLS) and auth constraints |
| `fixes/` | One-time data repair scripts |
| `debug/` | Diagnostic queries for troubleshooting |

## Initial Setup (new project)

Run in order:

1. `schema/database-setup.sql` — full schema (or run individual table scripts below)
2. `schema/profiles-table.sql`
3. `schema/launches-table.sql`
4. `schema/votes-table.sql`
5. `schema/comments-table.sql`
6. `schema/forum-tables.sql`
7. `policies/fix-rls-policies.sql`
8. `policies/fix-forum-rls-policies.sql`
9. `policies/enforce-uw-email.sql`
10. `migrations/increment-views-function.sql`

## Migrations (existing project)

- `migrations/add-slug-to-launches.sql` — add slug column to launches
- `migrations/increment-views-function.sql` — atomic view counter

## Fixes (run as needed)

- `fixes/fix-vote-counts.sql` — recalculate vote counts
- `fixes/fix-votes-now.sql` — sync vote counts
- `fixes/fix-comments-count.sql` — sync comment counts
- `fixes/fix-all-counts.sql` — sync all counts

## Debug

- `debug/check-database-state.sql` — inspect current schema state
- `debug/debug-launches.sql` — launch data diagnostics
- `debug/debug-leaderboard.sql` — leaderboard diagnostics
- `debug/test-forum-access.sql` — verify forum RLS policies
