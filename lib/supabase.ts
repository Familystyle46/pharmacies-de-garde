import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Durée de cache des lectures Supabase (1 h). Les données pharmacies (adresses,
// téléphones) changent rarement : mettre "no-store" ici forçait chaque page à
// refaire un aller-retour DB, ce qui bloquait tout rendu statique/ISR.
const REVALIDATE_SECONDS = 3600;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options = {}) =>
      fetch(url, { ...options, next: { revalidate: REVALIDATE_SECONDS } }),
  },
});
