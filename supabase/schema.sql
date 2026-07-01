-- ============================================================
-- KSG Tag Generator — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── Profiles (extends Supabase Auth users) ─────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'admin'
    check (role in ('superadmin', 'admin', 'staff')),
  created_at timestamptz not null default now()
);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'admin')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── ID Tags ────────────────────────────────────────────────
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  full_name text not null,
  department text,
  position text,
  category text,
  id_number text not null,
  status text not null default 'Active',
  date_generated timestamptz not null default now(),
  updated_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_by_email text
);

create index if not exists tags_date_generated_idx on public.tags (date_generated desc);
create index if not exists tags_id_number_idx on public.tags (id_number);
create index if not exists tags_category_idx on public.tags (category);

-- ─── Activity logs ──────────────────────────────────────────
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  msg text not null,
  time timestamptz not null default now(),
  user_email text
);

create index if not exists activity_logs_time_idx on public.activity_logs (time desc);

-- ─── App settings (single shared row) ───────────────────────
create table if not exists public.app_settings (
  id text primary key default 'default',
  org text not null default 'Kenya School of Government',
  sys text not null default 'KSG Tag Generator System',
  tagline text not null default 'Official Identification Tag',
  gov text not null default 'Republic of Kenya',
  dark_mode boolean not null default false,
  qr boolean not null default true,
  dup boolean not null default true,
  log boolean not null default true,
  email boolean not null default false,
  tag_layout jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (id)
values ('default')
on conflict (id) do nothing;

-- ─── Row Level Security ─────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.tags enable row level security;
alter table public.activity_logs enable row level security;
alter table public.app_settings enable row level security;

-- Profiles: users read/update own row; all authenticated can read (for display)
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Tags: full CRUD for authenticated users
create policy "tags_select_authenticated"
  on public.tags for select
  to authenticated
  using (true);

create policy "tags_insert_authenticated"
  on public.tags for insert
  to authenticated
  with check (true);

create policy "tags_update_authenticated"
  on public.tags for update
  to authenticated
  using (true)
  with check (true);

create policy "tags_delete_authenticated"
  on public.tags for delete
  to authenticated
  using (true);

-- Activity logs (Superadmin only for delete)
create policy "logs_select_authenticated"
  on public.activity_logs for select
  to authenticated
  using (true);

create policy "logs_insert_authenticated"
  on public.activity_logs for insert
  to authenticated
  with check (true);

create policy "logs_delete_superadmin_only"
  on public.activity_logs for delete
  to authenticated
  using (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'superadmin'
    )
  );

-- App settings (shared org config)
create policy "settings_select_authenticated"
  on public.app_settings for select
  to authenticated
  using (true);

create policy "settings_upsert_authenticated"
  on public.app_settings for insert
  to authenticated
  with check (true);

create policy "settings_update_authenticated"
  on public.app_settings for update
  to authenticated
  using (true)
  with check (true);

-- ─── Optional: enable email auth in Dashboard ───────────────
-- Authentication → Providers → Email → Enable
-- For local dev you may disable "Confirm email" under Email settings.
