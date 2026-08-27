# SEO and Search Console Checklist

Post-launch:

1. Verify `www.destinofurniture.com` in Google Search Console.
2. Submit `https://www.destinofurniture.com/sitemap.xml`.
3. Inspect priority URLs: `/`, `/products`, `/projects`, `/clients`, `/contact`.
4. Request indexing only after DNS, HTTPS, canonical tags and redirects are stable.
5. Connect the website URL in Google Business Profile.
6. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` only after analytics consent copy is approved.
7. Monitor Search Console coverage, Core Web Vitals and performance reports.
8. Validate JSON-LD in Google's Rich Results Test and Schema Markup Validator.

Technical notes:

- Public pages have self-referencing canonicals.
- Admin routes are `noindex` and blocked in robots.
- Wishlist is `noindex` because it is device-specific.
- Filtered product URLs are `noindex` to reduce crawl bloat.
- Do not add ratings, reviews, prices, offers, opening hours or addresses until verified.
