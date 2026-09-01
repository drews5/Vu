const showcaseSlug = 'spring-showcase-2026';
const showcasePath = '/events/showcase';
const showcaseTitle = 'Vocal U Spring Showcase';
const auditionsSlug = 'fall-auditions-2026';

export interface EventDatePresentation {
  full: string;
  short: string;
  year: string;
}

export function getEventPath(slug: string) {
  if (slug === showcaseSlug) {
    return showcasePath;
  }

  if (slug === auditionsSlug) {
    return '/auditions';
  }

  return `/event/${slug}`;
}

export function isShowcaseSlug(slug: string) {
  return slug === showcaseSlug;
}

export function isEventScheduleConfirmed(slug: string) {
  return slug !== auditionsSlug && slug !== 'umn-homecoming-2026';
}

export function getEventDisplayTitle(slug: string, title: string) {
  if (slug === showcaseSlug) {
    return showcaseTitle;
  }

  return title;
}

export function getEventDatePresentation(slug: string, date: Date): EventDatePresentation {
  if (slug === auditionsSlug) {
    return { full: 'September 16–17, 2026', short: 'Sep 16–17', year: '2026' };
  }

  if (slug === 'umn-homecoming-2026') {
    return { full: 'October 19–24, 2026', short: 'Oct 19–24', year: '2026' };
  }

  return {
    full: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    year: date.getFullYear().toString(),
  };
}

export const springShowcaseSlug = showcaseSlug;
export const springShowcasePath = showcasePath;
export const springShowcaseTitle = showcaseTitle;
export const fallAuditionsSlug = auditionsSlug;
