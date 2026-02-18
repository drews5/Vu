import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, ExternalLink, Calendar, MessageCircle } from 'lucide-react';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };

// Instagram Post Type from Behold
type InstaPost = {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
  timestamp: string;
};

const InstagramCard = memo(function InstagramCard({ post }: { post: InstaPost }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col"
      style={{ borderRadius: '16px' }}
    >
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={post.mediaUrl}
          alt={post.caption || "Instagram Post"}
          className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
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
    </a>
  );
});

const VideoCard = memo(function VideoCard({ item, isHighlighted = false }: { item: any, isHighlighted?: boolean }) {
  const vId = typeof item === 'string' ? item : item.snippet.resourceId.videoId;
  const title = typeof item === 'string' ? 'ICCA 2025 SET: FULL PERFORMANCE' : item.snippet.title;
  const dateStr = typeof item === 'string' ? 'Feb 2025' : new Date(item.snippet.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div 
      className={`bg-white overflow-hidden border shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col ${
        isHighlighted ? 'border-[#8FA8C8] ring-4 ring-[#8FA8C8]/20' : 'border-gray-100'
      }`}
      style={{ borderRadius: '16px' }}
    >
      <div className={`relative bg-black ${isHighlighted ? 'pt-[56.25%]' : 'pt-[56.25%]'}`}>
        {isHighlighted && (
          <div className="absolute top-4 left-4 z-10 bg-[#2B4C6F] text-white px-3 py-1 text-[10px] font-bold tracking-widest rounded-full shadow-lg" style={fontYearbook}>
            FEATURED PERFORMANCE
          </div>
        )}
        <iframe 
          className="absolute top-0 left-0 w-full h-full border-0"
          src={`https://www.youtube.com/embed/${vId}?rel=0`} 
          allow="autoplay; encrypted-media; picture-in-picture" 
          allowFullScreen
          title={title}
        />
      </div>
      <div className={`p-5 flex-grow flex flex-col justify-between ${isHighlighted ? 'bg-gray-50/50' : ''}`}>
        <div>
          <div className="flex items-center gap-2 text-[#8FA8C8] mb-2 tracking-wider font-semibold text-[10px]" style={fontInter}>
            <Calendar className="w-3.5 h-3.5" />
            {dateStr}
          </div>
          <h3 
            className={`text-[#2B4C6F] leading-[1.2] uppercase line-clamp-2 ${isHighlighted ? 'text-xl md:text-2xl' : 'text-lg'}`} 
            style={fontYearbook}
          >
            {title}
          </h3>
        </div>
        {isHighlighted && (
          <p className="mt-3 text-[#2B4C6F]/70 text-sm leading-relaxed" style={fontInter}>
            Our complete set from the 2025 ICCA competition.
          </p>
        )}
      </div>
    </div>
  );
});

