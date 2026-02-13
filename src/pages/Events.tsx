import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Events() {
  const upcomingEvents = [
    {
      id: 'winter-showcase-2025',
      date: 'DEC 6',
      year: '2025',
      title: 'Vocal U Winter Showcase',
      time: '7:30 PM',
      location: 'Cowles Auditorium',
      description: 'Join us as we perform all of our repertoire at the Rarig Center in a night of winter fun. Featuring Minnesota Fitoor as the opener!',
      image: 'https://images.unsplash.com/photo-1689018161278-4e363b0c4a81'
    },
    {
      id: 'chriskindl-market-2025',
      date: 'DEC 7',
      year: '2025',
      title: 'Minneapolis Chriskindl Market',
      time: '7:00 PM',
      location: 'North Loop',
      description: 'Enjoy the festive environment of the Chriskindl market and hear us perform live on stage, singing many of your favorites.',
      image: 'https://images.unsplash.com/photo-1699802703996-d19cc0b185b9'
    },
    {
      id: 'icca-quarterfinal-2026',
      date: 'FEB 15',
      year: '2026',
      title: 'ICCA Quarterfinal Competition',
      time: '7:00 PM',
      location: 'Ted Mann Concert Hall',
      description: 'Join us as we compete in the International Championship of Collegiate A Cappella!',
      image: 'https://images.unsplash.com/photo-1760539619770-f58d0588db9e'
    }
  ];

  const pastEvents = [
    {
      title: 'Homecoming Block Party',
      location: 'Coffman Memorial Plaza',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4'
    },
    {
      title: 'Minnesota State Fair',
      location: 'University Stage',
      image: 'https://images.unsplash.com/photo-1752300779727-13d587a42881'
    }
  ];

  return (
    <div className="pb-8 md:pb-16">
      {/* Hero Section */}
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div className="bg-[#8FA8C8] shadow-xl py-16 md:py-24 px-4 md:px-8" style={{ borderRadius: '20px' }}>
          <div className="max-w-5xl mx-auto text-center">
            <h1 
              className="text-white mb-4" 
              style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: 'clamp(48px, 10vw, 96px)',
                letterSpacing: '0.05em'
              }}
            >
              EVENTS
            </h1>
            <p 
              className="text-white" 
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '17px'
              }}
            >
              Come and see what we're all about by going to a live event!
            </p>
          </div>
        </div>
      </section>

      {/* Our Performances */}
      <section style={{ marginBottom: '25px' }}>
        <h2 className="text-[#2B4C6F] mb-4 px-4 md:px-0" style={{ 
          fontFamily: "'Yearbook Solid', sans-serif",
          fontSize: 'clamp(32px, 6vw, 48px)'
        }}>
          OUR PERFORMANCES
        </h2>
        <p className="text-[#2B4C6F] mb-8 px-4 md:px-0" style={{ 
          fontFamily: 'Inter, sans-serif',
          fontSize: '17px'
        }}>
          Our latest shows and gigs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '25px' }}>
          {pastEvents.map((event, index) => (
            <div 
              key={index} 
              className="bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow" 
              style={{ borderRadius: '20px' }}
            >
              <div className="w-full h-48 bg-gradient-to-br from-[#8FA8C8] to-[#A3B8D3] mb-4 overflow-hidden" style={{ borderRadius: '15px' }}>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-[#2B4C6F] mb-2" style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: 'clamp(22px, 4vw, 28px)'
              }}>
                {event.title}
              </h3>
              <p className="text-[#8FA8C8]" style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px'
              }}>
                {event.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-[#2B4C6F] mb-6 md:mb-8 px-4 md:px-0" style={{ 
          fontFamily: "'Yearbook Solid', sans-serif",
          fontSize: 'clamp(32px, 6vw, 48px)'
        }}>
          UPCOMING EVENTS
        </h2>
        <div className="space-y-6">
          {upcomingEvents.map((event, index) => (
            <Link to={`/event/${event.id}`} key={index}>
              <div 
                className="bg-white p-6 md:p-8 shadow-lg hover:shadow-xl hover:scale-[1.01] hover:translate-x-1 transition-all cursor-pointer" 
                style={{ borderRadius: '20px' }}
              >
                <div className="flex flex-col lg:flex-row" style={{ gap: '25px' }}>
                  {/* Date Box */}
                  <div className="flex-shrink-0">
                    <div className="bg-[#91a8c6] text-white p-6 text-center hover:scale-105 hover:rotate-2 transition-transform" style={{ borderRadius: '15px', minWidth: '120px' }}>
                      <div style={{ 
                        fontFamily: "'Yearbook Solid', sans-serif",
                        fontSize: '32px',
                        lineHeight: '1'
                      }}>
                        {event.date}
                      </div>
                      <div style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '18px',
                        marginTop: '4px'
                      }}>
                        {event.year}
                      </div>
                    </div>
                  </div>

                  {/* Event Preview Image */}
                  <div className="flex-shrink-0 lg:w-64">
                    <div className="w-full h-48 bg-gradient-to-br from-[#8FA8C8] to-[#A3B8D3] overflow-hidden" style={{ borderRadius: '15px' }}>
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1">
                    <h3 className="text-[#2B4C6F] mb-3" style={{ 
                      fontFamily: "'Yearbook Solid', sans-serif",
                      fontSize: 'clamp(24px, 4vw, 32px)'
                    }}>
                      {event.title}
                    </h3>
                    <div className="space-y-2 mb-3" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>
                      <div className="flex items-center gap-3 text-[#2B4C6F]">
                        <Calendar className="w-5 h-5 text-[#8FA8C8]" />
                        <span>{event.time} • {event.location}</span>
                      </div>
                    </div>
                    <p className="text-[#2B4C6F]/80 leading-relaxed" style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '17px',
                      lineHeight: '1.7'
                    }}>
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}