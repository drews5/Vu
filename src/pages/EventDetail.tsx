import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Share2, Navigation, ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };

interface EventData {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
  ticketLink?: string;
  imageUrl?: string;
  fullDate?: Date;
  status?: string;
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
          slug: data.slug,
          title: data.title,
          date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          time: data.display_time || d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: data.location,
          address: data.address,
          description: data.description,
          ticketLink: data.ticket_link,
          imageUrl: data.image_url,
          fullDate: d,
          status: data.status,
        });
      }
      setLoading(false);
    }

    fetchEventDetail();
  }, [eventId]);

  const handleShare = async () => {
    if (!event) return;
    const shareUrl = window.location.href;
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
          navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        }
      }
    } else {
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
    if (!event || !event.fullDate) return '#';

    const title = encodeURIComponent(event.title);
    const location = encodeURIComponent(`${event.location} ${event.address}`);
    const details = encodeURIComponent(event.description);
    
    const startDate = event.fullDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(event.fullDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  const getNavigationUrl = () => {
    if (!event) return '#';
    const query = encodeURIComponent(`${event.location} ${event.address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FA8C8]" /></div>;
  if (!event) return <div className="text-center py-24"><h1 style={fontYearbook}>Event Not Found</h1><Link to="/events" className="text-[#8FA8C8]">Back to Events</Link></div>;

  const isUpcoming = event.status === 'Upcoming';

  return (
    <div className="pb-16 md:pb-24">
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
          {/* Back Button */}
          <div className="p-6 md:p-8 pb-0">
            <Link to="/events" className="inline-flex items-center gap-2 text-[#8FA8C8] hover:text-[#2B4C6F] transition-colors font-bold text-sm tracking-widest font-bold" style={fontInter}>
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>
          </div>

          <div className="max-w-5xl mx-auto p-6 md:p-12">
            <div className="flex flex-col gap-8">
              {/* Header Info */}
              <div>
                <h1 className="text-[#2B4C6F] mb-4 leading-tight" style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 72px)' }}>{event.title}</h1>
                <div className="flex flex-wrap gap-6 text-[#2B4C6F]/60" style={fontInter}>
                  <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-[#8FA8C8]" /><span>{event.date}</span></div>
                  <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#8FA8C8]" /><span>{event.time}</span></div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Image and Description */}
                <div className="lg:col-span-2 space-y-8">
                  {event.imageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-100">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-auto object-cover max-h-[500px]" />
                      {isUpcoming && (
                        <div className="absolute top-6 left-6">
                          <span className="bg-[#8FA8C8] text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest" style={fontYearbook}>Upcoming</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="prose prose-lg max-w-none">
                    <p className="whitespace-pre-wrap text-[#2B4C6F] leading-relaxed text-lg" style={fontInter}>{event.description}</p>
                  </div>
                </div>

                {/* Right Column: Actions and Location */}
                <div className="space-y-6">
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    {event.ticketLink && (
                      <a href={event.ticketLink} target="_blank" rel="noreferrer" className="w-full bg-[#8FA8C8] text-white py-5 rounded-2xl font-bold text-center border border-[#8FA8C8] hover:bg-[#7A97B7] transition-all active:scale-[0.98] font-bold" style={fontYearbook}>
                        GET TICKETS
                      </a>
                    )}
                    {isUpcoming && (
                      <a 
                        href={getCalendarUrl()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-white text-[#2B4C6F] border border-gray-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-[#8FA8C8] transition-all group font-bold" 
                        style={fontInter}
                      >
                        <Calendar className="w-5 h-5 text-[#8FA8C8]" /> Add to Calendar
                      </a>
                    )}
                    <a 
                      href={getNavigationUrl()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-white text-[#2B4C6F] border border-gray-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-[#8FA8C8] transition-all group font-bold" 
                      style={fontInter}
                    >
                      <Navigation className="w-5 h-5 text-[#8FA8C8]" /> Navigate to Venue
                    </a>
                    <button onClick={handleShare} className="w-full bg-white text-[#2B4C6F] border border-gray-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-[#8FA8C8] transition-all group font-bold" style={fontInter}>
                      <Share2 className="w-5 h-5 text-[#8FA8C8]" /> Share Event
                    </button>
                  </div>

                  {/* Location Card */}
                  <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-[#8FA8C8] shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-[#2B4C6F]" style={fontInter}>Location</h4>
                        <p className="text-[#2B4C6F]/70 text-sm leading-relaxed" style={fontInter}>{event.location}</p>
                        <p className="text-[#2B4C6F]/50 text-xs leading-relaxed mt-1" style={fontInter}>{event.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
