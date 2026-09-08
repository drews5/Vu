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

Members, events, and audition slots come from Supabase. Local images in `src/assets` are used when an event or member has a matching optimized asset.

Static page metadata lives in each page's `Seo` component. The canonical production origin is `https://www.vocalu.org`.
