import { createClient } from '@jsr/supabase__supabase-js';

// These are public browser credentials. Supabase row-level security controls access.
// Environment values take precedence, while the fallback keeps static builds working.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ekqumqicsrfangqaumqa.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcXVtcWljc3JmYW5ncWF1bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjQ2MzIsImV4cCI6MjA4NjQwMDYzMn0.H4xRwyIUA0e1t9Dm2-4sP-4M_BXLWH4ArYf8UULQYj4';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
