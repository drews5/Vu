import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Share2, Navigation, ArrowLeft, Copy } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { loadSupabase } from '../utils/loadSupabase';
import { getEventImage } from '../utils/eventImages';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';
import { getGoogleCalendarUrl, isEventUpcoming, parseEventDate } from '../utils/eventDate';

const fontInter = { fontFamily: 'Inter, sans-serif' };
interface EventData {
    slug: string;
    title: string;
    date: string;
    time: string;
    location: string;
    address?: string;
    description: string;
    ticketLink?: string;
    imageUrl?: string;
    fullDate?: Date;
    status?: string;
}
export function EventDetail() {
    const { eventId } = useParams();
    const detailPath = eventId ? `/event/${eventId}` : '/events';
    const fallbackDescription =
        'View details for an upcoming Vocal U performance, showcase, or appearance in Minneapolis and around the University of Minnesota.';
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!eventId) return;
        let cancelled = false;
        async function fetchEventDetail() {
            const supabase = await loadSupabase();
            const { data, error } = await supabase
                .from('events')
                .select('slug,title,date,display_time,location,address,description,ticket_link,image_url')
                .eq('slug', eventId)
                .single();
            if (error) {
                console.error('Error fetching event detail:', error);
            } else if (data) {
                const d = parseEventDate(data.date, data.display_time);
                if (cancelled) {
                    return;
                }

                setEvent({
                    slug: data.slug,
                    title: data.title,
                    date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    time: data.display_time || d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    location: data.location,
                    address: data.address || undefined,
                    description: data.description,
                    ticketLink: data.ticket_link,
                    imageUrl: getEventImage(data.slug, data.image_url),
                    fullDate: d,
                    status: isEventUpcoming(d) ? 'Upcoming' : 'Previous',
                });
            }
            if (!cancelled) {
                setLoading(false);
            }
        }
        void fetchEventDetail();
        return () => {
            cancelled = true;
        };
    }, [eventId]);
    const [actionMessage, setActionMessage] = useState('');
    const showActionMessage = (message: string) => {
        setActionMessage(message);
        window.setTimeout(() => setActionMessage(''), 2000);
    };
    const handleCopyInfo = async () => {
        if (!event) return;
        const eventLink = window.location.href;
        const info = `Come see Vocal U at ${event.title} on ${event.date} at ${event.time}, ${event.location}. ${eventLink}`;
        try {
            await navigator.clipboard.writeText(info);
            showActionMessage('Event details copied');
        } catch {
            showActionMessage('Copy failed');
        }
    };
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
                    await navigator.clipboard.writeText(shareUrl);
                    showActionMessage('Event link copied');
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                showActionMessage('Event link copied');
            } catch (err) {
                console.error('Clipboard error:', err);
                showActionMessage('Copy failed');
            }
        }
    };
    const getCalendarUrl = () => {
        if (!event || !event.fullDate) return '#';
        return getGoogleCalendarUrl({
            title: event.title,
            start: event.fullDate,
            description: event.description,
            location: `${event.location}${event.address ? `, ${event.address}` : ''}`,
        });
    };
    const getNavigationUrl = () => {
        if (!event) return '#';
        const query = encodeURIComponent(`${event.location}${event.address ? ` ${event.address}` : ''}`);
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    };
    if (loading) {
        return (
            <>
                <Seo
                    title="Event Details"
                    description={fallbackDescription}
                    path={detailPath}
                    keywords={['Vocal U event details', 'UMN a cappella event']}
                    breadcrumbs={[
                        { name: 'Home', path: '/' },
                        { name: 'Events', path: '/events' },
                    ]}
                />
                <div className="flex justify-center py-24" role="status"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FA8C8]" /><span className="sr-only">Loading event</span></div>
            </>
        );
    }
    if (!event) {
        return (
            <>
                <Seo
                    title="Event Not Found"
                    description="The requested Vocal U event could not be found."
                    path={detailPath}
                    noindex
                    breadcrumbs={[
                        { name: 'Home', path: '/' },
                        { name: 'Events', path: '/events' },
                    ]}
                />
                <div className="text-center py-24"><h1 style={fontYearbook}>Event Not Found</h1><Link to="/events" className="text-[#8FA8C8]">Back to Events</Link></div>
            </>
        );
    }
    const isUpcoming = event.status === 'Upcoming';
    const locationAddress = event.address || undefined;
    const eventDescription =
        event.description.length > 160
            ? `${event.description.slice(0, 157).trimEnd()}...`
            : event.description;
    const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        name: event.title,
        description: event.description,
        url: toAbsoluteUrl(detailPath),
        image: event.imageUrl ? [toAbsoluteUrl(event.imageUrl)] : undefined,
        startDate: event.fullDate?.toISOString(),
        eventStatus: isUpcoming
            ? 'https://schema.org/EventScheduled'
            : 'https://schema.org/EventCompleted',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
            '@type': 'Place',
            name: event.location,
            address: locationAddress,
        },
        performer: {
            '@id': toAbsoluteUrl('/#organization'),
        },
        organizer: {
            '@id': toAbsoluteUrl('/#organization'),
        },
        offers: event.ticketLink
            ? {
                '@type': 'Offer',
                url: event.ticketLink,
                availability: isUpcoming
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/SoldOut',
            }
            : undefined,
    };

    return (
        <PageShell className="pb-16 md:pb-24">
            <Seo
                title={`${event.title} | Vocal U Events`}
                description={eventDescription}
                path={detailPath}
                keywords={[event.title, 'Vocal U event', 'UMN performance']}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Events', path: '/events' },
                    { name: event.title, path: detailPath },
                ]}
                schema={eventSchema}
            />
            <section style={{ marginTop: '25px', marginBottom: '25px' }}>
                <div className="bg-white border border-gray-100 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
                    {/* Back Button */}
                    <div className="p-6 md:p-8 pb-0">
                        <div className="inline-block">
                            <Link to="/events" className="inline-flex items-center gap-2 text-[#8FA8C8] hover:text-[#2B4C6F] transition-colors duration-200 text-sm tracking-widest cursor-pointer" style={fontInter}>
                                <ArrowLeft className="w-4 h-4" /> Back to Events
                            </Link>
                        </div>
                    </div>
                    <div className="max-w-5xl mx-auto p-6 md:p-12">
                        <div className="flex flex-col gap-8">
                            {/* Header Info */}
                            <div>
                                <div className="flex justify-start mb-2 relative">
                                    <button onClick={handleCopyInfo} className="flex items-center gap-2 text-[#8FA8C8] hover:text-[#2B4C6F] transition-colors duration-200 text-xs tracking-widest cursor-pointer group/copy relative" style={fontInter}>
                                        <Copy className="w-4 h-4" /> Copy event details
                                    </button>
                                    <span className="ml-3 text-xs text-[#2e4c6d]/60" aria-live="polite">{actionMessage}</span>
                                </div>
                                <h1 className="text-[#2B4C6F] mb-4 leading-tight" style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 72px)' }}>
                                    {event.title}
                                </h1>
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
                                        <div className="relative rounded-2xl overflow-hidden border border-gray-100 aspect-video">
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" style={{ filter: 'saturate(1.1) contrast(1.1)' }} />
                                            {isUpcoming && (
                                                <div className="absolute top-6 left-6">
                                                    <span className="bg-[#8FA8C8] text-white px-6 py-2 rounded-full text-xs tracking-widest" style={fontYearbook}>Upcoming</span>
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
                                            <a href={event.ticketLink} target="_blank" rel="noreferrer" className="block w-full rounded-xl border border-[#8FA8C8] bg-[#8FA8C8] py-4 text-center text-white transition-colors duration-200 hover:border-[#2B4C6F] hover:bg-[#2B4C6F]" style={fontYearbook}>
                                                Get tickets
                                            </a>
                                        )}
                                        {isUpcoming && (
                                            <a href={getCalendarUrl()} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-4 text-[#2B4C6F] transition-colors duration-200 hover:border-[#8FA8C8] hover:bg-[#f4f7fa]" style={fontInter}>
                                                <Calendar className="w-5 h-5 text-[#8FA8C8]" /> Add to calendar
                                            </a>
                                        )}
                                        {isUpcoming && (
                                            <a href={getNavigationUrl()} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-4 text-[#2B4C6F] transition-colors duration-200 hover:border-[#8FA8C8] hover:bg-[#f4f7fa]" style={fontInter}>
                                                <Navigation className="w-5 h-5 text-[#8FA8C8]" /> Directions
                                            </a>
                                        )}
                                        <button onClick={handleShare} className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-4 text-[#2B4C6F] transition-colors duration-200 hover:border-[#8FA8C8] hover:bg-[#f4f7fa]" style={fontInter}>
                                            <Share2 className="w-5 h-5 text-[#8FA8C8]" /> Share event
                                        </button>
                                    </div>
                                    {/* Location Card */}
                                    <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-6 h-6 text-[#8FA8C8] shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-[#2B4C6F]" style={fontInter}>Location</h4>
                                                <p className="text-[#2B4C6F]/70 text-sm leading-relaxed" style={fontInter}>{event.location}</p>
                                                {event.address && <p className="text-[#2B4C6F]/50 text-xs leading-relaxed mt-1" style={fontInter}>{event.address}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
