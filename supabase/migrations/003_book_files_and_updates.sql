-- Migration: book_files table for dynamic book parts
-- Run this in Supabase SQL Editor

-- ============================================
-- BOOK FILES (replaces download_url_part1/part2)
-- ============================================
create table public.book_files (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  file_url text not null,
  label text,
  part_number int not null default 1,
  created_at timestamptz default now()
);

-- RLS
alter table public.book_files enable row level security;

create policy "Public can read book files" on public.book_files
  for select using (true);

create policy "Admin full access book_files" on public.book_files
  for all using (auth.role() = 'authenticated');

-- Index
create index idx_book_files_book on public.book_files(book_id, part_number);
