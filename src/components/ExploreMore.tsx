import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { childVariants } from './PageTransition';
import { fontYearbook } from '../styles/fonts';

const exploreItems = [
  { name: 'About Us', path: '/about' },
  { name: 'Our Members', path: '/members' },
  { name: 'Our Media', path: '/media' },
  { name: 'Support Us', path: '/donate' },
  { name: 'Join Us', path: '/auditions' },
];

export function ExploreMore({ currentPath, className = 'mt-24' }: { currentPath: string; className?: string }) {
  const visibleItems = exploreItems.filter((item) => item.path !== currentPath).slice(0, 4);

  return (
    <motion.section variants={childVariants} className={`${className} border-t border-gray-100 pt-16`}>
      <h2
        className="mb-10 text-center text-[#2B4C6F] font-yearbook"
        style={{ ...fontYearbook, fontSize: 'clamp(28px, 4vw, 36px)' }}
      >
        EXPLORE MORE
      </h2>
      <nav className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" aria-label="Explore more pages">
        {visibleItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="group bg-white p-8 text-center border border-gray-100 shadow-sm transition-all duration-300 hover:border-[#8FA8C8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8FA8C8]"
            style={{ borderRadius: '20px' }}
          >
            <h3
              className="text-lg text-[#2B4C6F] transition-colors group-hover:text-[#8FA8C8] font-yearbook"
              style={fontYearbook}
            >
              {item.name}
            </h3>
            <p className="mt-2 text-xs font-bold tracking-widest text-[#8FA8C8] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              LEARN MORE →
            </p>
          </Link>
        ))}
      </nav>
    </motion.section>
  );
}
