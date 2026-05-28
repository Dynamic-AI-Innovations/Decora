# Cloudflare CDN — Decora

CDN sits in front of Vercel + Supabase Storage. Job: serve generated renders fast
to Nigerian users (Lagos PoP), with WebP transforms, aggressive caching, and
image resizing.

## Rules to configure (do these manually in dashboard for V1.0)

1. **Image resizing** on `*.supabase.co/storage/v1/object/public/renders/*` —
   transform to WebP, max width 1080px for share/download, 2048px for hero.
2. **Cache-everything** on `/renders/*` (immutable, 1-year max-age).
3. **Origin Pull policy:** keep origin auth header off, public bucket.
4. **WAF:** rate-limit `/api/renders` to 60 req/min per IP at the edge.
5. **Page Rules:** strip query params from cache keys on render image URLs.
6. **Browser cache TTL:** 4 hours for HTML, 1 year for hashed assets.

When automating, move config into Terraform under `infra/cloudflare/terraform/`.
