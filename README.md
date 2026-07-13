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

## Content

Members, events, and audition slots come from Supabase. Local images in `src/assets` are used when an event or member has a matching optimized asset.

Static page metadata lives in each page's `Seo` component. The canonical production origin is `https://www.vocalu.org`.
