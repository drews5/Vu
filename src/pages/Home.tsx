import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import fullLogo from '../assets/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';
import heroBackground from '../assets/hero-1600.webp';
import heroBackgroundLarge from '../assets/hero-2400.webp';
import groupPhoto from '../assets/group-photo.webp';

import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, ChevronDown, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition, childVariants } from '../components/PageTransition';
import { loadSupabase } from '../utils/loadSupabase';
import { getEventImage, getEventImageFit, getEventImagePosition } from '../utils/eventImages';
import { getEventDatePresentation, getEventDescription, getEventDisplayTitle, getEventPath } from '../utils/eventRoutes';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';
import { copyText } from '../utils/clipboard';
import { isEventUpcoming } from '../utils/eventDate';

const fontInter = { fontFamily: 'Inter, sans-serif' };
const LazyContactForm = lazy(() => import('../components/ContactForm').then((m) => ({ default: m.ContactForm })));

interface FeaturedEvent {
  slug: string;
  tag: string;
  date: string;
  year?: string;
  title: string;
  location: string;
  description?: string;
  link: string;
  image: string;
  status: 'Upcoming' | 'Previous';
  isInstagram?: boolean;
}

const MAX_VISIBLE_EVENT_CARDS = 3;
const HERO_SCROLL_LOCK_MS = 160;

function getVisibleCardCount(width: number) {
  if (width >= 1024) return MAX_VISIBLE_EVENT_CARDS;
  if (width >= 768) return 2;
  return 1;
}

