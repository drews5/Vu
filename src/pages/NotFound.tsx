import { motion, useReducedMotion } from 'motion/react';
import { Calendar, Home, Music, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Seo } from '../components/Seo';

export function NotFound() {
  const missingPath = typeof window !== 'undefined' ? window.location.pathname : '/404';
  const reduceMotion = useReducedMotion();

  return (
    <PageShell className="flex min-h-[68vh] items-center justify-center px-1 py-10">
      <Seo
        title="Page Not Found"
        description="The page you requested could not be found on the Vocal U website."
        path={missingPath}
        noindex
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-[#e9f0f7] via-white to-[#d9e5f0] px-6 py-12 text-center shadow-[0_24px_70px_rgba(46,76,109,0.16)] md:px-12 md:py-16">
        <span className="absolute -right-7 -top-10 select-none text-[9rem] text-[#91a8c6]/12" aria-hidden="true">VU</span>
        <Sparkles className="absolute left-8 top-9 h-8 w-8 rotate-[-12deg] text-[#7895b7]/40" aria-hidden="true" />
        <motion.div
          animate={reduceMotion ? undefined : { rotate: [-7, 7, -7], y: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#2e4c6d] text-white shadow-[8px_8px_0_#91a8c6]"
        >
          <Music className="h-8 w-8" aria-hidden="true" />
        </motion.div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-[#7895b7]">404 · missed entrance</p>
        <h1 className="mt-3 text-[clamp(2.4rem,7vw,4rem)] leading-none text-[#2e4c6d]">That note isn’t in the arrangement</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-[#2e4c6d]/70">
          This page wandered off during rehearsal. Head home or see where we’re singing next.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2e4c6d] px-6 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(46,76,109,0.2)] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#7895b7]">
            <Home className="h-4 w-4" aria-hidden="true" />
            Go home
          </Link>
          <Link to="/events" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#b9c9d9] bg-white px-6 py-3 font-semibold text-[#2e4c6d] transition-[transform,border-color,background-color] hover:-translate-y-0.5 hover:border-[#91a8c6] hover:bg-[#eef3f7]">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Browse events
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
