import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';

export function EventDetail() {
  const { eventId } = useParams();

  const events: Record<string, {
    title: string;
    date: string;
    time: string;
    location: string;
    address: string;
    description: string[];
    ticketLink?: string;
    imageUrl?: string;
  }> = {
    'winter-showcase-2025': {
      title: 'Vocal U Winter Showcase',
      date: 'December 6, 2025',
      time: '7:30 PM',
      location: 'Cowles Auditorium',
      address: 'Rarig Center, 330 21st Ave S, Minneapolis, MN 55455',
      description: [
        'Join us as we perform all of our repertoire at the Rarig Center in a night of winter fun. Featuring Minnesota Fitoor as the opener!',
        'This special winter showcase features our complete repertoire from the semester, including holiday favorites and contemporary hits.',
        'Doors open at 7:00 PM. General admission seating.'
      ],
      ticketLink: 'https://example.com/tickets',
      imageUrl: 'https://images.unsplash.com/photo-1689018161278-4e363b0c4a81'
    },
    'chriskindl-market-2025': {
      title: 'Minneapolis Chriskindl Market',
      date: 'December 7, 2025',
      time: '7:00 PM',
      location: 'North Loop',
      address: 'North Loop Neighborhood, Minneapolis, MN',
      description: [
        'Enjoy the festive environment of the Chriskindl market and hear us perform live on stage, singing many of your favorites.',
        'Experience the magic of the holiday season as we perform classic carols and contemporary holiday songs in the heart of the Minneapolis Chriskindl Market.',
        'Free event - no tickets required. Bundle up and join us for an evening of music and merriment!'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1699802703996-d19cc0b185b9'
    },
    'icca-quarterfinal-2026': {
      title: 'ICCA Quarterfinal Competition',
      date: 'February 15, 2026',
      time: '7:00 PM',
      location: 'Ted Mann Concert Hall',
      address: '2128 4th St S, Minneapolis, MN 55455',
      description: [
        'Join us as we compete in the International Championship of Collegiate A Cappella!',
        'Watch Vocal U compete against other collegiate a cappella groups from across the region in this exciting quarterfinal competition.',
        'This is your chance to see some of the best collegiate a cappella groups perform their competition sets live on stage.'
      ],
      ticketLink: 'https://artsticketing.wisc.edu/Online/default.asp?doWork::WScontent::loadArticle=Load&BOparam::WScontent::loadArticle::article_id=0BEF4201-2FB0-4E36-BC46-FB2625F51E03#buynow',
      imageUrl: 'https://images.unsplash.com/photo-1760539619770-f58d0588db9e'
    }
  };

  const event = eventId && events[eventId];

  if (!event) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-8 md:pb-16"
      >
        <section style={{ marginTop: '25px', marginBottom: '25px' }}>
          <div className="bg-white p-8 md:p-12 shadow-lg text-center" style={{ borderRadius: '20px' }}>
            <h1 className="text-[#2B4C6F] mb-4" style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(32px, 6vw, 48px)'
            }}>
              Event Not Found
            </h1>
            <Link 
              to="/events"
              className="inline-flex items-center gap-2 bg-[#8FA8C8] text-white px-8 py-3 shadow-lg hover:bg-[#7A97B7] transition-colors"
              style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: '18px',
                letterSpacing: '0.05em',
                borderRadius: '20px'
              }}
            >
              Back to Events
            </Link>
          </div>
        </section>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-8 md:pb-16"
    >
      {/* Hero Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ marginTop: '25px', marginBottom: '25px' }}
      >
        <div className="bg-white shadow-xl p-8 md:p-12" style={{ borderRadius: '20px' }}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link 
                to="/events"
                className="inline-flex items-center text-[#8FA8C8] hover:text-[#7A97B7] mb-6 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}
              >
                ← Back to Events
              </Link>
              
              <h1 className="text-[#2B4C6F] mb-6" style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: 'clamp(36px, 8vw, 56px)',
                letterSpacing: '0.02em'
              }}>
                {event.title}
              </h1>

              {/* Event Image Placeholder */}
              {event.imageUrl ? (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-[400px] object-cover" />
                </div>
              ) : (
                <div className="w-full h-[400px] bg-gradient-to-br from-[#8FA8C8] to-[#A3B8D3] mb-8 flex items-center justify-center rounded-2xl">
                  <span className="text-white/40 text-2xl" style={{ fontFamily: "'Yearbook Solid', sans-serif" }}>
                    EVENT PHOTO
                  </span>
                </div>
              )}

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-[#91a8c6]/10" style={{ borderRadius: '15px' }}>
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-[#8FA8C8] flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-[#2B4C6F]/60 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Date
                    </div>
                    <div className="text-[#2B4C6F]" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
                      {event.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-[#8FA8C8] flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-[#2B4C6F]/60 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Time
                    </div>
                    <div className="text-[#2B4C6F]" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
                      {event.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-[#8FA8C8] flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-[#2B4C6F]/60 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Location
                    </div>
                    <div className="text-[#2B4C6F]" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
                      {event.location}
                    </div>
                    <div className="text-[#2B4C6F]/70 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {event.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-4 mb-8">
                {event.description.map((paragraph, index) => (
                  <p key={index} className="text-[#2B4C6F] leading-relaxed" style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '17px',
                    lineHeight: '1.7'
                  }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Ticket Button */}
              {event.ticketLink && (
                <motion.a
                  href={event.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-[#8FA8C8] text-white px-10 py-4 shadow-lg hover:bg-[#7A97B7] transition-colors"
                  style={{ 
                    fontFamily: "'Yearbook Solid', sans-serif",
                    fontSize: '20px',
                    letterSpacing: '0.05em',
                    borderRadius: '20px'
                  }}
                >
                  GET TICKETS
                </motion.a>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}