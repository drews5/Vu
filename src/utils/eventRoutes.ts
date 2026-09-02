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

export function getEventDisplayTime(slug: string, displayTime: string) {
  if (slug === 'minnesota-state-fair-2026') {
    return '10:00 AM';
  }

  if (slug === auditionsSlug) {
    return 'September 16 & 17, 6:00–9:00 PM';
  }

  return displayTime;
}

export function getEventDescription(slug: string, description: string) {
  if (slug === 'minnesota-state-fair-2026') {
    return 'Catch Vocal U live at 10:00 AM on the University of Minnesota Outdoor Stage at the Minnesota State Fair. The stage is on the south side of Dan Patch Avenue between Underwood and Cooper streets.';
  }

  if (slug === auditionsSlug) {
    return 'Come sing with Vocal U on September 16 or 17. Choose a live audition slot between 6:00 and 9:00 PM, prepare about 60 seconds of a contemporary song, and arrive 15 minutes early. Location details will be shared with singers.';
  }

  return description;
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
