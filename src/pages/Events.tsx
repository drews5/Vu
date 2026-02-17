import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
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
  description: string;
  image: string;
  status: 'Upcoming' | 'Previous';
}

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
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
            year: d.getFullYear().toString(),
            title: r.title,
            time: r.display_time || d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: r.location,
            description: r.description,
            image: r.image_url,
            status: r.status,
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
    <div className="pb-8 md:pb-16">
      {/* Hero Section */}
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="bg-[#8FA8C8] shadow-xl py-16 md:py-24 px-4 md:px-8"
          style={{ borderRadius: '20px' }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <h1
              className="text-white mb-4"
              style={{ ...fontYearbook, fontSize: 'clamp(48px, 10vw, 96px)', letterSpacing: '0.05em' }}
            >
              EVENTS
            </h1>
            <p className="text-white" style={{ ...fontInter, fontSize: '17px' }}>
              Come and see what we're all about!
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <h2
            className="text-[#2B4C6F] mb-6 md:mb-8 px-4 md:px-0"
            style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}
          >
            UPCOMING EVENTS
          </h2>
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <Link to={`/event/${event.slug}`} key={event.id}>
                <div
                  className="bg-white p-6 md:p-8 shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
                  style={{ borderRadius: '20px' }}
                >
                  <div className="flex flex-col lg:flex-row" style={{ gap: '25px' }}>
                    <div className="flex-shrink-0">
                      <div
                        className="bg-[#91a8c6] text-white p-6 text-center"
                        style={{ borderRadius: '15px', minWidth: '120px' }}
                      >
                        <div style={{ ...fontYearbook, fontSize: '32px' }}>{event.date}</div>
                        <div style={{ ...fontInter, fontSize: '18px' }}>{event.year}</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 lg:w-64">
                      <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-[15px]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#2B4C6F] mb-3" style={{ ...fontYearbook, fontSize: 'clamp(24px, 4vw, 32px)' }}>
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[#2B4C6F] mb-3">
                        <Calendar className="w-5 h-5 text-[#8FA8C8]" />
                        <span>{event.time} &bull; {event.location}</span>
                      </div>
                      <p className="text-[#2B4C6F]/80 line-clamp-3">{event.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Past Performances */}
      <section>
        <h2
          className="text-[#2B4C6F] mb-4 px-4 md:px-0"
          style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}
        >
          PAST PERFORMANCES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastEvents.map((event) => (
            <div key={event.id} className="bg-white p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ borderRadius: '20px' }}>
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-[15px] mb-4" />
              <h3 className="text-[#2B4C6F] mb-2" style={{ ...fontYearbook, fontSize: '22px' }}>{event.title}</h3>
              <p className="text-[#8FA8C8]">{event.location}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
