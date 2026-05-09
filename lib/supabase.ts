import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    // Désactive le cache Next.js sur les fetch Supabase → données toujours fraîches
    fetch: (url, options = {}) =>
      fetch(url, { ...options, cache: "no-store" }),
  },
});
