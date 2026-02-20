import { Helmet } from 'react-helmet-async';
import fullLogo from 'figma:asset/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';
import heroBackground from 'figma:asset/15a7da513ab99cbb57e9735db4d4d232088838f1.png';
import ichsaPhoto from '../assets/ichsa-quarterfinal.jpg';
import showcasePhoto from '../assets/spring-showcase.jpg';
import groupPhoto from '../assets/group-photo.jpg';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
import { supabase } from '../utils/supabase';
import { motion } from 'motion/react';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };

interface FeaturedEvent {
  tag: string;
  date: string;
  title: string;
  location: string;
  link: string;
  image: string;
  isInstagram?: boolean;
}

function EventCard({ event }: { event: FeaturedEvent }) {
  const content = (
    <>
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span
            className="bg-[#8FA8C8] text-white px-3 py-1 text-[10px] tracking-widest font-yearbook"
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
  const carouselRef = useRef<HTMLDivElement>(null);

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

      const pastEvents = processed.filter((e: any) => e.status === 'Previous').sort((a: any, b: any) => b.fullDate.getTime() - a.fullDate.getTime());
      const upcomingEvents = processed.filter((e: any) => e.status === 'Upcoming').sort((a: any, b: any) => a.fullDate.getTime() - b.fullDate.getTime());

      const selected = [
        ...(pastEvents.length > 0 ? [pastEvents[0]] : []),
        ...upcomingEvents.slice(0, 2)
      ];

      const formattedEvents = selected.map((r: any) => ({
        tag: r.tag || (r.status === 'Upcoming' ? 'Upcoming' : 'Past Event'),
        date: r.fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: r.title,
        location: r.location,
        link: `/event/${r.slug}`,
        image: r.slug === 'ichsa-quarterfinal-4-2026' ? ichsaPhoto :
          r.slug === 'spring-showcase-2026' ? showcasePhoto :
            r.image_url,
      }));

      setItems(formattedEvents);
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

  return (
    <div className="pb-0">
      <Helmet>
        <title>Vocal U A Cappella | Home | UMN Minneapolis</title>
        <meta name="description" content="Official home of Vocal U A Cappella at the University of Minnesota. Explore our music, meet our members, and find upcoming performances in Minneapolis." />
        <link rel="canonical" href="https://vocalu.org/" />
      </Helmet>
      {/* Hero Section */}
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="relative overflow-hidden border border-gray-100 shadow-sm"
          style={{ borderRadius: '16px', height: '576px' }}
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
                alt="Vocal U - University of Minnesota's A Cappella Group"
                className="w-full max-w-[264px] md:max-w-[330px]"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
              />
            </div>

            <div className="flex-grow" />

            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 4px 6px rgba(0,0,0,0.1)",
                  "0 10px 15px rgba(0,0,0,0.2)",
                  "0 4px 6px rgba(0,0,0,0.1)"
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <a
                href="https://www.varsityvocals.com/events/2026-ichsa-gl-qf4-lakeville-hs"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#2B4C6F] px-8 md:px-12 py-3 md:py-4 border border-white hover:bg-[#8FA8C8] hover:text-white hover:border-[#8FA8C8] transition-all duration-300 flex-shrink-0 text-center block cursor-pointer font-yearbook shadow-md"
                style={{
                  ...fontYearbook,
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  letterSpacing: '0.05em',
                  borderRadius: '12px',
                }}
              >
                ICHSA 2026 Tickets
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* We Are Vocal U Section */}
      <section
        className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 items-center shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{ gap: '25px', marginBottom: '25px', borderRadius: '16px' }}
      >
        <div>
          <h2 className="mb-6 md:mb-8 whitespace-nowrap">
            <span
              className="text-[#A3B8D3] font-yearbook"
              style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 56px)' }}
            >
              We Are{' '}
            </span>
            <span
              className="text-[#2B4C6F] font-yearbook"
              style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 56px)' }}
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
      </section>

      {/* Events Section */}
      <section
        className="relative py-12 md:py-16 px-6 md:px-12 mx-3 md:mx-0"
        style={{
          marginBottom: '25px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #91a8c6 0%, #7A97B7 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2
              className="text-white mb-2 font-yearbook"
              style={{
                ...fontYearbook,
                fontSize: 'clamp(40px, 8vw, 80px)',
                letterSpacing: '0.05em',
              }}
            >
              Events
            </h2>
            <p className="text-white/90 font-normal tracking-wide text-xs md:text-base" style={fontInter}>
              Join us for live performances, competitions, and more.
            </p>
          </div>

          <div className="relative group/carousel px-4">
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex md:grid md:grid-cols-3 gap-6"
                style={{
                  display: 'flex',
                  width: '100%',
                }}
              >
                {items.map((event, idx) => (
                  <div key={idx} className="w-full shrink-0 px-2 md:px-0 md:shrink">
                    <EventCard event={event} />
                  </div>
                ))}
              </motion.div>
            </div>

            {items.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 bg-white/90 hover:bg-white text-[#2B4C6F] p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-20 md:hidden"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 bg-white/90 hover:bg-white text-[#2B4C6F] p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-20 md:hidden"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Pagination Dots for Mobile */}
            <div className="flex justify-center gap-2 mt-6 md:hidden">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-white w-4' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
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
      </section>

      {/* Contact Form Section */}
      <section className="mx-3 md:mx-0" style={{ marginBottom: '25px' }}>
        <ContactForm />
      </section>
    </div>
  );
}
