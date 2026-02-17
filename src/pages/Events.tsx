import { useEffect, useState, memo } from 'react';
import { Calendar, MapPin, ArrowRight, Clock, Share2, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };

interface Event {
  id: string;
  slug: string;
  date: string;
  year: string;
  title: string;
  time: string;
  location: string;
  address?: string;
  description: string;
  image: string;
  status: 'Upcoming' | 'Previous';
  fullDate?: Date;
}

const UnifiedEventCard = memo(function UnifiedEventCard({ event }: { event: Event }) {
  const isUpcoming = event.status === 'Upcoming';
  
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/event/${event.slug}`;
    const shareTitle = event.title;
    const shareText = `Check out ${event.title} by Vocal U!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          // Fallback if share fails
          navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Clipboard error:', err);
        alert('Could not copy link. Please copy the URL from your browser.');
      }
    }
  };

  const getCalendarUrl = () => {
    if (!event.fullDate) return '#';

    const title = encodeURIComponent(event.title);
    const location = encodeURIComponent(`${event.location} ${event.address || ''}`);
    const details = encodeURIComponent(event.description);
    
    // Create Google Calendar link
    const startDate = event.fullDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(event.fullDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  const getNavigationUrl = () => {
    const query = encodeURIComponent(`${event.location} ${event.address || ''}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="relative">
      <Link 
        to={`/event/${event.slug}`}
        className={`group bg-white overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col md:flex-row h-full md:min-h-64 ${
          isUpcoming ? 'ring-2 ring-[#8FA8C8]/20 shadow-xl' : 'shadow-lg'
        }`}
        style={{ borderRadius: '24px' }}
      >
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-48 md:h-auto overflow-hidden shrink-0">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <span className="text-white text-sm font-black flex items-center gap-2">
              VIEW DETAILS <ArrowRight className="w-4 h-4" />
            </span>
          </div>
          {isUpcoming && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#8FA8C8] text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] border border-white/20" style={fontYearbook}>
                UPCOMING
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 pb-20 md:pb-24 flex flex-col flex-grow justify-center relative bg-white">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2 text-[#8FA8C8] font-bold text-xs tracking-widest" style={fontInter}>
              <Calendar className="w-3.5 h-3.5" />
              {event.date}, {event.year}
            </div>
            <h3 className="text-[#2B4C6F] text-2xl md:text-3xl leading-tight group-hover:text-[#8FA8C8] transition-colors" style={fontYearbook}>
              {event.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-y-2 gap-x-6 text-[#2B4C6F]/60 text-sm mb-4" style={fontInter}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8FA8C8]/60" />
              {event.time}
            </div>
            <div className="flex items-center gap-2 max-w-xs">
              <MapPin className="w-4 h-4 text-[#8FA8C8]/60 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <p className="text-[#2B4C6F]/70 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed max-w-2xl" style={fontInter}>
            {event.description}
          </p>
        </div>
      </Link>

      {/* Action Buttons Layered Over */}
      {isUpcoming && (
        <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:right-8 md:left-auto flex flex-wrap gap-3 z-10">
          <a 
            href={getCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#8FA8C8] px-4 py-2.5 rounded-full hover:bg-[#8FA8C8] hover:text-white transition-all shadow-md border border-[#8FA8C8]/20 group/btn"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={fontInter}>Add to Calendar</span>
          </a>
          <a 
            href={getNavigationUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#8FA8C8] px-4 py-2.5 rounded-full hover:bg-[#8FA8C8] hover:text-white transition-all shadow-md border border-[#8FA8C8]/20"
          >
            <Navigation className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={fontInter}>Navigate</span>
          </a>
          <button 
            onClick={handleShare}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#8FA8C8] px-4 py-2.5 rounded-full hover:bg-[#8FA8C8] hover:text-white transition-all shadow-md border border-[#8FA8C8]/20"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={fontInter}>Share</span>
          </button>
        </div>
      )}
    </div>
  );
});

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        const formatted = data.map((r: any) => {
          const d = new Date(r.date);
          return {
            id: r.id,
            slug: r.slug,
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            year: d.getFullYear().toString(),
            title: r.title,
            time: r.display_time || d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: r.location,
            address: r.address,
            description: r.description,
            image: r.image_url,
            status: r.status,
            fullDate: d,
          };
        });
        setEvents(formatted);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(e => e.status === 'Upcoming');
  const pastEvents = events.filter(e => e.status === 'Previous');

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FA8C8]" />
      </div>
    );
  }

  return (
    <div className="pb-16 md:pb-24">
      {/* Hero Section */}
      <section style={{ marginTop: '25px', marginBottom: '40px' }}>
        <div
          className="bg-[#8FA8C8] shadow-2xl py-20 md:py-32 px-4 md:px-8 overflow-hidden relative"
          style={{ borderRadius: '24px' }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h1
                      className="text-white mb-6"
                      style={{ ...fontYearbook, fontSize: 'clamp(56px, 12vw, 110px)', letterSpacing: '0.05em', lineHeight: '0.9' }}
                    >
                      OUR EVENTS
                    </h1>
            <p className="text-white/90 max-w-2xl mx-auto font-medium tracking-wide text-sm md:text-lg" style={fontInter}>
              Join us for live performances, workshops, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-6 mb-10 px-4 md:px-0">
            <h2
              className="text-[#2B4C6F] shrink-0"
              style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}
            >
              UPCOMING
            </h2>
            <div className="h-[2px] w-full bg-[#8FA8C8]/20 rounded-full" />
          </div>
          <div className="flex flex-col gap-8">
            {upcomingEvents.map((event) => (
              <UnifiedEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Past Performances */}
      <section>
        <div className="flex items-center gap-6 mb-10 px-4 md:px-0">
          <h2
            className="text-[#2B4C6F] shrink-0 opacity-60"
            style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}
          >
            PAST EVENTS
          </h2>
          <div className="h-[2px] w-full bg-[#8FA8C8]/10 rounded-full" />
        </div>
        <div className="flex flex-col gap-8">
          {pastEvents.map((event) => (
            <UnifiedEventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
