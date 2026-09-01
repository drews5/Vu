import 'dotenv/config';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const siteUrl = 'https://www.vocalu.org';
const buildDate = new Date().toISOString().split('T')[0];
const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml');

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0', lastmod: buildDate },
  { path: '/about', changefreq: 'monthly', priority: '0.8', lastmod: buildDate },
  { path: '/auditions', changefreq: 'weekly', priority: '0.9', lastmod: buildDate },
  { path: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: buildDate },
  { path: '/donate', changefreq: 'monthly', priority: '0.7', lastmod: buildDate },
  { path: '/events', changefreq: 'weekly', priority: '0.9', lastmod: buildDate },
  { path: '/media', changefreq: 'weekly', priority: '0.8', lastmod: buildDate },
  { path: '/members', changefreq: 'monthly', priority: '0.8', lastmod: buildDate },
];

const fallbackEventRoutes = [
  { path: '/event/icca-quarterfinal-2025', lastmod: '2025-03-01' },
  { path: '/event/icca-quarterfinal-2026', lastmod: '2026-02-14' },
  { path: '/event/ichsa-quarterfinal-4-2026', lastmod: '2026-02-21' },
  { path: '/event/minnesota-state-fair-2026', lastmod: '2026-09-05' },
  { path: '/event/night-songs', lastmod: '2026-02-15' },
  { path: '/event/the-mix-2026', lastmod: '2026-05-15' },
  { path: '/event/umn-homecoming-2026', lastmod: '2026-10-19' },
  { path: '/event/winter-showcase-2025', lastmod: '2025-12-06' },
  { path: '/events/showcase', lastmod: '2026-05-02' },
].map((route) => ({ ...route, changefreq: 'weekly', priority: '0.8' }));

function getEventPath(slug) {
  if (slug === 'spring-showcase-2026') {
    return '/events/showcase';
  }

  if (slug === 'fall-auditions-2026') {
    return '/auditions';
  }

  return `/event/${slug}`;
}

function formatDate(dateValue) {
  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? buildDate : parsedDate.toISOString().split('T')[0];
}

async function fetchEventRoutes() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.warn('Using known event routes because Supabase env vars are missing.');
    return fallbackEventRoutes;
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/events?select=slug,date&slug=not.is.null&order=date.asc`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        signal: AbortSignal.timeout(8_000),
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}`);
    }

    const events = await response.json();

    return events
      .filter((event) => typeof event.slug === 'string' && event.slug.trim().length > 0)
      .map((event) => ({
        path: getEventPath(event.slug),
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: formatDate(event.date),
      }));
  } catch (error) {
    console.warn(`Using known event routes because live fetch failed: ${String(error)}`);
    return fallbackEventRoutes;
  }
}

function buildUrlEntry(route) {
  return [
    '  <url>',
    `    <loc>${new URL(route.path, siteUrl).toString()}</loc>`,
    `    <lastmod>${route.lastmod}</lastmod>`,
    `    <changefreq>${route.changefreq}</changefreq>`,
    `    <priority>${route.priority}</priority>`,
    '  </url>',
  ].join('\n');
}

async function main() {
  const dynamicRoutes = await fetchEventRoutes();
  const routes = Array.from(
    new Map([...staticRoutes, ...dynamicRoutes].map((route) => [route.path, route])).values()
  ).sort((a, b) => a.path.localeCompare(b.path));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map(buildUrlEntry),
    '</urlset>',
    '',
  ].join('\n');

  await writeFile(outputPath, xml, 'utf8');
  console.log(`Generated sitemap with ${routes.length} URLs.`);
}

main().catch((error) => {
  console.error('Failed to generate sitemap:', error);
  process.exit(1);
});
