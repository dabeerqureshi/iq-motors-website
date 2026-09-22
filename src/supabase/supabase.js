// src/supabase.js
import { createClient } from "@supabase/supabase-js";

// Credentials come from .env so project switches don't require code changes.
// Vite inlines VITE_* values at build time (vite.config.ts fails the build on
// Vercel when they are missing).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// `createClient(undefined, undefined)` throws "supabaseUrl is required." at
// module load, which prevents React from ever mounting and shows visitors a
// blank white page. When credentials are missing we log one actionable error
// and fall back to a placeholder host: the app still renders and the data
// hooks fall into their normal error/empty states.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    "[IQ Motors] Supabase is not configured: VITE_SUPABASE_URL and/or " +
      "VITE_SUPABASE_ANON_KEY are missing from this build. Locally add them to " +
      ".env; on Vercel add both under Settings -> Environment Variables " +
      "(Production, Preview and Development) and redeploy. Inventory, vehicle " +
      "pages and the admin dashboard will stay empty until then."
  );
}

const NOT_CONFIGURED_URL = "https://not-configured.supabase.co";

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : NOT_CONFIGURED_URL,
  isSupabaseConfigured ? supabaseAnonKey : "not-configured"
);
