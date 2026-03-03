import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Analytics } from '@vercel/analytics/react';
// @ts-ignore
import { useWebHaptics } from 'web-haptics/react';
import { HelmetProvider } from 'react-helmet-async';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Members = lazy(() => import('./pages/Members').then(m => ({ default: m.Members })));
const Media = lazy(() => import('./pages/Media').then(m => ({ default: m.Media })));
const Donate = lazy(() => import('./pages/Donate').then(m => ({ default: m.Donate })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const EventDetail = lazy(() => import('./pages/EventDetail').then(m => ({ default: m.EventDetail })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Auditions = lazy(() => import('./pages/Auditions').then(m => ({ default: m.Auditions })));
const Portal = lazy(() => import('./pages/Portal').then(m => ({ default: m.Portal })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8FA8C8]" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function GlobalHaptics() {
  const { trigger } = useWebHaptics();

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window);
    if (!isMobile) return;

    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target !== document.body) {
        if (
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.getAttribute('role') === 'button'
        ) {
          trigger('success');
          break;
        }
        target = target.parentElement;
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [trigger]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAuditionsPage = location.pathname === '/auditions';
  const isPortalPage = location.pathname === '/portal';
  const hideHeaderFooter = isAuditionsPage || isPortalPage;

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <GlobalHaptics />
      <Analytics />
      <div className="max-w-[1440px] mx-auto px-3 md:px-[50px]">
        {!hideHeaderFooter && <Header />}
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/members" element={<Members />} />
              <Route path="/media" element={<Media />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:eventId" element={<EventDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auditions" element={<Auditions />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
        {!hideHeaderFooter && <Footer />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}