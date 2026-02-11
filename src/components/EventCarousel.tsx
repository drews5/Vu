import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const events = [
  {
    date: 'DEC 6, 2025',
    title: 'Vocal U Winter Showcase',
    time: '7:30 PM',
    location: 'Cowles Auditorium',
    description: 'Join us as we perform all of our repertoire at the Rarig Center in a night of winter fun. Featuring Minnesota Fitoor as the opener!',
    link: '/event/winter-showcase-2025'
  },
  {
    date: 'DEC 7, 2025',
    title: 'Minneapolis Chriskindl Market',
    time: '7:00 PM',
    location: 'North Loop',
    description: 'Enjoy the festive environment of the Chriskindl market and hear us perform live on stage, singing many of your favorites.',
    link: '/event/chriskindl-market-2025'
  },
  {
    date: 'FEB 15, 2026',
    title: 'ICCA Quarterfinal Competition',
    time: '7:00 PM',
    location: 'Ted Mann Concert Hall',
    description: 'Join us as we compete in the International Championship of Collegiate A Cappella!',
    link: '/event/icca-quarterfinal-2026'
  }
];

export function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const getVisibleEvents = (screenSize: 'mobile' | 'tablet' | 'desktop') => {
    const counts = { mobile: 1, tablet: 2, desktop: 3 };
    const count = counts[screenSize];
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(events[(currentIndex + i) % events.length]);
    }
    return result;
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {events.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 bg-white text-[#2B4C6F] p-3 rounded-full shadow-xl hover:bg-gray-50 transition-colors"
            aria-label="Previous events"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 bg-white text-[#2B4C6F] p-3 rounded-full shadow-xl hover:bg-gray-50 transition-colors"
            aria-label="Next events"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </>
      )}

      {/* Cards Container */}
      <div className="overflow-visible py-4">
        {/* Mobile: 1 column */}
        <div className="md:hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <EventCard event={events[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tablet: 2 columns */}
        <div className="hidden md:grid xl:hidden grid-cols-2 gap-6">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            {getVisibleEvents('tablet').map((event, idx) => (
              <motion.div
                key={`${currentIndex}-${idx}`}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, delay: idx * 0.05 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Desktop: 3 columns */}
        <div className="hidden xl:grid grid-cols-3 gap-6">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            {getVisibleEvents('desktop').map((event, idx) => (
              <motion.div
                key={`${currentIndex}-${idx}`}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, delay: idx * 0.05 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      {events.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {events.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60 w-2'
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event }: { event: typeof events[0] }) {
  return (
    <Link to={event.link} className="block h-full">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white/95 backdrop-blur-sm p-6 md:p-8 cursor-pointer h-full flex flex-col"
        style={{ borderRadius: '20px' }}
      >
        <div className="w-full h-48 bg-gradient-to-br from-[#8FA8C8] to-[#A3B8D3] mb-4 flex items-center justify-center flex-shrink-0" style={{ borderRadius: '15px' }}>
          <span className="text-white/40 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            EVENT PHOTO
          </span>
        </div>
        <div className="text-[#2B4C6F]/70 mb-2" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {event.date}
        </div>
        <h3 className="text-[#2B4C6F] mb-2" style={{
          fontFamily: "'Yearbook Solid', sans-serif",
          fontSize: 'clamp(20px, 3vw, 24px)'
        }}>
          {event.title}
        </h3>
        <p className="text-[#2B4C6F] mb-2" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          lineHeight: '1.6'
        }}>
          {event.time} • {event.location}
        </p>
        <p className="text-[#2B4C6F]/80 flex-grow" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {event.description}
        </p>
      </motion.div>
    </Link>
  );
}