import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not set
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

export const supabase = createClient(
  supabaseUrl || defaultUrl, 
  supabaseAnonKey || defaultKey
);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
export interface RepairRequest {
  id?: string;
  name: string;
  phone: string;
  device_type?: string;
  problem?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}