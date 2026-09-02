import {
  ArrowUpRight,
  CalendarDays,
  Heart,
  Mail,
  Mic2,
  Play,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { fontYearbook } from '../styles/fonts';

type ExploreItem = {
  name: string;
  description: string;
  path: string;
  Icon: LucideIcon;
};

const exploreItems: ExploreItem[] = [
  { name: 'About Us', description: 'Meet the group and our mission.', path: '/about', Icon: Mic2 },
  { name: 'Our Members', description: 'Get to know the voices of Vocal U.', path: '/members', Icon: Users },
  { name: 'Events', description: 'See where we are performing next.', path: '/events', Icon: CalendarDays },
  { name: 'Our Media', description: 'Watch performances and recent clips.', path: '/media', Icon: Play },
  { name: 'Join Us', description: 'Find audition details and choose a time.', path: '/auditions', Icon: Mic2 },
  { name: 'Support Us', description: 'Help fund performances and travel.', path: '/donate', Icon: Heart },
  { name: 'Contact', description: 'Book Vocal U or send us a message.', path: '/contact', Icon: Mail },
];

export function ExploreMore({ currentPath, className = 'mt-24' }: { currentPath: string; className?: string }) {
  const visibleItems = exploreItems.filter((item) => item.path !== currentPath);

  return (
    <motion.section
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${className} relative overflow-hidden rounded-[28px] bg-[#2B4C6F] px-5 py-10 shadow-[0_24px_70px_-42px_rgba(19,43,68,0.8)] sm:px-8 md:px-10 md:py-12`}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#8FA8C8]/25 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

      <div className="relative mb-8 flex flex-col gap-3 text-center md:mb-10 md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#BFD0E4]">Keep exploring</p>
          <h2
            className="text-white font-yearbook"
            style={{ ...fontYearbook, fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 0.95 }}
          >
            EXPLORE MORE
          </h2>
        </div>
        <p className="mx-auto max-w-md text-sm leading-6 text-white/65 md:mx-0 md:text-right">
          More music, people, performances, and ways to be part of Vocal U.
        </p>
      </div>

      <nav className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Explore more pages">
        {visibleItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, delay: Math.min(index * 0.055, 0.28), ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
          >
            <Link
              to={item.path}
              className="group flex h-full min-h-[136px] items-start gap-4 rounded-[18px] border border-white/15 bg-white/[0.08] p-5 text-left backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-300 hover:border-white/35 hover:bg-white/[0.14] hover:shadow-[0_18px_30px_-24px_rgba(0,0,0,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#2B4C6F] shadow-sm transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105">
                <item.Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="text-[19px] text-white font-yearbook" style={fontYearbook}>{item.name}</span>
                  <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-[#BFD0E4] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                </span>
                <span className="mt-2 block text-[13px] leading-5 text-white/65">{item.description}</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.section>
  );
}
