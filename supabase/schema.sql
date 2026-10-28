-- Class submissions for SysAdmin Documentation Lab.
--
-- Run this once in your Supabase project (SQL Editor -> New query -> paste -> Run).
-- Before running, replace CHANGE-THIS-CODE at the bottom with your own review code.
-- Don't commit your real review code to the repository.
--
-- Security model:
--   * Visitors (the public anon / publishable key) can only INSERT submissions.
--   * Nobody can read, change or delete submissions directly.
--   * The presenter reads and deletes them through the functions below, which require the
--     review code. The code is stored as a bcrypt hash, never in plain text.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 80),
  scenario_id text check (scenario_id is null or char_length(scenario_id) <= 60),
  scenario_title text check (scenario_title is null or char_length(scenario_title) <= 120),
  template text not null check (template in ('incident', 'request', 'security', 'maintenance')),
  found int check (found is null or found between 0 and 100),
  total int check (total is null or total between 0 and 100),
  checks_used int not null default 0 check (checks_used between 0 and 1000),
  record jsonb not null check (pg_column_size(record) <= 65536)
);

alter table public.submissions enable row level security;

drop policy if exists "Anyone can submit" on public.submissions;
create policy "Anyone can submit" on public.submissions
  for insert to anon, authenticated
  with check (true);
-- No SELECT, UPDATE or DELETE policies on purpose.

revoke all on public.submissions from anon, authenticated;
grant insert on public.submissions to anon, authenticated;

create table if not exists public.review_settings (
  id int primary key default 1 check (id = 1),
  code_hash text not null
);
alter table public.review_settings enable row level security;
revoke all on public.review_settings from anon, authenticated;

create or replace function public.check_review_code(review_code text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if review_code is null or not exists (
    select 1 from public.review_settings s
    where s.code_hash = extensions.crypt(review_code, s.code_hash)
  ) then
    raise exception 'Wrong review code' using errcode = '28000';
  end if;
end;
$$;

create or replace function public.list_submissions(review_code text)
returns setof public.submissions
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform public.check_review_code(review_code);
  return query select * from public.submissions order by created_at desc limit 500;
end;
$$;

create or replace function public.delete_submission(review_code text, submission_id uuid)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform public.check_review_code(review_code);
  delete from public.submissions where id = submission_id;
end;
$$;

create or replace function public.clear_submissions(review_code text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform public.check_review_code(review_code);
  delete from public.submissions where true;
end;
$$;

revoke all on function public.check_review_code(text) from public, anon, authenticated;
revoke all on function public.list_submissions(text) from public;
revoke all on function public.delete_submission(text, uuid) from public;
revoke all on function public.clear_submissions(text) from public;
grant execute on function public.list_submissions(text) to anon, authenticated;
grant execute on function public.delete_submission(text, uuid) to anon, authenticated;
grant execute on function public.clear_submissions(text) to anon, authenticated;

-- Set (or later change) the review code: replace the text in quotes and run this statement.
insert into public.review_settings (id, code_hash)
values (1, extensions.crypt('CHANGE-THIS-CODE', extensions.gen_salt('bf')))
on conflict (id) do update set code_hash = excluded.code_hash;
