import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Copy, MapPin, Navigation, Share2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import showcasePhoto from '../assets/spring-showcase.jpg';
import { PageTransition } from '../components/PageTransition';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';
import { loadSupabase } from '../utils/loadSupabase';
import { springShowcasePath, springShowcaseSlug, springShowcaseTitle } from '../utils/eventRoutes';
import { copyText } from '../utils/clipboard';
import { getGoogleCalendarUrl, isEventUpcoming, parseEventDate } from '../utils/eventDate';

const fontInter = { fontFamily: 'Inter, sans-serif' };
const inviteDescription =
  'Our annual Spring Showcase is back! Join us for an evening of a cappella. Friends, family, students, and the community are welcome.';
const showcaseDescription = 'Our annual Spring Showcase is back! Join us for an evening of a cappella.';
const welcomeLine = 'Friends, family, students, and the community are welcome.';

type ShowcaseEvent = {
  slug: string;
  title: string;
  dateLabel: string;
  rawDate: string;
  time: string;
  location: string;
  address: string;
  description: string;
  imageUrl: string;
  fullDate: Date;
};

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

const fallbackDate = parseEventDate('2026-05-02T19:30:00+00:00', '7:30 PM');
const fallbackEvent: ShowcaseEvent = {
  slug: springShowcaseSlug,
  title: springShowcaseTitle,
  dateLabel: formatEventDate(fallbackDate),
  rawDate: '2026-05-02T19:30:00+00:00',
  time: '7:30 PM',
  location: 'Cowles Auditorium',
  address: 'Humphrey School of Public Affairs, 301 19th Ave S, Minneapolis, MN 55455',
  description: showcaseDescription,
  imageUrl: showcasePhoto,
  fullDate: fallbackDate,
};