export function Media() {
  const [videos, setVideos] = useState<any[]>([]);
  const [instaPosts, setInstaPosts] = useState<InstaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadFeeds() {
      const YOUTUBE_API_KEY = 'AIzaSyDN6gIEwSBWQkwZ0LqcmzwQjwBJy3Pgq7Y';
      const YOUTUBE_PLAYLIST_ID = 'UUnTUlN8WPYoqaAgnR58dXBA';
      const INSTA_FEED_URL = 'https://feeds.behold.so/rWuujcErcs5hcWQ5MPPw';

      try {
        setLoading(true);
        
        // Fetch YouTube
        const ytPromise = fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`)
          .then(res => res.json());

        // Fetch Instagram
        const instaPromise = fetch(INSTA_FEED_URL)
          .then(res => res.json());

        const [ytData, instaData] = await Promise.all([ytPromise, instaPromise]);
        
        if (ytData.items) {
          setVideos(ytData.items);
        }

        if (instaData && instaData.posts) {
          setInstaPosts(instaData.posts.slice(0, 9));
        }

        setError(false);
      } catch (err) {
        console.error('Feed Error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadFeeds();
  }, []);

  return (
    <div className="pb-8 md:pb-16">
      {/* Header Section */}
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="bg-[#8FA8C8] py-10 md:py-16 px-4 text-center"
          style={{ borderRadius: '16px' }}
        >
          <h1
            className="text-white"
            style={{ fontFamily: "'Yearbook Solid', sans-serif", fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}
          >
            MEDIA
          </h1>
          <p
            className="text-white/90 mt-2 max-w-2xl mx-auto text-sm md:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore our journey through performance, competition, and community.
          </p>
        </div>
      </section>

      {/* Main Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
        {/* YouTube Column */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-[#8FA8C8] mb-2" style={fontInter}>
                <Youtube className="w-5 h-5" />
                <span className="tracking-widest text-sm font-bold">Latest Performances</span>
              </div>
              <h2 className="text-[#2B4C6F] text-4xl md:text-5xl" style={fontYearbook}>
                YOUTUBE
              </h2>
            </div>
            <a
              href="https://www.youtube.com/@vocal-u/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-[#8FA8C8] text-[#2B4C6F] px-5 py-2 transition-all hover:bg-[#8FA8C8]/10 font-bold"
              style={{ ...fontYearbook, borderRadius: '12px', fontSize: '14px' }}
            >
              YOUTUBE CHANNEL
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-8">
            {/* Highlighted Video */}
            <VideoCard item="wksl9wmTQio" isHighlighted={true} />

            {/* Other Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="aspect-video bg-gray-100 animate-pulse" style={{ borderRadius: '16px' }} />
                ))
              ) : error ? (
                <p className="col-span-full text-[#2B4C6F]/60 text-center py-8" style={fontInter}>Unable to load additional videos.</p>
              ) : (
                videos.map((video) => (
                  <VideoCard key={video.id} item={video} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Instagram Column */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-[#8FA8C8] mb-2" style={fontInter}>
                <Instagram className="w-5 h-5" />
                <span className="tracking-widest text-sm font-bold">Recent Photos</span>
              </div>
              <h2 className="text-[#2B4C6F] text-4xl md:text-5xl" style={fontYearbook}>
                INSTAGRAM
              </h2>
            </div>
            <a
              href="https://www.instagram.com/vocal_u"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-[#8FA8C8] text-[#2B4C6F] px-5 py-2 transition-all hover:bg-[#8FA8C8]/10 font-bold"
              style={{ ...fontYearbook, borderRadius: '12px', fontSize: '14px' }}
            >
              FOLLOW @VOCAL_U
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse" style={{ borderRadius: '16px' }} />
              ))
            ) : error ? (
              <p className="col-span-full text-[#2B4C6F]/60 text-center py-8" style={fontInter}>Unable to load photos.</p>
            ) : (
              instaPosts.map((post) => (
                <InstagramCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Reach Out Section */}
      <section className="bg-gray-50 border border-gray-100 p-8 md:p-12 text-center" style={{ borderRadius: '16px' }}>
        <div className="flex justify-center mb-6">
          <div className="bg-[#8FA8C8]/20 p-4 rounded-full">
            <MessageCircle className="w-8 h-8 text-[#2B4C6F]" />
          </div>
        </div>
        <h2 className="text-[#2B4C6F] text-3xl md:text-4xl mb-4" style={fontYearbook}>
          WANT MORE MEDIA?
        </h2>
        <p className="text-[#2B4C6F]/70 max-w-xl mx-auto mb-8" style={fontInter}>
          If you're looking for additional media or want to reach out about something else, we'd love to hear from you.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-[#2B4C6F] text-white px-8 py-3 transition-all hover:bg-[#1a2f45] font-bold"
          style={{ ...fontYearbook, borderRadius: '12px' }}
        >
          GET IN TOUCH
          <ExternalLink className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
