import heroBackground from 'figma:asset/15a7da513ab99cbb57e9735db4d4d232088838f1.png';
import fullLogo from 'figma:asset/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';
import groupPhoto from 'figma:asset/8b7d52033414d4d2f0999bc47a30f6af9f485f36.png';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
import { supabase } from '../utils/supabase';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };

interface FeaturedEvent {
  tag: string;
  date: string;
  title: string;
  location: string;
  link: string;
  image: string;
}

function EventCard({ event }: { event: FeaturedEvent }) {
  return (
    <Link
      to={event.link}
      className="group bg-white overflow-hidden border border-white/20 transition-all hover:bg-gray-50 active:scale-[0.98] flex flex-col"
      style={{ borderRadius: '24px' }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span
            className="bg-[#8FA8C8] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm"
            style={{ borderRadius: '8px', ...fontYearbook }}
          >
            {event.tag}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-[#8FA8C8] mb-2 text-xs font-bold" style={fontInter}>
          <Calendar className="w-3.5 h-3.5" />
          {event.date}
        </div>
        <h3
          className="text-[#2B4C6F] mb-3 text-xl leading-tight group-hover:text-[#8FA8C8] transition-colors"
          style={fontYearbook}
        >
          {event.title}
        </h3>
        <div className="mt-auto flex items-center gap-2 text-[#2B4C6F]/60 text-sm" style={fontInter}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </Link>
  );
}

export function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);

  useEffect(() => {
    async function fetchFeaturedEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .limit(3);

      if (error) {
        console.error('Error fetching featured events:', error);
      } else {
        const formatted = data.map((r: any) => ({
          tag: r.tag,
            date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          title: r.title,
          location: r.location,
          link: `/event/${r.slug}`,
          image: r.image_url,
        }));
        setFeaturedEvents(formatted);
      }
    }

    fetchFeaturedEvents();
  }, []);

  return (
    <div className="pb-0">
      {/* Hero Section */}
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="relative overflow-hidden shadow-xl"
          style={{ borderRadius: '20px', height: '576px' }}
        >
          <img
            src={heroBackground}
            alt="Vocal U Group"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(1.08) saturate(1.05)' }}
          />
          <div className="absolute inset-0 flex flex-col justify-between items-center py-8 md:py-12 px-4">
            <div className="flex-shrink-0">
              <img
                src={fullLogo}
                alt="Vocal U - University of Minnesota's Premier A Cappella Group"
                className="w-full max-w-[264px] md:max-w-[330px]"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
              />
            </div>

            <div className="flex-grow" />

            <Link
              to="/event/spring-showcase-2026"
              className="bg-white text-[#2B4C6F] px-8 md:px-12 py-3 md:py-4 shadow-lg hover:bg-gray-100 transition-all flex-shrink-0 hover:scale-[1.08] hover:-translate-y-1 active:scale-[0.98] text-center"
              style={{
                ...fontYearbook,
                fontSize: 'clamp(16px, 2vw, 20px)',
                letterSpacing: '0.05em',
                borderRadius: '20px',
              }}
            >
              SPRING SHOWCASE
            </Link>
          </div>
        </div>
      </section>

      {/* We Are Vocal U Section */}
      <section
        className="bg-gray-100 shadow-lg p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 items-center"
        style={{ gap: '25px', marginBottom: '25px', borderRadius: '20px' }}
      >
        <div>
          <h2 className="mb-6 md:mb-8 whitespace-nowrap">
            <span
              className="text-[#A3B8D3]"
              style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 56px)' }}
            >
              WE ARE{' '}
            </span>
            <span
              className="text-[#2B4C6F]"
              style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 56px)' }}
            >
              VOCAL U
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

          <Link
            to="/about"
            className="inline-flex items-center gap-2 bg-[#8FA8C8] text-white px-8 py-3 shadow-lg hover:bg-[#7A97B7] transition-all hover:translate-x-1"
            style={{ ...fontYearbook, fontSize: '18px', letterSpacing: '0.05em', borderRadius: '20px' }}
          >
            LEARN MORE
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div
          className="overflow-hidden shadow-xl hover:scale-[1.02] transition-transform"
          style={{ borderRadius: '20px' }}
        >
          <img
            src={groupPhoto}
            alt="Vocal U Group Members"
            className="w-full h-[300px] md:h-[500px] object-cover"
            style={{ filter: 'brightness(1.08) saturate(1.05)' }}
            loading="lazy"
          />
        </div>
      </section>

      {/* Events Section */}
      <section
        className="relative py-16 md:py-24 px-6 md:px-12 mx-3 md:mx-0"
        style={{
          marginBottom: '25px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #91a8c6 0%, #7A97B7 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="text-white"
              style={{
                ...fontYearbook,
                fontSize: 'clamp(64px, 12vw, 120px)',
                letterSpacing: '0.05em',
              }}
            >
              EVENTS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {featuredEvents.map((event, idx) => (
              <EventCard key={idx} event={event} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/events">
              <button
                className="inline-flex items-center gap-3 bg-white text-[#2B4C6F] px-12 py-5 shadow-2xl hover:bg-gray-50 hover:scale-105 hover:-translate-y-1 transition-all"
                style={{ ...fontYearbook, fontSize: '22px', letterSpacing: '0.05em', borderRadius: '25px' }}
              >
                <span>VIEW ALL EVENTS</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="mx-3 md:mx-0" style={{ marginBottom: '25px' }}>
        <ContactForm />
      </section>

      <Footer />
    </div>
  );
}
