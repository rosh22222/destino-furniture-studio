-- This seed shows the content structure used by the admin panel.
-- The public site also ships with local verified seed data in lib/data.ts.

insert into public.product_categories (
  title,
  slug,
  status,
  display_order,
  image_url,
  image_alt,
  content
) values (
  'Office Furniture',
  'office-furniture',
  'published',
  10,
  '/legacy/image%20(1)-D1OB4ju4.jpeg',
  'Office furniture project by Destino Furniture Studio',
  '{
    "summary": "Desks, seating, storage and collaborative furniture for modern workplaces.",
    "description": "Destino helps teams select coordinated office furniture for cabins, workstations, meeting rooms and support areas.",
    "keywords": ["office furniture in Visakhapatnam", "office furniture in Kakinada", "office furniture in Bengaluru"],
    "featured": true
  }'::jsonb
) on conflict (slug) do nothing;

insert into public.products (
  title,
  slug,
  status,
  display_order,
  image_url,
  image_alt,
  content
) values (
  'Ergonomic Task Chair Range',
  'ergonomic-task-chair-range',
  'published',
  10,
  '/legacy/image%20(2)-BJmis9oF.jpeg',
  'Ergonomic chair range by Destino Furniture Studio',
  '{
    "categorySlug": "ergonomic-chairs",
    "brandSlug": "hof",
    "furnitureType": "Chairs",
    "shortDescription": "A curated ergonomic-chair range for focused office work.",
    "fullDescription": "Confirmed adjustment details, dimensions and finishes are added at quotation stage.",
    "gallery": ["/legacy/image%20(2)-BJmis9oF.jpeg"],
    "features": ["Guided model selection by usage and seat count"],
    "relatedSlugs": [],
    "featured": true,
    "seoTitle": "Ergonomic Office Chairs | Destino Furniture Studio",
    "seoDescription": "Explore ergonomic office chair ranges from Destino Furniture Studio.",
    "updatedAt": "2026-08-26"
  }'::jsonb
) on conflict (slug) do nothing;

insert into public.redirects (
  title,
  slug,
  status,
  display_order,
  content
) values (
  '/Clients to /clients',
  'clients-uppercase',
  'published',
  10,
  '{"source": "/Clients", "destination": "/clients", "permanent": true}'::jsonb
) on conflict (slug) do nothing;

