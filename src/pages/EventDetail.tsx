import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };

interface EventData {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
  ticketLink?: string;
  imageUrl?: string;
}

export function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    async function fetchEventDetail() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', eventId)
        .single();

      if (error) {
        console.error('Error fetching event detail:', error);
      } else if (data) {
        const d = new Date(data.date);
        setEvent({
          title: data.title,
          date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          time: data.display_time || d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: data.location,
          address: data.address,
          description: data.description,
          ticketLink: data.ticket_link,
          imageUrl: data.image_url,
        });
      }
      setLoading(false);
    }

    fetchEventDetail();
  }, [eventId]);

  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FA8C8]" /></div>;
  if (!event) return <div className="text-center py-24"><h1 style={fontYearbook}>Event Not Found</h1><Link to="/events" className="text-[#8FA8C8]">Back to Events</Link></div>;

  return (
    <div className="pb-8 md:pb-16">
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div className="bg-white shadow-xl p-8 md:p-12" style={{ borderRadius: '20px' }}>
          <div className="max-w-4xl mx-auto">
            <Link to="/events" className="inline-flex items-center text-[#8FA8C8] mb-6">&larr; Back to Events</Link>
            <h1 className="text-[#2B4C6F] mb-6" style={{ ...fontYearbook, fontSize: 'clamp(36px, 8vw, 56px)' }}>{event.title}</h1>
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-[400px] object-cover rounded-2xl mb-8" />}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-[#91a8c6]/10" style={{ borderRadius: '15px' }}>
              <div className="flex items-start gap-3"><Calendar className="w-6 h-6 text-[#8FA8C8]" /><div><div className="text-xs opacity-60">Date</div><div>{event.date}</div></div></div>
              <div className="flex items-start gap-3"><Clock className="w-6 h-6 text-[#8FA8C8]" /><div><div className="text-xs opacity-60">Time</div><div>{event.time}</div></div></div>
              <div className="flex items-start gap-3"><MapPin className="w-6 h-6 text-[#8FA8C8]" /><div><div className="text-xs opacity-60">Location</div><div>{event.location}</div><div className="text-xs opacity-70">{event.address}</div></div></div>
            </div>

            <div className="whitespace-pre-wrap text-[#2B4C6F] leading-relaxed mb-8" style={fontInter}>{event.description}</div>
            {event.ticketLink && <a href={event.ticketLink} target="_blank" rel="noreferrer" className="inline-block bg-[#8FA8C8] text-white px-10 py-4 rounded-2xl" style={fontYearbook}>GET TICKETS</a>}
          </div>
        </div>
      </section>
    </div>
  );
}
