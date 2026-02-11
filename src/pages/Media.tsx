import { motion } from 'motion/react';
import { Play, Image as ImageIcon } from 'lucide-react';

const mediaItems = [
  { type: 'video', title: 'ICCA 2024 Set', thumbnail: 'https://images.unsplash.com/photo-1699802703996-d19cc0b185b9' },
  { type: 'photo', title: 'Spring Showcase 2024', thumbnail: 'https://images.unsplash.com/photo-1752300779727-13d587a42881' },
  { type: 'video', title: 'Winter Concert Highlights', thumbnail: 'https://images.unsplash.com/photo-1689018161278-4e363b0c4a81' },
  { type: 'photo', title: 'Campus Performance', thumbnail: 'https://images.unsplash.com/photo-1760539619770-f58d0588db9e' },
  { type: 'photo', title: 'Group Retreat', thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4' },
  { type: 'video', title: 'Recording Session', thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04' },
];

export function Media() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-8 md:pb-16"
    >
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ marginTop: '25px', marginBottom: '25px' }}
      >
        <div className="bg-[#8FA8C8] shadow-xl py-16 md:py-24 px-4 text-center" style={{ borderRadius: '20px' }}>
          <h1 
            className="text-white" 
            style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(48px, 10vw, 96px)',
              letterSpacing: '0.05em'
            }}
          >
            MEDIA
          </h1>
          <p className="text-white/90 mt-4 max-w-2xl mx-auto font-inter text-lg">
            A collection of our favorite moments, from high-stakes competitions to casual campus gigs.
          </p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '25px' }}>
        {mediaItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative cursor-pointer overflow-hidden shadow-lg"
            style={{ borderRadius: '20px', aspectRatio: '16/9' }}
          >
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              {item.type === 'video' ? (
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-bold" style={{ fontFamily: "'Yearbook Solid', sans-serif" }}>
                {item.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