const BloomingFlowers = () => {
  const flowers = [
    { top: '-3%', left: '-1%', size: 58, rotate: 18, color: '#FFB7B2' },
    { bottom: '-4%', right: '-1%', size: 68, rotate: -18, color: '#E2F0CB' },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ borderRadius: '16px' }}>
      {flowers.map((f, i) => (
        <div
          key={i}
          className="absolute opacity-60"
          style={{ top: f.top, bottom: f.bottom, left: f.left, right: f.right, transform: `rotate(${f.rotate}deg)` }}
        >
          <svg width={f.size} height={f.size} viewBox="0 0 100 100">
            <g transform="translate(50 50)">
              <path fill={f.color} d="M0,0 C-15,-20 -10,-40 0,-45 C10,-40 15,-20 0,0 Z" />
              <path fill={f.color} d="M0,0 C-15,-20 -10,-40 0,-45 C10,-40 15,-20 0,0 Z" transform="rotate(72)" />
              <path fill={f.color} d="M0,0 C-15,-20 -10,-40 0,-45 C10,-40 15,-20 0,0 Z" transform="rotate(144)" />
              <path fill={f.color} d="M0,0 C-15,-20 -10,-40 0,-45 C10,-40 15,-20 0,0 Z" transform="rotate(216)" />
              <path fill={f.color} d="M0,0 C-15,-20 -10,-40 0,-45 C10,-40 15,-20 0,0 Z" transform="rotate(288)" />
              <circle cx="0" cy="0" r="8" fill="#FFF4D2" />
              <circle cx="0" cy="0" r="4" fill="#ECA2A2" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
};

function ActionButton({
  href,
  onClick,
  title,
  icon,
  primary = false,
}: {
  href?: string;
  onClick?: () => void;
  title: string;
  icon: ReactNode;
  primary?: boolean;
}) {
  const baseClasses = "flex items-center justify-center gap-2 w-full px-4 py-3.5 sm:py-3 transition-all duration-300 font-semibold text-[13px] sm:text-[14px] cursor-pointer";

  const styleClasses = primary
    ? "bg-[#2B4C6F] text-white border border-[#2B4C6F] hover:bg-white hover:text-[#2B4C6F]"
    : "bg-white text-[#2B4C6F] border border-[#DDE7F0] hover:border-[#8FA8C8]";

  const content = (
    <motion.span
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${styleClasses}`}
      style={{ borderRadius: '12px', ...fontInter }}
    >
      {icon}
      <span>{title}</span>
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="block w-full">
      {content}
    </button>
  );
}

export function SpringShowcase() {
  const [event, setEvent] = useState<ShowcaseEvent>(fallbackEvent);
  const [copiedState, setCopiedState] = useState<'invite' | 'link' | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchShowcase() {
      try {
        const supabase = await loadSupabase();
        const { data, error } = await supabase
          .from('events')
          .select('slug, date, display_time, location, address')
          .eq('slug', springShowcaseSlug)
          .abortSignal(controller.signal)
          .single();

        if (error) throw error;
        if (!data || cancelled) return;

        const fullDate = parseEventDate(data.date, data.display_time || '7:30 PM');

        setEvent({
          slug: data.slug,
          title: springShowcaseTitle,
          dateLabel: formatEventDate(fullDate),
          rawDate: data.date,
          time: data.display_time || '7:30 PM',
          location: data.location || fallbackEvent.location,
          address: data.address || fallbackEvent.address,
          description: showcaseDescription,
          imageUrl: showcasePhoto,
          fullDate,
        });
      } catch (error) {
        if (!cancelled) console.error('Error fetching showcase:', error);
      }
    }

    void fetchShowcase();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const shareUrl = toAbsoluteUrl(springShowcasePath);
  const shareMessage = 'Join Vocal U for their Spring Showcase 2026!';
  const shareBody = `${shareMessage} ${event.dateLabel} at ${event.time} in ${event.location}. ${shareUrl}`;
  const calendarUrl = useMemo(() => getGoogleCalendarUrl({
    title: event.title,
    start: event.fullDate,
    description: `${shareMessage} ${event.description}`,
    location: `${event.location} ${event.address}`,
  }), [event]);
  const navigationUrl = useMemo(
    () =>
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${event.location} ${event.address}`
      )}`,
    [event]
  );

  const showcaseSchema = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: event.title,
    description: inviteDescription,
    url: shareUrl,
    image: [toAbsoluteUrl('/og/spring-showcase-2026.jpg')],
    startDate: event.fullDate.toISOString(),
    eventStatus: isEventUpcoming(event.fullDate)
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventCompleted',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address,
        addressLocality: 'Minneapolis',
        addressRegion: 'MN',
        addressCountry: 'US',
      },
    },
    performer: {
      '@id': toAbsoluteUrl('/#organization'),
    },
    organizer: {
      '@id': toAbsoluteUrl('/#organization'),
    },
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareMessage,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }

    if (await copyText(shareUrl)) {
      setCopiedState('link');
      window.setTimeout(() => setCopiedState(null), 2200);
    }
  };

  const handleCopyInvite = async () => {
    if (await copyText(shareBody)) {
      setCopiedState('invite');
      window.setTimeout(() => setCopiedState(null), 2200);
    }
  };

  return (
    <PageTransition className="pb-24">
      <Seo
        title={springShowcaseTitle}
        description={inviteDescription}
        path={springShowcasePath}
        image="/og/spring-showcase-2026.jpg"
        keywords={['Vocal U Spring Showcase', 'Spring Showcase 2026', 'UMN a cappella showcase']}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: 'Showcase', path: springShowcasePath },
        ]}
        schema={showcaseSchema}
      />

      <section className="mt-8 w-full md:mt-12">
        <motion.div whileHover={{ x: -4 }} className="inline-block mb-6 md:mb-8">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-[#6F8BA8] font-medium transition-colors hover:text-[#2B4C6F]"
            style={fontInter}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </motion.div>

        {/* Main Invite Card */}
        <motion.div
          className="bg-white border border-gray-100 overflow-hidden relative flex flex-col md:flex-row"
          style={{ borderRadius: '16px' }}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <BloomingFlowers />

          {/* Left: Top/Side Banner Background */}
          <div className="relative h-64 sm:h-80 md:h-auto md:w-[45%] lg:w-[45%] shrink-0 bg-[#f8fbff]">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
            {/* Elegant gradient blending into content */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none md:hidden"></div>
            <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

            {/* "You're Invited" floating badge */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 md:top-8 md:left-8">
              <span
                className="bg-white/95 text-[#2B4C6F] px-4 py-2 text-[12px] font-yearbook border border-white"
                style={{ borderRadius: '12px', ...fontInter, fontWeight: 700 }}
              >
                YOU&apos;RE INVITED!
              </span>
            </div>
          </div>

          {/* Right: Invitation Content */}
          <div className="px-6 py-8 sm:px-12 md:px-10 lg:px-14 sm:py-12 md:py-16 flex-1 flex flex-col items-center md:items-start text-center md:text-left relative z-20">

            <div className="relative inline-block w-full">
              <h1
                className="text-[#2B4C6F] leading-tight flex flex-col items-center md:items-start"
                style={{ ...fontYearbook, fontSize: 'clamp(38px, 5.5vw, 64px)', letterSpacing: '0.02em' }}
              >
                <span>Vocal U</span>
                <span className="text-[#8FA8C8] text-[0.85em] mt-1 md:mt-2 relative inline-flex items-center justify-center md:justify-start">
                  Spring Showcase
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopyInvite}
                    className="absolute -right-10 md:-right-14 text-[#A3B8D3] hover:text-[#2B4C6F] p-2"
                    title="Copy full invite details"
                  >
                    {copiedState === 'invite' ? <Check className="h-5 w-5 md:h-6 md:w-6 text-green-500" /> : <Copy className="h-5 w-5 md:h-6 md:w-6" />}
                  </motion.button>
                </span>
              </h1>
            </div>

            {/* Clean Information List (No boxes) */}
            <div className="mt-6 md:mt-8 flex flex-col gap-5 sm:gap-6 w-full relative z-20">
              {/* Date & Time */}
              <div className="flex items-center md:justify-start gap-4 group cursor-default">
                 <div className="flex items-center justify-center p-3 bg-[#EEF4FA] text-[#8FA8C8] rounded-full shrink-0 transition-colors group-hover:bg-[#8FA8C8]/15 group-hover:text-[#2B4C6F]">
                   <Calendar className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:scale-110" />
                 </div>
                 <div className="flex flex-col items-start text-left">
                   <div className="font-bold text-[#2B4C6F] text-[15px] sm:text-[17px] leading-none mb-1 md:mb-1.5">{event.dateLabel}</div>
                   <div className="font-medium text-[#2B4C6F]/70 text-[14px] sm:text-[15px] leading-none">{event.time}</div>
                 </div>
              </div>

              {/* Location & Address */}
              <div className="flex items-center md:justify-start gap-4 group cursor-default">
                 <div className="flex items-center justify-center p-3 bg-[#EEF4FA] text-[#8FA8C8] rounded-full shrink-0 transition-colors group-hover:bg-[#8FA8C8]/15 group-hover:text-[#2B4C6F]">
                   <MapPin className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:scale-110" />
                 </div>
                 <div className="flex flex-col items-start text-left">
                   <div className="font-bold text-[#2B4C6F] text-[15px] sm:text-[17px] leading-none mb-1 md:mb-1.5">{event.location}</div>
                   <div className="font-medium text-[#2B4C6F]/70 text-[14px] sm:text-[15px] leading-snug lg:whitespace-nowrap">{event.address}</div>
                 </div>
              </div>
            </div>

            {/* Buttons Above Description */}
            <div className="mt-8 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-20">
                <ActionButton
                  href={calendarUrl}
                  title="Add to Calendar"
                  icon={<Calendar className="h-4 w-4" />}
                  primary={true}
                />
                <ActionButton
                  href={navigationUrl}
                  title="Navigate to Venue"
                  icon={<Navigation className="h-4 w-4" />}
                />
                <div className="sm:col-span-2">
                  <ActionButton
                    onClick={handleShare}
                    title={copiedState === 'link' ? 'Copied Link' : 'Share Invite'}
                    icon={<Share2 className="h-4 w-4" />}
                  />
                </div>
            </div>

            {/* Description */}
            <div className="mt-8 md:mt-10 max-w-2xl border-t border-[#DDE7F0] pt-8 md:pt-10">
              <p className="text-[#2B4C6F]/80 leading-relaxed text-[16px] sm:text-[17px] md:text-[18px]" style={fontInter}>
                {event.description}
              </p>
              <p className="font-bold text-[#2B4C6F] text-[16px] sm:text-[17px] md:text-[18px] mt-4" style={fontInter}>
                {welcomeLine}
              </p>
            </div>

          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
