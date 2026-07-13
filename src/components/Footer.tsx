import { memo } from 'react';
import { Link } from 'react-router-dom';
import footerLogo from '../assets/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';
import { SocialLinks } from './SocialLinks';

const resourceLinks = [
  { to: '/about', label: 'About us' },
  { to: '/members', label: 'Members' },
  { to: '/media', label: 'Media' },
  { to: '/events/showcase', label: 'Showcase' },
  { to: '/auditions', label: 'Auditions' },
  { to: '/donate', label: 'Support us' },
];

export const Footer = memo(function Footer() {
  return (
    <footer className="mt-12 rounded-2xl bg-[#2e4c6d] px-6 py-9 text-white md:mt-16 md:px-10 md:py-11">
      <div className="mx-auto grid max-w-7xl gap-9 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
        <div>
          <img src={footerLogo} alt="Vocal U" className="h-14 w-auto" loading="lazy" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/68">
            Gender-inclusive a cappella at the University of Minnesota, singing together since 2011.
          </p>
        </div>

        <div>
          <h2 className="text-lg text-white">Explore</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-sm md:grid-cols-1">
            {resourceLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/68 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg text-white">Connect</h2>
          <a href="mailto:vocalu@umn.edu" className="mt-3 inline-block text-sm text-white/68 transition-colors hover:text-white">
            vocalu@umn.edu
          </a>
          <SocialLinks
            className="mt-4 flex items-center gap-2"
            linkClassName="rounded-full border border-white/15 p-2.5 text-white/72 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
            iconClassName="h-4 w-4"
          />
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-7xl border-t border-white/10 pt-5 text-center text-xs leading-5 text-white/48 md:text-left">
        © {new Date().getFullYear()} Vocal U A Cappella. Vocal U is a registered student organization independent of the University of Minnesota.
      </div>
    </footer>
  );
});
