import { Helmet } from 'react-helmet-async';
import fullLogo from 'figma:asset/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';
import heroBackground from 'figma:asset/15a7da513ab99cbb57e9735db4d4d232088838f1.png';
import ichsaPhoto from '../assets/ichsa-quarterfinal.jpg';
import showcasePhoto from '../assets/spring-showcase.jpg';
import icca2026Photo from '../assets/icca-2026.jpg';
import icca2025Photo from '../assets/icca-2025.jpg';
import winterShowcasePhoto from '../assets/winter-showcase.jpg';
import nightSongsPhoto from '../assets/night-songs.jpg';
import groupPhoto from '../assets/group-photo.jpg';

import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { ContactForm } from '../components/ContactForm';

import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition, childVariants } from '../components/PageTransition';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };

interface FeaturedEvent {
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

function EventCard({ event }: { event: FeaturedEvent }) {
  const [copied, setCopied] = useState(false);
  const handleCopyInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const eventLink = `${window.location.origin}${event.link}`;
    const info = `Come see Vocal U at ${event.title} on ${event.date} at ${event.location}! ${eventLink}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2 text-[#8FA8C8] text-xs font-bold" style={fontInter}>
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
          </div>
          {!event.isInstagram && (
            <button
              onClick={handleCopyInfo}
              className="p-1.5 hover:bg-[#8FA8C8]/10 rounded-full transition-all duration-200 shrink-0 group/copy cursor-pointer -mr-1 relative"
              title="Copy event info"
            >
              <span className={`absolute -top-7 right-0 bg-[#2B4C6F] text-white text-[10px] px-2 py-1 rounded transition-opacity pointer-events-none font-bold whitespace-nowrap ${copied ? 'opacity-100' : 'opacity-0'}`}>
                COPIED!
              </span>
              <Copy className="w-3.5 h-3.5 text-[#8FA8C8]/60 group-hover/copy:text-[#8FA8C8]" />
            </button>
          )}
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
        className="group bg-white overflow-hidden border border-gray-100 transition-[box-shadow,border-color] duration-300 hover:shadow-xl hover:border-[#8FA8C8] flex flex-col cursor-pointer"
        style={{ borderRadius: '16px' }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link
        to={event.link}
        className="group bg-white overflow-hidden border border-gray-100 transition-[box-shadow,border-color] duration-300 hover:shadow-xl hover:border-[#8FA8C8] flex flex-col h-full cursor-pointer"
        style={{ borderRadius: '16px' }}
      >
        {content}
      </Link>
    </motion.div>
  );
}

