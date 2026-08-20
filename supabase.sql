-- Proofly cloud database (Supabase / PostgreSQL)
-- Stores per-user application state with RLS.
create table if not exists public.user_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_states enable row level security;
drop policy if exists "Users can read their own Proofly state" on public.user_states;
create policy "Users can read their own Proofly state" on public.user_states for select using (auth.uid() = user_id);
drop policy if exists "Users can insert their own Proofly state" on public.user_states;
create policy "Users can insert their own Proofly state" on public.user_states for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own Proofly state" on public.user_states;
create policy "Users can update their own Proofly state" on public.user_states for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete their own Proofly state" on public.user_states;
create policy "Users can delete their own Proofly state" on public.user_states for delete using (auth.uid() = user_id);
create or replace function public.touch_user_states_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists trg_user_states_updated_at on public.user_states;
create trigger trg_user_states_updated_at before update on public.user_states for each row execute function public.touch_user_states_updated_at();
