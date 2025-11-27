# GauntletFuse

GauntletFuse is a Next.js + TypeScript blueprint for a multi-LLM orchestration engine where multiple providers and personas debate, critique, and fuse responses. The UI includes landing, dashboard, providers/personas management, arena builder, run viewer, and profile settings screens. Supabase authentication and Row Level Security are scaffolded for future wiring.

## Getting started

1. Install dependencies

```bash
npm install
```

2. Configure environment variables (Supabase + provider aliases)

Copy `.env.example` to `.env.local` and add your keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_KEY=...
ANTHROPIC_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
```

3. Run the dev server

```bash
npm run dev
```

## Database schema (Supabase)

```sql
create table profiles (
  id uuid references auth.users on delete cascade,
  email text,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

create table model_providers (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users on delete cascade,
  name text not null,
  api_base_url text,
  api_key_alias text,
  is_shared boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table personas (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users on delete cascade,
  name text not null,
  description text,
  system_prompt text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table arenas (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users on delete cascade,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table arena_runs (
  id uuid default gen_random_uuid() primary key,
  arena_id uuid references arenas(id) on delete cascade,
  owner_id uuid references auth.users on delete cascade,
  input_prompt text not null,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone
);

create table arena_run_participants (
  id uuid default gen_random_uuid() primary key,
  run_id uuid references arena_runs(id) on delete cascade,
  provider_id uuid references model_providers(id),
  persona_id uuid references personas(id),
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table arena_run_rounds (
  id uuid default gen_random_uuid() primary key,
  run_id uuid references arena_runs(id) on delete cascade,
  round_number int not null,
  phase text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table arena_run_messages (
  id uuid default gen_random_uuid() primary key,
  round_id uuid references arena_run_rounds(id) on delete cascade,
  participant_id uuid references arena_run_participants(id),
  role text,
  content text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table arena_run_fused_outputs (
  id uuid default gen_random_uuid() primary key,
  run_id uuid references arena_runs(id) on delete cascade,
  fused_answer text,
  reasoning_summary text,
  export_json jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

Add Row Level Security policies so users only access their own rows (unless explicitly shared), and connect Supabase real-time to stream run updates into the run viewer.

## Key implementation notes

- Next.js App Router with Tailwind CSS, Zustand for toasts/state, and lucide-react icons.
- Supabase helper clients are configured; add keys to enable SSR + client auth.
- Mock data illustrates providers, personas, runs, and rounds until Supabase wiring is connected.
- Forms include inline validation, safe error messaging, and keyboard shortcut (Ctrl+Enter) to start a run from the builder.
- Environment aliases are used to avoid exposing raw provider keys in the frontend.

## Deployment

Deploy to Netlify or Bolt.new with the environment variables above. Enable Next.js output tracing and Supabase server-side keys for protected routes, and wire Stripe later if billing is required.
