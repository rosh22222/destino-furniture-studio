# Content Management

Use `/admin` after Supabase is configured.

1. Run `supabase/migrations/001_initial_schema.sql`.
2. Create a Supabase Auth user for the administrator.
3. Insert a matching row in `profiles` with role `admin` or `editor`.
4. Use the resource dashboard to manage published/draft status, display order, image alt text, JSON content and media.

Images are uploaded to the public `website-media` bucket with a 5 MB validation limit. Product-level fields such as dimensions, SKU, finishes, brochures and materials should be added only after the business confirms them.

Recommended content keys:

- Products: `categorySlug`, `brandSlug`, `furnitureType`, `shortDescription`, `fullDescription`, `gallery`, `features`, `materials`, `dimensions`, `finishes`, `relatedSlugs`, `seoTitle`, `seoDescription`.
- Projects: `clientName`, `sector`, `location`, `gallery`, `scope`, `categories`, `relatedProductSlugs`, `seoTitle`, `seoDescription`.
- Locations: `region`, `intro`, `services`, `serviceAreas`, `relatedProjectSlugs`, `address`, `businessHours`, `mapEmbedUrl`, `directionsUrl`, `seoTitle`, `seoDescription`.
- Insights: `category`, `excerpt`, `body`, `author`, `publishedAt`, `seoTitle`, `seoDescription`.

