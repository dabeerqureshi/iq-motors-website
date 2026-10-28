import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Vite inlines every VITE_* value into the bundle at BUILD time, so a missing
// variable silently becomes `undefined` at runtime - which is how this site once
// shipped a blank white page (the Supabase client threw "supabaseUrl is
// required." before React could mount). That failure mode is now handled at
// runtime instead: src/supabase/supabase.js falls back to a placeholder client,
// main.tsx wraps the app in an ErrorBoundary, index.html shows a reload /
// phone-number guard and ContactForm tells visitors to call. A missing variable
// is therefore reported loudly here, but never aborts the build - doing that
// once failed every Preview deployment (they legitimately build without
// Production credentials) and blocked unrelated fixes from shipping.
const REQUIRED_ENV = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
  "VITE_SERVICE_ID_EMAILJS",
  "VITE_PUBLIC_KEY_EMAILJS",
  "VITE_TEMPLATE_ID_EMAILJS",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isSet = (key: string) => Boolean((process.env[key] ?? env[key] ?? "").trim());
  const missing = REQUIRED_ENV.filter((key) => !isSet(key));

  if (missing.length > 0) {
    const lines = [
      `Missing required environment variable(s): ${missing.join(", ")}`,
      "Locally: copy .env.example to .env and fill it in.",
      "On Vercel: Project -> Settings -> Environment Variables (Production,",
      "Preview and Development), then Deployments -> Redeploy - the values are",
      "inlined at build time, so an existing deployment can never pick them up.",
      "The build continues: inventory, the contact form and the admin dashboard",
      "fall back to their empty / call-us states until the variables are set.",
    ];

    console.warn(`\n[env] ${lines.join("\n")}\n`);

    // Vercel and GitHub Actions render these as annotations in the build log.
    if (process.env.VERCEL || process.env.CI) {
      for (const line of lines) {
        console.warn(`::warning title=Missing environment variable::${line}`);
      }
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Keep third-party code (React, Radix, Supabase, EmailJS, ...) in one
      // long-lived "vendor" chunk so a routine content-only deploy only forces
      // visitors to re-download the small app chunk instead of the whole bundle.
      rollupOptions: {
        output: {
          manualChunks: (id) => (id.includes("node_modules") ? "vendor" : null),
        },
      },
    },
  };
});
