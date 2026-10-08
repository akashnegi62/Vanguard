import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  console.log('⚡ Supabase Client initialized successfully.');
} else {
  console.log('ℹ️  Supabase URL/Key not configured. Supabase JS client optional features in standby mode.');
}

export const supabase = client;

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseKey);
}
