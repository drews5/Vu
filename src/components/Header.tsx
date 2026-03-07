import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Youtube, Facebook } from 'lucide-react';
import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from 'figma:asset/d4630c01b543cc75980f0b293230859d29654fbb.png';

const MOBILE_FLOATING_LANE = 96;
const MOBILE_FULL_WIDTH_LANE = 84;
const MOBILE_MENU_OPEN_LANE = 360;
const MOBILE_DOCK_HYSTERESIS = 72;

const TikTokIcon = memo(function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
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
    <motion.a href={href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="bg-white rounded-full p-1.5 lg:p-2 flex items-center justify-center transition-colors duration-200 hover:bg-[#8FA8C8] group shadow-sm cursor-pointer" aria-label={label}>
      <Icon className={`w-4 h-4 lg:w-${size} lg:h-${size} text-[#8FA8C8] group-hover:text-white transition-colors duration-200`} />
    </motion.a>
  );
});
export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledMore, setIsScrolledMore] = useState(false);
  const [mobileDockedTop, setMobileDockedTop] = useState(false);
  const mobileDockedTopRef = useRef(false);

  useEffect(() => {
    mobileDockedTopRef.current = mobileDockedTop;
  }, [mobileDockedTop]);

  useEffect(() => {
    let frameId = 0;

    const syncHeaderState = () => {
      const scrollY = window.scrollY;
      const nextIsScrolled = scrollY > 10;
      setIsScrolled(nextIsScrolled);
      setIsScrolledMore(scrollY > 600);

      if (window.innerWidth >= 768) {
        if (mobileDockedTopRef.current) {
          mobileDockedTopRef.current = false;
          setMobileDockedTop(false);
        }
        return;
      }

      const footerElement = document.querySelector('footer');
      if (!footerElement) {
        if (mobileDockedTopRef.current) {
          mobileDockedTopRef.current = false;
          setMobileDockedTop(false);
        }
        return;
      }

      const footerTop = footerElement.getBoundingClientRect().top;
      const floatingLaneHeight = mobileMenuOpen
        ? MOBILE_MENU_OPEN_LANE
        : nextIsScrolled
          ? MOBILE_FLOATING_LANE
          : MOBILE_FULL_WIDTH_LANE;
      const dockLine = window.innerHeight - floatingLaneHeight;
      const releaseLine = dockLine + MOBILE_DOCK_HYSTERESIS;
      const shouldDock = mobileDockedTopRef.current
        ? footerTop <= releaseLine
        : footerTop <= dockLine;

      if (shouldDock !== mobileDockedTopRef.current) {
        mobileDockedTopRef.current = shouldDock;
        setMobileDockedTop(shouldDock);
      }
    };

    const handleViewportChange = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncHeaderState);
    };

    handleViewportChange();
    window.addEventListener('scroll', handleViewportChange, { passive: true });
    window.addEventListener('resize', handleViewportChange);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [location.pathname, mobileMenuOpen]);

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
  const isMobileIslandFloating = isScrolled || mobileDockedTop;
  return (
    <>
      {/* Desktop Top Mask - Hides content scrolling above the island */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 right-0 z-[51] bg-white pointer-events-none"
        initial={{ height: 0 }}
        animate={{ height: isScrolledMore ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      <motion.div
        className="hidden md:flex fixed top-0 left-0 right-0 z-[50] justify-center pointer-events-none px-4 lg:px-[50px]"
        animate={{ paddingTop: isScrolled ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="relative w-full max-w-[1340px] mx-auto flex justify-center">
          {/* Inverted Corners to frame the island perfectly */}
          <AnimatePresence>
            {isScrolledMore && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 left-0 w-5 h-5 bg-white z-[52]"
                  style={{
                    maskImage: 'radial-gradient(circle at 100% 100%, transparent 20px, black 20px)',
                    WebkitMaskImage: 'radial-gradient(circle at 100% 100%, transparent 20px, black 20px)'
                  }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 right-0 w-5 h-5 bg-white z-[52]"
                  style={{
                    maskImage: 'radial-gradient(circle at 0% 100%, transparent 20px, black 20px)',
                    WebkitMaskImage: 'radial-gradient(circle at 0% 100%, transparent 20px, black 20px)'
                  }}
                />
              </>
            )}
          </AnimatePresence>

          <motion.header
            layout
            className={`pointer-events-auto transition-shadow duration-300 ${isScrolled ? 'w-auto inline-block px-5 lg:px-8 py-2 lg:py-2.5 rounded-[20px] shadow-lg' : 'w-full px-6 lg:px-10 py-4 lg:py-6 rounded-b-[24px] rounded-t-0'}`}
            style={{
              background: isScrolled || location.pathname !== '/'
                ? 'linear-gradient(135deg, rgba(143,168,200,0.92) 0%, rgba(163,188,220,0.88) 50%, rgba(143,168,200,0.92) 100%)'
                : 'transparent',
              backdropFilter: isScrolled || location.pathname !== '/' ? 'blur(20px) saturate(1.6)' : 'none',
              WebkitBackdropFilter: isScrolled || location.pathname !== '/' ? 'blur(20px) saturate(1.6)' : 'none',
              border: isScrolled || location.pathname !== '/' ? '1px solid rgba(255,255,255,0.4)' : 'none',
              boxShadow: isScrolled || location.pathname !== '/'
                ? '0 10px 40px rgba(43,76,111,0.15), inset 0 1px 0 rgba(255,255,255,0.4)'
                : 'none',
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="grid grid-cols-[1fr_auto_1fr] items-center relative w-full">
              <div className="flex items-center min-w-0">
                <Link to="/" className="flex items-center shrink-0">
                  <motion.img
                    layout
                    src={logoImage}
                    alt="Vocal U"
                    className={`${isScrolled ? 'h-7 lg:h-9' : 'h-10 lg:h-14'} w-auto hover:scale-105 transition-all duration-300`}
                  />
                </Link>
              </div>

              <nav className="flex items-center justify-center gap-0">
                {navItems.map((item, index) => {
                  return (
                    <div key={item.path} className="flex items-center">
                      <div className="relative py-2 flex flex-col items-center group px-1.5 lg:px-5">
                        {item.dropdown ? (
                          <div className="relative" onMouseEnter={() => setAboutDropdownOpen(true)}
                            onMouseLeave={() => setAboutDropdownOpen(false)}
                          >
                            <div className={`cursor-pointer transition-colors duration-200 flex items-center gap-1 font-yearbook ${location.pathname.startsWith(item.path) || isAboutActive ? 'text-white' : 'text-white/70 hover:text-white'}`} style={{ ...fontYearbook, fontSize: 'clamp(16px, 1.8vw, 22px)', letterSpacing: '0.05em' }}>
                              {item.name}
                            </div>
                            <AnimatePresence>
                              {aboutDropdownOpen && (
                                <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 pointer-events-auto">
                                  <div className="bg-white/95 backdrop-blur-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] py-2.5 min-w-[220px] border border-[#8FA8C8]/20" style={{ borderRadius: '14px' }}>
                                    {item.dropdown.map((dropItem) => (
                                      <Link key={dropItem.path} to={dropItem.path} className={`block px-6 py-2.5 transition-all duration-200 font-yearbook mx-1.5 ${location.pathname === dropItem.path ? 'bg-[#8FA8C8]/15 text-[#2B4C6F]' : 'text-[#2B4C6F] hover:bg-[#8FA8C8]/10'}`} style={{ ...fontYearbook, fontSize: '18px', borderRadius: '10px' }}>
                                        {dropItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={item.path} className={`px-0 py-2 transition-colors duration-200 font-yearbook ${location.pathname === item.path ? 'text-white' : 'text-white/70 hover:text-white'}`} style={{ ...fontYearbook, fontSize: 'clamp(16px, 1.8vw, 22px)', letterSpacing: '0.05em' }}>
                              {item.name}
                            </Link>
                          </motion.div>
                        )}
                        {/* Active Underline */}
                        {(location.pathname === item.path || (item.dropdown && isAboutActive)) && (
                          <motion.div layoutId="navActionIndicatorDesktop" className="absolute bottom-[5px] inset-x-1 lg:inset-x-2 h-[2.5px] bg-white rounded-full z-20" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                      </div>
                      {index < navItems.length - 1 && (
                        <div className="h-4 w-[1px] bg-white/40 mx-1 lg:mx-2" />
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="flex items-center gap-1.5 lg:gap-3 justify-end min-w-0">
                {socialLinks.map((s) => (
                  <SocialIcon key={s.label} href={s.href} label={s.label} Icon={s.Icon} size={isScrolled ? 4 : 5} />
                ))}
              </div>
            </div>
          </motion.header>
        </div>
      </motion.div>

      {/* Mobile Dynamic Island */}
      <div className={`md:hidden fixed left-0 right-0 z-[60] flex justify-center pointer-events-none transition-all duration-500 ${mobileDockedTop ? 'top-3 px-4' : isScrolled ? 'bottom-3 px-4' : 'bottom-0 px-0'}`}>
        <motion.div
          layout
          className={`pointer-events-auto overflow-hidden ${isMobileIslandFloating ? 'rounded-[16px] shadow-lg' : 'rounded-t-[16px] w-full'} ${!isMobileIslandFloating || mobileMenuOpen ? 'w-full' : 'w-auto'
            } py-[6px] px-5`}
          style={{
            background: 'linear-gradient(135deg, rgba(143,168,200,0.95) 0%, rgba(163,188,220,0.92) 50%, rgba(143,168,200,0.95) 100%)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            border: isMobileIslandFloating ? '1px solid rgba(255,255,255,0.4)' : 'none',
            borderTop: !isMobileIslandFloating ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 -4px 30px rgba(43,76,111,0.1), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {/* Collapsed/Header state */}
          <motion.div layout className={`flex items-center justify-between ${mobileMenuOpen ? 'pb-4 border-b border-white/20 gap-4' : 'gap-3'}`}>
            <Link to="/" className="flex items-center shrink-0" onClick={() => setMobileMenuOpen(false)}>
              <motion.img layout src={logoImage} alt="Vocal U" className="h-8 w-auto transition-all duration-300" loading="lazy" />
            </Link>
            {!mobileMenuOpen && (
              <motion.div
                layout
                className="text-white/95 text-[22px] truncate cursor-pointer flex-1 text-center px-2"
                onClick={() => setMobileMenuOpen(true)}
                style={{ ...fontYearbook, letterSpacing: '0.05em' }}
              >
                {navItems.find(item => location.pathname === item.path)?.name || (isAboutActive ? 'About' : 'Menu')}
              </motion.div>
            )}
            <motion.button layout className="text-white active:scale-90 transition-transform flex-shrink-0 bg-white/10 hover:bg-white/20 rounded-[12px] p-2.5" onClick={() => setMobileMenuOpen((prev) => !prev)}>
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Expanded Menu Content */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden px-4"
              >
                <nav className="mt-4 flex flex-col gap-1">
                  {navItems.map((item) =>
                    item.dropdown ? (
                      <div key={item.path} className="bg-white/5 rounded-2xl overflow-hidden">
                        <button onClick={() => setAboutDropdownOpen((prev) => !prev)}
                          className="w-full text-left px-4 py-3 text-white/90 flex justify-between items-center bg-transparent transition-colors hover:bg-white/5"
                          style={{ ...fontYearbook, fontSize: '22px', letterSpacing: '0.05em' }}
                        >
                          {item.name}
                          <motion.div animate={{ rotate: aboutDropdownOpen ? 180 : 0 }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {aboutDropdownOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-black/10">
                              {item.dropdown.map((dropItem) => (
                                <Link key={dropItem.path} to={dropItem.path} onClick={closeMobileMenu} className="block px-6 py-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors" style={{ ...fontYearbook, fontSize: '16px' }}>
                                  {dropItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link key={item.path} to={item.path} onClick={closeMobileMenu} className={`block px-4 py-3 rounded-2xl transition-colors duration-200 ${location.pathname === item.path ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'}`} style={{ ...fontYearbook, fontSize: '22px', letterSpacing: '0.05em' }}>
                        {item.name}
                      </Link>
                    )
                  )}
                  <div className="flex items-center justify-center gap-4 px-4 py-5 mt-2">
                    {socialLinks.map((s) => (
                      <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all duration-200 cursor-pointer flex items-center justify-center" aria-label={s.label}>
                        <s.Icon className="w-5 h-5 text-white" />
                      </motion.a>
                    ))}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>



    </>
  );
}
