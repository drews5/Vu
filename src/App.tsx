import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { VideoNotification } from './components/VideoNotification';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { Contact } from './pages/Contact';
import { Auditions } from './pages/Auditions';

function AppContent() {
  const location = useLocation();
  const isAuditionsPage = location.pathname === '/auditions';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuditionsPage && <Header />}
      <div className={isAuditionsPage ? "px-3 md:px-[50px]" : "px-3 md:px-[50px] pb-[25px]"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auditions" element={<Auditions />} />
        </Routes>
      </div>
      {!isAuditionsPage && <VideoNotification />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}