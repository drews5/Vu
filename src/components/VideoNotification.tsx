import { useState, useCallback } from 'react';
import { X, Play } from 'lucide-react';

const VIDEO_ID = 'wksl9wmTQio';
const THUMBNAIL_URL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export function VideoNotification() {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const dismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  }, []);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  if (!isVisible) return null;

  return (
    <>
      {!showModal && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-white shadow-lg cursor-pointer group max-w-[200px] transition-transform active:scale-95"
          style={{ borderRadius: '16px' }}
          onClick={openModal}
        >
          <div className="relative overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="relative h-28 overflow-hidden">
              <img
                src={THUMBNAIL_URL}
                alt="2025 ICCA Set"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3">
                  <Play className="w-6 h-6 text-[#8FA8C8]" fill="currentColor" />
                </div>
              </div>
            </div>

            <button
              onClick={dismiss}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl bg-white border border-gray-100 shadow-xl"
            style={{ borderRadius: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 bg-white text-[#2B4C6F] rounded-full p-3 border border-gray-100 shadow-md hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative pt-[56.25%] overflow-hidden" style={{ borderRadius: '16px' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`}
                title="Vocal U 2025 ICCA Set"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: '16px' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
