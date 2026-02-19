import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase pour le serveur (API routes, Server Components).
 * Utilise la Service Role Key en priorité pour contourner le RLS (ex. formulaire contact).
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || (!serviceKey && !anonKey)) {
    return null;
  }
  const key = serviceKey ?? anonKey!;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
