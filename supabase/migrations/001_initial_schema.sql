create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

create or replace function public.create_content_table(table_name text)
returns void
language plpgsql
as $$
begin
  execute format($fmt$
    create table if not exists public.%I (
      id uuid primary key default gen_random_uuid(),
      title text not null,
      slug text not null unique,
      status text not null default 'draft' check (status in ('draft', 'published')),
      display_order integer not null default 100,
      image_url text,
      image_alt text,
      content jsonb not null default '{}'::jsonb,
      created_by uuid references auth.users(id) on delete set null,
      updated_by uuid references auth.users(id) on delete set null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  $fmt$, table_name);

  execute format(
    'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
    table_name,
    table_name
  );
exception
  when duplicate_object then null;
end;
$$;

select public.create_content_table('product_categories');
select public.create_content_table('products');
select public.create_content_table('brands');
select public.create_content_table('projects');
select public.create_content_table('clients');
select public.create_content_table('locations');
select public.create_content_table('insights');
select public.create_content_table('faqs');
select public.create_content_table('homepage_sections');
select public.create_content_table('site_settings');
select public.create_content_table('social_links');
select public.create_content_table('footer_content');
select public.create_content_table('seo_defaults');
select public.create_content_table('seo_pages');
select public.create_content_table('redirects');

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  image_url text not null,
  image_alt text,
  display_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  image_url text not null,
  image_alt text,
  display_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.website_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  company text,
  location text,
  message text not null,
  source_path text not null,
  products text[] not null default '{}',
  project text,
  status text not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotation_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  company text,
  location text,
  message text not null,
  source_path text not null,
  products text[] not null default '{}',
  project text,
  status text not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_website_enquiries_updated_at
before update on public.website_enquiries
for each row execute function public.set_updated_at();

create trigger set_quotation_requests_updated_at
before update on public.quotation_requests
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles
for select using (id = auth.uid() or public.is_admin());
create policy "Admins manage profiles" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'product_categories',
    'products',
    'brands',
    'projects',
    'clients',
    'locations',
    'insights',
    'faqs',
    'homepage_sections',
    'site_settings',
    'social_links',
    'footer_content',
    'seo_defaults',
    'seo_pages',
    'redirects'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy "Public reads published %1$I" on public.%1$I for select using (status = ''published'')',
      table_name
    );
    execute format(
      'create policy "Admins manage %1$I" on public.%1$I for all using (public.is_admin()) with check (public.is_admin())',
      table_name
    );
  end loop;
end;
$$;

alter table public.product_images enable row level security;
alter table public.project_images enable row level security;
create policy "Public reads product images" on public.product_images for select using (true);
create policy "Admins manage product images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "Public reads project images" on public.project_images for select using (true);
create policy "Admins manage project images" on public.project_images for all using (public.is_admin()) with check (public.is_admin());

alter table public.website_enquiries enable row level security;
alter table public.quotation_requests enable row level security;
create policy "Anyone can create website enquiries" on public.website_enquiries for insert with check (true);
create policy "Admins manage website enquiries" on public.website_enquiries for all using (public.is_admin()) with check (public.is_admin());
create policy "Anyone can create quotation requests" on public.quotation_requests for insert with check (true);
create policy "Admins manage quotation requests" on public.quotation_requests for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media',
  'website-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public reads website media" on storage.objects
for select using (bucket_id = 'website-media');

create policy "Admins upload website media" on storage.objects
for insert with check (bucket_id = 'website-media' and public.is_admin());

create policy "Admins update website media" on storage.objects
for update using (bucket_id = 'website-media' and public.is_admin())
with check (bucket_id = 'website-media' and public.is_admin());

create policy "Admins delete website media" on storage.objects
for delete using (bucket_id = 'website-media' and public.is_admin());

drop function if exists public.create_content_table(text);

