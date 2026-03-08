import { useEffect, useState, memo } from 'react';
import { Calendar, MapPin, ArrowRight, Clock, Share2, Navigation, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PageTransition, childVariants } from '../components/PageTransition';
import { loadSupabase } from '../utils/loadSupabase';
import { getEventImage } from '../utils/eventImages';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';

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
    const [copied, setCopied] = useState(false);
    const handleCopyInfo = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const eventLink = `${window.location.origin}/event/${event.slug}`;
        const info = `Come see Vocal U at ${event.title} on ${event.date}, ${event.year} at ${event.time} at ${event.location}! ${eventLink}`;
        navigator.clipboard.writeText(info);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
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
        <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }} className="relative h-full">
            <Link to={`/event/${event.slug}`} className={`group bg-white overflow-hidden border border-gray-100 transition-[box-shadow,border-color] duration-300 hover:shadow-2xl flex flex-col md:flex-row h-full md:min-h-64 cursor-pointer ${isUpcoming ? 'ring-1 ring-[#8FA8C8]/30 shadow-md' : 'shadow-sm'}`} style={{ borderRadius: '16px' }}>
                {/* Image Section */}
                <div className="relative w-full md:w-80 aspect-video md:aspect-auto md:h-auto overflow-hidden shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ filter: 'saturate(1.1) contrast(1.1)' }} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white text-sm font-black flex items-center gap-2">
                            VIEW DETAILS <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                    {isUpcoming && (
                        <div className="absolute top-4 left-4">
                            <span className="bg-[#8FA8C8] text-white px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] border border-white/20 font-yearbook" style={fontYearbook}>
                                Upcoming
                            </span>
                        </div>
                    )}
                </div>
                {/* Content Section */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-center relative bg-white">
                    <div className="flex justify-between items-end mb-1">
                        <div className="flex items-center gap-2 text-[#8FA8C8] font-bold text-xs tracking-widest" style={fontInter}>
                            <Calendar className="w-3.5 h-3.5" />
                            {event.date}, {event.year}
                        </div>
                        <button onClick={handleCopyInfo} className="p-2 hover:bg-[#8FA8C8]/10 rounded-full transition-all duration-200 shrink-0 group/copy cursor-pointer -mr-2 relative" title="Copy event info">
                            <span className={`absolute -top-8 right-0 bg-[#2B4C6F] text-white text-[10px] px-2 py-1 rounded transition-opacity pointer-events-none font-bold whitespace-nowrap ${copied ? 'opacity-100' : 'opacity-0'}`}>
                                COPIED!
                            </span>
                            <Copy className="w-3.5 h-3.5 text-[#8FA8C8]/60 group-hover/copy:text-[#8FA8C8]" />
                        </button>
                    </div>
                    <h3 className="text-[#2B4C6F] text-2xl md:text-3xl leading-tight group-hover:text-[#8FA8C8] transition-colors font-yearbook" style={fontYearbook}>
                        {event.title}
                    </h3>
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
                    <div className="flex flex-col gap-4">
                        <p className="text-[#2B4C6F]/70 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed max-w-2xl" style={fontInter}>
                            {event.description}
                        </p>
                        {isUpcoming && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                <motion.a href={getCalendarUrl()} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#8FA8C8] px-4 py-2 rounded-full hover:bg-[#8FA8C8]/10 hover:border-[#8FA8C8]/40 transition-all duration-200 border border-[#8FA8C8]/20 group/btn shadow-sm cursor-pointer"
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-normal tracking-wider" style={fontInter}>Add to Calendar</span>
                                </motion.a>
                                <motion.a href={getNavigationUrl()} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#8FA8C8] px-4 py-2 rounded-full hover:bg-[#8FA8C8]/10 hover:border-[#8FA8C8]/40 transition-all duration-200 border border-[#8FA8C8]/20 shadow-sm cursor-pointer"
                                >
                                    <Navigation className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-normal tracking-wider" style={fontInter}>Navigate</span>
                                </motion.a>
                                <motion.button onClick={handleShare} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#8FA8C8] px-4 py-2 rounded-full hover:bg-[#8FA8C8]/10 hover:border-[#8FA8C8]/40 transition-all duration-200 border border-[#8FA8C8]/20 shadow-sm cursor-pointer">
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-normal tracking-wider" style={fontInter}>Share</span>
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
});
const PastEventCard = memo(function PastEventCard({ event }: { event: Event }) {
    return (
        <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="h-full">
            <Link to={`/event/${event.slug}`} className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full group">
                <div className="relative aspect-video overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-110" style={{ filter: 'saturate(1.1) contrast(1.1)' }} loading="lazy" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-[#8FA8C8] font-bold text-[10px] tracking-[0.2em] mb-2 uppercase" style={fontInter}>
                        {event.date}, {event.year}
                    </div>
                    <h3 className="text-[#2B4C6F] text-lg font-yearbook leading-tight group-hover:text-[#8FA8C8] transition-colors line-clamp-2" style={fontYearbook}>
                        {event.title}
                    </h3>
                </div>
            </Link>
        </motion.div>
    );
});
export function Events() {
    const eventsDescription =
        'See upcoming Vocal U performances, showcases, competitions, and past events from the University of Minnesota a cappella group.';
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [pastIndex, setPastIndex] = useState(0);
    const nextPast = () => {
        const pastCount = events.filter(e => e.status === 'Previous').length;
        if (pastCount === 0) return;
        setPastIndex((prev: any) => (prev + 1) % pastCount);
    };
    const prevPast = () => {
        const pastCount = events.filter(e => e.status === 'Previous').length;
        if (pastCount === 0) return;
        setPastIndex((prev: any) => (prev - 1 + pastCount) % pastCount);
    };
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const pastEvents = events.filter(e => e.status === 'Previous');
    const upcomingEvents = events
        .filter((e) => e.status === 'Upcoming')
        .sort((a, b) => (a.fullDate?.getTime() || 0) - (b.fullDate?.getTime() || 0));
    const showPastArrows = pastEvents.length > (isMobile ? 1 : isTablet ? 2 : 3);
    const translatePercent = isMobile ? 100 : isTablet ? 50 : 33.333;
    useEffect(() => {
        let cancelled = false;
        async function fetchEvents() {
            const supabase = await loadSupabase();
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false });
            if (error) {
                console.error('Error fetching events:', error);
            } else {
                if (cancelled) {
                    return;
                }

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
                        image: getEventImage(r.slug, r.image_url),
                        status: new Date(d.setHours(23, 59, 59, 999)) >= new Date() ? 'Upcoming' : 'Previous',
                        fullDate: d
                    };
                });
                setEvents(formatted as Event[]);
            }
            if (!cancelled) {
                setLoading(false);
            }
        }
        void fetchEvents();
        return () => {
            cancelled = true;
        };
    }, []);
    const eventsSchema = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Vocal U Events',
            description: eventsDescription,
            url: toAbsoluteUrl('/events'),
            about: {
                '@id': toAbsoluteUrl('/#organization'),
            },
        },
    ];

    if (events.length > 0) {
        eventsSchema.push({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Vocal U Events',
            itemListElement: events.map((event, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: toAbsoluteUrl(`/event/${event.slug}`),
                name: event.title,
            })),
        });
    }

    return (
        <PageTransition className="pb-8 md:pb-16 min-h-screen">
            <Seo
                title="Vocal U Events"
                description={eventsDescription}
                path="/events"
                keywords={['Vocal U events', 'UMN a cappella performances', 'Minneapolis a cappella events']}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Events', path: '/events' },
                ]}
                schema={eventsSchema}
            />
            {/* Header Section */}
            <motion.section variants={childVariants} style={{ marginTop: '25px', marginBottom: '25px' }}>
                <div className="bg-[#91a8c6] py-10 md:py-16 px-4 text-center border border-gray-100 shadow-sm relative overflow-hidden" style={{ borderRadius: '16px' }}>
                    <div className="max-w-4xl mx-auto relative z-10">
                        <h1 className="text-white mb-2 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}>
                            Events
                        </h1>
                        <p className="text-white/90 tracking-wide text-xs md:text-base" style={fontInter}>
                            Join us for live performances, competitions, and more.
                        </p>
                    </div>
                </div>
            </motion.section>
            <div className="max-w-6xl mx-auto space-y-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#8FA8C8]/30 border-t-[#8FA8C8] rounded-full animate-spin" />
                    </div>
                ) : (
                    <> {upcomingEvents.length > 0 && (
                        <motion.section variants={childVariants}>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-[#2B4C6F] text-2xl md:text-3xl font-yearbook whitespace-nowrap" style={fontYearbook}>
                                    Upcoming Events
                                </h2>
                                <div className="h-[1px] bg-[#8FA8C8]/20 flex-grow" />
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                                {upcomingEvents.map((event) => (
                                    <UnifiedEventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </motion.section>
                    )}
                        <motion.section variants={childVariants}>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-[#2B4C6F] text-2xl md:text-3xl font-yearbook whitespace-nowrap" style={fontYearbook}>
                                    Past Events
                                </h2>
                                <div className="h-[1px] bg-[#8FA8C8]/20 flex-grow" />
                            </div>
                            <div className="relative group/carousel pb-4">
                                <div className="overflow-hidden px-4 md:px-0 pb-2">
                                    <motion.div animate={{ x: `-${pastIndex * translatePercent}%` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} style={{ display: 'flex', width: '100%', }}>
                                        {pastEvents.map((event) => (
                                            <div key={event.id} className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-2" style={{ paddingBottom: '4px' }}>
                                                <PastEventCard event={event} />
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                                {showPastArrows && (
                                    <> <button onClick={prevPast} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 bg-white text-[#2B4C6F] p-2 rounded-full shadow-lg z-20 hover:bg-[#F8FAFC] transition-colors" aria-label="Previous past events">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                        <button onClick={nextPast} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 bg-white text-[#2B4C6F] p-2 rounded-full shadow-lg z-20 hover:bg-[#F8FAFC] transition-colors" aria-label="Next past events">
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}
                                {/* Pagination Dots for Mobile */}
                                {isMobile && pastEvents.length > 1 && (
                                    <div className="flex justify-center gap-2 mt-6 md:hidden">
                                        {pastEvents.map((_, idx) => (
                                            <button key={idx} onClick={() => setPastIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${pastIndex === idx ? 'bg-[#8FA8C8] w-4' : 'bg-[#8FA8C8]/40'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    </>
                )}
            </div>
        </PageTransition>
    );
}
