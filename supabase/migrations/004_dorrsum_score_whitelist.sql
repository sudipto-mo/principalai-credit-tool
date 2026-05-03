-- Dorrsum Score access whitelist.
-- Run in Supabase: SQL Editor → New query → paste → Run.
--
-- After running, go to Table Editor → dorrsum_score_whitelist
-- and add rows manually.  Only `email` is required.
--
-- To grant access: INSERT a row with the email address.
-- To revoke access: set active = false OR delete the row.

create table if not exists public.dorrsum_score_whitelist (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  name         text,                                -- optional label (e.g. "Sudipto M.")
  note         text,                                -- optional free-text note
  active       boolean not null default true,       -- set false to suspend without deleting
  added_at     timestamptz not null default now()
);

-- Fast lookup by email
create index if not exists dorrsum_score_whitelist_email_idx
  on public.dorrsum_score_whitelist (lower(email));

alter table public.dorrsum_score_whitelist enable row level security;

-- Only the service role (server-side) can read/write — no anon/authenticated access.
-- View and edit rows in Supabase Dashboard → Table Editor → dorrsum_score_whitelist.

-- Seed your own email right away:
insert into public.dorrsum_score_whitelist (email, name, note)
values ('sudipto.m23@gmail.com', 'Sudipto', 'Owner')
on conflict (email) do nothing;
