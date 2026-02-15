-- À exécuter dans l’éditeur SQL de ton projet Supabase (Dashboard > SQL Editor)

create table if not exists public.pharmacies (
  id bigserial primary key,
  osm_id text unique,
  nom text,
  adresse text,
  ville text,
  ville_slug text,
  departement text,
  code_postal text,
  telephone text,
  horaires text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz default now()
);

-- Index pour les recherches
create index if not exists idx_pharmacies_ville_slug on public.pharmacies (ville_slug);
create index if not exists idx_pharmacies_code_postal on public.pharmacies (code_postal);
create index if not exists idx_pharmacies_ville on public.pharmacies (ville);
create index if not exists idx_pharmacies_departement on public.pharmacies (departement);

-- RLS
alter table public.pharmacies enable row level security;

-- Lecture publique
create policy "Lecture publique"
  on public.pharmacies for select
  using (true);

-- Insert / update pour l’import (script avec anon ou service_role)
create policy "Insert pour import"
  on public.pharmacies for insert
  with check (true);

create policy "Update pour import"
  on public.pharmacies for update
  using (true);
