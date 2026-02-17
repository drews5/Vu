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
  { href: 'https://instagram.com/vocaluminn', label: 'Instagram', Icon: Instagram },
  { href: 'https://facebook.com/vocaluminn', label: 'Facebook', Icon: Facebook },
  { href: 'https://youtube.com/@vocaluminn', label: 'YouTube', Icon: Youtube },
  { href: 'https://tiktok.com/@vocaluminn', label: 'TikTok', Icon: TikTokIcon },
];

export const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[#2B4C6F] text-white py-12 px-6 md:px-12 mx-3 md:mx-0"
      style={{ borderRadius: '20px', marginTop: '25px' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <img
              src={footerLogo}
              alt="Vocal U - University of Minnesota's Premier A Cappella Group"
              className="h-20 w-auto mb-4"
              loading="lazy"
            />
            <p className="text-white/70 text-sm leading-relaxed" style={fontInter}>
              Gender-inclusive a cappella group at the University of Minnesota-Twin Cities, established in 2011.
            </p>
          </div>

          <div>
            <h3 className="mb-4" style={{ ...fontYearbook, fontSize: '20px' }}>
              Quick Links
            </h3>
            <ul className="space-y-2" style={{ ...fontInter, fontSize: '15px' }}>
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4" style={{ ...fontYearbook, fontSize: '20px' }}>
              Resources
            </h3>
            <ul className="space-y-2" style={{ ...fontInter, fontSize: '15px' }}>
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

          <div>
            <h3 className="mb-4" style={{ ...fontYearbook, fontSize: '20px' }}>
              Connect
            </h3>
            <div className="mb-4">
              <a
                href="mailto:vocalu@umn.edu"
                className="text-white/70 hover:text-white transition-colors"
                style={{ ...fontInter, fontSize: '15px' }}
              >
                vocalu@umn.edu
              </a>
            </div>
            <div className="flex gap-3 mt-4">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                  aria-label={s.label}
                >
                  <s.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm text-center" style={fontInter}>
            &copy; {currentYear} Vocal U A Cappella. This group is a Registered Student Organization and is
            independent of the University of Minnesota.
          </p>
        </div>
      </div>
    </footer>
  );
});
