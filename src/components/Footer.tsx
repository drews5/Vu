import { memo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import footerLogo from '../assets/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';
import { fontYearbook } from '../styles/fonts';

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
  { to: '/events/showcase', label: 'Showcase', external: false },
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
    <footer className="bg-[#2B4C6F] text-white py-5 md:py-12 px-6 md:px-12 border border-white/5 mx-3 md:mx-0" style={{ borderRadius: '16px', marginTop: '48px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[4fr_3fr_3fr] gap-4 md:gap-12 mb-6 md:mb-12 text-left">
          <div className="flex flex-col items-start pr-2 md:pr-4">
            <img src={footerLogo} alt="Vocal U" className="h-8 md:h-16 w-auto mb-2 md:mb-4" loading="lazy" />
            <p className="text-white/70 text-[10px] md:text-sm leading-relaxed max-w-sm">
              Gender-inclusive a cappella at the University of Minnesota, established in 2011.
            </p>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="mb-1 md:mb-4" style={{ ...fontYearbook, fontSize: 'clamp(14px, 2vw, 18px)' }}>
              RESOURCES
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-1 md:space-y-2 w-full" style={{ ...fontInter, fontSize: 'clamp(13px, 1.5vw, 14px)' }}>
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#8FA8C8] transition-colors duration-300">
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
            <h3 className="mb-1 md:mb-4" style={{ ...fontYearbook, fontSize: 'clamp(14px, 2vw, 18px)' }}>
              CONNECT
            </h3>
            <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 w-full">
              <div className="mb-1 md:mb-4 relative shrink-0">
                <button onClick={handleCopy} className="text-white/70 hover:text-white/90 transition-colors truncate block w-full text-left cursor-pointer group relative" style={{ ...fontInter, fontSize: 'clamp(13px, 1.5vw, 14px)' }}>
                  vocalu@umn.edu
                  <span className={`absolute -top-8 left-0 bg-white text-[#2B4C6F] text-[10px] px-2 py-1 rounded transition-opacity pointer-events-none font-bold ${copied ? 'opacity-100' : 'opacity-0'}`}>
                    COPIED!
                  </span>
                </button>
              </div>
              <div className="flex gap-2">
                {socialIcons.map((s) => (
                  <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex size-10 shrink-0 aspect-square items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-[#8FA8C8]/20 hover:text-[#8FA8C8] cursor-pointer md:size-11" aria-label={s.label}>
                    <s.Icon className="size-4 md:size-[18px]" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 md:pt-8 border-t border-white/10">
          <p className="text-white/50 text-[10px] md:text-sm text-center" style={fontInter}>
            &copy; {new Date().getFullYear()} Vocal U A Cappella. This group is a Registered Student Organization and is independent of the University of Minnesota.
          </p>
        </div>
      </div>
    </footer>
  );
});
