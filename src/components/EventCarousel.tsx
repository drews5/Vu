import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const events = [
  // Previous Events
  {
    date: 'SEP 14, 2024',
    title: 'State Fair Performance',
    time: '2:00 PM',
    location: 'University Stage',
    link: '/events',
    image: 'https://images.unsplash.com/photo-1752300779727-13d587a42881',
    status: 'previous' as const
  },
  {
    date: 'OCT 12, 2024',
    title: 'Homecoming Block Party',
    time: '5:00 PM',
    location: 'Coffman Memorial Plaza',
    link: '/events',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    status: 'previous' as const
  },
  {
    date: 'NOV 3, 2024',
    title: 'Fall Concert',
    time: '7:30 PM',
    location: 'Ted Mann Concert Hall',
    link: '/events',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
    status: 'previous' as const
  },
  {
    date: 'NOV 20, 2024',
    title: 'Campus Showcase',
    time: '6:00 PM',
    location: 'Northrop Auditorium',
    link: '/events',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
    status: 'previous' as const
  },
  // Upcoming Events
  {
    date: 'DEC 6, 2025',
    title: 'Vocal U Winter Showcase',
    time: '7:30 PM',
    location: 'Cowles Auditorium',
    link: '/event/winter-showcase-2025',
    image: 'https://images.unsplash.com/photo-1689018161278-4e363b0c4a81',
    status: 'upcoming' as const
  },
  {
    date: 'DEC 7, 2025',
    title: 'Minneapolis Chriskindl Market',
    time: '7:00 PM',
    location: 'North Loop',
    link: '/event/chriskindl-market-2025',
    image: 'https://images.unsplash.com/photo-1699802703996-d19cc0b185b9',
    status: 'upcoming' as const
  },
  {
    date: 'JAN 18, 2026',
    title: 'New Year Concert',
    time: '8:00 PM',
    location: 'Cowles Auditorium',
    link: '/events',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    status: 'upcoming' as const
  },
  {
    date: 'FEB 15, 2026',
    title: 'ICCA Quarterfinal Competition',
    time: '7:00 PM',
    location: 'Ted Mann Concert Hall',
    link: '/event/icca-quarterfinal-2026',
    image: 'https://images.unsplash.com/photo-1760539619770-f58d0588db9e',
    status: 'upcoming' as const
  },
  {
    date: 'MAR 22, 2026',
    title: 'Spring Gala',
    time: '7:30 PM',
    location: 'Northrop Auditorium',
    link: '/events',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
    status: 'upcoming' as const
  },
  {
    date: 'APR 10, 2026',
    title: 'Community Outreach Concert',
    time: '6:00 PM',
    location: 'Minneapolis Public Library',
    link: '/events',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
    status: 'upcoming' as const
  }
];

export function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    
    if (Math.abs(walk) > 50) {
      if (walk > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX) return;
    const x = e.touches[0].pageX;
    const walk = x - startX;
    
    if (Math.abs(walk) > 50) {
      if (walk > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
      setStartX(0);
    }
  };

  const getVisibleCards = () => {
    const result = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + events.length) % events.length;
      result.push({ event: events[index], offset: i, index });
    }
    return result;
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-20 bg-white text-[#2B4C6F] p-3 rounded-full shadow-xl hover:bg-gray-50 hover:scale-110 transition-all"
        aria-label="Previous events"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-20 bg-white text-[#2B4C6F] p-3 rounded-full shadow-xl hover:bg-gray-50 hover:scale-110 transition-all"
        aria-label="Next events"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Rolodex Container */}
      <div
        ref={containerRef}
        className="relative h-[480px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ perspective: '1000px' }}
      >
        {getVisibleCards().map(({ event, offset, index }) => (
          <div
            key={index}
            className="absolute transition-all duration-500 ease-out"
            style={{
              transform: `translateX(${offset * 320}px) translateZ(${offset === 0 ? 0 : -200}px) rotateY(${offset * -15}deg) scale(${offset === 0 ? 1 : 0.85})`,
              opacity: offset === 0 ? 1 : 0.5,
              zIndex: offset === 0 ? 10 : 5 - Math.abs(offset),
              pointerEvents: offset === 0 ? 'auto' : 'none'
            }}
          >
            <EventCard event={event} isCenter={offset === 0} />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/40 hover:bg-white/60 w-2'
            }`}
            aria-label={`Go to event ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event, isCenter }: { event: typeof events[0]; isCenter: boolean }) {
  return (
    <Link to={event.link} className={`block ${!isCenter && 'pointer-events-none'}`}>
      <div
        className="bg-white/95 backdrop-blur-sm p-6 md:p-8 w-[280px] md:w-[320px] h-[400px] flex flex-col transition-shadow duration-300"
        style={{ borderRadius: '20px', boxShadow: isCenter ? '0 20px 60px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.2)' }}
      >
        {/* Status Label */}
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              event.status === 'upcoming'
                ? 'bg-[#8FA8C8] text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
            style={{ 
              borderRadius: '10px',
              fontFamily: "'Yearbook Solid', sans-serif"
            }}
          >
            {event.status === 'upcoming' ? 'Upcoming' : 'Previous'}
          </span>
        </div>

        {/* Event Image */}
        <div className="w-full h-40 bg-gradient-to-br from-[#8FA8C8] to-[#A3B8D3] mb-4 overflow-hidden flex-shrink-0" style={{ borderRadius: '15px' }}>
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Event Date */}
        <div className="text-[#2B4C6F]/70 mb-2" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {event.date}
        </div>

        {/* Event Title */}
        <h3 className="text-[#2B4C6F] mb-2 flex-grow" style={{
          fontFamily: "'Yearbook Solid', sans-serif",
          fontSize: 'clamp(18px, 3vw, 22px)',
          lineHeight: '1.3'
        }}>
          {event.title}
        </h3>

        {/* Event Details */}
        <p className="text-[#2B4C6F]" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {event.time} • {event.location}
        </p>
      </div>
    </Link>
  );
}
