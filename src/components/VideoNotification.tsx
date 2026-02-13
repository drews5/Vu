import { useState } from 'react';
import { X, Play } from 'lucide-react';

export function VideoNotification() {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const videoId = 'wksl9wmTQio';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!isVisible) return null;

  return (
    <>
      {/* Notification Popup - Smaller, thumbnail only */}
      {isVisible && !showModal && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-white shadow-2xl cursor-pointer group max-w-[200px] transition-transform hover:scale-105"
          style={{ borderRadius: '20px' }}
          onClick={() => setShowModal(true)}
        >
          <div className="relative overflow-hidden" style={{ borderRadius: '20px' }}>
            {/* Thumbnail */}
            <div className="relative h-28 overflow-hidden">
              <img 
                src={thumbnailUrl} 
                alt="2025 ICCA Set" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3">
                  <Play className="w-6 h-6 text-[#8FA8C8]" fill="currentColor" />
                </div>
              </div>
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
        </div>
      )}

      {/* Video Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
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
          </div>
        </div>
      )}
    </>
  );
}