const showcaseSlug = 'spring-showcase-2026';
const showcasePath = '/events/showcase';
const showcaseTitle = 'Vocal U Spring Showcase';

export function getEventPath(slug: string) {
  if (slug === showcaseSlug) {
    return showcasePath;
  }

  return `/event/${slug}`;
}

export function isShowcaseSlug(slug: string) {
  return slug === showcaseSlug;
}

export function getEventDisplayTitle(slug: string, title: string) {
  if (slug === showcaseSlug) {
    return showcaseTitle;
  }

  return title;
}

export const springShowcaseSlug = showcaseSlug;
export const springShowcasePath = showcasePath;
export const springShowcaseTitle = showcaseTitle;
