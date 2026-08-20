# Proofly

Proofly is a security-first web prototype for recording online deals, checking risk signals, preserving evidence, managing disputes, and preparing fraud reports.

## Free deployment

- Frontend: GitHub Pages or Cloudflare Pages
- Auth/database: Supabase Free tier
- No private/service-role Supabase key belongs in frontend code.

## Files

- `index.html` — main Proofly website
- `admin.html` — protected staff/admin console
- `supabase.sql` — database schema and RLS
- `admin.sql` — admin/security schema and RLS
- `tests/proofly.spec.js` — browser regression tests

## Important

This project does not guarantee that a person or transaction is safe. Uploaded evidence is not automatically authentic. Government reports are not submitted automatically by the static frontend; the site prepares users for the official reporting process.
