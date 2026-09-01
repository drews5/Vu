import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, ExternalLink, Calendar, MessageCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { PageTransition, childVariants } from '../components/PageTransition';
import { ExploreMore } from '../components/ExploreMore';
import { Seo, toAbsoluteUrl, type SeoSchema } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';
import { fetchJson } from '../utils/network';
import { getSafeExternalUrl } from '../utils/safeUrl';

const fontInter = { fontFamily: 'Inter, sans-serif' };
const YOUTUBE_API_KEY = 'AIzaSyDN6gIEwSBWQkwZ0LqcmzwQjwBJy3Pgq7Y';
const YOUTUBE_PLAYLIST_ID = 'UUnTUlN8WPYoqaAgnR58dXBA';
const INSTA_FEED_URL = 'https://feeds.behold.so/rWuujcErcs5hcWQ5MPPw';

type YouTubeVideo = {
    id?: string;
    snippet: {
        title: string;
        publishedAt: string;
        resourceId: { videoId: string };
    };
};

type InstaPost = {
    id: string;
    mediaUrl: string;
    permalink: string;
    caption?: string;
    timestamp: string;
};

function isYouTubeVideo(value: unknown): value is YouTubeVideo {
    if (!value || typeof value !== 'object') return false;
    const video = value as Partial<YouTubeVideo>;
    const videoId = video.snippet?.resourceId?.videoId;
    return typeof video.snippet?.title === 'string'
        && typeof video.snippet.publishedAt === 'string'
        && typeof videoId === 'string'
        && /^[\w-]{11}$/.test(videoId);
}

