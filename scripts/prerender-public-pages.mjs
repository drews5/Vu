import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const siteUrl = 'https://www.vocalu.org';
const buildDir = resolve('build');
const baseHtml = await readFile(resolve(buildDir, 'index.html'), 'utf8');
const memberGroups = JSON.parse(await readFile(resolve('src/data/memberGroups.json'), 'utf8'));
const siteFaqs = JSON.parse(await readFile(resolve('src/data/siteFaqs.json'), 'utf8'));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function link(path, label) {
  return `<a href="${escapeHtml(path)}">${escapeHtml(label)}</a>`;
}

const pages = [
  {
    path: '/',
    title: 'Vocal U A Cappella | University of Minnesota A Cappella Group',
    description: 'Vocal U is a gender-inclusive a cappella group at the University of Minnesota performing throughout Minneapolis and the Twin Cities.',
    heading: 'Vocal U A Cappella',
    content: `<p>Vocal U is a gender-inclusive a cappella group at the University of Minnesota. We perform at campus events, charity events, showcases, competitions, and throughout the Twin Cities.</p>
      <p>Founded in 2011, our group shares a love of music and community through student-led a cappella performance.</p>
      <p>Explore our ${link('/about', 'mission and repertoire')}, ${link('/members', 'current members')}, ${link('/events', 'events')}, and ${link('/media', 'performances')}.</p>
      <section><h2>Questions we get</h2>${siteFaqs.map(({ question, answer, path, linkText }) =>
        `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p><p>${link(path, linkText)}</p></details>`
      ).join('')}</section>`,
  },
  {
    path: '/about',
    title: 'About Vocal U | Vocal U A Cappella',
    description: 'Learn about Vocal U, the University of Minnesota gender-inclusive a cappella group, including our mission, repertoire, and Twin Cities performances.',
    heading: 'About Vocal U',
    content: `<h2>Our mission</h2><p>Founded in 2011, Vocal U A Cappella fosters musical growth within our group while sharing our passion for the arts with the community. We perform at charity events, University of Minnesota events, and in the greater Twin Cities area.</p>
      <p>Our repertoire spans contemporary pop, soul, and other student-arranged music. Visit the ${link('/about', 'full about page')} for the current repertoire.</p>`,
  },
  {
    path: '/members',
    title: 'Vocal U Members | Vocal U A Cappella',
    description: 'Meet the current singers of Vocal U, the University of Minnesota gender-inclusive a cappella group.',
    heading: 'Our members',
    content: memberGroups.map(({ part, members }) =>
      `<section><h2>${escapeHtml(part)}</h2><ul>${members.map((name) => `<li>${escapeHtml(name)}</li>`).join('')}</ul></section>`
    ).join('\n'),
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Vocal U Members',
      itemListElement: memberGroups.flatMap(({ part, members }) => members.map((name) => ({ name, part })))
        .map(({ name, part }, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@type': 'Person', name, jobTitle: part },
        })),
    },
  },
  {
    path: '/media',
    title: 'Vocal U Media | Vocal U A Cappella',
    description: 'Watch Vocal U performances on YouTube and browse recent Instagram posts from the University of Minnesota gender-inclusive a cappella group.',
    heading: 'Vocal U media',
    content: `<p>Watch Vocal U performances and follow recent updates from the group.</p><p>${link('https://www.youtube.com/@vocal-u', 'Vocal U on YouTube')} · ${link('https://www.instagram.com/vocal_u', 'Vocal U on Instagram')}</p>`,
  },
  {
    path: '/events',
    title: 'Vocal U Events | Vocal U A Cappella',
    description: 'See upcoming Vocal U performances, showcases, competitions, and past events from the University of Minnesota a cappella group.',
    heading: 'Vocal U events',
    content: `<p>Vocal U performs at campus and community events, showcases, and competitions. Visit the interactive ${link('/events', 'events page')} for the latest event dates and details, or ${link('/contact', 'contact us')} about a booking.</p>`,
  },
  {
    path: '/contact',
    title: 'Contact Vocal U | Vocal U A Cappella',
    description: 'Contact Vocal U for bookings, collaboration requests, general questions, or audition information through email, social media, or the site contact form.',
    heading: 'Contact Vocal U',
    content: `<p>For bookings, collaborations, auditions, and general questions, email ${link('mailto:vocalu@umn.edu', 'vocalu@umn.edu')} or use the contact form on this page.</p>
      <section><h2>Book Vocal U</h2><p>Campus show, fundraiser, neighborhood get-together—if live a cappella sounds right, we'd love to hear about it. Email us the date, the place, and roughly how long you'd like us to sing. We'll talk through what works.</p>
      <p>${link('mailto:vocalu@umn.edu?subject=Vocal%20U%20Booking%20Inquiry', 'Tell us about your event')}</p></section>`,
  },
  {
    path: '/donate',
    title: 'Support Vocal U | Vocal U A Cappella',
    description: 'Support Vocal U with a secure donation to help cover travel, showcase costs, and competition fees for the University of Minnesota a cappella group.',
    heading: 'Support Vocal U',
    content: `<p>Vocal U is a self-funded student organization. Donations help cover travel, event costs, and competition fees.</p><p>${link('https://givebutter.com/vu', 'Donate through Givebutter')} or ${link('https://venmo.com/u/vocalu', 'support us on Venmo')}.</p>`,
  },
  {
    path: '/auditions',
    title: 'Thank You for Auditioning | Vocal U',
    description: 'Thank you for auditioning for Vocal U. Results will be emailed to you shortly. Auditions for 2027 will open in August.',
    heading: 'Auditions',
    content: `<p>Thank you for auditioning for Vocal U. Results will be emailed to you shortly. Auditions for 2027 will open in August.</p><p>${link('/contact', 'Contact Vocal U')} with questions.</p>`,
  },
];

const navigation = pages.map(({ path, heading }) => link(path, heading)).join(' · ');

for (const page of pages) {
  const canonical = new URL(page.path, siteUrl).toString();
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const fallback = `<div id="root"><div style="max-width:960px;margin:0 auto;padding:2rem;font:18px/1.6 system-ui,sans-serif;color:#2B4C6F"><header><nav aria-label="Site pages">${navigation}</nav></header><main><h1>${escapeHtml(page.heading)}</h1>${page.content}</main><footer><p>Vocal U A Cappella · University of Minnesota · ${link('mailto:vocalu@umn.edu', 'vocalu@umn.edu')}</p></footer></div></div>`;
  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="twitter:title" content="[^"]*" \/>/, `<meta property="twitter:title" content="${title}" />`)
    .replace(/<meta property="twitter:description" content="[^"]*" \/>/, `<meta property="twitter:description" content="${description}" />`)
    .replace(/<meta property="twitter:url" content="[^"]*" \/>/, `<meta property="twitter:url" content="${canonical}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace('<div id="root"></div>', fallback);
  if (!html.includes(fallback)) throw new Error(`Could not add initial content for ${page.path}`);
  if (page.schema) {
    const schema = JSON.stringify(page.schema).replace(/</g, '\\u003c');
    html = html.replace('</head>', `<script type="application/ld+json">${schema}</script>\n</head>`);
  }
  const output = page.path === '/' ? resolve(buildDir, 'index.html') : resolve(buildDir, page.path.slice(1), 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html, 'utf8');
}

console.log(`Prepared ${pages.length} public pages with crawlable HTML.`);
