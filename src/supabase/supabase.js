// src/supabase.js
import { createClient } from "@supabase/supabase-js";

// Credentials come from .env so project switches don't require code changes.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
