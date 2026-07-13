import { memo, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Copy, MapPin, Navigation, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { PageShell } from '../components/PageShell';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { getGoogleCalendarUrl, isEventUpcoming, parseEventDate } from '../utils/eventDate';
import { getEventImage } from '../utils/eventImages';
import { getEventDisplayTitle, getEventPath } from '../utils/eventRoutes';
import { loadSupabase } from '../utils/loadSupabase';

type Event = {
  id: string;
  slug: string;
  dateLabel: string;
  title: string;
  time: string;
  location: string;
  address?: string;
  description: string;
  image: string;
  status: 'Upcoming' | 'Previous';
  fullDate: Date;
};

type EventRow = {
  id: string;
  slug: string;
  date: string;
  title: string;
  display_time: string | null;
  location: string;
  address: string | null;
  description: string;
  image_url: string;
};

const EventActions = memo(function EventActions({ event }: { event: Event }) {
  const [message, setMessage] = useState('');
  const eventPath = getEventPath(event.slug);
  const eventUrl = `${window.location.origin}${eventPath}`;
  const location = `${event.location}${event.address ? `, ${event.address}` : ''}`;
  const calendarUrl = getGoogleCalendarUrl({
    title: event.title,
    start: event.fullDate,
    description: event.description,
    location,
  });
  const navigationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const showMessage = (nextMessage: string) => {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(''), 2000);
  };

  const copyInfo = async () => {
    const info = `Come see Vocal U at ${event.title} on ${event.dateLabel} at ${event.time}, ${event.location}. ${eventUrl}`;
    try {
      await navigator.clipboard.writeText(info);
      showMessage('Event details copied');
    } catch {
      showMessage('Copy failed');
    }
  };

  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text: `See ${event.title} with Vocal U.`, url: eventUrl });
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(eventUrl);
      showMessage('Event link copied');
    } catch {
      showMessage('Copy failed');
    }
  };

  const actionClass =
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#dce5ed] bg-white px-3 py-2 text-xs font-semibold text-[#2e4c6d] transition-colors hover:border-[#91a8c6] hover:bg-[#f4f7fa]';

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
          <Calendar className="h-3.5 w-3.5 text-[#7895b7]" aria-hidden="true" />
          Add to calendar
        </a>
        <a href={navigationUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
          <Navigation className="h-3.5 w-3.5 text-[#7895b7]" aria-hidden="true" />
          Directions
        </a>
        <button type="button" onClick={shareEvent} className={actionClass}>
          <Share2 className="h-3.5 w-3.5 text-[#7895b7]" aria-hidden="true" />
          Share
        </button>
        <button type="button" onClick={copyInfo} className={actionClass}>
          <Copy className="h-3.5 w-3.5 text-[#7895b7]" aria-hidden="true" />
          Copy details
        </button>
      </div>
      <p className="mt-2 min-h-5 text-xs text-[#2e4c6d]/65" aria-live="polite">
        {message}
      </p>
    </div>
  );
});

