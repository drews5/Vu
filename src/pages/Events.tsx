import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';
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
      description: 'Join us as we perform all of our repertoire at the Rarig Center in a night of winter fun. Featuring Minnesota Fitoor as the opener!'
    },
    {
      id: 'chriskindl-market-2025',
      date: 'DEC 7',
      year: '2025',
      title: 'Minneapolis Chriskindl Market',
      time: '7:00 PM',
      location: 'North Loop',
      description: 'Enjoy the festive environment of the Chriskindl market and hear us perform live on stage, singing many of your favorites.'
    },
    {
      id: 'icca-quarterfinal-2026',
      date: 'FEB 15',
      year: '2026',
      title: 'ICCA Quarterfinal Competition',
      time: '7:00 PM',
      location: 'Ted Mann Concert Hall',
      description: 'Join us as we compete in the International Championship of Collegiate A Cappella!'
    }
  ];

  const pastEvents = [
    {
      title: 'Homecoming Block Party',
      location: 'Coffman Memorial Plaza'
    },
    {
      title: 'Minnesota State Fair',
      location: 'University Stage'
    }
  ];

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
        <div className="bg-[#8FA8C8] shadow-xl py-16 md:py-24 px-4 md:px-8" style={{ borderRadius: '20px' }}>
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white mb-4" 
              style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: 'clamp(48px, 10vw, 96px)',
                letterSpacing: '0.05em'
              }}
            >
              EVENTS
            </motion.h1>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-white" 
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '17px'
              }}
            >
              Come and see what we're all about by going to a live event!
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Our Performances */}
      <motion.section 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '25px' }}
      >
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
            <motion.div 
              key={index} 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white p-6 md:p-8 shadow-lg" 
              style={{ borderRadius: '20px' }}
            >
              <div className="w-full h-48 bg-gradient-to-br from-[#8FA8C8] to-[#A3B8D3] mb-4 flex items-center justify-center" style={{ borderRadius: '15px' }}>
                <span className="text-white/40 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  EVENT PHOTO
                </span>
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
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Upcoming Events */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[#2B4C6F] mb-6 md:mb-8 px-4 md:px-0" style={{ 
          fontFamily: "'Yearbook Solid', sans-serif",
          fontSize: 'clamp(32px, 6vw, 48px)'
        }}>
          UPCOMING EVENTS
        </h2>
        <div className="space-y-6">
          {upcomingEvents.map((event, index) => (
            <Link to={`/event/${event.id}`} key={index}>
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.01, x: 5 }}
                className="bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" 
                style={{ borderRadius: '20px' }}
              >
                <div className="flex flex-col lg:flex-row" style={{ gap: '25px' }}>
                  {/* Date Box */}
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="flex-shrink-0"
                  >
                    <div className="bg-[#91a8c6] text-white p-6 text-center" style={{ borderRadius: '15px', minWidth: '120px' }}>
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
                  </motion.div>

                  {/* Event Preview Image */}
                  <div className="flex-shrink-0 lg:w-64">
                    <div className="w-full h-48 bg-gradient-to-br from-[#8FA8C8] to-[#A3B8D3] flex items-center justify-center" style={{ borderRadius: '15px' }}>
                      <span className="text-white/40 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        EVENT PHOTO
                      </span>
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
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
