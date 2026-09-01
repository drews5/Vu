import { memo, useCallback, useEffect, useState } from 'react';
import { ArrowRight, Facebook, Instagram, Menu, X, Youtube } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../assets/d4630c01b543cc75980f0b293230859d29654fbb.png';
import { fontYearbook } from '../styles/fonts';

const TikTokIcon = memo(function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
});

const navItems = [
  { name: 'Home', path: '/' },
  {
    name: 'About',
    path: '/about',
    dropdown: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Members', path: '/members' },
      { name: 'Media', path: '/media' },
      { name: 'Donate', path: '/donate' },
      { name: 'Auditions', path: '/auditions' },
    ],
  },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' },
];

const socialLinks = [
  { href: 'https://www.instagram.com/vocal_u', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.facebook.com/vocaluacappella/', label: 'Facebook', Icon: Facebook },
  { href: 'https://www.tiktok.com/@vocalumn', label: 'TikTok', Icon: TikTokIcon },
  { href: 'https://www.youtube.com/@vocal-u', label: 'YouTube', Icon: Youtube },
];

const SocialIcon = memo(function SocialIcon({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      className="group flex size-8 shrink-0 aspect-square items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors duration-200 hover:bg-[#2B4C6F] lg:size-9"
      aria-label={label}
    >
      <Icon className="size-3.5 text-[#8FA8C8] transition-colors duration-200 group-hover:text-white lg:size-4" />
    </motion.a>
  );
});

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 24);

  useEffect(() => {
    let lastScrolledState = window.scrollY > 24;

    const syncScrolledState = () => {
      const next = lastScrolledState ? window.scrollY > 8 : window.scrollY > 24;
      if (next === lastScrolledState) return;
      lastScrolledState = next;
      setIsScrolled(next);
    };

    setIsScrolled(lastScrolledState);
    window.addEventListener('scroll', syncScrolledState, { passive: true });
    return () => window.removeEventListener('scroll', syncScrolledState);
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!aboutDropdownOpen && !mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAboutDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [aboutDropdownOpen, mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
  }, []);

  const isAboutActive =
    location.pathname.includes('/about') ||
    location.pathname === '/members' ||
    location.pathname === '/media' ||
    location.pathname === '/donate' ||
    location.pathname === '/auditions';
  const isSolid = isScrolled || location.pathname !== '/';
  const currentPage = navItems.find((item) => location.pathname === item.path)?.name || (isAboutActive ? 'About' : 'Menu');

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[50] hidden justify-center pt-4 md:flex">
        <div className="vu-frame relative">
          <header
            className={`pointer-events-auto relative z-20 w-full rounded-[20px] border px-6 py-3 transition-[background-color,border-color] duration-200 lg:px-8 ${
              isSolid
                ? 'border-white/45 bg-[#8FA8C8]/95 shadow-[0_6px_18px_rgba(43,76,111,0.1)]'
                : 'border-transparent bg-transparent shadow-none'
            }`}
          >
            <div className="grid w-full items-center gap-4 md:grid-cols-[9.5rem_minmax(0,1fr)_9.5rem] lg:grid-cols-[10.5rem_minmax(0,1fr)_10.5rem]">
              <div className="flex min-w-0 items-center justify-start">
                <Link to="/" className="flex shrink-0 items-center" aria-label="Vocal U home">
                  <img src={logoImage} alt="Vocal U" className="h-10 w-auto transition-transform duration-200 hover:scale-[1.03] lg:h-12" />
                </Link>
              </div>

              <nav className="flex items-center justify-center" aria-label="Primary navigation">
                {navItems.map((item, index) => {
                  const active = location.pathname === item.path || Boolean(item.dropdown && isAboutActive);
                  return (
                    <div key={item.path} className="flex items-center">
                      <div className="relative flex flex-col items-center px-3 py-2 lg:px-4 xl:px-5">
                        {item.dropdown ? (
                          <div
                            className="relative flex items-center"
                            onMouseEnter={() => setAboutDropdownOpen(true)}
                            onMouseLeave={() => setAboutDropdownOpen(false)}
                          >
                            <button
                              type="button"
                              onClick={() => setAboutDropdownOpen((open) => !open)}
                              onFocus={() => setAboutDropdownOpen(true)}
                              className={`whitespace-nowrap py-2 transition-colors duration-150 ${active ? 'text-white' : 'text-white/80 hover:text-white'}`}
                              style={{ ...fontYearbook, fontSize: 'clamp(17px, 1.8vw, 22px)', letterSpacing: '0.05em' }}
                              aria-expanded={aboutDropdownOpen}
                              aria-haspopup="menu"
                            >
                              {item.name}
                            </button>
                            <AnimatePresence>
                              {aboutDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 4 }}
                                  transition={{ duration: 0.15 }}
                                  className="pointer-events-auto absolute left-1/2 top-full z-30 -translate-x-1/2 pt-2"
                                >
                                  <div className="min-w-[220px] rounded-[14px] border border-[#8FA8C8]/20 bg-white py-2.5 shadow-[0_10px_24px_-16px_rgba(43,76,111,0.26)]" role="menu">
                                    {item.dropdown.map((dropItem) => (
                                      <Link
                                        key={dropItem.path}
                                        to={dropItem.path}
                                        role="menuitem"
                                        className={`mx-1.5 block rounded-[10px] px-6 py-2.5 transition-colors duration-150 ${
                                          location.pathname === dropItem.path
                                            ? 'bg-[#8FA8C8]/15 text-[#2B4C6F]'
                                            : 'text-[#2B4C6F] hover:bg-[#8FA8C8]/10'
                                        }`}
                                        style={{ ...fontYearbook, fontSize: '18px' }}
                                      >
                                        {dropItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            to={item.path}
                            className={`block whitespace-nowrap py-2 transition-colors duration-150 ${active ? 'text-white' : 'text-white/80 hover:text-white'}`}
                            style={{ ...fontYearbook, fontSize: 'clamp(17px, 1.8vw, 22px)', letterSpacing: '0.05em' }}
                            aria-current={active ? 'page' : undefined}
                          >
                            {item.name}
                          </Link>
                        )}
                        {active && <span className="absolute bottom-[5px] inset-x-3 h-[2.5px] rounded-full bg-white" />}
                      </div>
                      {index < navItems.length - 1 && <div className="mx-1 h-5 w-px bg-white/35 lg:mx-1.5" />}
                    </div>
                  );
                })}
              </nav>

              <div className="flex min-w-0 items-center justify-end gap-1.5 lg:gap-2">
                {socialLinks.map((social) => (
                  <SocialIcon key={social.label} href={social.href} label={social.label} Icon={social.Icon} />
                ))}
              </div>
            </div>
          </header>

          {isSolid && (
            <Link
              to="/auditions"
              className="group pointer-events-auto absolute left-[50px] right-[50px] top-[calc(100%-8px)] z-10 flex h-11 items-center justify-center gap-2 rounded-b-[20px] border border-t-0 border-white/70 bg-white/95 px-4 pt-2 text-[#2B4C6F] shadow-[0_4px_12px_rgba(43,76,111,0.05)] transition-colors duration-200 hover:bg-[#2B4C6F] hover:text-white"
              style={{ ...fontYearbook, letterSpacing: '0.05em' }}
            >
              <span className="text-[14px]">AUDITION SIGN UP</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[60] flex justify-center px-4 md:hidden">
        <div className="pointer-events-none relative w-full max-w-[420px]">
          {!mobileMenuOpen && (
            <Link
              to="/auditions"
              className="group pointer-events-auto absolute inset-x-0 bottom-[calc(100%-6px)] flex h-11 items-center justify-center gap-2 rounded-t-[18px] border border-b-0 border-white/70 bg-white/95 px-3 pb-1.5 text-[#2B4C6F] shadow-[0_-4px_12px_rgba(43,76,111,0.05)] transition-colors duration-200 hover:bg-[#2B4C6F] hover:text-white"
              style={{ ...fontYearbook, letterSpacing: '0.05em' }}
            >
              <span className="text-[14px]">AUDITION SIGN UP</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}

          <div className="pointer-events-auto overflow-hidden rounded-[18px] border border-white/45 bg-[#8FA8C8] px-5 py-[6px] shadow-[0_6px_18px_rgba(43,76,111,0.1)]">
            <div className={`flex items-center justify-between ${mobileMenuOpen ? 'gap-4 border-b border-white/20 pb-4' : 'gap-3'}`}>
              <Link to="/" className="flex shrink-0 items-center" onClick={closeMobileMenu} aria-label="Vocal U home">
                <img src={logoImage} alt="Vocal U" className="h-8 w-auto" loading="lazy" />
              </Link>
              {!mobileMenuOpen && (
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate px-2 text-center text-[22px] text-white/95"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{ ...fontYearbook, letterSpacing: '0.05em' }}
                  aria-label="Open navigation menu"
                >
                  {currentPage}
                </button>
              )}
              <button
                type="button"
                className="shrink-0 rounded-[12px] bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="overflow-hidden px-4"
                >
                  <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile navigation">
                    {navItems.map((item) =>
                      item.dropdown ? (
                        <div key={item.path} className="overflow-hidden rounded-2xl bg-white/5">
                          <button
                            type="button"
                            onClick={() => setAboutDropdownOpen((open) => !open)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left text-white/95 transition-colors hover:bg-white/5"
                            style={{ ...fontYearbook, fontSize: '22px', letterSpacing: '0.05em' }}
                            aria-expanded={aboutDropdownOpen}
                          >
                            {item.name}
                            <span className={`text-base transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`}>⌄</span>
                          </button>
                          <AnimatePresence initial={false}>
                            {aboutDropdownOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden bg-black/10"
                              >
                                {item.dropdown.map((dropItem) => (
                                  <Link
                                    key={dropItem.path}
                                    to={dropItem.path}
                                    onClick={closeMobileMenu}
                                    className="block px-6 py-2.5 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                                    style={{ ...fontYearbook, fontSize: '16px' }}
                                  >
                                    {dropItem.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={closeMobileMenu}
                          className={`block rounded-2xl px-4 py-3 transition-colors ${
                            location.pathname === item.path ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
                          }`}
                          style={{ ...fontYearbook, fontSize: '22px', letterSpacing: '0.05em' }}
                          aria-current={location.pathname === item.path ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ),
                    )}
                    <div className="mt-2 flex items-center justify-center gap-4 px-4 py-5">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex size-10 shrink-0 aspect-square items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                          aria-label={social.label}
                        >
                          <social.Icon className="h-5 w-5 text-white" />
                        </a>
                      ))}
                    </div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
