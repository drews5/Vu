import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const siteUrl = 'https://www.vocalu.org';
const buildDir = resolve('build');
const baseHtml = await readFile(resolve(buildDir, 'index.html'), 'utf8');
const memberGroups = JSON.parse(await readFile(resolve('src/data/memberGroups.json'), 'utf8'));
const memberDetails = JSON.parse(await readFile(resolve('src/data/memberDetails.json'), 'utf8'));
const siteContent = JSON.parse(await readFile(resolve('src/data/siteContent.json'), 'utf8'));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function link(path, label) {
  return `<a href="${escapeHtml(path)}">${escapeHtml(label)}</a>`;
}

const faqHtml = `<section><h2>FAQs</h2>${siteContent.faqs.map(({ question, answer, path, linkText, includeMembers }) =>
  `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p>${includeMembers ? `<dl>${memberGroups.map(({ part, members }) => `<dt>${escapeHtml(part)}</dt><dd>${escapeHtml(members.join(', '))}</dd>`).join('')}</dl>` : ''}<p>${link(path, linkText)}</p></details>`
).join('')}</section>`;
const bookingHtml = `<section id="booking"><h2>${escapeHtml(siteContent.booking.heading)}</h2><p>${escapeHtml(siteContent.booking.description)}</p><p>${escapeHtml(siteContent.booking.details)}</p><p>${link('mailto:vocalu@umn.edu?subject=Booking%20Vocal%20U', 'Email Us')}</p></section>`;

const pages = [
  {
    path: '/',
    title: 'Vocal U A Cappella | University of Minnesota A Cappella Group',
    description: 'Vocal U is a gender-inclusive a cappella group at the University of Minnesota performing throughout Minneapolis and the Twin Cities.',
    heading: 'Vocal U A Cappella',
    content: `<h2>We Are Vocal U</h2><p>Vocal U is a gender-inclusive a cappella group at the University of Minnesota, established in 2011. We are a registered student organization dedicated to spreading our music across the Twin Cities and beyond, and having a great time while doing it.</p>
      <p>We come from all different majors and backgrounds, but we're all a part of VU because we love music and the arts. More than an a cappella group, Vocal U is a family. We support and push each other to be the best performers we can be, which translates to the stage.</p>
      ${faqHtml}<h2>Get in Touch</h2><p>Reach out about booking and audition information, collaborations, or general inquiries.</p><p>${link('mailto:vocalu@umn.edu', 'vocalu@umn.edu')}</p>`,
  },
  {
    path: '/about',
    title: 'About Vocal U | Vocal U A Cappella',
    description: 'Learn about Vocal U, the University of Minnesota gender-inclusive a cappella group, including our mission, repertoire, and Twin Cities performances.',
    heading: 'About Vocal U',
    content: `<h2>Our Mission</h2><p>Founded in 2011, Vocal U A Cappella is dedicated to fostering musical growth within our group while sharing our passion for the arts with the community.</p>
      <p>We embrace our diversity of voices and backgrounds to perform at charity events that resonate with our members, seek to build the University community at U of M events, and spread our harmonies in the surrounding communities, especially the University District and greater Twin Cities area. Our mission is to share the universal language of music through the unique form of a cappella, reaching as many people as we can.</p>
      <blockquote>A cappella is a way to unify a huge world of culture with the human voice. By arranging, practicing and performing, we are able to pay unique homage to some of today's greatest hits and yesterday's greatest memories.</blockquote>`,
  },
  {
    path: '/members',
    title: 'Vocal U Members | Vocal U A Cappella',
    description: 'Meet the current singers of Vocal U, the University of Minnesota gender-inclusive a cappella group.',
    heading: 'Our members',
    content: memberGroups.map(({ part, members }) =>
      `<section><h2>${escapeHtml(part)}</h2><ul>${members.map((name) => {
        const details = memberDetails[name];
        return `<li><h3>${escapeHtml(name)}</h3>${details ? `${details.officer ? `<p>${escapeHtml(details.officer)}</p>` : ''}<p>${escapeHtml(details.major)}</p><p>${escapeHtml(details.year)}</p>` : ''}</li>`;
      }).join('')}</ul></section>`
    ).join('\n'),
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Vocal U Members',
      itemListElement: memberGroups.flatMap(({ part, members }) => members.map((name) => ({ name, part })))
        .map(({ name, part }, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@type': 'Person', name, jobTitle: memberDetails[name]?.officer || part },
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
    content: `<p>Reach out about booking and audition information, collaborations, or general inquiries.</p>
      <h2>Contact Information</h2><p>${link('mailto:vocalu@umn.edu', 'vocalu@umn.edu')}</p><p>University of Minnesota<br>Minneapolis, MN</p>
      <h2>Follow Us</h2><p>${link('https://www.instagram.com/vocal_u', 'Instagram')} · ${link('https://www.facebook.com/vocaluacappella/', 'Facebook')} · ${link('https://www.youtube.com/@vocal-u', 'YouTube')} · ${link('https://www.tiktok.com/@vocalumn', 'TikTok')}</p>${bookingHtml}`,
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
