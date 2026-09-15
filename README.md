# POWER FITNESS HEALTH CLUB GYM

Production-ready React/Vite/Tailwind/Supabase starter for the Power Fitness Health Club Gym website + admin dashboard.

## Important
The supplied project snippets had several runtime/SQL issues. This version fixes them:
- Vite `index.html` is at the project root.
- Supabase client is guarded when env vars are missing.
- Auth hook exposes `loading`, `error`, session and password-change functionality.
- Login fields have proper `name`/state handling.
- Member due amount is a normal DB column maintained by a PostgreSQL trigger; PostgreSQL generated columns cannot contain a cross-table subquery.
- Member status is calculated from expiry date.
- Responsive mobile navigation works.
- Admin routes are protected.
- Member search/filter/delete/edit/add are implemented.
- Plans/facilities/gallery/settings CMS screens are implemented.
- RLS is enabled for the application tables.
- No service-role key is used in the frontend.

## Setup

1. Create a Supabase project.
2. Open SQL Editor and run:
   `supabase/migrations/20260915_initial_schema.sql`
3. Create Storage buckets:
   - `member-photos` — Private
   - `gallery` — Public
   - `facilities` — Public
   - `gym-logo` — Public
4. Put the actual gym logo at:
   `public/assets/images/logo.svg`
   (The source conversation did not contain the binary logo asset, so this ZIP intentionally does not fabricate or redesign it.)
5. Optional hero/background media can be added later; the hero currently uses a premium CSS composition so it never shows a broken image.
6. Copy `.env.example` to `.env` and fill:
   `VITE_SUPABASE_URL=...`
   `VITE_SUPABASE_ANON_KEY=...`
7. Create the admin user in Supabase Authentication > Users.
8. Install/build:
   `npm install`
   `npm run build`
9. Cloudflare Pages:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Storage security
For `member-photos`, keep the bucket private and create authenticated-only Storage policies. The member-management UI expects a public URL today, so if you keep that bucket private, switch the UI to signed URLs before production. The safer production approach is signed URLs for member photos.

## Current business facts
- POWER FITNESS HEALTH CLUB GYM
- Owner: Mukesh Kumar Jagrat
- WhatsApp/Phone: +91 99296 56539
- Instagram: @power_fitness_healthclub_gym
- Address: Plot No. 67, Mukund Vihar Colony, Near Study Base Library, Adarsh Nagar, Ajmer, Rajasthan - 305003
- Maps: https://maps.app.goo.gl/vjHAwZynNLBQK3TRA?g_st=ac
- Plans seeded: Yearly ₹8,999; 6 Months ₹5,999; 3 Months ₹3,499

Opening hours are intentionally not invented and remain editable in settings.
