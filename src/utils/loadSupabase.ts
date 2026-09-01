let supabaseModulePromise: Promise<typeof import('./supabase')> | null = null;

export async function loadSupabase() {
  if (!supabaseModulePromise) {
    supabaseModulePromise = import('./supabase');
  }

  try {
    const { supabase } = await supabaseModulePromise;
    return supabase;
  } catch (error) {
    // A failed lazy chunk request should be retryable after connectivity returns.
    supabaseModulePromise = null;
    throw error;
  }
}
