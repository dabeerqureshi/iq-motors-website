# IQ Motors Limited — Website

![Build & Deploy](https://github.com/dabeerqureshi/iq-motors-website/actions/workflows/deploy.yml/badge.svg)
![Keep Supabase Awake](https://github.com/dabeerqureshi/iq-motors-website/actions/workflows/keep-supabase-alive.yml/badge.svg)

Professional Mercedes-Benz dealership website (React 18 + Vite + TypeScript +
Tailwind CSS + shadcn-style UI), backed by Supabase.

## ✨ Features
- Homepage with animated hero, featured vehicles, testimonials & certifications
- Stock list with live search, price sort, pagination and responsive car cards
- Full vehicle detail pages (gallery carousel, specs, price, quick-contact)
- Sold cars, happy customers, finance and servicing pages
- Contact form powered by EmailJS
- Admin dashboard (`/admin-IQmotors`) with stock + happy-customer management
- Scroll-reveal animations that respect `prefers-reduced-motion`

## 🚀 Local development

```bash
npm install
cp .env.example .env   # then fill in your values (see below)
npm run dev            # http://localhost:8080
```

Other scripts:

```bash
npm run build      # production build into dist/
npm run preview    # preview the production build
npm run lint       # eslint
npx tsc -b --noEmit  # type check
```

## 🔑 Environment variables (`.env`)

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (safe to expose in the bundle, but keep the file out of git) |
| `VITE_SERVICE_ID_EMAILJS` | EmailJS service id (contact form) |
| `VITE_PUBLIC_KEY_EMAILJS` | EmailJS public key |
| `VITE_TEMPLATE_ID_EMAILJS` | EmailJS template id |

> ⚠️ `.env` is git-ignored. Deployments (Netlify/Vercel) need these same
> variables set in their dashboard.

## 🗄 Supabase setup

1. Create a project and note its URL + anon key.
2. Run the SQL in [`sql/enable_rls.sql`](sql/enable_rls.sql) via
   **SQL Editor** — this enables Row Level Security (public read, admin-only
   writes) and creates the `admin_users` table.
3. Create your admin Auth user:
   - **Authentication → Users → Add user** (email + strong password)
   - Then add their row (replace the email):
     ```sql
     insert into public.admin_users (email) values ('admin@iqmotors.co.uk')
     on conflict (email) do nothing;
     ```
4. Log in at `/admin-IQmotors` with that email + password.

Expected tables (created via the app/Supabase):
- `stock_list(id, title, price, year, miles_driven, description, attributes, image_url, is_available, created_at)`
- `happy_customers(id, image_url, created_at)`
- `admin_users(id, email, last_login, created_at)`

## ☁ Deploy

The site is a static build — any host that serves `dist/` works.

**Netlify:** Build command `npm run build`, publish directory `dist`, add the
env vars above.

**Vercel:** Framework preset *Vite*, build `npm run build`, output `dist`, add
the env vars above.

### GitHub Actions → Hostinger (automatic)

Simple pipeline (`.github/workflows/deploy.yml`): **every push to `main` builds
the site and uploads `dist/` to Hostinger.** No linting or tests run in CI — run
those locally with `npm run lint`, `npm run test:run` and `npm run test:e2e`.

The deploy step installs `lftp` and tries **FTPS → FTP → SFTP** in order, using
the first method that connects, then auto-detects the web root (so it works
whether the FTP account is rooted at the account root or already inside
`public_html`). Credentials are written to `~/.netrc`, so passwords containing
special characters need no escaping.

**Required GitHub Actions secrets** (repo → Settings → Secrets and variables →
Actions → New repository secret):

| Secret name | Value |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `EMAILJS_SERVICE_ID` | EmailJS service ID |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `HOSTINGER_SFTP_HOST` | FTP/SFTP hostname (hPanel → Files → FTP Accounts) |
| `HOSTINGER_SFTP_USER` | FTP/SFTP username |
| `HOSTINGER_SFTP_PASSWORD` | FTP/SFTP password |
| `HOSTINGER_SFTP_PORT` | *optional* — FTP/FTPS `21`, SFTP `65002` |
| `HOSTINGER_REMOTE_BASE` | *optional* — default `/public_html` |

*Optional repository **variable*** (Settings → Secrets and variables → Actions →
**Variables** tab) `HOSTINGER_PROTOCOL` = `ftps` \| `ftp` \| `sftp` pins a single
transfer method if the automatic fallback picks the wrong one.

The build also ships [`public/.htaccess`](public/.htaccess) (Vite copies it into
`dist/`), which adds SPA rewrites so deep links such as `/stock` or
`/admin-IQmotors` survive a hard refresh on Apache, plus long-term caching for
the hashed asset files.

## ♻ Keep the Supabase project awake

Free-tier Supabase projects auto-pause after ~7 days of inactivity. The
workflow in [`.github/workflows/keep-supabase-alive.yml`](.github/workflows/keep-supabase-alive.yml)
pings the API weekly. To use it, add these **Actions secrets**:

- `SUPABASE_URL` → `https://<project-ref>.supabase.co`
- `SUPABASE_ANON_KEY` → your anon key

## 🧭 Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/stock` | Available inventory |
| `/sold` | Recently sold |
| `/customers` | Happy customers |
| `/finance` | Financing options |
| `/servicing` | Mercedes servicing + contact form |
| `/contact` | Contact + map |
| `/about` | About IQ Motors |
| `/car/:id` | Vehicle detail |
| `/admin-IQmotors` | Admin dashboard |
