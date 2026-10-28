// src/supabase/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Credentials come from environment variables.
// Fallback to placeholder URLs prevents runtime initialization crashes
// in environments where variables are not yet configured.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes("placeholder")
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface DatabaseStockItem {
  id: number | string;
  title: string;
  price: number | string;
  year: number | string;
  miles_driven: string | null;
  description: string | null;
  attributes: string[] | null;
  is_available: boolean;
  image_url: string[] | string | null;
  created_at?: string;
}

export interface DatabaseHappyCustomer {
  id: number | string;
  image_url: string;
  created_at?: string;
}

export interface DatabaseAdminUser {
  id: string;
  email: string;
  last_login?: string | null;
  created_at?: string;
}

