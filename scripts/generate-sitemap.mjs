/**
 * @fileoverview Build-time sitemap & robots.txt generator.
 *
 * Runs as a `postbuild` step so every production build gets a sitemap that
 * includes dynamically-generated vehicle pages (/car/:id) from Supabase.
 *
 * Environment: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (anon key can READ).
 *
 * @module scripts/generate-sitemap
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distDir = resolve(root, "dist");
const seoPath = resolve(root, "src/data/seo.json");

/**
 * Minimal .env loader — Vite already parsed these during `vite build`, but the
 * postbuild script runs in a fresh Node process where import.meta.env is not
 * available. This reads the same .env file Vite used so vehicle pages can be
 * included in the sitemap.
 */
function loadEnv() {
  const envPath = resolve(root, ".env");
  if (!existsSync(envPath)) return;

  const raw = readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    // Don't override if already set (e.g. from CI)
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}

loadEnv();

const today = new Date().toISOString().split("T")[0];

/**
 * @param {string} s
 */
function escapeXml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c)
  );
}

function loadSeo() {
  const raw = readFileSync(seoPath, "utf-8");
  return JSON.parse(raw);
}

function xmlUrl(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function fetchStock() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "[sitemap] SUPABASE env vars not set — vehicle pages will be omitted. " +
        "Set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY to include them."
    );
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("stock_list")
    .select(
      "id,title,price,year,miles_driven,description,attributes,is_available,image_url,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[sitemap] Supabase error:", error.message);
    return [];
  }

  return data ?? [];
}

function buildSitemapXml(siteUrl, routes, stock) {
  const urls = [];

  // Static routes from seo.json
  for (const route of routes) {
    // skip noindex / not-in-sitemap routes
    if (route.noindex || route.sitemap === false) continue;
    urls.push(
      xmlUrl(
        `${siteUrl}${route.path}`,
        today,
        route.changefreq,
        route.priority
      )
    );
  }

  // Dynamic vehicle pages
  for (const car of stock) {
    const loc = `${siteUrl}/car/${car.id}`;
    const lastmod = car.created_at
      ? new Date(car.created_at).toISOString().split("T")[0]
      : today;
    urls.push(xmlUrl(loc, lastmod, "weekly", "0.8"));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join("\n")}
</urlset>
`;
}

function buildRobotsTxt(siteUrl) {
  return `# Public site: crawl everything except the admin dashboard.
User-agent: *
Allow: /
Disallow: /admin-IQmotors

Sitemap: ${siteUrl}/sitemap.xml
`;
}

async function main() {
  const seo = loadSeo();
  const siteUrl = seo.site.url.replace(/\/$/, ""); // strip trailing slash

  const stock = await fetchStock();

  mkdirSync(distDir, { recursive: true });

  // sitemap.xml
  const sitemapXml = buildSitemapXml(siteUrl, seo.routes, stock);
  writeFileSync(resolve(distDir, "sitemap.xml"), sitemapXml);
  console.log(
    `[sitemap] wrote sitemap.xml with ${seo.routes.length} static routes + ${stock.length} vehicle pages`
  );

  // robots.txt
  const robotsTxt = buildRobotsTxt(siteUrl);
  writeFileSync(resolve(distDir, "robots.txt"), robotsTxt);
  console.log("[sitemap] wrote robots.txt");
}

main().catch((err) => {
  console.error("[sitemap] fatal error:", err);
  process.exit(1);
});
