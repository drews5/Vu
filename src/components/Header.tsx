import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, Menu, Music2, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logoImage from '../assets/d4630c01b543cc75980f0b293230859d29654fbb.png';
import { fontYearbook } from '../styles/fonts';
import { SocialLinks } from './SocialLinks';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' },
];

const aboutLinks = [
  { name: 'Our story', path: '/about' },
  { name: 'Meet the group', path: '/members' },
  { name: 'Watch & listen', path: '/media' },
  { name: 'Support Vocal U', path: '/donate' },
];

export function Header() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const isHome = pathname === '/';
  const isFloating = !isHome || isScrolled;
  const isAboutActive = ['/about', '/members', '/media', '/donate'].includes(pathname);

  useEffect(() => {
    let frameId = 0;
    const update = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => setIsScrolled(window.scrollY > 24));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', update);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const currentPage =
    navItems.find((item) => item.path === pathname)?.name ||
    aboutLinks.find((item) => item.path === pathname)?.name ||
    (pathname === '/auditions' ? 'Auditions' : 'Menu');

  const islandStyle = {
    background:
      'linear-gradient(135deg, rgba(126,151,184,0.96) 0%, rgba(154,179,211,0.94) 52%, rgba(126,151,184,0.96) 100%)',
    boxShadow: '0 18px 55px rgba(35,61,85,0.2), inset 0 1px 0 rgba(255,255,255,0.42)',
    backdropFilter: 'blur(20px) saturate(1.45)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.45)',
  };

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-x-0 top-0 z-[100] hidden justify-center px-4 transition-[padding] duration-300 md:flex md:px-[50px] ${
          isFloating ? 'pt-4' : 'pt-0'
        }`}
      >
        <motion.header
          layout={!reduceMotion}
          className={`pointer-events-auto relative border-white/35 text-white ${
            isFloating
              ? 'w-auto rounded-[24px] border px-5 py-2.5 lg:px-7'
              : 'w-full max-w-[1340px] rounded-b-[28px] px-7 py-5 lg:px-10 lg:py-6'
          }`}
          style={isFloating ? islandStyle : undefined}
          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        >
          <div className={`grid items-center ${isFloating ? 'grid-cols-[7rem_auto_7rem] gap-5 lg:grid-cols-[8rem_auto_8rem]' : 'grid-cols-[10rem_auto_10rem] gap-7'}`}>
            <Link to="/" aria-label="Vocal U home" className="flex items-center">
              <motion.img
                layout={!reduceMotion}
                src={logoImage}
                alt="Vocal U"
                className={`${isFloating ? 'h-8 lg:h-9' : 'h-12 lg:h-14'} w-auto drop-shadow-sm`}
              />
            </Link>

            <nav className="flex items-center justify-center" aria-label="Main navigation">
              {navItems.map((item, index) => {
                const active = item.path === '/about' ? isAboutActive : pathname === item.path;
                const isAbout = item.path === '/about';

                return (
                  <div key={item.path} className="flex items-center">
                    <div
                      className="group relative px-3 py-2 lg:px-4"
                      onMouseEnter={() => isAbout && setAboutOpen(true)}
                      onMouseLeave={() => isAbout && setAboutOpen(false)}
                    >
                      {isAbout ? (
                        <button
                          type="button"
                          onClick={() => setAboutOpen((open) => !open)}
                          className={`flex items-center gap-1.5 whitespace-nowrap transition-colors ${active ? 'text-white' : 'text-white/72 hover:text-white'}`}
                          style={{ ...fontYearbook, fontSize: isFloating ? '18px' : '21px', letterSpacing: '0.035em' }}
                          aria-expanded={aboutOpen}
                          aria-haspopup="menu"
                        >
                          About
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                        </button>
                      ) : (
                        <NavLink
                          to={item.path}
                          className={({ isActive }) => `block whitespace-nowrap transition-colors ${isActive ? 'text-white' : 'text-white/72 hover:text-white'}`}
                          style={{ ...fontYearbook, fontSize: isFloating ? '18px' : '21px', letterSpacing: '0.035em' }}
                        >
                          {item.name}
                        </NavLink>
                      )}

                      {active && (
                        <motion.span
                          layoutId="desktop-nav-marker"
                          className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-white"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      <AnimatePresence>
                        {isAbout && aboutOpen && (
                          <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                            className="absolute left-1/2 top-full z-20 w-56 -translate-x-1/2 pt-4"
                          >
                            <div className="rounded-2xl border border-[#91a8c6]/24 bg-white/96 p-2 text-[#2e4c6d] shadow-[0_18px_50px_rgba(35,61,85,0.18)] backdrop-blur-md">
                              {aboutLinks.map((link) => (
                                <Link
                                  key={link.path}
                                  to={link.path}
                                  className={`block rounded-xl px-4 py-2.5 text-base transition-colors hover:bg-[#eef3f7] ${pathname === link.path ? 'bg-[#e5edf5] text-[#2e4c6d]' : ''}`}
                                  style={fontYearbook}
                                >
                                  {link.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {index < navItems.length - 1 && <span className="mx-0.5 h-5 w-px bg-white/28" />}
                  </div>
                );
              })}
            </nav>

            <SocialLinks
              className="flex items-center justify-end gap-1"
              linkClassName="rounded-full bg-white/12 p-2 text-white transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-white/24"
              iconClassName="h-4 w-4"
            />
          </div>

          <AnimatePresence>
            {isFloating && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: -8, scaleX: 0.9 }}
                animate={{ opacity: 1, y: 0, scaleX: 1 }}
                exit={{ opacity: 0, y: -8, scaleX: 0.9 }}
                className="pointer-events-auto absolute left-1/2 top-full -translate-x-1/2"
              >
                <Link
                  to="/auditions"
                  className="group flex h-8 w-[330px] items-center justify-center gap-2 rounded-b-full border border-t-0 border-white/70 bg-white/94 px-4 text-[#2e4c6d] shadow-[0_9px_24px_rgba(35,61,85,0.13)] backdrop-blur-md transition-colors hover:bg-[#2e4c6d] hover:text-white"
                >
                  <Music2 className="h-3.5 w-3.5 text-[#7895b7] transition-colors group-hover:text-white" />
                  <span className="text-[11px] font-bold tracking-[0.13em]">Auditions are open</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[120] flex justify-center px-3 md:hidden">
        <motion.div layout={!reduceMotion} className="pointer-events-auto relative w-full max-w-md" transition={{ type: 'spring', stiffness: 360, damping: 32 }}>
          <AnimatePresence>
            {!mobileMenuOpen && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8, scaleX: 0.9 }}
                animate={{ opacity: 1, y: 1, scaleX: 1 }}
                exit={{ opacity: 0, y: 8, scaleX: 0.9 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2"
              >
                <Link
                  to="/auditions"
                  className="group flex h-7 w-[236px] items-center justify-center gap-1.5 rounded-t-full border border-b-0 border-white/70 bg-white/94 text-[#2e4c6d] shadow-[0_-8px_22px_rgba(35,61,85,0.1)]"
                >
                  <Music2 className="h-3 w-3 text-[#7895b7]" />
                  <span className="text-[10px] font-bold tracking-[0.11em]">Auditions are open</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout={!reduceMotion} className="overflow-hidden rounded-[22px] border border-white/38 px-4 py-2.5 text-white" style={islandStyle}>
            <div className={`flex items-center gap-3 ${mobileMenuOpen ? 'border-b border-white/18 pb-3' : ''}`}>
              <Link to="/" onClick={closeMobileMenu} aria-label="Vocal U home" className="shrink-0">
                <img src={logoImage} alt="Vocal U" className="h-8 w-auto" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex flex-1 items-center justify-center text-center text-xl"
                style={fontYearbook}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-island-menu"
              >
                {mobileMenuOpen ? 'Where to?' : currentPage}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/12 transition-colors hover:bg-white/24"
                aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.span key="close" initial={{ rotate: -60, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 60, opacity: 0 }}>
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 60, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -60, opacity: 0 }}>
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.nav
                  id="mobile-island-menu"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pt-3"
                  aria-label="Mobile navigation"
                >
                  <div className="grid grid-cols-2 gap-1.5">
                    {[...navItems, { name: 'Members', path: '/members' }, { name: 'Media', path: '/media' }, { name: 'Support us', path: '/donate' }].map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `rounded-xl px-3 py-2.5 text-center text-base transition-colors ${isActive ? 'bg-white text-[#2e4c6d]' : 'bg-white/6 text-white/90 hover:bg-white/14'}`}
                        style={fontYearbook}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                    <NavLink to="/auditions" onClick={closeMobileMenu} className="rounded-xl bg-[#2e4c6d] px-3 py-2.5 text-center text-base text-white" style={fontYearbook}>
                      Auditions
                    </NavLink>
                  </div>
                  <SocialLinks
                    className="mt-3 flex items-center justify-center gap-2 border-t border-white/16 pt-3"
                    linkClassName="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/22"
                    iconClassName="h-4 w-4"
                  />
                </motion.nav>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
