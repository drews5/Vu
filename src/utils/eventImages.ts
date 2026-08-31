import ichsaPhoto from '../assets/ichsa-quarterfinal.webp';
import showcasePhoto from '../assets/spring-showcase.jpg';
import icca2026Photo from '../assets/icca-2026.webp';
import icca2025Photo from '../assets/icca-2025.webp';
import winterShowcasePhoto from '../assets/winter-showcase.webp';
import nightSongsPhoto from '../assets/night-songs.webp';
import groupPhoto from '../assets/group-photo.webp';

const eventImageBySlug: Record<string, string> = {
  'ichsa-quarterfinal-4-2026': ichsaPhoto,
  'spring-showcase-2026': showcasePhoto,
  'icca-quarterfinal-2026': icca2026Photo,
  'icca-quarterfinal-2025': icca2025Photo,
  'winter-showcase-2025': winterShowcasePhoto,
  'night-songs': nightSongsPhoto,
  'minnesota-state-fair-2026': groupPhoto,
  'fall-auditions-2026': groupPhoto,
  'umn-homecoming-2026': groupPhoto,
};

export function getEventImage(slug: string, fallbackImage: string) {
  return eventImageBySlug[slug] || fallbackImage;
}