export function Home() {
  const [items, setItems] = useState<FeaturedEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolledAtAll, setHasScrolledAtAll] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [isExtraSmall, setIsExtraSmall] = useState(typeof window !== 'undefined' && window.innerWidth <= 468);

  // Track scroll for full-screen hero transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Small threshold to trigger the snap
      setIsScrolled(scrollY > 20);
      setHasScrolledAtAll(scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setVisibleCards(3);
      else if (window.innerWidth >= 768) setVisibleCards(2);
      else setVisibleCards(1);
      setIsMobile(window.innerWidth < 768);
      setIsExtraSmall(window.innerWidth <= 468);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        return;
      }

      const now = new Date();
      const processed = (eventsData || []).map((r: any) => {
        const d = new Date(r.date);
        return {
          ...r,
          fullDate: d,
          status: d >= now ? 'Upcoming' : 'Previous'
        };
      });

      // Strictly chronological sort (oldest to newest)
      const allEvents = processed.sort((a: any, b: any) => a.fullDate.getTime() - b.fullDate.getTime());
      const pastCount = allEvents.filter((e: any) => e.status === 'Previous').length;

      const formattedEvents: any[] = allEvents.map((r: any) => ({
        // Always override tag from DB — past events must show "PAST"
        tag: r.status === 'Previous' ? 'PAST' : 'UPCOMING',
        date: r.fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: r.title,
        location: r.location,
        description: r.description,
        link: `/event/${r.slug}`,
        status: r.status,
        // NOTE: These photos are intentionally swapped to showcasePhoto for ICHSA slug and ichsaPhoto for Spring Showcase slug
        image: r.slug === 'ichsa-quarterfinal-4-2026' ? showcasePhoto :
          r.slug === 'spring-showcase-2026' ? ichsaPhoto :
            r.slug === 'icca-quarterfinal-2026' ? icca2026Photo :
              r.slug === 'icca-quarterfinal-2025' ? icca2025Photo :
                r.slug === 'winter-showcase-2025' ? winterShowcasePhoto :
                  r.slug === 'night-songs' ? nightSongsPhoto :
                    r.image_url,
      }));

      setItems(formattedEvents);
      const vCards = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);

      const initialIdx = Math.max(0, pastCount - 1);

      const maxIdx = Math.max(0, formattedEvents.length - vCards);
      setCurrentIndex(Math.min(initialIdx, maxIdx));
    }

    fetchData();
  }, []);

  const nextSlide = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };
  const showArrows = items.length > visibleCards;

  return (
    <PageTransition className="pb-0 relative" delay={0}>
      <Helmet>
        <title>Vocal U A Cappella | Home | UMN Minneapolis</title>
        <meta name="description" content="Official home of Vocal U A Cappella at the University of Minnesota. Explore our music, meet our members, and find upcoming performances in Minneapolis." />
        <link rel="canonical" href="https://vocalu.org/" />
        <style type="text/css">{`
          body {
            overflow-x: hidden;
          }
        `}</style>
      </Helmet>

      {/* Hero Section */}
      <motion.section
        initial={false}
        animate={{
          marginTop: isScrolled ? 110 : 0,
          marginBottom: isScrolled ? 25 : 0,
          marginLeft: isScrolled ? '0vw' : 'calc(50% - 50vw)',
          marginRight: isScrolled ? '0vw' : 'calc(50% - 50vw)',
          width: isScrolled ? '100%' : '100vw',
          maxWidth: isScrolled ? '100%' : '100vw'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <motion.div
          className="relative overflow-hidden"
          initial={false}
          animate={{
            height: isScrolled ? 576 : 'min(100vh, 160vw)', // limit height slightly on mobile to prevent extreme cropping
            borderRadius: isScrolled ? 16 : 0,
            border: isScrolled ? '1px solid rgba(243, 244, 246, 1)' : '0px solid rgba(243, 244, 246, 0)',
            boxShadow: isScrolled ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        >
          <motion.img
            src={heroBackground}
            alt="Vocal U Group"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(1.08) saturate(1.05)', objectPosition: 'center bottom' }}
            layout
          />
          <div className="absolute inset-0 flex flex-col items-center px-4 pointer-events-none">
            <motion.div
              className="pt-[calc(10vh-10px)] md:pt-[70px] flex-shrink-0 pointer-events-auto"
              initial={false}
              animate={{
                opacity: 1,
                scale: isScrolled ? (window.innerWidth < 768 ? 0.85 : 1) : (window.innerWidth < 768 ? 1 : 1.25),
                y: isScrolled ? 0 : (window.innerWidth < 768 ? 10 : 20)
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              style={{ originY: 0 }}
            >
              <Link to="/portal" className="cursor-default outline-none" draggable={false}>
                <img
                  src={fullLogo}
                  alt="Vocal U - University of Minnesota's A Cappella Group"
                  className="w-[85vw] max-w-[340px] md:max-w-[280px]"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
                />
              </Link>
            </motion.div>

            <motion.div
              className="absolute bottom-[125px] left-1/2 -translate-x-1/2 pointer-events-auto"
              initial={false}
              animate={{
                opacity: 1,
                scale: 1,
                y: (isExtraSmall ? 45 : 0) + (isScrolled ? 50 : 0),
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
                    "0 8px 30px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
                    "0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/event/spring-showcase-2026"
                  className="bg-white text-[#2B4C6F] px-6 md:px-12 py-2.5 md:py-4 border border-white hover:bg-[#8FA8C8] hover:text-white hover:border-[#8FA8C8] transition-all duration-300 flex-shrink-0 text-center block cursor-pointer font-yearbook shadow-md whitespace-nowrap"
                  style={{
                    ...fontYearbook,
                    fontSize: 'clamp(14px, 4vw, 20px)',
                    letterSpacing: '0.05em',
                    borderRadius: '12px',
                  }}
                >
                  Spring Showcase
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Swipe Hint Animation - Mobile Only */}
          <AnimatePresence>
            {!hasScrolledAtAll && isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { delay: 4 }, default: { type: 'spring', damping: 25, stiffness: 120 } }}
                className="absolute bottom-24 right-6 z-10 pointer-events-none"
              >
                <div className="relative w-14 h-28 flex justify-center overflow-hidden">
                  <motion.div
                    animate={{
                      y: [90, 15, 15],
                      opacity: [0, 0.75, 0]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: [0.45, 0.05, 0.55, 0.95]
                    }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" role="img" aria-label="scroll" style={{ filter: 'brightness(0) invert(1)' }}>👆</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* We Are Vocal U Section */}
      <motion.section
        variants={childVariants}
        className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 items-center shadow-sm hover:shadow-md transition-shadow duration-300 relative z-10"
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
              className="inline-flex items-center gap-2 bg-[#2B4C6F] text-white px-8 py-3 border border-[#2B4C6F] hover:bg-white hover:text-[#2B4C6F] hover:shadow-xl transition-all duration-300 group cursor-pointer font-yearbook"
              style={{ ...fontYearbook, fontSize: '18px', letterSpacing: '0.05em', borderRadius: '12px' }}
            >
              Learn More
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div
          className="overflow-hidden border border-gray-100"
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
        className="relative py-12 md:py-16 px-6 md:px-12"
        style={{
          marginBottom: '25px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #91a8c6 0%, #7A97B7 100%)',
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

          <div className="relative group/carousel px-0">
            <div className="overflow-hidden py-8">
              <motion.div
                animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex"
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
                  className="absolute left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white text-[#2B4C6F] p-2 rounded-full shadow-lg z-20 hover:bg-[#F8FAFC] transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white text-[#2B4C6F] p-2 rounded-full shadow-lg z-20 hover:bg-[#F8FAFC] transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Pagination Dots for Mobile/Tablet */}
            {items.length > 1 && (
              <div className="flex justify-center gap-2 mt-5 lg:hidden">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-white w-4' : 'bg-white/40 w-2'}`}
                  />
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
                className="inline-flex items-center gap-3 bg-white text-[#2B4C6F] px-10 py-4 border border-white hover:bg-[#2B4C6F] hover:text-white hover:border-[#2B4C6F] transition-all duration-300 shadow-sm group cursor-pointer font-yearbook"
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
        <ContactForm />
      </motion.section>
    </PageTransition>
  );
}