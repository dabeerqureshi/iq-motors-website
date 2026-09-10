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

This repo ships a production-grade CI/CD pipeline (`.github/workflows/deploy.yml`)
that builds and deploys to Hostinger **automatically on every push to `main`**:

1. PRs to `main` → lint + type-check (gatekeeper).
2. Push to `main` → build → deploy `dist/` over SFTP to Hostinger.

**Required GitHub Actions secrets** (repo → Settings → Secrets and variables →
Actions → New repository secret):

| Secret name | Value |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `EMAILJS_SERVICE_ID` | EmailJS service ID |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `HOSTINGER_SFTP_HOST` | SFTP hostname (from hPanel → FTP Accounts) |
| `HOSTINGER_SFTP_USER` | FTP username |
| `HOSTINGER_SFTP_PASSWORD` | FTP password |
| `HOSTINGER_SFTP_PORT` | SFTP port (default `22`, optional) |
| `HOSTINGER_REMOTE_BASE` | Remote folder (default `/public_html`, optional) |

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
