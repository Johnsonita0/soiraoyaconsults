# soiraoyaconsults

A real-estate consulting landing page built with React and Vite.

## Search engine optimization

The app updates page titles, descriptions, canonical URLs, social sharing metadata, and business structured data for each public route. Private pages and property search query pages are marked `noindex`. The static sitemap and robots rules are published from `public/`.

The canonical domain is configured as `https://soiraoyaconsulting.org` in `index.html`, `src/lib/seo.js`, `public/robots.txt`, and `public/sitemap.xml`. Keep these values in sync if the production domain changes. Once deployed, verify the domain in Google Search Console, submit `/sitemap.xml`, and review indexing and Core Web Vitals reports.

## Scripts

- npm install
- npm run dev
- npm run build

## Email and newsletter setup

Configure these server-side environment variables in Vercel (never expose the service-role key or Resend key as `VITE_` variables):

- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` for verified Resend sending.
- `RESEND_TO_EMAIL` for website enquiry notifications (defaults to `soiraoyaconsults@gmail.com`).
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the existing browser client, plus `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` for protected API operations. The service-role key must remain server-only.
- `CRON_SECRET` for scheduled campaign delivery and `SITE_URL` for confirmation and unsubscribe links.

Run the updated `supabase-schema.sql` in the Supabase SQL editor to create the subscriber, campaign, and delivery tables and the campaign-claim function. Public newsletter signups require email confirmation; active subscribers can unsubscribe from any campaign. The admin Newsletter panel saves drafts, schedules campaigns, and queues sends. On Vercel Hobby, the cron checks the queue once daily at 00:00 UTC and sends batches of up to 50 subscribers per run; additional batches wait until the following daily run. Scheduled sends occur on the first run after the selected time. A Vercel plan supporting more frequent cron runs is needed for closer-to-scheduled delivery.
