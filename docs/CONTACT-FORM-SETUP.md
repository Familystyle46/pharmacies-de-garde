# Formulaire de contact — configuration

Le formulaire `/contact` enregistre les messages dans Supabase et envoie un email via Resend.

## 1. Table Supabase `contact_messages`

Dans **Supabase** (projet utilisé par le site) → **SQL Editor**, exécute :

```sql
DROP TABLE IF EXISTS contact_messages;

CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Si tu vois l’erreur **« Could not find the 'name' column »** (PGRST204), la table a une mauvaise structure : refais le `DROP` + `CREATE` ci-dessus, puis **Project Settings** → **API** → **Reload schema**.

## 2. Variables d’environnement

En local (`.env.local`) et sur Vercel (**Settings** → **Environment Variables**) :

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service (recommandée pour que l’API puisse écrire sans RLS) |
| `RESEND_API_KEY` | Clé API Resend (dashboard resend.com) |
| `CONTACT_EMAIL` | Adresse qui reçoit les messages (ex. contact@pharmacies-de-garde.net) |

Sans `SUPABASE_SERVICE_ROLE_KEY`, l’API utilise la clé anon ; si le RLS est activé sur `contact_messages`, l’insert peut être refusé.

## 3. Resend

1. Créer un compte sur [resend.com](https://resend.com).
2. Créer une clé API et la mettre dans `RESEND_API_KEY`.
3. Avec le domaine par défaut, l’expéditeur est `onboarding@resend.dev`. Avec un domaine vérifié, tu peux utiliser par ex. `contact@pharmacies-de-garde.net`.

## 4. Dépendance

```bash
cd pharmacies-de-garde
npm install
```

Le package `resend` est déjà dans `package.json`.
