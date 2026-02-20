import { memo, useState } from 'react';
import { motion } from 'motion/react';

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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('vocalu@umn.edu');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      className="w-full bg-[#2B4C6F] text-white py-6 md:py-12 px-4 md:px-12 shadow-sm border border-white/5"
      style={{ borderRadius: '16px', marginTop: '48px' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-[4fr_3fr_3fr] gap-4 md:gap-12 mb-12 text-left">
          <div className="flex flex-col items-start pr-2 md:pr-4">
            <img
              src={footerLogo}
              alt="Vocal U"
              className="h-8 md:h-16 w-auto mb-3 md:mb-4"
              loading="lazy"
            />
            <p className="text-white/70 text-[8px] md:text-sm leading-relaxed max-w-sm">
              Gender-inclusive a cappella at the University of Minnesota, established in 2011.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="mb-2 md:mb-4" style={{ ...fontYearbook, fontSize: 'clamp(10px, 2vw, 18px)' }}>
              RESOURCES
            </h3>
            <ul className="space-y-1 md:space-y-2" style={{ ...fontInter, fontSize: 'clamp(8px, 1.5vw, 14px)' }}>
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-[#8FA8C8] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.to || ''} className="text-white/70 hover:text-[#8FA8C8] transition-colors duration-300">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start overflow-hidden">
            <h3 className="mb-2 md:mb-4" style={{ ...fontYearbook, fontSize: 'clamp(10px, 2vw, 18px)' }}>
              CONNECT
            </h3>
            <div className="mb-2 md:mb-4 w-full relative">
              <button
                onClick={handleCopy}
                className="text-white/70 hover:text-white/90 transition-colors truncate block w-full text-left cursor-pointer group relative"
                style={{ ...fontInter, fontSize: 'clamp(8px, 1.5vw, 14px)' }}
              >
                vocalu@umn.edu
                <span
                  className={`absolute -top-8 left-0 bg-white text-[#2B4C6F] text-[10px] px-2 py-1 rounded transition-opacity pointer-events-none font-bold ${copied ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  COPIED!
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {socialIcons.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/10 p-1.5 md:p-2.5 rounded-full hover:bg-[#8FA8C8]/20 hover:text-[#8FA8C8] transition-all duration-200 cursor-pointer flex items-center justify-center aspect-square"
                  aria-label={s.label}
                >
                  <s.Icon className="w-2.5 h-2.5 md:w-4.5 md:h-4.5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>


        <div className="pt-6 md:pt-8 border-t border-white/10">
          <p className="text-white/50 text-[10px] md:text-sm text-center" style={fontInter}>
            &copy; {new Date().getFullYear()} Vocal U A Cappella. This group is a Registered Student Organization and is independent of the University of Minnesota.
          </p>
        </div>
      </div>
    </footer>
  );
});
