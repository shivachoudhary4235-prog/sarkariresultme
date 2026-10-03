-- =============================================================================
--  SARKARI RESULT — SUPABASE POSTGRESQL SCHEMA (IDEMPOTENT)
--  Run this in Supabase SQL Editor or via `supabase db push`
-- =============================================================================

-- Enable required extensions
create extension if not exists "pgcrypto";
create extension if not exists "unaccent";

-- =============================================================================
-- 1. PROFILES (linked to auth.users)
-- =============================================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can only read/update their own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =============================================================================
-- 2. ADMIN ROLES
-- =============================================================================
do $$ begin
  create type admin_role_type as enum ('SUPER_ADMIN', 'CONTENT_ADMIN', 'EDITOR', 'MODERATOR');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.admin_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  role       admin_role_type not null default 'EDITOR',
  granted_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;

-- Only the server (service role) can manage admin_roles
-- No RLS policy means only the server key can access this table
-- (service role bypasses RLS)

-- =============================================================================
-- 3. NOTIFICATIONS (core content table)
-- =============================================================================
do $$ begin
  create type notification_category_type as enum (
    'result', 'admit-card', 'latest-job', 'teaching',
    'answer-key', 'syllabus', 'outsourcing', 'important'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type status_badge_type as enum (
    'DECLARED', 'ACTIVE', 'OUT', 'EXTENDED',
    'NEW', 'CORRECTION', 'UPCOMING'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.notifications (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  title                 text not null,
  category              notification_category_type not null,
  organization          text not null,
  department            text,
  state                 text not null default 'All India',
  qualification         text not null,
  total_vacancies       text not null,
  post_date             text not null,
  last_date             text,
  exam_date             text,
  admit_card_date       text,
  result_date           text,
  answer_key_date       text,
  answer_key_close_date text,
  answer_key_url        text,
  objection_url         text,
  teaching_level        text,
  teaching_subject      text,
  tet_requirement       text,
  fee_general           text,
  fee_reserved          text,
  age_min               text,
  age_max               text,
  age_as_on_date        text,
  age_relaxation_notes  text,
  post_wise_age_limits  text,
  eligibility           text not null,
  short_description     text not null,
  apply_url             text not null,
  apply_url_server2     text,
  notification_url      text not null,
  official_url          text not null,
  telegram_url          text,
  whatsapp_url          text,
  custom_links          jsonb default '[]'::jsonb,
  article_content       text,
  how_to_apply          text,
  selection_process     text,
  status_badge          status_badge_type,
  featured              boolean not null default false,
  published             boolean not null default false,
  in_trash              boolean not null default false,
  views                 integer not null default 0,
  created_by            uuid references auth.users(id),
  updated_by            uuid references auth.users(id),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Indexes for common query patterns
create index if not exists idx_notifications_slug        on public.notifications(slug);
create index if not exists idx_notifications_category   on public.notifications(category);
create index if not exists idx_notifications_published  on public.notifications(published);
create index if not exists idx_notifications_in_trash   on public.notifications(in_trash);
create index if not exists idx_notifications_featured   on public.notifications(featured);
create index if not exists idx_notifications_created_at on public.notifications(created_at desc);
create index if not exists idx_notifications_state      on public.notifications(state);
-- Full text search index
create index if not exists idx_notifications_title_fts
  on public.notifications using gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(organization, '') || ' ' || coalesce(short_description, '')));

alter table public.notifications enable row level security;

-- Public: only published, non-trashed notifications
drop policy if exists "Public can view published notifications" on public.notifications;
create policy "Public can view published notifications"
  on public.notifications for select
  using (published = true and in_trash = false);

-- All writes go through the server (service role key, bypasses RLS)

-- =============================================================================
-- 4. TICKER ITEMS
-- =============================================================================
create table if not exists public.ticker_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  url         text not null,
  active      boolean not null default true,
  category    text,
  badge       text,
  target_slug text,
  sort_order  integer not null default 0,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

alter table public.ticker_items enable row level security;

drop policy if exists "Public can view active ticker items" on public.ticker_items;
create policy "Public can view active ticker items"
  on public.ticker_items for select
  using (active = true);

-- =============================================================================
-- 5. FEATURED TILES
-- =============================================================================
create table if not exists public.featured_tiles (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  action_text  text not null,
  bg_color     text not null,
  action_color text not null,
  slug         text not null,
  active       boolean not null default true,
  sort_order   integer not null default 0,
  updated_by   uuid references auth.users(id),
  updated_at   timestamptz not null default now()
);

alter table public.featured_tiles enable row level security;

drop policy if exists "Public can view active featured tiles" on public.featured_tiles;
create policy "Public can view active featured tiles"
  on public.featured_tiles for select
  using (active = true);

-- =============================================================================
-- 6. FAQ ITEMS
-- =============================================================================
create table if not exists public.faq_items (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  sort_order integer not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faq_items enable row level security;

drop policy if exists "Public can view active FAQ items" on public.faq_items;
create policy "Public can view active FAQ items"
  on public.faq_items for select
  using (active = true);

-- =============================================================================
-- 7. MEDIA FILES & SUPABASE STORAGE BUCKET (Replaces Cloudflare R2)
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('portal-media', 'portal-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access to portal-media" on storage.objects;
create policy "Public Access to portal-media"
  on storage.objects for select
  using ( bucket_id = 'portal-media' );

drop policy if exists "Admins upload to portal-media" on storage.objects;
create policy "Admins upload to portal-media"
  on storage.objects for insert
  with check ( bucket_id = 'portal-media' );

create table if not exists public.media_files (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url   text not null,
  file_name    text not null,
  mime_type    text not null,
  size_bytes   bigint not null,
  alt_text     text,
  uploaded_by  uuid references auth.users(id),
  created_at   timestamptz not null default now()
);

alter table public.media_files enable row level security;


-- Only admins (via server key) can manage media files
-- No public select policy — all access via service role

-- =============================================================================
-- 8. AUDIT LOGS
-- =============================================================================
create table if not exists public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null,
  actor_email   text not null,
  action        text not null,
  resource_type text not null,
  resource_id   text,
  before_data   jsonb,
  after_data    jsonb,
  ip_address    text,
  user_agent    text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_audit_logs_actor     on public.audit_logs(actor_user_id);
create index if not exists idx_audit_logs_action    on public.audit_logs(action);
create index if not exists idx_audit_logs_resource  on public.audit_logs(resource_type, resource_id);
create index if not exists idx_audit_logs_created   on public.audit_logs(created_at desc);

alter table public.audit_logs enable row level security;

-- Only accessible via server key (service role)
-- No RLS policy = only service role can read/write

-- =============================================================================
-- 9. SITE SETTINGS
-- =============================================================================
create table if not exists public.site_settings (
  id                   uuid primary key default gen_random_uuid(),
  site_name            text not null default 'Sarkari Result',
  site_tagline         text not null default 'Public Jobs & Recruitment Portal',
  telegram_channel_url text,
  whatsapp_group_url   text,
  footer_text          text,
  maintenance_mode     boolean not null default false,
  updated_at           timestamptz not null default now(),
  updated_by           uuid references auth.users(id)
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
  on public.site_settings for select
  using (true);

-- Insert default settings
insert into public.site_settings (site_name, site_tagline)
values ('Sarkari Result', 'Public Jobs & Recruitment Portal')
on conflict do nothing;

-- =============================================================================
-- 10. TRIGGERS — auto-update updated_at
-- =============================================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_notifications_updated_at on public.notifications;
create trigger trigger_notifications_updated_at
  before update on public.notifications
  for each row execute function public.update_updated_at();

drop trigger if exists trigger_profiles_updated_at on public.profiles;
create trigger trigger_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

drop trigger if exists trigger_admin_roles_updated_at on public.admin_roles;
create trigger trigger_admin_roles_updated_at
  before update on public.admin_roles
  for each row execute function public.update_updated_at();

drop trigger if exists trigger_faq_items_updated_at on public.faq_items;
create trigger trigger_faq_items_updated_at
  before update on public.faq_items
  for each row execute function public.update_updated_at();

drop trigger if exists trigger_featured_tiles_updated_at on public.featured_tiles;
create trigger trigger_featured_tiles_updated_at
  before update on public.featured_tiles
  for each row execute function public.update_updated_at();
