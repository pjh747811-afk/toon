-- ToonLog: run this entire script in Supabase > SQL Editor.
-- User-owned diary rows. RLS ensures each user can access only their own records.

create table if not exists public.toonlog_diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  diary_id text not null,
  title text not null default '제목 없는 웹툰',
  diary_date text,
  style text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint toonlog_diaries_user_diary_unique unique (user_id, diary_id)
);

create index if not exists toonlog_diaries_user_updated_idx
  on public.toonlog_diaries (user_id, updated_at desc);

alter table public.toonlog_diaries enable row level security;

drop policy if exists "Users can read their own ToonLog diaries" on public.toonlog_diaries;
create policy "Users can read their own ToonLog diaries"
  on public.toonlog_diaries for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own ToonLog diaries" on public.toonlog_diaries;
create policy "Users can insert their own ToonLog diaries"
  on public.toonlog_diaries for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own ToonLog diaries" on public.toonlog_diaries;
create policy "Users can update their own ToonLog diaries"
  on public.toonlog_diaries for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own ToonLog diaries" on public.toonlog_diaries;
create policy "Users can delete their own ToonLog diaries"
  on public.toonlog_diaries for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.toonlog_diaries to authenticated;