const UpcomingEventCard = memo(function UpcomingEventCard({ event }: { event: Event }) {
  const eventPath = getEventPath(event.slug);

  return (
    <motion.article whileHover={{ y: -4, rotate: 0.15 }} className="overflow-hidden rounded-[24px] border border-[#dce5ed] bg-white shadow-[0_12px_32px_rgba(35,61,85,0.08)] md:grid md:grid-cols-[320px_minmax(0,1fr)]">
      <Link to={eventPath} className="group relative block min-h-[220px] overflow-hidden bg-[#eef3f7] md:min-h-full">
        <img
          src={event.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute left-4 top-4 rounded-lg bg-[#2e4c6d] px-2.5 py-1 text-xs font-semibold text-white">
          Upcoming
        </span>
        <span className="sr-only">View {event.title}</span>
      </Link>

      <div className="flex flex-col justify-center p-6 md:p-8">
        <time dateTime={event.fullDate.toISOString()} className="flex items-center gap-2 text-xs font-semibold text-[#7895b7]">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {event.dateLabel}
        </time>
        <h3 className="mt-2 text-3xl leading-tight text-[#2e4c6d]">
          <Link to={eventPath} className="transition-colors hover:text-[#7895b7]">
            {event.title}
          </Link>
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#2e4c6d]/65">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#7895b7]" aria-hidden="true" />
            {event.time}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#7895b7]" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </span>
        </div>
        <p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-6 text-[#2e4c6d]/72">{event.description}</p>
        <div className="mt-5">
          <EventActions event={event} />
        </div>
      </div>
    </motion.article>
  );
});

const PastEventCard = memo(function PastEventCard({ event }: { event: Event }) {
  return (
    <motion.article whileHover={{ y: -7, rotate: 0.45 }} whileTap={{ scale: 0.985 }} className="group h-full overflow-hidden rounded-[22px] border border-[#dce5ed] bg-white shadow-[0_8px_24px_rgba(35,61,85,0.07)] transition-[border-color,box-shadow] hover:border-[#91a8c6] hover:shadow-[0_18px_36px_rgba(35,61,85,0.14)]">
      <Link to={getEventPath(event.slug)} className="flex h-full flex-col">
        <div className="aspect-video overflow-hidden bg-[#eef3f7]">
          <img src={event.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <time dateTime={event.fullDate.toISOString()} className="text-xs font-semibold text-[#7895b7]">{event.dateLabel}</time>
          <h3 className="mt-2 text-xl leading-tight text-[#2e4c6d] transition-colors group-hover:text-[#7895b7]">{event.title}</h3>
          <p className="mt-auto pt-4 text-sm text-[#2e4c6d]/60">{event.location}</p>
        </div>
      </Link>
    </motion.article>
  );
});

export function Events() {
  const eventsDescription =
    'See upcoming Vocal U performances, showcases, competitions, and past events from the University of Minnesota a cappella group.';
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      try {
        const supabase = await loadSupabase();
        const { data, error } = await supabase
          .from('events')
          .select('id,slug,date,title,display_time,location,address,description,image_url')
          .order('date', { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        const formatted = ((data || []) as EventRow[]).map((row) => {
          const fullDate = parseEventDate(row.date, row.display_time);
          return {
            id: row.id,
            slug: row.slug,
            dateLabel: fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            title: getEventDisplayTitle(row.slug, row.title),
            time: row.display_time || fullDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            location: row.location,
            address: row.address || undefined,
            description: row.description,
            image: getEventImage(row.slug, row.image_url),
            status: isEventUpcoming(fullDate) ? 'Upcoming' as const : 'Previous' as const,
            fullDate,
          };
        });

        setEvents(formatted);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcomingEvents = events
    .filter((event) => event.status === 'Upcoming')
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
  const pastEvents = events
    .filter((event) => event.status === 'Previous')
    .sort((a, b) => b.fullDate.getTime() - a.fullDate.getTime());
  const eventsSchema: Array<Record<string, unknown>> = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Vocal U Events',
      description: eventsDescription,
      url: toAbsoluteUrl('/events'),
      about: { '@id': toAbsoluteUrl('/#organization') },
    },
  ];

  if (events.length > 0) {
    eventsSchema.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Vocal U Events',
      itemListElement: events.map((event, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: toAbsoluteUrl(getEventPath(event.slug)),
        name: event.title,
      })),
    });
  }

  return (
    <PageShell className="min-h-screen pb-8 md:pb-16">
      <Seo
        title="Vocal U Events"
        description={eventsDescription}
        path="/events"
        keywords={['Vocal U events', 'UMN a cappella performances', 'Minneapolis a cappella events']}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Events', path: '/events' }]}
        schema={eventsSchema}
      />

      <PageHero
        title="Events"
        eyebrow="Come hear us live"
        description="Competitions, campus gigs, showcases, and the occasional delightfully unexpected performance."
        stamp="On stage"
      />

      <div className="mx-auto max-w-6xl space-y-14">
        {loading ? (
          <div className="flex justify-center py-20" role="status">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#91a8c6]/30 border-t-[#2e4c6d]" />
            <span className="sr-only">Loading events</span>
          </div>
        ) : (
          <>
            <section>
              <div className="mb-7 flex items-center gap-4">
                <h2 className="whitespace-nowrap text-3xl text-[#2e4c6d]">Upcoming events</h2>
                <div className="h-px flex-1 bg-[#dce5ed]" />
              </div>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-6">
                  {upcomingEvents.map((event) => <UpcomingEventCard key={event.id} event={event} />)}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#dce5ed] bg-[#f4f7fa] px-6 py-8 text-[#2e4c6d]/72">
                  No events are posted right now. Follow <a href="https://www.instagram.com/vocal_u" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#2e4c6d] underline decoration-[#91a8c6] underline-offset-4">@vocal_u</a> for the latest announcements.
                </div>
              )}
            </section>

            {pastEvents.length > 0 && (
              <section>
                <div className="mb-7 flex items-center gap-4">
                  <h2 className="whitespace-nowrap text-3xl text-[#2e4c6d]">Past events</h2>
                  <div className="h-px flex-1 bg-[#dce5ed]" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event) => <PastEventCard key={event.id} event={event} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
