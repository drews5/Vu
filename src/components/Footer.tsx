import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import footerLogo from 'figma:asset/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };

const TikTokIcon = memo(function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
});

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/donate', label: 'Donate' },
  { to: '/members', label: 'Members' },
  { to: '/contact', label: 'Contact' },
];

const resourceLinks = [
  { to: '/auditions', label: 'Auditions', external: false },
  { to: '/media', label: 'Media', external: false },
  { href: 'https://gopherlink.umn.edu/organization/vocalu', label: 'GopherLink', external: true },
  { href: '#', label: 'Showcase', external: true },
];

const socialIcons = [
  { href: 'https://www.instagram.com/vocal_u', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.facebook.com/vocaluacappella/', label: 'Facebook', Icon: Facebook },
  { href: 'https://www.youtube.com/@vocal-u', label: 'YouTube', Icon: Youtube },
  { href: 'https://www.tiktok.com/@vocalumn', label: 'TikTok', Icon: TikTokIcon },
];

export const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[#2B4C6F] text-white py-6 md:py-12 px-4 md:px-12 shadow-sm border border-white/5 mb-8"
      style={{ borderRadius: '16px', marginTop: '25px' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* 3-Column Layout: Logo/Desc, Resources, Connect */}
        <div className="grid grid-cols-3 gap-4 md:gap-12 mb-8 text-left">
          {/* Column 1: Logo and Description */}
          <div className="flex flex-col items-start">
            <img
              src={footerLogo}
              alt="Vocal U"
              className="h-8 md:h-16 w-auto mb-3 md:mb-4"
              loading="lazy"
            />
            <p className="text-white/70 text-[9px] md:text-sm leading-relaxed">
              Gender-inclusive a cappella at the University of Minnesota, established in 2011.
            </p>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col items-start">
            <h3 className="mb-2 md:mb-4 font-bold" style={{ ...fontYearbook, fontSize: 'clamp(12px, 2vw, 18px)' }}>
              RESOURCES
            </h3>
            <ul className="space-y-1 md:space-y-2" style={{ ...fontInter, fontSize: 'clamp(10px, 1.5vw, 14px)' }}>
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.to!} className="text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="flex flex-col items-start overflow-hidden">
            <h3 className="mb-2 md:mb-4 font-bold" style={{ ...fontYearbook, fontSize: 'clamp(12px, 2vw, 18px)' }}>
              CONNECT
            </h3>
            <div className="mb-2 md:mb-4 w-full">
              <a
                href="mailto:vocalu@umn.edu"
                className="text-white/70 hover:text-white transition-colors truncate block w-full"
                style={{ ...fontInter, fontSize: 'clamp(10px, 1.5vw, 14px)' }}
              >
                vocalu@umn.edu
              </a>
            </div>
            <div className="flex gap-2 md:gap-3 flex-wrap">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 p-1 md:p-2.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label={s.label}
                >
                  <s.Icon className="w-3 h-3 md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-white/10">
          <p className="text-white/50 text-[10px] md:text-sm text-center" style={fontInter}>
            &copy; {currentYear} Vocal U A Cappella. This group is a Registered Student Organization and is independent of the University of Minnesota.
          </p>
        </div>
      </div>
    </footer>
  );
});
