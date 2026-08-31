import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalHaptics } from './components/GlobalHaptics';
import { HelmetProvider } from 'react-helmet-async';
import { springShowcasePath } from './utils/eventRoutes';

const Analytics = lazy(() => import('@vercel/analytics/react').then((m) => ({ default: m.Analytics })));
const SpeedInsights = lazy(() => import('@vercel/speed-insights/react').then((m) => ({ default: m.SpeedInsights })));
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Members = lazy(() => import('./pages/Members').then(m => ({ default: m.Members })));
const Media = lazy(() => import('./pages/Media').then(m => ({ default: m.Media })));
const Donate = lazy(() => import('./pages/Donate').then(m => ({ default: m.Donate })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const EventDetail = lazy(() => import('./pages/EventDetail').then(m => ({ default: m.EventDetail })));
const SpringShowcase = lazy(() => import('./pages/SpringShowcase').then(m => ({ default: m.SpringShowcase })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Auditions = lazy(() => import('./pages/Auditions').then(m => ({ default: m.Auditions })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3" role="status" aria-label="Loading page">
      <div className="vu-equalizer" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className="font-yearbook text-sm tracking-[0.2em] text-[#2B4C6F]/60">WARMING UP</span>
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

function ProductionInstrumentation() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!import.meta.env.PROD) {
      return;
    }

    const timeoutId = window.setTimeout(() => setShouldLoad(true), 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!import.meta.env.PROD || !shouldLoad) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Analytics />
      <SpeedInsights />
    </Suspense>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuditionsPage = location.pathname === '/auditions';
  const hideHeaderFooter = isAuditionsPage;

  return (
    <div className="vu-site-shell min-h-screen bg-white">
      <ScrollToTop />
      <GlobalHaptics />
      <ProductionInstrumentation />
      <div className="vu-frame vu-content-shell">
        {!hideHeaderFooter && <Header />}
        <main className={location.pathname !== '/' && !hideHeaderFooter ? 'md:pt-[110px]' : ''}>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/members" element={<Members />} />
                <Route path="/media" element={<Media />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/events/showcase" element={<SpringShowcase />} />
                <Route path="/events" element={<Events />} />
                <Route path="/event/spring-showcase-2026" element={<Navigate to={springShowcasePath} replace />} />
                <Route path="/event/:eventId" element={<EventDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auditions" element={<Auditions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        {!hideHeaderFooter && <Footer />}
      </div>
    </div>
  );
}



export default function App() {
  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <Router>
          <AppContent />
        </Router>
      </MotionConfig>
    </HelmetProvider>
  );
}
