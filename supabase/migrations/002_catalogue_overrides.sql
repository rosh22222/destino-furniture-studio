-- Expose only override identities, never unpublished content, to the public catalogue.
create or replace function public.catalogue_overrides(resource text)
returns table(slug text)
language sql stable security definer
set search_path = ''
as $$
  select coalesce(nullif(p.content->>'_seedSlug', ''), p.slug)
  from public.products p where resource = 'products'
  union
  select coalesce(nullif(p.content->>'_seedSlug', ''), p.slug)
  from public.projects p where resource = 'projects';
$$;

revoke all on function public.catalogue_overrides(text) from public;
grant execute on function public.catalogue_overrides(text) to anon, authenticated;

create unique index if not exists products_seed_identity
  on public.products ((content->>'_seedSlug')) where content ? '_seedSlug';
create unique index if not exists projects_seed_identity
  on public.projects ((content->>'_seedSlug')) where content ? '_seedSlug';
