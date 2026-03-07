-- Analytics tables for tracking page views and user interactions
-- Run this in Supabase SQL Editor

-- ============================================
-- PAGE VIEWS
-- ============================================
create table public.page_views (
  id uuid default uuid_generate_v4() primary key,
  page_path text not null,
  locale text,
  country text,
  city text,
  referrer text,
  user_agent text,
  device_type text check (device_type in ('desktop', 'mobile', 'tablet')),
  session_id text,
  is_new_visitor boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- ANALYTICS EVENTS (clicks, downloads, etc.)
-- ============================================
create table public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  event_type text not null check (event_type in ('click', 'download', 'form_submit', 'dossier_download')),
  element_id text,
  element_text text,
  page_path text,
  metadata jsonb,
  session_id text,
  created_at timestamptz default now()
);

-- ============================================
-- RLS
-- ============================================
alter table public.page_views enable row level security;
alter table public.analytics_events enable row level security;

-- Public can insert (for tracking)
create policy "Public can insert page views" on public.page_views
  for insert with check (true);

create policy "Public can insert analytics events" on public.analytics_events
  for insert with check (true);

-- Only authenticated users can read (admin dashboard)
create policy "Admin can read page views" on public.page_views
  for select using (auth.role() = 'authenticated');

create policy "Admin can read analytics events" on public.analytics_events
  for select using (auth.role() = 'authenticated');

-- Admin full access for cleanup
create policy "Admin can delete page views" on public.page_views
  for delete using (auth.role() = 'authenticated');

create policy "Admin can delete analytics events" on public.analytics_events
  for delete using (auth.role() = 'authenticated');

-- ============================================
-- INDEXES
-- ============================================
create index idx_page_views_created on public.page_views(created_at desc);
create index idx_page_views_path on public.page_views(page_path);
create index idx_page_views_country on public.page_views(country);
create index idx_page_views_locale on public.page_views(locale);
create index idx_page_views_session on public.page_views(session_id);
create index idx_page_views_device on public.page_views(device_type);
create index idx_events_type on public.analytics_events(event_type);
create index idx_events_created on public.analytics_events(created_at desc);
create index idx_events_page on public.analytics_events(page_path);
