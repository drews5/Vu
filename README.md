# Vocal U website

The official website for Vocal U A Cappella at the University of Minnesota.

## Stack

- React and TypeScript
- Vite and Tailwind CSS
- Supabase for members, events, and audition slots
- Vercel for hosting and analytics

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and add the public Supabase project values.
3. Start the site with `npm run dev`.

Never commit `.env` or a Supabase service-role key. The service-role key is only for trusted server-side maintenance and is not used by the website.

## Checks

- `npm run typecheck` checks TypeScript.
- `npm run build` generates the sitemap and creates a production build in `build/`.
- `npm run check` runs both checks.

## Audition signup notifications

Audition signup and cancellation emails are sent from the Supabase Edge Function at
`supabase/functions/audition-notify`. The database trigger in
`supabase/migrations/20260908010000_audition_email_notifications.sql` calls that
function only after a reservation actually changes in `public.auditions`.

Set these Supabase Edge Function secrets:

```bash
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set AUDITION_NOTIFY_TO=you@example.com
supabase secrets set AUDITION_NOTIFY_FROM="Vocal U Auditions <auditions@vocalu.org>"
supabase secrets set AUDITION_WEBHOOK_SECRET=<long-random-secret>
```

Deploy the function without JWT verification because the database trigger
authenticates with `AUDITION_WEBHOOK_SECRET`:

```bash
supabase functions deploy audition-notify --no-verify-jwt
```

After the function is deployed, configure the database trigger:

```sql
alter database postgres set app.audition_notify_url = 'https://<project-ref>.supabase.co/functions/v1/audition-notify';
alter database postgres set app.audition_webhook_secret = '<same long-random-secret>';
select pg_reload_conf();
```

Resend requires `AUDITION_NOTIFY_FROM` to use a verified sending domain before
production delivery. For quick testing, use the sender address Resend allows on
your account.

## Content

The member roster lives in `src/data/memberGroups.json`. Events come from Supabase. Local images in `src/assets` are used when an event has a matching optimized asset.

Static page metadata lives in each page's `Seo` component. The canonical production origin is `https://www.vocalu.org`.

Birthday songs live in the native React page at `src/pages/Birthday.tsx`, with offer copy in `src/data/birthday.json`. It shares the site fonts, navigation shell, and transitions. The page is unlisted: open `/birthday` directly. It is excluded from menus, page promotions, the sitemap, and public page listings, and carries `noindex` metadata in both initial HTML and React. Requests submit through FormSubmit on the site and require a reply from Vocal U to confirm availability and payment. `/birthdays` and the former `/birthday.html` address redirect to `/birthday`.

`npm run build` also prepares readable initial HTML for the main public routes. Keep the page summaries in `scripts/prerender-public-pages.mjs` aligned with visible site copy when these pages change.

## Contact and birthday forms

The homepage contact form, contact page, and birthday request form share `submitContactMessage` in `src/utils/contact.ts`. They POST JSON to `https://formsubmit.co/ajax/vocalu@umn.edu` and show success only when both the HTTP response and FormSubmit success flag confirm acceptance. Sender email is included as Reply-To. Failed submissions preserve the visitor's inputs.

FormSubmit may send an activation link to `vocalu@umn.edu` on first submission. Confirm that email to enable delivery. TypeScript, production build, and mocked submission checks do not prove inbox delivery or activation.
