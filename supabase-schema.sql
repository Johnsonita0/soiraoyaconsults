-- Comprehensive Supabase schema for S.O. Iraoya
-- Exact admin-only access: admin@soiraoyaconsulting.com.ng
-- Exact user id: 8b4f5926-c6ec-43a0-aa34-7277a2732577

create extension if not exists "uuid-ossp";

create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_slides (
  id uuid primary key default uuid_generate_v4(),
  title text,
  tagline text,
  image_url text,
  image_path text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  location text,
  type text,
  price text,
  description text,
  image_url text,
  image_path text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text not null,
  request text,
  message text,
  created_at timestamptz not null default now(),
  status text not null default 'new'
);

create table if not exists public.files (
  id uuid primary key default uuid_generate_v4(),
  bucket_name text not null,
  file_name text not null,
  file_path text not null,
  mime_type text,
  size bigint,
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.hero_slides enable row level security;
alter table public.gallery_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.files enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select auth.uid() = '8b4f5926-c6ec-43a0-aa34-7277a2732577'::uuid
    and lower(auth.email()) = 'admin@soiraoyaconsulting.com.ng';
$$;

drop policy if exists "Admins can read site settings" on public.site_settings;
drop policy if exists "Admins can insert site settings" on public.site_settings;
drop policy if exists "Admins can update site settings" on public.site_settings;
drop policy if exists "Public can read published hero slides" on public.hero_slides;
drop policy if exists "Admins can write hero slides" on public.hero_slides;
drop policy if exists "Public can read published gallery" on public.gallery_items;
drop policy if exists "Admins can write gallery" on public.gallery_items;
drop policy if exists "Public can submit contacts" on public.contact_messages;
drop policy if exists "Admins can read contacts" on public.contact_messages;
drop policy if exists "Admins can manage storage files" on public.files;
drop policy if exists "Public read access to public images" on storage.objects;
drop policy if exists "Admin write access to public images" on storage.objects;
drop policy if exists "Admin update access to public images" on storage.objects;
drop policy if exists "Admin delete access to public images" on storage.objects;

create policy "Admins can read site settings" on public.site_settings
for select using (public.is_admin_user());

create policy "Admins can insert site settings" on public.site_settings
for insert with check (public.is_admin_user());

create policy "Admins can update site settings" on public.site_settings
for update using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Public can read published hero slides" on public.hero_slides
for select using (is_active = true or public.is_admin_user());

create policy "Admins can write hero slides" on public.hero_slides
for all using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Public can read published gallery" on public.gallery_items
for select using (is_active = true);

create policy "Admins can write gallery" on public.gallery_items
for all using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Public can submit contacts" on public.contact_messages
for insert with check (true);

create policy "Admins can read contacts" on public.contact_messages
for select using (public.is_admin_user());

create policy "Admins can manage storage files" on public.files
for all using (public.is_admin_user())
with check (public.is_admin_user());

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
drop trigger if exists set_hero_slides_updated_at on public.hero_slides;
drop trigger if exists set_gallery_items_updated_at on public.gallery_items;

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute procedure public.handle_updated_at();

create trigger set_hero_slides_updated_at
before update on public.hero_slides
for each row execute procedure public.handle_updated_at();

create trigger set_gallery_items_updated_at
before update on public.gallery_items
for each row execute procedure public.handle_updated_at();

create or replace function public.seed_default_content()
returns void
language plpgsql
as $$
begin
  insert into public.site_settings (key, value)
  values
    ('hero_title', '{"text": "Property decisions, made with conviction."}'::jsonb),
    ('hero_text', '{"text": "Strategic real-estate advisory for people and institutions who want to protect capital, unlock opportunity, and build lasting value."}'::jsonb),
    ('hero_slides', '{"items": [{"title": "Property decisions, made with conviction.", "tagline": "Perspective changes everything.", "image_url": "/image/hero/hero-1.jpg"}, {"title": "Build value that lasts.", "tagline": "The long view creates stronger assets.", "image_url": "/image/hero/hero-2.jpg"}]}'::jsonb)
  on conflict (key) do nothing;
end;
$$;

create or replace function public.seed_default_gallery()
returns void
language plpgsql
as $$
begin
  insert into public.gallery_items (title, location, type, price, description, image_url, sort_order, is_active)
  values
    ('Ikoyi Garden Residence', 'Ikoyi, Lagos', 'Residential', '₦185m', 'A considered family residence with generous light, mature landscaping, and quiet access to the city.', '/image/hero/hero-1.jpg', 0, true),
    ('Victoria Island Offices', 'Victoria Island, Lagos', 'Commercial', '₦420m', 'A flexible office asset positioned for businesses looking for a central Lagos address.', '/image/hero/hero-4.jpg', 1, true)
  on conflict do nothing;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-images', 'public-images', true, 5242880, ARRAY['image/png','image/jpeg','image/webp','image/jpg','image/gif'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-uploads', 'public-uploads', true, 10485760, ARRAY['image/png','image/jpeg','image/webp','image/jpg','image/gif'])
on conflict (id) do nothing;

create policy "Public read access to public images" on storage.objects
for select using (bucket_id in ('public-images', 'public-uploads'));

create policy "Admin write access to public images" on storage.objects
for insert with check (
  bucket_id in ('public-images', 'public-uploads')
  and public.is_admin_user()
);

create policy "Admin update access to public images" on storage.objects
for update using (
  bucket_id in ('public-images', 'public-uploads')
  and public.is_admin_user()
)
with check (
  bucket_id in ('public-images', 'public-uploads')
  and public.is_admin_user()
);

create policy "Admin delete access to public images" on storage.objects
for delete using (
  bucket_id in ('public-images', 'public-uploads')
  and public.is_admin_user()
);

