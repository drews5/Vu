import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Youtube, Facebook } from 'lucide-react';
import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from 'figma:asset/d4630c01b543cc75980f0b293230859d29654fbb.png';

const TikTokIcon = memo(function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
});

const navItems = [
  { name: 'HOME', path: '/' },
  {
    name: 'ABOUT',
    path: '/about',
    dropdown: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Members', path: '/members' },
      { name: 'Media', path: '/media' },
      { name: 'Donate', path: '/donate' },
      { name: 'Auditions', path: '/auditions' },
    ],
  },
  { name: 'EVENTS', path: '/events' },
  { name: 'CONTACT', path: '/contact' },
];

const socialLinks = [
  { href: 'https://www.instagram.com/vocal_u', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.facebook.com/vocaluacappella/', label: 'Facebook', Icon: Facebook },
  { href: 'https://www.tiktok.com/@vocalumn', label: 'TikTok', Icon: TikTokIcon },
  { href: 'https://www.youtube.com/@vocal-u', label: 'YouTube', Icon: Youtube },
];

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };

const SocialIcon = memo(function SocialIcon({
  href,
  label,
  Icon,
  size = 5,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  size?: number;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-full p-2 hover:bg-white/90 transition-colors hover:scale-110 active:scale-95"
      aria-label={label}
    >
      <Icon className={`w-${size} h-${size} text-[#8FA8C8]`} />
    </a>
  );
});

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

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

  return (
    <header
      className="bg-[#8FA8C8] mx-3 md:mx-[50px] mt-[25px] px-4 md:px-8 py-4 border border-[#8FA8C8] shadow-sm relative z-50"
      style={{ borderRadius: '16px' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between relative">
          <Link to="/" className="flex items-center">
            <img
              src={logoImage}
              alt="Vocal U"
              className="h-16 w-auto hover:scale-105 transition-transform duration-200"
            />
          </Link>

          <nav className="flex items-center absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item, index) => (
              <div key={item.path} className="flex items-center">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                  >
                    <div
                      className={`px-4 py-2 cursor-default transition-all duration-200 ${
                        isAboutActive ? 'text-white' : 'text-white/90 hover:text-white'
                      }`}
                      style={{ ...fontYearbook, fontSize: '22px', letterSpacing: '0.05em' }}
                    >
                      {item.name}
                    </div>

                    <AnimatePresence>
                      {aboutDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 bg-white shadow-lg py-2 min-w-[200px] z-50"
                          style={{ borderRadius: '12px' }}
                        >
                          {item.dropdown.map((dropItem) => (
                            <Link
                              key={dropItem.path}
                              to={dropItem.path}
                              className="block px-6 py-2 text-[#2B4C6F] hover:bg-[#8FA8C8]/10 transition-colors"
                              style={{ ...fontYearbook, fontSize: '18px' }}
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
                    to={item.path}
                    className={`px-4 py-2 transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-white'
                        : 'text-white/90 hover:text-white hover:scale-105'
                    }`}
                    style={{ ...fontYearbook, fontSize: '22px', letterSpacing: '0.05em' }}
                  >
                    {item.name}
                  </Link>
                )}
                {index < navItems.length - 1 && <div className="h-6 w-[1px] bg-white/30" />}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <SocialIcon key={s.label} href={s.href} label={s.label} Icon={s.Icon} />
            ))}
          </div>
        </div>

        {/* Tablet Layout (Medium Screens) */}
        <div className="hidden md:flex lg:hidden items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src={logoImage}
              alt="Vocal U"
              className="h-12 w-auto hover:scale-105 transition-transform duration-200"
            />
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item, index) => (
              <div key={item.path} className="flex items-center">
                <Link
                  to={item.path}
                  className={`px-2 py-1 transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                  }`}
                  style={{ ...fontYearbook, fontSize: '16px', letterSpacing: '0.05em' }}
                >
                  {item.name}
                </Link>
                {index < navItems.length - 1 && <div className="h-4 w-[1px] bg-white/30" />}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {socialLinks.map((s) => (
              <SocialIcon key={s.label} href={s.href} label={s.label} Icon={s.Icon} size={4} />
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="Vocal U" className="h-12 w-auto" loading="lazy" />
            </Link>

            <button
              className="text-white active:scale-90 transition-transform"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <nav className="mt-4 pt-4 border-t border-white/30">
                  {navItems.map((item) =>
                    item.dropdown ? (
                      <div key={item.path}>
                        <button
                          onClick={() => setAboutDropdownOpen((prev) => !prev)}
                          className="w-full text-left px-4 py-3 text-white/90"
                          style={{ ...fontYearbook, fontSize: '20px', letterSpacing: '0.05em' }}
                        >
                          {item.name}
                        </button>
                        <AnimatePresence>
                          {aboutDropdownOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-4 overflow-hidden"
                            >
                              {item.dropdown.map((dropItem) => (
                                <Link
                                  key={dropItem.path}
                                  to={dropItem.path}
                                  onClick={closeMobileMenu}
                                  className="block px-4 py-2 text-white/80"
                                  style={{ ...fontYearbook, fontSize: '18px' }}
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
                        className={`block px-4 py-3 transition-all duration-200 ${
                          location.pathname === item.path ? 'text-white' : 'text-white/90 hover:text-white'
                        }`}
                        style={{ ...fontYearbook, fontSize: '20px', letterSpacing: '0.05em' }}
                      >
                        {item.name}
                      </Link>
                    )
                  )}

                  <div className="flex items-center gap-3 px-4 py-4 mt-2">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-full p-2 active:scale-90 transition-transform"
                        aria-label={s.label}
                      >
                        <s.Icon className="w-4 h-4 text-[#8FA8C8]" />
                      </a>
                    ))}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
