import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
const SUPABASE_URL = "https://kjzeqxhsxgcdhfgnsujc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YyV7Dk5M1DiCTfwNDXslXA_i90karlu";
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);