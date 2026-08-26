# Redirect Map

| Old URL | New URL | Status |
| --- | --- | --- |
| `/Clients` | `/clients` | 301 |
| `/featured-categories` | `/products` | 301 |
| `/admin-login` | `/admin/login` | 301 |
| `/dashboard` | `/admin` | 301 |

Legacy `/product/:id` URLs from the old backend cannot be mapped one-to-one because the old product API is unavailable. After confirmed SKU records are imported, add explicit redirects in `next.config.ts` or the `redirects` admin resource.