function EventCard({ event }: { event: FeaturedEvent }) {
  const [copied, setCopied] = useState(false);
  const handleCopyInfo = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const eventLink = `${window.location.origin}${event.link}`;
    const info = `${event.title} — ${event.date} at ${event.location}. ${eventLink}`;
    if (await copyText(info)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const content = (
    <>
      <div className="relative aspect-video overflow-hidden bg-[#27316B]">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          style={{ objectFit: getEventImageFit(event.slug), objectPosition: getEventImagePosition(event.slug) }}
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`${event.status === 'Previous' ? 'bg-gray-400' : 'bg-[#8FA8C8]'} text-white px-3 py-1 text-[10px] tracking-widest font-yearbook`}
            style={{ borderRadius: '8px', ...fontYearbook }}
          >
            {event.tag}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-1">
          <div className="flex items-center gap-2 text-[#8FA8C8] text-xs font-bold" style={fontInter}>
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
          </div>
        </div>
        <h3
          className="text-[#2B4C6F] mb-3 text-xl leading-tight group-hover:text-[#8FA8C8] transition-colors line-clamp-2 font-yearbook"
          style={fontYearbook}
        >
          {event.title}
        </h3>
        <div className="mt-auto flex items-center gap-2 text-[#2B4C6F]/60 text-sm" style={fontInter}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </>
  );

  if (event.isInstagram) {
    return (
      <motion.a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="vu-card group bg-white overflow-hidden border border-gray-100 transition-[box-shadow,border-color] duration-300 hover:border-[#8FA8C8] flex flex-col cursor-pointer"
        style={{ borderRadius: '16px' }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="relative h-full"
    >
      <Link
        to={event.link}
        className="vu-card group bg-white overflow-hidden border border-gray-100 transition-[box-shadow,border-color] duration-300 hover:border-[#8FA8C8] flex flex-col h-full cursor-pointer"
        style={{ borderRadius: '16px' }}
      >
        {content}
      </Link>
      <button
        type="button"
        onClick={handleCopyInfo}
        className="group/copy absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/95 shadow-sm transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={copied ? `${event.title} event details copied` : `Copy ${event.title} event details`}
      >
        <span aria-live="polite" className={`absolute -top-8 right-0 rounded bg-[#2B4C6F] px-2 py-1 text-[10px] font-bold text-white transition-opacity pointer-events-none whitespace-nowrap ${copied ? 'opacity-100' : 'opacity-0'}`}>
          {copied ? 'COPIED!' : ''}
        </span>
        <Copy className="h-4 w-4 text-[#8FA8C8] transition-colors group-hover/copy:text-[#2B4C6F]" />
      </button>
    </motion.div>
  );
}

export function Home() {
  const homeDescription =
    'Official site for Vocal U, the University of Minnesota gender-inclusive a cappella group. Explore performances, members, media, auditions, and ways to support the group.';
  const [items, setItems] = useState<FeaturedEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [hasScrolledAtAll, setHasScrolledAtAll] = useState(
    typeof window !== 'undefined' && window.scrollY > 0
  );
  const [isHeroContained, setIsHeroContained] = useState(
    typeof window !== 'undefined' && window.scrollY > 0
  );
  const heroContainedRef = useRef(isHeroContained);
  const heroTransitionLockedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [isExtraSmall, setIsExtraSmall] = useState(typeof window !== 'undefined' && window.innerWidth <= 468);

  // The first downward gesture reveals the contained webpage layout without also
  // moving it underneath the fixed header. Later gestures scroll normally.
  useEffect(() => {
    let unlockTimer = 0;
    let touchStartY: number | null = null;
    let hasEnteredPageScroll = window.scrollY > 0;

    const publishHeroState = (contained: boolean) => {
      document.documentElement.dataset.homeHeroContained = String(contained);
      window.dispatchEvent(new CustomEvent('vu:home-hero-state', { detail: { contained } }));
    };

    const unlockAfterTransition = () => {
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        heroTransitionLockedRef.current = false;
      }, HERO_SCROLL_LOCK_MS);
    };

    const containHero = () => {
      if (heroContainedRef.current) return;
      heroContainedRef.current = true;
      heroTransitionLockedRef.current = true;
      setIsHeroContained(true);
      setHasScrolledAtAll(true);
      publishHeroState(true);
      unlockAfterTransition();
    };

    const expandHero = () => {
      if (!heroContainedRef.current) return;
      heroContainedRef.current = false;
      heroTransitionLockedRef.current = false;
      setIsHeroContained(false);
      publishHeroState(false);
    };

    const handleWheel = (event: WheelEvent) => {
      if (window.scrollY > 0 || event.deltaY <= 0) return;
      if (!heroContainedRef.current) {
        event.preventDefault();
        containHero();
        return;
      }
      if (heroTransitionLockedRef.current) {
        event.preventDefault();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (touchStartY === null || currentY === undefined || touchStartY - currentY < 8 || window.scrollY > 0) return;
      if (!heroContainedRef.current || heroTransitionLockedRef.current) {
        event.preventDefault();
        containHero();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isDownwardNavigation = ['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key);
      if (!isDownwardNavigation || window.scrollY > 0 || heroContainedRef.current) return;
      event.preventDefault();
      containHero();
    };

    const handleScroll = () => {
      if (window.scrollY > 0) {
        hasEnteredPageScroll = true;
        setHasScrolledAtAll(true);
        if (!heroContainedRef.current) {
          heroContainedRef.current = true;
          setIsHeroContained(true);
          publishHeroState(true);
        }
      } else if (hasEnteredPageScroll) {
        hasEnteredPageScroll = false;
        expandHero();
      }
    };

    publishHeroState(heroContainedRef.current);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.clearTimeout(unlockTimer);
      delete document.documentElement.dataset.homeHeroContained;
      window.dispatchEvent(new CustomEvent('vu:home-hero-state', { detail: { contained: false } }));
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let frameId = 0;

    const handleResize = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const width = window.innerWidth;
        setVisibleCards(getVisibleCardCount(width));
        setIsMobile(width < 768);
        setIsExtraSmall(width <= 468);
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchData() {
      try {
        const supabase = await loadSupabase();
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('slug, date, title, location, description, image_url, tag')
          .order('date', { ascending: true })
          .abortSignal(controller.signal);

        if (eventsError) {
          if (!cancelled) console.error('Error fetching events:', eventsError);
          return;
        }

        if (cancelled) return;

        const now = new Date();
        const processed = (eventsData || []).map((r: any) => {
          const d = new Date(r.date);
          return {
            ...r,
            fullDate: d,
            status: isEventUpcoming(d, now) ? 'Upcoming' : 'Previous'
          };
        });

        const allEvents = processed.sort((a: any, b: any) => a.fullDate.getTime() - b.fullDate.getTime());
        const formattedEvents: FeaturedEvent[] = allEvents.map((r: any) => ({
          slug: r.slug,
          tag: r.status === 'Previous' ? 'PAST' : r.tag || 'UPCOMING',
          date: getEventDatePresentation(r.slug, r.fullDate).full,
          title: getEventDisplayTitle(r.slug, r.title),
          location: r.location,
          description: getEventDescription(r.slug, r.description),
          link: getEventPath(r.slug),
          status: r.status,
          image: getEventImage(r.slug, r.image_url),
        }));

        if (cancelled) return;

        setItems(formattedEvents);
        const vCards = getVisibleCardCount(window.innerWidth);
        const firstUpcomingIdx = formattedEvents.findIndex((event) => event.status === 'Upcoming');
        const maxIdx = Math.max(0, formattedEvents.length - vCards);
        setCurrentIndex(firstUpcomingIdx === -1 ? maxIdx : Math.min(firstUpcomingIdx, maxIdx));
      } catch (error) {
        if (!cancelled) console.error('Could not load events:', error);
      }
    }

    void fetchData();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const nextSlide = () => {
    if (items.length === 0) return;
    const finalIndex = Math.max(0, items.length - visibleCards);
    setCurrentIndex((prev) => (prev >= finalIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (items.length === 0) return;
    const finalIndex = Math.max(0, items.length - visibleCards);
    setCurrentIndex((prev) => (prev <= 0 ? finalIndex : prev - 1));
  };
  const showArrows = items.length > visibleCards;
  const slideCount = Math.max(1, items.length - visibleCards + 1);
  const heroStageHeight = isHeroContained
    ? isMobile
      ? 'clamp(480px, 72svh, 576px)'
      : '726px'
    : 'max(560px, min(100svh, 900px))';
  const homeSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Vocal U Home',
      description: homeDescription,
      url: toAbsoluteUrl('/'),
      about: {
        '@id': toAbsoluteUrl('/#organization'),
      },
    },
  ];

  return (
    <PageTransition className="pb-0 relative" delay={0}>
      <Seo
        title="Vocal U A Cappella | University of Minnesota A Cappella Group"
        description={homeDescription}
        path="/"
        keywords={['Vocal U Minneapolis', 'UMN gender-inclusive a cappella', 'Twin Cities vocal group']}
        schema={homeSchema}
      />

      {/* Hero Section */}
      <section
        className="relative left-1/2 mb-[25px] w-screen -translate-x-1/2"
        style={{ zIndex: 1, height: heroStageHeight }}
      >
        <motion.div
          layout
          layoutDependency={isHeroContained}
          initial={false}
          transition={{ layout: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }}
          className={`absolute overflow-hidden bg-[#2B4C6F] ${
            isHeroContained
              ? 'inset-x-0 top-0 mx-auto w-[calc(100%-24px)] rounded-[18px] border border-white/70 md:top-[134px] md:h-[576px] md:w-[calc(100%-100px)] md:max-w-[1340px]'
              : 'inset-0 h-full w-full rounded-none border border-transparent'
          }`}
          style={isHeroContained && isMobile ? { height: 'clamp(480px, 72svh, 576px)' } : undefined}
        >
          <img
            src={heroBackground}
            srcSet={`${heroBackground} 1600w, ${heroBackgroundLarge} 2400w`}
            sizes="100vw"
            alt="Vocal U Group"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center bottom' }}
            decoding="async"
            {...({ fetchpriority: 'high' } as Record<string, string>)}
          />
          <div className="absolute inset-0 flex flex-col items-center px-4 pointer-events-none">
            <motion.div
              className={`flex-shrink-0 pointer-events-auto transition-[width,max-width] duration-500 ease-out ${
                isHeroContained && isMobile
                  ? 'w-[60vw] max-w-[230px]'
                  : 'w-[85vw] max-w-[340px] md:w-[280px] md:max-w-[280px]'
              }`}
              initial={false}
              animate={{ paddingTop: isMobile ? 'calc(10vh - 10px)' : (isHeroContained ? 22 : 132) }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="vu-hero-logo-shell cursor-default outline-none select-none">
                <img
                  src={fullLogo}
                  alt="Vocal U - University of Minnesota's A Cappella Group"
                  className="block w-full"
                  style={{ filter: 'drop-shadow(0 2px 3px rgba(19, 43, 68, 0.2))' }}
                />
              </div>
            </motion.div>

            <div
              className="pointer-events-none absolute inset-x-0 z-20 flex justify-center px-4"
              style={{ bottom: isHeroContained ? (isExtraSmall ? '38px' : '30px') : (isExtraSmall ? '135px' : '125px') }}
            >
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="hero-audition-glow pointer-events-auto rounded-[16px]"
              >
                <Link
                  to="/auditions"
                  className="hero-audition-stroke group relative block overflow-hidden border border-white/80 bg-white/95 px-6 md:px-12 py-2.5 md:py-4 text-center text-[#2B4C6F] transition-all duration-300 hover:border-[#8FA8C8] hover:bg-[#8FA8C8] hover:text-white whitespace-nowrap"
                  style={{
                    ...fontYearbook,
                    fontSize: 'clamp(14px, 4vw, 20px)',
                    letterSpacing: '0.05em',
                    borderRadius: '16px',
                  }}
                >
                  <span className="relative flex items-center justify-center gap-2">
                    AUDITION SIGN UP
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Scroll cue - mobile */}
          <AnimatePresence>
            {!hasScrolledAtAll && isMobile && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 2, duration: 0.3 }}
                onClick={() => document.getElementById('meet-vocal-u')?.scrollIntoView({ behavior: 'smooth' })}
                className="absolute bottom-[96px] left-1/2 z-20 -translate-x-1/2 text-white/95 drop-shadow-[0_2px_3px_rgba(19,43,68,0.65)]"
                aria-label="Scroll to meet Vocal U"
              >
                <motion.span
                  className="block"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ChevronDown className="h-7 w-7 stroke-[2.5px]" />
                </motion.span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* We Are Vocal U Section */}
      <motion.section
        id="meet-vocal-u"
        variants={childVariants}
        className="vu-panel bg-white border border-gray-100 p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 items-center relative z-10"
        style={{
          gap: '25px',
          marginBottom: '25px',
          borderRadius: '16px'
        }}
      >
        <div>
          <h2 className="mb-6 md:mb-8 whitespace-nowrap">
            <span
              className="text-[#A3B8D3] font-yearbook"
              style={{ ...fontYearbook, fontSize: 'clamp(32px, 5.2vw, 56px)' }}
            >
              We Are{' '}
            </span>
            <span
              className="text-[#2B4C6F] font-yearbook"
              style={{ ...fontYearbook, fontSize: 'clamp(32px, 5.2vw, 56px)' }}
            >
              Vocal U
            </span>
          </h2>

          <div
            className="space-y-4 text-[#2B4C6F] leading-relaxed mb-6"
            style={{ ...fontInter, fontSize: '17px', fontWeight: '400', lineHeight: '1.7' }}
          >
            <p>
              Vocal U is a gender-inclusive a cappella group at the University of Minnesota, established in
              2011. We are a registered student organization dedicated to spreading our music across the
              Twin Cities and beyond, and having a great time while doing it.
            </p>
            <p>
              We come from all different majors and backgrounds, but we're all a part of VU because we love
              music and the arts. More than an a cappella group, Vocal U is a family. We support and push
              each other to be the best performers we can be, which translates to the stage.
            </p>
          </div>

          <motion.div
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-[#2B4C6F] text-white px-8 py-3 border border-[#2B4C6F] hover:bg-white hover:text-[#2B4C6F] transition-all duration-300 group cursor-pointer font-yearbook"
              style={{ ...fontYearbook, fontSize: '18px', letterSpacing: '0.05em', borderRadius: '12px' }}
            >
              Learn More
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div
          className="vu-image-frame overflow-hidden border border-gray-100"
          style={{ borderRadius: '16px' }}
        >
          <img
            src={groupPhoto}
            alt="Vocal U Group Members"
            className="w-full h-[300px] md:h-[500px] object-cover"
            style={{ filter: 'brightness(1.08) saturate(1.05)' }}
            loading="lazy"
          />
        </div>
      </motion.section>

      {/* Events Section */}
      <motion.section
        variants={childVariants}
        className="vu-events-stage relative py-12 md:py-16 px-6 md:px-12"
        style={{
          marginBottom: '25px',
          borderRadius: '16px',
          background: '#8FA8C8',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2
              className="text-white mb-2 font-yearbook"
              style={{
                ...fontYearbook,
                fontSize: 'clamp(48px, 8vw, 80px)',
                letterSpacing: '0.05em',
              }}
            >
              Events
            </h2>
            <p className="text-white/90 font-normal tracking-wide text-sm md:text-base" style={fontInter}>
              Join us for live performances, competitions, and more.
            </p>
          </div>

          <div
            className="relative group/carousel px-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
            role="region"
            aria-label="Featured events carousel"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                prevSlide();
              }
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                nextSlide();
              }
            }}
          >
            <div className="overflow-hidden py-8 touch-pan-y">
                <motion.div
                  animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -55) nextSlide();
                    if (info.offset.x > 55) prevSlide();
                  }}
                  className="flex cursor-grab active:cursor-grabbing"
                  style={{ width: '100%' }}
                >
                  {items.map((event, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 px-2 md:px-4 flex items-stretch"
                      style={{ width: `${100 / visibleCards}%` }}
                    >
                      <div className="w-full">
                        <EventCard event={event} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

            {showArrows && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 bg-white text-[#2B4C6F] flex h-11 w-11 items-center justify-center rounded-full border border-[#8FA8C8]/20 z-20 hover:bg-[#F8FAFC] hover:scale-105 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 bg-white text-[#2B4C6F] flex h-11 w-11 items-center justify-center rounded-full border border-[#8FA8C8]/20 z-20 hover:bg-[#F8FAFC] hover:scale-105 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Pagination */}
            {items.length > 1 && (
              <div className="mt-3 flex flex-wrap justify-center gap-0.5" aria-label="Choose an event">
                {Array.from({ length: slideCount }, (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className="group/dot flex h-11 w-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
                    aria-label={`Show event ${idx + 1} of ${slideCount}`}
                    aria-current={currentIndex === idx ? 'true' : undefined}
                  >
                    <span className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-white w-5' : 'bg-white/40 group-hover/dot:bg-white/70 w-2'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <motion.div
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/events"
                className="inline-flex items-center gap-3 bg-white text-[#2B4C6F] px-10 py-4 border border-white hover:bg-[#2B4C6F] hover:text-white hover:border-[#2B4C6F] transition-all duration-300 group cursor-pointer font-yearbook"
                style={{ ...fontYearbook, fontSize: '18px', letterSpacing: '0.05em', borderRadius: '12px' }}
              >
                <span>View All Events</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section variants={childVariants} style={{ marginBottom: '25px', position: 'relative', zIndex: 1 }}>
        <Suspense fallback={null}>
          <LazyContactForm />
        </Suspense>
      </motion.section>
    </PageTransition>
  );
}
