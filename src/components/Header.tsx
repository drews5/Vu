import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logoImage from '../assets/d4630c01b543cc75980f0b293230859d29654fbb.png';
import { SocialLinks } from './SocialLinks';

const navItems = [
  { name: 'About', path: '/about' },
  { name: 'Members', path: '/members' },
  { name: 'Events', path: '/events' },
  { name: 'Media', path: '/media' },
  { name: 'Contact', path: '/contact' },
];

export function Header() {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === '/';
  const isSolid = !isHome || isScrolled || menuOpen;

  useEffect(() => {
    let frameId = 0;
    const update = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => setIsScrolled(window.scrollY > 32));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', update);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-sm font-semibold tracking-wide transition-colors ${
      isActive ? 'text-white' : 'text-white/72 hover:text-white'
    } after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-white after:transition-transform ${
      isActive ? 'after:scale-x-100' : 'after:scale-x-0'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] border-b transition-colors duration-200 ${
        isSolid
          ? 'border-white/10 bg-[#2e4c6d]/95 shadow-[0_4px_20px_rgba(26,48,70,0.12)] backdrop-blur-sm'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 md:h-[88px] md:px-[50px]">
        <Link to="/" className="shrink-0" aria-label="Vocal U home">
          <img src={logoImage} alt="Vocal U" className="h-11 w-auto md:h-13" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={navLinkClass}>
              {item.name}
            </NavLink>
          ))}
          <NavLink
            to="/auditions"
            className="rounded-xl border border-white bg-white px-5 py-2.5 text-sm font-semibold text-[#2e4c6d] transition-colors hover:bg-transparent hover:text-white"
          >
            Auditions
          </NavLink>
        </nav>

        <SocialLinks
          className="hidden items-center gap-1.5 xl:flex"
          linkClassName="rounded-full p-2 text-white/72 transition-colors hover:bg-white/10 hover:text-white"
          iconClassName="h-4 w-4"
        />

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/18 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="overflow-hidden border-t border-white/10 bg-[#2e4c6d] lg:hidden">
          <nav className="mx-auto max-w-[1440px] px-4 pb-6 pt-3 md:px-[50px]" aria-label="Mobile navigation">
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                      isActive ? 'bg-white text-[#2e4c6d]' : 'text-white/82 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <NavLink to="/donate" className="rounded-xl px-4 py-3 text-base font-semibold text-white/82 hover:bg-white/10 hover:text-white">
                Support us
              </NavLink>
              <NavLink to="/auditions" className="rounded-xl bg-white px-4 py-3 text-base font-semibold text-[#2e4c6d]">
                Auditions
              </NavLink>
            </div>
            <SocialLinks
              className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4"
              linkClassName="rounded-full p-2.5 text-white/72 transition-colors hover:bg-white/10 hover:text-white"
              iconClassName="h-5 w-5"
            />
          </nav>
        </div>
      )}
    </header>
  );
}