function normalizeInstagramPost(value: unknown): InstaPost | null {
    if (!value || typeof value !== 'object') return null;
    const post = value as Partial<InstaPost>;
    const mediaUrl = getSafeExternalUrl(post.mediaUrl);
    const permalink = getSafeExternalUrl(post.permalink);
    if (typeof post.id !== 'string' || !mediaUrl || !permalink) return null;

    return {
        id: post.id,
        mediaUrl,
        permalink,
        caption: typeof post.caption === 'string' ? post.caption : undefined,
        timestamp: typeof post.timestamp === 'string' ? post.timestamp : '',
    };
}
const InstagramCard = memo(function InstagramCard({ post }: { post: InstaPost }) {
    return (
        <motion.a href={post.permalink} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.98 }} className="vu-card group bg-white overflow-hidden border border-gray-100 transition-[box-shadow,border-color] duration-300 hover:border-[#8FA8C8] flex flex-col cursor-pointer" style={{ borderRadius: '16px' }}>
            <div className="relative overflow-hidden bg-gray-50">
                <img src={post.mediaUrl} alt={post.caption || "Instagram Post"} className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-[#2B4C6F]/0 group-hover:bg-[#2B4C6F]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Instagram className="w-8 h-8 text-white drop-shadow-md" />
                </div>
            </div>
            {post.caption && (
                <div className="p-5 border-t border-gray-50 bg-white">
                    <p className="text-[#2B4C6F]/80 text-[13px] md:text-[14px] line-clamp-4 leading-relaxed" style={fontInter}>
                        {post.caption}
                    </p>
                    <div className="mt-3 text-[#8FA8C8] text-[10px] font-bold tracking-widest flex items-center gap-1.5" style={fontInter}>
                        <Instagram className="w-3.5 h-3.5" />
                        <span>View on Instagram</span>
                    </div>
                </div>
            )}
        </motion.a>
    );
});
const VideoModal = ({ vId, onClose }: { vId: string; onClose: () => void }) => {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/85 backdrop-blur-md" />
            <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative z-[221] w-full overflow-hidden bg-black shadow-2xl"
                style={{
                    borderRadius: '24px',
                    aspectRatio: '16 / 9',
                    maxWidth: 'min(1100px, calc(100vw - 2rem), calc((100vh - 2rem) * 16 / 9))',
                }}
                role="dialog"
                aria-modal="true"
                aria-label="Vocal U video player"
            >
                <button onClick={onClose} className="absolute right-4 top-4 z-20 rounded-full bg-black/45 p-2 text-white transition-colors hover:bg-black/60 hover:text-[#8FA8C8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Close video player">
                    <X className="w-7 h-7" />
                </button>
                <iframe className="h-full w-full border-0" src={`https://www.youtube.com/embed/${vId}?autoplay=1&rel=0`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen title="Video Player" referrerPolicy="strict-origin-when-cross-origin" />
            </motion.div>
        </div>,
        document.body
    );
};
const VideoCard = memo(function VideoCard({ item, isHighlighted = false, onOpen }: { item: YouTubeVideo | string, isHighlighted?: boolean, onOpen: (vId: string) => void }) {
    const vId = typeof item === 'string' ? item : item.snippet.resourceId.videoId;
    const title = typeof item === 'string' ? 'ICCA 2025 Set: Full Performance' : item.snippet.title;
    const dateStr = typeof item === 'string' ? 'Mar 1, 2025' : new Date(item.snippet.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return (
        <motion.button type="button" whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} onClick={() => onOpen(vId)}
            className={`group flex w-full flex-col overflow-hidden border bg-white text-left transition-[transform,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#2B4C6F] ${isHighlighted ? 'border-[#8FA8C8]' : 'border-gray-100'
                }`}
            style={{ borderRadius: '16px' }}
        >
            <div className={`relative bg-black ${isHighlighted ? 'pt-[56.25%]' : 'pt-[56.25%]'}`}>
                {isHighlighted && (
                    <div className="absolute bottom-4 left-4 z-10">
                        <span className="bg-[#8FA8C8] text-white px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] border border-white/20 font-yearbook" style={fontYearbook}>
                            Featured
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/20">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                        <Youtube className="w-8 h-8 text-white" />
                    </div>
                </div>
                <img src={`https://img.youtube.com/vi/${vId}/maxresdefault.jpg`} alt={title} className="absolute top-0 left-0 w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
            </div>
            <div className={`p-5 flex-grow flex flex-col justify-between transition-colors ${isHighlighted ? 'bg-gray-50/50' : ''}`}>
                <div>
                    <div className="flex items-center gap-2 text-[#8FA8C8] mb-2 tracking-wider font-semibold text-[10px]" style={fontInter}>
                        <Calendar className="w-3.5 h-3.5" />
                        {dateStr}
                    </div>
                    <h3 className={`text-[#2B4C6F] group-hover:text-[#8FA8C8] transition-colors leading-[1.2] font-yearbook line-clamp-2 ${isHighlighted ? 'text-xl' : 'text-lg'}`} style={fontYearbook}>
                        {title}
                    </h3>
                </div>
                {isHighlighted && (
                    <p className="mt-3 text-[#2B4C6F]/70 text-sm leading-relaxed" style={fontInter}>
                        Our complete set from the 2025 ICCA competition.
                    </p>
                )}
            </div>
        </motion.button>
    );
});
export function Media() {
    const mediaDescription =
        'Watch Vocal U performances on YouTube and browse recent Instagram posts from the University of Minnesota gender-inclusive a cappella group.';
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [instaPosts, setInstaPosts] = useState<InstaPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [youtubeError, setYoutubeError] = useState(false);
    const [instagramError, setInstagramError] = useState(false);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        let cancelled = false;

        async function loadFeeds() {
            setLoading(true);
            const youtubeUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;
            const [youtubeResult, instagramResult] = await Promise.allSettled([
                fetchJson<{ items?: unknown[] }>(youtubeUrl, { signal: controller.signal }, 10000),
                fetchJson<{ posts?: unknown[] }>(INSTA_FEED_URL, { signal: controller.signal }, 10000),
            ]);

            if (cancelled) return;

            if (youtubeResult.status === 'fulfilled') {
                setVideos((youtubeResult.value.items || []).filter(isYouTubeVideo));
                setYoutubeError(false);
            } else {
                console.error('YouTube feed error:', youtubeResult.reason);
                setYoutubeError(true);
            }

            if (instagramResult.status === 'fulfilled') {
                setInstaPosts((instagramResult.value.posts || []).map(normalizeInstagramPost).filter((post): post is InstaPost => post !== null).slice(0, 9));
                setInstagramError(false);
            } else {
                console.error('Instagram feed error:', instagramResult.reason);
                setInstagramError(true);
            }

            setLoading(false);
        }

        void loadFeeds();
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);
    const mediaSchema: SeoSchema[] = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Vocal U Media',
            description: mediaDescription,
            url: toAbsoluteUrl('/media'),
            about: {
                '@id': toAbsoluteUrl('/#organization'),
            },
        },
    ];

    if (videos.length > 0) {
        mediaSchema.push({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Vocal U Videos',
            itemListElement: videos.map((video, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: video.snippet?.title || `Vocal U video ${index + 1}`,
                url: `https://www.youtube.com/watch?v=${video.snippet?.resourceId?.videoId}`,
            })),
        });
    }

    return (
        <PageTransition className="pb-8 md:pb-16">
            <Seo
                title="Vocal U Media"
                description={mediaDescription}
                path="/media"
                keywords={['Vocal U videos', 'Vocal U Instagram', 'UMN a cappella media']}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Media', path: '/media' },
                ]}
                schema={mediaSchema}
            />
            <AnimatePresence>
                {activeVideo && <VideoModal vId={activeVideo} onClose={() => setActiveVideo(null)} />}
            </AnimatePresence>
            {/* Header Section */}
            <motion.section variants={childVariants} style={{ marginTop: '25px', marginBottom: '25px' }}>
                <div className="vu-page-hero bg-[#8FA8C8] py-10 md:py-16 px-4 text-center" style={{ borderRadius: '16px' }}>
                    <h1 className="text-white font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}>
                        Media
                    </h1>
                    <p className="text-white/90 mt-2 max-w-2xl mx-auto text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Catch our latest performances and keep up with us on social media.
                    </p>
                </div>
            </motion.section>
            {/* Main Feeds Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
                {/* YouTube Column */}
                <motion.section variants={childVariants}>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                        <div>
                            <div className="flex items-center gap-2 text-[#2B4C6F]" style={fontInter}>
                                <Youtube className="w-5 h-5" />
                                <h2 className="text-4xl md:text-5xl font-yearbook" style={fontYearbook}>YouTube</h2>
                            </div>
                        </div>
                        <motion.a href="https://www.youtube.com/@vocal-u/videos" target="_blank" rel="noopener noreferrer" whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 border-2 border-[#8FA8C8] text-[#2B4C6F] px-5 py-2 hover:bg-[#8FA8C8] hover:text-white transition-all duration-200 cursor-pointer" style={{ ...fontYearbook, borderRadius: '12px', fontSize: '14px' }}>
                            YouTube Channel
                            <Youtube className="w-4 h-4" />
                        </motion.a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Highlighted Video */}
                        <VideoCard item="wksl9wmTQio" isHighlighted={true} onOpen={setActiveVideo} />
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="aspect-video bg-gray-100 animate-pulse" style={{ borderRadius: '16px' }} />
                            ))
                        ) : youtubeError ? (
                            <p className="col-span-full text-[#2B4C6F]/60 text-center py-8" style={fontInter}>Unable to load additional videos.</p>
                        ) : (
                            videos.map((video) => (
                                <VideoCard key={video.id} item={video} onOpen={setActiveVideo} />
                            ))
                        )}
                    </div>
                </motion.section>
                {/* Instagram Column */}
                <motion.section variants={childVariants}>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                        <div>
                            <div className="flex items-center gap-2 text-[#2B4C6F]" style={fontInter}>
                                <Instagram className="w-5 h-5" />
                                <h2 className="text-4xl md:text-5xl font-yearbook" style={fontYearbook}>Instagram</h2>
                            </div>
                        </div>
                        <motion.a href="https://www.instagram.com/vocal_u" target="_blank" rel="noopener noreferrer" whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 border-2 border-[#8FA8C8] text-[#2B4C6F] px-5 py-2 hover:bg-[#8FA8C8] hover:text-white transition-all duration-200 cursor-pointer" style={{ ...fontYearbook, borderRadius: '12px', fontSize: '14px' }}>
                            Visit @vocal_u
                            <Instagram className="w-4 h-4" />
                        </motion.a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse" style={{ borderRadius: '16px' }} />
                            ))
                        ) : instagramError ? (
                            <p className="col-span-full text-[#2B4C6F]/60 text-center py-8" style={fontInter}>Unable to load photos.</p>
                        ) : (
                            instaPosts.map((post) => (
                                <InstagramCard key={post.id} post={post} />
                            ))
                        )}
                    </div>
                </motion.section>
            </div>
            {/* Reach Out Section */}
            <motion.section variants={childVariants} className="bg-gray-50 border border-gray-100 p-8 md:p-12 text-center" style={{ borderRadius: '16px' }}>
                <div className="flex justify-center mb-6">
                    <div className="bg-[#8FA8C8]/20 p-4 rounded-full">
                        <MessageCircle className="w-8 h-8 text-[#2B4C6F]" />
                    </div>
                </div>
                <h2 className="text-[#2B4C6F] text-3xl md:text-4xl mb-4 font-yearbook" style={fontYearbook}>
                    Want more Media?
                </h2>
                <p className="text-[#2B4C6F]/70 max-w-xl mx-auto mb-8" style={fontInter}>
                    If you're looking for additional media or want to reach out about something else, we'd love to hear from you.
                </p>
                <motion.div whileHover={{ x: 6 }} whileTap={{ scale: 0.95 }} className="inline-block">
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-[#2B4C6F] px-8 py-3 border border-gray-100 hover:bg-[#8FA8C8]/10 hover:border-[#8FA8C8]/50 transition-all duration-300 cursor-pointer" style={{ ...fontYearbook, borderRadius: '12px' }}>
                        Get in Touch
                        <ExternalLink className="w-5 h-5" />
                    </Link>
                </motion.div>
            </motion.section>
            <ExploreMore currentPath="/media" />
        </PageTransition>
    );
}
