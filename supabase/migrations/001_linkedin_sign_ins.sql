-- Run in Supabase: SQL Editor → New query → paste → Run.
-- Or: supabase db push (if you use Supabase CLI linked to this project).

create table if not exists public.linkedin_sign_ins (
  id uuid primary key default gen_random_uuid(),
  linkedin_sub text not null,
  email text,
  name text,
  signed_in_at timestamptz not null default now(),
  user_agent text,
  ip text
);

create index if not exists linkedin_sign_ins_signed_in_at_idx
  on public.linkedin_sign_ins (signed_in_at desc);

create index if not exists linkedin_sign_ins_sub_idx
  on public.linkedin_sign_ins (linkedin_sub);

alter table public.linkedin_sign_ins enable row level security;

-- Intentionally no GRANT to anon/authenticated: only the service role (server) inserts via REST.
-- View rows in Supabase Dashboard → Table Editor → linkedin_sign_ins.
