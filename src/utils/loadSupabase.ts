let supabaseModulePromise: Promise<typeof import('./supabase')> | null = null;

export async function loadSupabase() {
  if (!supabaseModulePromise) {
    supabaseModulePromise = import('./supabase');
  }

  const { supabase } = await supabaseModulePromise;
  return supabase;
}
