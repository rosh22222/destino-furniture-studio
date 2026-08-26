# Destino Furniture Studio Website

Production-ready Next.js App Router site for Destino Furniture Studio, a unit of Manidivya Enterprises.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Supabase Auth, PostgreSQL and Storage
- Local fallback seed content in `lib/data.ts`

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
3. Run `supabase/migrations/001_initial_schema.sql`.
4. Create an Auth user.
5. Insert a row into `profiles` for that user with role `admin`.
6. Sign in at `/admin/login`.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

## Important Notes

- The site is enquiry-focused and does not include checkout, payments or fake prices.
- Public content is rendered server-side or statically regenerated.
- Product specs, addresses, hours, awards and pricing remain hidden until verified.
- Wishlist data persists locally on the visitor's device.
- Forms validate, rate-limit and store to Supabase when configured.

See `docs/CONTENT_MANAGEMENT.md`, `docs/SEO_CHECKLIST.md`, `docs/REDIRECT_MAP.md` and `docs/CONFIRMATION_REQUIRED.md` for launch operations.

