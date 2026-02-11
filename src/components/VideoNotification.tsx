import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';

export function VideoNotification() {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const videoId = 'wksl9wmTQio';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!isVisible) return null;

  return (
    <>
      {/* Notification Popup */}
      <AnimatePresence>
        {isVisible && !showModal && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ delay: 2, duration: 0.5, type: 'spring' }}
            className="fixed bottom-6 right-6 z-50 bg-white shadow-2xl cursor-pointer group max-w-sm"
            style={{ borderRadius: '20px' }}
            onClick={() => setShowModal(true)}
          >
            <div className="relative overflow-hidden" style={{ borderRadius: '20px' }}>
              {/* Thumbnail */}
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={thumbnailUrl} 
                  alt="2025 ICCA Set" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-white/90 rounded-full p-3"
                  >
                    <Play className="w-6 h-6 text-[#8FA8C8]" fill="currentColor" />
                  </motion.div>
                </div>
              </div>

              {/* Text Content */}
              <div className="p-4">
                <h3 className="text-[#2B4C6F] mb-1" style={{ 
                  fontFamily: "'Yearbook Solid', sans-serif",
                  fontSize: '18px'
                }}>
                  Watch our 2025 ICCA set!
                </h3>
                <p className="text-[#2B4C6F]/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Click to watch
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-4xl bg-white"
              style={{ borderRadius: '20px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute -top-4 -right-4 bg-white text-[#2B4C6F] rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video Container */}
              <div className="relative pt-[56.25%] overflow-hidden" style={{ borderRadius: '20px' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title="Vocal U 2025 ICCA Set"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '20px' }}
                />
              </div>

              {/* Video Title */}
              <div className="p-6">
                <h2 className="text-[#2B4C6F] mb-2" style={{ 
                  fontFamily: "'Yearbook Solid', sans-serif",
                  fontSize: '24px'
                }}>
                  Vocal U 2025 ICCA Set
                </h2>
                <p className="text-[#2B4C6F]/70" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
                  Watch our performance from the 2025 International Championship of Collegiate A Cappella!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
