# IQ Motors Limited — Website

[![CI](https://github.com/dabeerqureshi/iq-motors-website/actions/workflows/ci.yml/badge.svg)](https://github.com/dabeerqureshi/iq-motors-website/actions/workflows/ci.yml)
[![Keep Supabase Awake](https://github.com/dabeerqureshi/iq-motors-website/actions/workflows/keep-supabase-alive.yml/badge.svg)](https://github.com/dabeerqureshi/iq-motors-website/actions/workflows/keep-supabase-alive.yml)

**Live site:** https://iq-motors.co.uk — static SPA built by **Vercel** (auto-deployed
from `main`), domain from **Hostinger**, data/auth on **Supabase**, contact-form
email through **EmailJS**.

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
npm run preview    # serve the production build locally
npm run lint       # eslint
npm run typecheck  # type check (tsc -b, project references)
```

Node **22 LTS** is required (pinned in `package.json` → `engines` and `.nvmrc`, and
in Vercel's build image).

## 🔑 Environment variables (`.env`)

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (safe to expose in the bundle, but keep the file out of git) |
| `VITE_SERVICE_ID_EMAILJS` | EmailJS service id (contact form) |
| `VITE_PUBLIC_KEY_EMAILJS` | EmailJS public key |
| `VITE_TEMPLATE_ID_EMAILJS` | EmailJS template id |

> ⚠️ `.env` is git-ignored (and kept out of deploys by `.vercelignore`). The same
> variables must be set in **Vercel → Project → Settings → Environment Variables**
> for *Production*, *Preview* and *Development*. Vite inlines them at build time,
> so changing one only takes effect after the next deployment.

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

## ☁️ Deploy — Vercel (hosting) + Hostinger (domain)

The site is a **static SPA build** (`dist/`). It is hosted on Vercel's global CDN;
the domain stays registered at Hostinger. Vercel deploys it automatically on every
push to `main`.

| Piece | Where | Cost |
|---|---|---|
| Website hosting, CDN, SSL, CI/CD | **Vercel** (Hobby plan) | £0 |
| Domain + DNS records | **Hostinger** (already owned) | already paid |
| Database, auth, image storage | **Supabase** (free tier) | £0 |
| Contact-form email | **EmailJS** (free tier) | £0 |
| Source code + quality gate | **GitHub** + GitHub Actions | £0 |

### How a deploy works

```
push / merge to main
        │
        ▼
Vercel detects the commit ──► npm ci ─► npm run build ──► dist/ ──► global CDN
        │                                                              │
        └────────────► https://iq-motors.co.uk  ◄──────────────────────┘
```

Every branch and pull request also gets its own **Preview Deployment** URL, so
changes can be checked on a real URL before they reach production.

### One-time setup

1. **Import the repository** — vercel.com → *Add New… → Project* → import
   `dabeerqureshi/iq-motors-website`. The repo ships [`vercel.json`](vercel.json),
   which already sets the framework preset (*Vite*), the `npm ci` install command,
   `npm run build` build command, `dist` output directory, SPA rewrites, caching and
   security headers — accept the detected defaults and press **Deploy**.

2. **Add the environment variables** — *Project → Settings → Environment
   Variables*, added for **Production**, **Preview** *and* **Development**:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
   | `VITE_SERVICE_ID_EMAILJS` | EmailJS service id |
   | `VITE_PUBLIC_KEY_EMAILJS` | EmailJS public key |
   | `VITE_TEMPLATE_ID_EMAILJS` | EmailJS template id |

   After editing any of them, use **Deployments → ⋯ → Redeploy**, because Vite
   inlines these values into the bundle at build time.

3. **Node version** — pinned to Node **22.x** via `package.json` → `engines` (and
   `.nvmrc`), so the Vercel build image matches local development and CI. No
   dashboard change needed.

4. **Connect the Hostinger domain** — *Project → Settings → Domains → Add*, then add
   **both** `iq-motors.co.uk` and `www.iq-motors.co.uk` and pick one as primary (the
   other 308-redirects to it). Vercel then displays the exact DNS records to create;
   add those in hPanel → *Domains → DNS / Nameservers*:

   | Type | Name / Host | Value | Notes |
   |---|---|---|---|
   | `A` | `@` (apex / blank) | `216.198.79.1` | Vercel's current recommended apex IP. Use **the value Vercel shows you** — older projects may show `76.76.21.21`, which is also valid. |
   | `CNAME` | `www` | `cname.vercel-dns.com` | Use the exact target Vercel shows for your project. |

   - ⚠️ **Keep Hostinger's nameservers.** Only add/edit the A + CNAME records. Moving
     the domain to Vercel's nameservers takes the **MX records with it** and mailboxes
     such as `info@iqmotors.co.uk` would stop receiving mail.
   - ⚠️ Remove any Hostinger *parking*/redirection record on the apex — two competing
     `A` records make the domain resolve unpredictably.
   - ⚠️ Leave MX, SPF/DKIM TXT and other records untouched.
   - HTTPS certificates are issued and renewed automatically once the records verify
     (often minutes; DNS propagation can take longer).

5. **Protect `main`** (recommended) — GitHub → *Settings → Branches* → add a rule for
   `main` that requires the **CI / Lint, typecheck & build** check before merging.

### What `vercel.json` configures

| Setting | Why |
|---|---|
| `rewrites: /(.*) → /index.html` | **SPA routing.** Refreshing or sharing a deep link (`/stock`, `/car/123`, `/admin-IQmotors`, `/contact`) serves the app instead of a 404. Vercel checks the filesystem *before* rewrites, so real files are still served normally. |
| `Cache-Control` on `/assets/*` and `/lovable-uploads/*` | Content-hashed bundles and brand images are `public, max-age=31536000, immutable`, so repeat visits are served from the browser cache. |
| `Cache-Control` on `/index.html` | `max-age=0, must-revalidate` — the HTML shell is always revalidated, so a new deploy is live immediately. |
| Security headers | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. |
| HTTPS, HSTS, HTTP→HTTPS redirect | Handled by Vercel automatically for custom domains — nothing to configure. |
| `.vercelignore` | Keeps `.env*`, `.github/`, `sql/`, docs and local build output out of a CLI deploy. Never add build **inputs** (configs, `src/`, `public/`) to it. |

The bundle is also split so that `vendor` (React, Radix, Supabase, EmailJS…) is
cached separately from the app chunk — see the `manualChunks` option in
[`vite.config.ts`](vite.config.ts).

> The old Apache `public/.htaccess` (SPA rewrites for shared hosting) has been
> removed — `vercel.json` replaces it. It remains in git history
> (`git log -- public/.htaccess`) in case the site ever moves back to Apache hosting.

### Day-to-day: previews, rollbacks, manual deploys

- **Preview URL per PR** — Vercel comments the deployment URL on the pull request.
- **Rollback** — *Deployments* tab → choose a good build → **Promote to Production**
  (instant, no rebuild).
- **CLI** — `npm i -g vercel`, then `vercel` (preview) or `vercel --prod`.
- **Optional hardening** — *Settings → Deployment Protection → Vercel
  Authentication* can make preview URLs private (production stays public); useful
  because preview builds include the same `/admin-IQmotors` route.
- **Hostinger deploy removed** — `.github/workflows/deploy.yml` and its FTP upload
  step are gone. Once Vercel is live you can delete the `HOSTINGER_*` Action secrets
  and revoke the FTP account in hPanel.

### CI (GitHub Actions)

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull request and
push to `main`: `npm ci` → `npm run lint` → `npm run typecheck` → `npm run build`,
then asserts `dist/index.html`, `dist/robots.txt` and `dist/sitemap.xml` exist.
Vercel does the deploying; CI only guards quality, so a broken commit cannot reach
production unnoticed.

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

Every path above is also handled by the SPA rewrite in `vercel.json`, so it can be
opened directly or refreshed without a 404.

## 🩺 Troubleshooting (Vercel)

| Symptom | Cause / fix |
|---|---|
| Deep link or refresh shows Vercel's 404 page | `vercel.json` rewrite missing or not committed — confirm the `rewrites` block is present and that the deployment was built after it landed. |
| Site loads but stock is empty / admin cannot log in | Env vars missing on Vercel (or added only to *Production*). Add them for all environments and redeploy. |
| Contact form fails | EmailJS ids wrong, or the domain is not allowed in the EmailJS dashboard (add `iq-motors.co.uk` + the `*.vercel.app` preview domains to the allowed origins). |
| Env var change has no effect | `VITE_*` values are baked in at build time — trigger **Redeploy**. |
| Domain still shows the old site | Hostinger DNS records are still pointing at the old host; check that the apex `A` record is Vercel's IP and the old parking record is deleted (`nslookup iq-motors.co.uk`). |
| Domain shows "Invalid Configuration" in Vercel | The `A`/`CNAME` values do not match what Vercel shows, or extra records exist on the same hostname. |
| Emails to `info@iqmotors.co.uk` stop arriving | Nameservers were moved to Vercel; move them back to Hostinger and re-add the MX/SPF/DKIM records. |
| Build fails with `EBADENGINE` / wrong Node | Node is pinned to `22.x` in `package.json`; make sure the Vercel project's *Node.js Version* is not overridden to a deprecated major. |
