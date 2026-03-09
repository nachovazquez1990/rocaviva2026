-- Rocaviva 2026 Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROJECTS
-- ============================================
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title_es text not null,
  title_en text,
  title_fr text,
  description_es text,
  description_en text,
  description_fr text,
  image_url text,
  dossier_url_es text,
  dossier_url_en text,
  dossier_url_fr text,
  display_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PROJECT IMAGES (gallery)
-- ============================================
create table public.project_images (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  image_url text not null,
  alt_es text,
  alt_en text,
  alt_fr text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- EXHIBITIONS (itinerancias)
-- ============================================
create table public.exhibitions (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  slug text not null,
  city_es text not null,
  city_en text,
  city_fr text,
  venue_es text,
  venue_en text,
  venue_fr text,
  date_from date,
  date_to date,
  description_es text,
  description_en text,
  description_fr text,
  display_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, slug)
);

-- ============================================
-- EXHIBITION IMAGES (gallery)
-- ============================================
create table public.exhibition_images (
  id uuid default uuid_generate_v4() primary key,
  exhibition_id uuid references public.exhibitions(id) on delete cascade not null,
  image_url text not null,
  alt_es text,
  alt_en text,
  alt_fr text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- NEWS / COMMUNICATION
-- ============================================
create table public.news (
  id uuid default uuid_generate_v4() primary key,
  title_es text not null,
  title_en text,
  title_fr text,
  description_es text,
  description_en text,
  description_fr text,
  image_url text,
  date date not null,
  link_url text,
  media_type text check (media_type in ('press', 'radio', 'tv', 'video')) default 'press',
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- BOOKS
-- ============================================
create table public.books (
  id uuid default uuid_generate_v4() primary key,
  title_es text not null,
  title_en text,
  title_fr text,
  description_es text,
  description_en text,
  description_fr text,
  image_url text,
  extra_image_url text,
  download_url_part1 text,
  download_url_part2 text,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- BOOK DOWNLOADS (form submissions)
-- ============================================
create table public.book_downloads (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references public.books(id) on delete set null,
  name text not null,
  email text not null,
  interest text check (interest in ('personal', 'professional', 'gift')),
  profession text,
  comments text,
  created_at timestamptz default now()
);

-- ============================================
-- COLLABORATORS
-- ============================================
create table public.collaborators (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  logo_url text not null,
  website_url text,
  display_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- HOME CONTENT (editable sections)
-- ============================================
create table public.home_content (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value_es text,
  value_en text,
  value_fr text,
  updated_at timestamptz default now()
);

-- Insert default home content keys (run scripts/seed-home-content.sql for full content)
insert into public.home_content (key, value_es, value_en, value_fr) values
  ('hero_subtitle', '', '', ''),
  ('hero_cta', '', '', ''),
  ('about_title', '', '', ''),
  ('about_intro', '', '', ''),
  ('about_exhibition_1', '', '', ''),
  ('about_exhibition_2', '', '', ''),
  ('about_exhibition_3', '', '', ''),
  ('about_exhibition_4', '', '', ''),
  ('about_projects', '', '', ''),
  ('about_collaborators', '', '', ''),
  ('about_nobel', '', '', ''),
  ('about_readings', '', '', ''),
  ('about_yo_te_aplaudo', '', '', ''),
  ('services_title', '', '', ''),
  ('service_exhibitions', '', '', ''),
  ('service_exhibitions_desc', '', '', ''),
  ('service_guided_tours', '', '', ''),
  ('service_guided_tours_desc', '', '', ''),
  ('service_conferences', '', '', ''),
  ('service_conferences_desc', '', '', ''),
  ('service_readings', '', '', ''),
  ('service_readings_desc', '', '', ''),
  ('service_workshops', '', '', ''),
  ('service_workshops_desc', '', '', ''),
  ('service_commemorations', '', '', ''),
  ('service_commemorations_desc', '', '', ''),
  ('contact_title', '', '', ''),
  ('contact_cta', '', '', ''),
  ('contact_button', '', '', ''),
  ('social_title', '', '', '');

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.exhibitions enable row level security;
alter table public.exhibition_images enable row level security;
alter table public.news enable row level security;
alter table public.books enable row level security;
alter table public.book_downloads enable row level security;
alter table public.collaborators enable row level security;
alter table public.home_content enable row level security;

-- Public read access for published content
create policy "Public can read published projects" on public.projects
  for select using (is_published = true);

create policy "Public can read project images" on public.project_images
  for select using (true);

create policy "Public can read published exhibitions" on public.exhibitions
  for select using (is_published = true);

create policy "Public can read exhibition images" on public.exhibition_images
  for select using (true);

create policy "Public can read published news" on public.news
  for select using (is_published = true);

create policy "Public can read published books" on public.books
  for select using (is_published = true);

create policy "Public can insert book downloads" on public.book_downloads
  for insert with check (true);

create policy "Public can read collaborators" on public.collaborators
  for select using (is_published = true);

create policy "Public can read home content" on public.home_content
  for select using (true);

-- Admin full access (authenticated users)
create policy "Admin full access projects" on public.projects
  for all using (auth.role() = 'authenticated');

create policy "Admin full access project_images" on public.project_images
  for all using (auth.role() = 'authenticated');

create policy "Admin full access exhibitions" on public.exhibitions
  for all using (auth.role() = 'authenticated');

create policy "Admin full access exhibition_images" on public.exhibition_images
  for all using (auth.role() = 'authenticated');

create policy "Admin full access news" on public.news
  for all using (auth.role() = 'authenticated');

create policy "Admin full access books" on public.books
  for all using (auth.role() = 'authenticated');

create policy "Admin full access book_downloads" on public.book_downloads
  for all using (auth.role() = 'authenticated');

create policy "Admin full access collaborators" on public.collaborators
  for all using (auth.role() = 'authenticated');

create policy "Admin full access home_content" on public.home_content
  for all using (auth.role() = 'authenticated');

-- ============================================
-- INDEXES
-- ============================================
create index idx_projects_slug on public.projects(slug);
create index idx_projects_order on public.projects(display_order);
create index idx_exhibitions_project on public.exhibitions(project_id);
create index idx_exhibitions_slug on public.exhibitions(project_id, slug);
create index idx_news_date on public.news(date desc);
create index idx_news_type on public.news(media_type);
create index idx_collaborators_order on public.collaborators(display_order);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger exhibitions_updated_at before update on public.exhibitions
  for each row execute function public.handle_updated_at();

create trigger news_updated_at before update on public.news
  for each row execute function public.handle_updated_at();

create trigger books_updated_at before update on public.books
  for each row execute function public.handle_updated_at();

create trigger home_content_updated_at before update on public.home_content
  for each row execute function public.handle_updated_at();
