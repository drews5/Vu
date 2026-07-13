import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Copy, MapPin, Navigation, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';
import { loadSupabase } from '../utils/loadSupabase';
import { springShowcasePath, springShowcaseSlug, springShowcaseTitle } from '../utils/eventRoutes';
import { getGoogleCalendarUrl, isEventUpcoming, parseEventDate } from '../utils/eventDate';

const fontInter = { fontFamily: 'Inter, sans-serif' };
const inviteDescription =
  'Our annual Spring Showcase is back! Join us for an evening of a cappella. Friends, family, students, and the community are welcome.';
const archiveDescription =
  'Event details and archive for Vocal U’s 2026 Spring Showcase at the University of Minnesota.';
const showcaseDescription = 'Our annual Spring Showcase is back! Join us for an evening of a cappella.';
const welcomeLine = 'Friends, family, students, and the community are welcome.';
const showcasePhoto = '/og/spring-showcase-2026.jpg';

type ShowcaseEvent = {
  title: string;
  dateLabel: string;
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
  title: springShowcaseTitle,
  dateLabel: formatEventDate(fallbackDate),
  time: '7:30 PM',
  location: 'Cowles Auditorium',
  address: 'Humphrey School of Public Affairs, 301 19th Ave S, Minneapolis, MN 55455',
  description: showcaseDescription,
  imageUrl: showcasePhoto,
  fullDate: fallbackDate,
};

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to a temporary textarea for older browsers.
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', 'true');
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textArea);
  return copied;
}

function ActionButton({
  href,
  onClick,
  title,
  icon,
}: {
  href?: string;
  onClick?: () => void;
  title: string;
  icon: ReactNode;
}) {
  const content = (
    <span
      className="group flex min-h-[56px] items-center justify-center gap-2 rounded-xl border border-[#d7e1ec] bg-white px-3 py-3 text-center text-[#2e4c6d] transition-colors duration-200 hover:border-[#91a8c6] hover:bg-[#f4f7fa]"
      style={{ ...fontInter, fontSize: '13px', fontWeight: 700, lineHeight: '1.2' }}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF4FA] text-[#6F8BA8] transition-colors group-hover:bg-[#E1ECF7] group-hover:text-[#2B4C6F]">
        {icon}
      </span>
      {title}
    </span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="block w-full cursor-pointer">
      {content}
    </button>
  );
}

export function SpringShowcase() {
  const [event, setEvent] = useState<ShowcaseEvent>(fallbackEvent);
  const [copiedState, setCopiedState] = useState<'invite' | 'link' | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchShowcase() {
      const supabase = await loadSupabase();
      const { data, error } = await supabase
        .from('events')
        .select('date,display_time,location,address')
        .eq('slug', springShowcaseSlug)
        .single();

      if (error || !data || cancelled) {
        if (error) {
          console.error('Error fetching showcase:', error);
        }

        return;
      }

      const fullDate = parseEventDate(data.date, data.display_time || '7:30 PM');

      setEvent({
        title: springShowcaseTitle,
        dateLabel: formatEventDate(fullDate),
        time: data.display_time || '7:30 PM',
        location: data.location || fallbackEvent.location,
        address: data.address || fallbackEvent.address,
        description: showcaseDescription,
        imageUrl: showcasePhoto,
        fullDate,
      });
    }

    void fetchShowcase();

    return () => {
      cancelled = true;
    };
  }, []);

  const shareUrl = toAbsoluteUrl(springShowcasePath);
  const isUpcoming = isEventUpcoming(event.fullDate);
  const pageDescription = isUpcoming ? inviteDescription : archiveDescription;
  const shareMessage = isUpcoming
    ? 'Join Vocal U for our Spring Showcase 2026!'
    : 'Vocal U Spring Showcase 2026 event details.';
  const shareBody = `${shareMessage} ${event.dateLabel} at ${event.time} in ${event.location}. ${shareUrl}`;
  const calendarUrl = useMemo(() => {
    return getGoogleCalendarUrl({
      title: event.title,
      start: event.fullDate,
      description: `${shareMessage} ${event.description}`,
      location: `${event.location}, ${event.address}`,
    });
  }, [event, shareMessage]);
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
    description: pageDescription,
    url: shareUrl,
    image: [toAbsoluteUrl('/og/spring-showcase-2026.jpg')],
    startDate: event.fullDate.toISOString(),
    eventStatus: isUpcoming
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
    <PageShell className="pb-20 md:pb-28">
      <Seo
        title={springShowcaseTitle}
        description={pageDescription}
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

      <section className="mt-8 md:mt-10">
        <div className="overflow-hidden rounded-[30px] border border-[#DDE7F0] bg-white p-5 shadow-sm md:p-7 lg:p-8">
          <Link
            to="/events"
            className="mb-5 inline-flex items-center gap-2 text-[#6F8BA8] transition-colors hover:text-[#2B4C6F]"
            style={fontInter}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          <div className="lg:grid lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)] lg:items-stretch lg:gap-8">
            <div className="overflow-hidden rounded-[24px] border border-[#E6EDF5] bg-white shadow-sm">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-[190px] w-full object-cover sm:h-[280px] lg:h-full lg:min-h-[560px]"
                style={{ objectPosition: 'center 42%' }}
              />
            </div>

            <div className="mt-8 flex flex-col md:mt-10 lg:mt-0 lg:justify-center">
              <div
                className="mb-4 inline-flex w-fit items-center rounded-full border border-[#D7E1EC] bg-white px-3 py-1.5 text-[#6F8BA8] shadow-sm md:mb-5"
                style={{ ...fontInter, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em' }}
              >
                {isUpcoming ? 'You’re invited' : 'Event archive'}
              </div>

              <div className="flex items-start justify-between gap-3">
                <h1
                  className="text-[#2B4C6F]"
                  style={{ ...fontYearbook, fontSize: 'clamp(28px, 6vw, 72px)', lineHeight: '1', letterSpacing: '0.04em' }}
                >
                  <span className="block">Vocal U</span>
                  <span className="mt-1 block sm:mt-2">Spring Showcase</span>
                </h1>
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center text-[#6F8BA8] transition-colors hover:text-[#2B4C6F]"
                  aria-label={copiedState === 'invite' ? 'Invite copied' : 'Copy invite'}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-2.5 text-[#2B4C6F]/78 md:mt-7" style={{ ...fontInter, fontSize: '14px', lineHeight: '1.45' }}>
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#8FA8C8]" />
                  <span>
                    {event.dateLabel}
                    <br />
                    {event.time}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8FA8C8]" />
                  <span>
                    {event.location}
                    <br />
                    {event.address}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <ActionButton
                  href={calendarUrl}
                  title="Add to calendar"
                  icon={<Calendar className="h-4 w-4" />}
                />
                <ActionButton
                  href={navigationUrl}
                  title="Navigate"
                  icon={<Navigation className="h-4 w-4" />}
                />
                <ActionButton
                  onClick={handleShare}
                  title={copiedState === 'link' ? 'Link copied' : 'Share'}
                  icon={<Share2 className="h-4 w-4" />}
                />
              </div>

              <p className="mt-6 max-w-2xl text-[#2B4C6F]/80" style={{ ...fontInter, fontSize: '15px', lineHeight: '1.65' }}>
                {event.description}
              </p>
              {isUpcoming && (
                <p className="mt-2 text-[#2B4C6F]" style={{ ...fontInter, fontSize: '15px', fontWeight: 600, lineHeight: '1.5' }}>
                  {welcomeLine}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
