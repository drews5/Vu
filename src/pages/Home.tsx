import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import fullLogo from '../assets/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';
import heroBackground from '../assets/hero-group.webp';
import groupPhoto from '../assets/group-photo.webp';
import { PageShell } from '../components/PageShell';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { getEventImage } from '../utils/eventImages';
import { getEventDisplayTitle, getEventPath } from '../utils/eventRoutes';
import { loadSupabase } from '../utils/loadSupabase';
import { isEventUpcoming, parseEventDate } from '../utils/eventDate';

type FeaturedEvent = {
  slug: string;
  date: Date;
  dateLabel: string;
  title: string;
  location: string;
  image: string;
  status: 'Upcoming' | 'Previous';
};

type EventRow = {
  slug: string;
  date: string;
  title: string;
  location: string;
  image_url: string;
  display_time: string | null;
};

function EventCard({ event }: { event: FeaturedEvent }) {
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-[#dce5ed] bg-white transition-[border-color,box-shadow] duration-200 hover:border-[#91a8c6] hover:shadow-[0_14px_35px_rgba(35,61,85,0.12)]">
      <Link to={getEventPath(event.slug)} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#eef3f7]">
          <img
            src={event.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
          <span className="absolute left-4 top-4 rounded-lg bg-[#2e4c6d] px-2.5 py-1 text-xs font-semibold text-white">
            {event.status === 'Upcoming' ? 'Upcoming' : 'Past event'}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7895b7]">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={event.date.toISOString()}>{event.dateLabel}</time>
          </div>
          <h3 className="mt-2 text-2xl leading-tight text-[#2e4c6d] transition-colors group-hover:text-[#7895b7]">
            {event.title}
          </h3>
          <div className="mt-auto flex items-center gap-2 pt-5 text-sm text-[#2e4c6d]/62">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function Home() {
  const homeDescription =
    'Official site for Vocal U, the University of Minnesota gender-inclusive a cappella group. Explore performances, members, media, auditions, and ways to support the group.';
  const [events, setEvents] = useState<FeaturedEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventHeading, setEventHeading] = useState('Coming up');

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      try {
        const supabase = await loadSupabase();
        const { data, error } = await supabase
          .from('events')
          .select('slug,date,title,location,image_url,display_time')
          .order('date', { ascending: true });

        if (error) throw error;
        if (cancelled) return;

        const formatted = ((data || []) as EventRow[]).map((row) => {
          const date = parseEventDate(row.date, row.display_time);
          return {
            slug: row.slug,
            date,
            dateLabel: date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            title: getEventDisplayTitle(row.slug, row.title),
            location: row.location,
            image: getEventImage(row.slug, row.image_url),
            status: isEventUpcoming(date) ? 'Upcoming' as const : 'Previous' as const,
          };
        });

        const upcoming = formatted.filter((event) => event.status === 'Upcoming').slice(0, 3);
        const recent = formatted
          .filter((event) => event.status === 'Previous')
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 3);

        setEvents(upcoming.length > 0 ? upcoming : recent);
        setEventHeading(upcoming.length > 0 ? 'Coming up' : 'Recent performances');
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    }

    void fetchEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Vocal U Home',
    description: homeDescription,
    url: toAbsoluteUrl('/'),
    about: { '@id': toAbsoluteUrl('/#organization') },
  };

  return (
    <PageShell className="pb-0">
      <Seo
        title="Vocal U A Cappella | University of Minnesota A Cappella Group"
        description={homeDescription}
        path="/"
        keywords={['Vocal U Minneapolis', 'UMN gender-inclusive a cappella', 'Twin Cities vocal group']}
        schema={homeSchema}
      />

      <section className="relative left-1/2 min-h-[640px] w-screen -translate-x-1/2 overflow-hidden bg-[#2e4c6d] md:min-h-[720px] md:h-[min(100svh,920px)]">
        <img
          src={heroBackground}
          alt="Vocal U members together on the University of Minnesota campus"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#182d41]/25 via-transparent to-[#182d41]/82" />
        <div className="relative mx-auto flex h-full min-h-[640px] max-w-[1440px] flex-col items-center justify-end px-5 pb-12 pt-28 text-center text-white md:min-h-[720px] md:items-start md:px-[50px] md:pb-16 md:text-left">
          <img
            src={fullLogo}
            alt="Vocal U, University of Minnesota"
            className="w-[min(82vw,390px)] drop-shadow-[0_3px_14px_rgba(0,0,0,0.28)] md:w-[410px]"
          />
          <p className="mt-5 max-w-xl text-base leading-7 text-white/88 md:text-lg">
            Gender-inclusive a cappella at the University of Minnesota. We sing, compete, and build community across the Twin Cities.
          </p>
          <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
            <Link
              to="/auditions"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#2e4c6d] transition-colors hover:bg-[#eaf1f7]"
            >
              Audition sign-up
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/55 bg-[#2e4c6d]/20 px-6 py-3 font-semibold text-white backdrop-blur-[2px] transition-colors hover:bg-white/12"
            >
              Meet Vocal U
            </Link>
          </div>
        </div>
      </section>

      <section
        className="my-6 grid overflow-hidden rounded-2xl border border-[#dce5ed] bg-white lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="flex flex-col justify-center p-7 md:p-11 lg:p-12">
          <p className="text-sm font-semibold tracking-wide text-[#7895b7]">Since 2011</p>
          <h2 className="mt-2 text-[clamp(2.4rem,5vw,4rem)] leading-none text-[#2e4c6d]">We are Vocal U</h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-[#2e4c6d]/78 md:text-[17px]">
            <p>
              Vocal U brings together students from different majors, backgrounds, and musical experiences to make music that feels like us.
            </p>
            <p>
              We perform around campus and the Twin Cities, compete in the ICCA, and put on showcases that bring our friends, families, and community into the room.
            </p>
          </div>
          <Link to="/about" className="mt-7 inline-flex w-fit items-center gap-2 font-semibold text-[#2e4c6d] underline decoration-[#91a8c6] decoration-2 underline-offset-4 hover:text-[#7895b7]">
            More about the group
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <img
          src={groupPhoto}
          alt="Vocal U group members"
          className="h-[340px] w-full object-cover md:h-[480px] lg:h-full lg:min-h-[520px]"
          loading="lazy"
          decoding="async"
        />
      </section>

      <section className="rounded-2xl bg-[#91a8c6] px-5 py-10 md:px-10 md:py-13">
        <div className="flex flex-col gap-3 text-white md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/76">On stage</p>
            <h2 className="mt-1 text-[clamp(2.5rem,6vw,4.5rem)] leading-none">{eventHeading}</h2>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 font-semibold text-white underline decoration-white/45 underline-offset-4 hover:decoration-white">
            View all events
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-busy={eventsLoading}>
          {eventsLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="h-[340px] animate-pulse rounded-2xl bg-white/30" />
              ))
            : events.length > 0
              ? events.map((event) => <EventCard key={event.slug} event={event} />)
              : (
                  <div className="rounded-2xl bg-white/92 p-6 text-[#2e4c6d] md:col-span-2 lg:col-span-3">
                    New dates are announced on <a href="https://www.instagram.com/vocal_u" target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-[#91a8c6] underline-offset-4">Instagram</a>. Check back soon for the next performance.
                  </div>
                )}
        </div>
        {eventsLoading && <p className="sr-only" role="status">Loading events</p>}
      </section>

      <section
        className="mt-6 flex flex-col gap-6 rounded-2xl border border-[#dce5ed] bg-[#f4f7fa] p-7 md:flex-row md:items-center md:justify-between md:p-10"
      >
        <div>
          <h2 className="text-3xl text-[#2e4c6d] md:text-4xl">Bring Vocal U to your event</h2>
          <p className="mt-2 max-w-2xl leading-7 text-[#2e4c6d]/72">
            Planning a campus event, fundraiser, celebration, or collaboration? Tell us what you have in mind.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2e4c6d] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#7895b7]"
        >
          Contact us
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </PageShell>
  );
}
