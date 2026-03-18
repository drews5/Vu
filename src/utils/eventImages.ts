import ichsaPhoto from '../assets/ichsa-quarterfinal.jpg';
import showcasePhoto from '../assets/spring-showcase.jpg';
import icca2026Photo from '../assets/icca-2026.jpg';
import icca2025Photo from '../assets/icca-2025.jpg';
import winterShowcasePhoto from '../assets/winter-showcase.jpg';
import nightSongsPhoto from '../assets/night-songs.jpg';

const eventImageBySlug: Record<string, string> = {
  'ichsa-quarterfinal-4-2026': ichsaPhoto,
  'spring-showcase-2026': showcasePhoto,
  'icca-quarterfinal-2026': icca2026Photo,
  'icca-quarterfinal-2025': icca2025Photo,
  'winter-showcase-2025': winterShowcasePhoto,
  'night-songs': nightSongsPhoto,
};

export function getEventImage(slug: string, fallbackImage: string) {
  return eventImageBySlug[slug] || fallbackImage;
}
