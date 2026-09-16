# Content Management

Use `/admin` with a Supabase Auth account whose `profiles.role` is `admin` or `editor`.
Apply all migrations using `npx supabase db push`, including `002_catalogue_overrides.sql`.

## Products and Projects

The existing-record list includes items originally added in code and items added in the CMS.
Search by name, page slug, product ID, category or location, and filter by publishing status.
Open a record, make changes, then select **Save Record**. **View on website** opens its published page.

- A new record is placed after existing entries. Products are ordered within their category.
- Names, descriptions, category assignments, images and project details appear after saving.
- Descriptions support `**bold**`, `*italic*`, `***bold italic***` and paragraphs separated by a blank line.
- Upload a main image and multiple gallery images, or use gallery image URLs. Remove a gallery thumbnail with its remove button and save.
- Uploads accept JPG, PNG, WebP and AVIF, up to 5 MB per image and 25 MB per save. The hosting platform may impose a lower request limit.
- Failed saves preserve the form. Changes made in another tab are detected to prevent overwriting newer content.
- New-record forms clear after a successful save. Existing-record forms retain the saved values.
- Title and description supply SEO text automatically. Details without editable fields are retained.

## Original Records

Edits to code-defined records are stored in Supabase with a stable `_seedSlug` identity.
Changing a page slug replaces the original listing; the previous URL no longer resolves.
Drafts are hidden from public pages. Deleting a saved original creates a hidden draft marker so the
original code content does not reappear. Records created solely in the CMS are deleted normally.

The `catalogue_overrides` database function exposes only record identities to the public catalogue.
Draft content remains protected by the existing row-level security policies.

## Verification

Run `npm run test:admin` for isolated save, merge, image, draft, deletion, concurrency and pagination tests.
These tests do not write to the live database.

`node scripts/test-admin-browser.mjs` runs real Next.js admin/public pages against an isolated
Supabase-compatible fixture. It requires Playwright and Chromium; `PLAYWRIGHT_MODULE` can point to an
existing Playwright installation. Desktop/mobile screenshots are written to `.next/cms-test-screenshots`.
