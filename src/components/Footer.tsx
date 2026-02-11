import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import footerLogo from 'figma:asset/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2B4C6F] text-white py-12 px-6 md:px-12 mx-3 md:mx-0" style={{ borderRadius: '20px', marginTop: '25px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <img 
              src={footerLogo} 
              alt="Vocal U - University of Minnesota's Premier A Cappella Group" 
              className="h-20 w-auto mb-4"
            />
            <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gender-inclusive a cappella group at the University of Minnesota-Twin Cities, established in 2011.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4" style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: '20px'
            }}>
              Quick Links
            </h3>
            <ul className="space-y-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
              <li>
                <Link to="/" className="text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-white/70 hover:text-white transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4" style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: '20px'
            }}>
              Resources
            </h3>
            <ul className="space-y-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
              <li>
                <Link to="/auditions" className="text-white/70 hover:text-white transition-colors">
                  Auditions
                </Link>
              </li>
              <li>
                <Link to="/media" className="text-white/70 hover:text-white transition-colors">
                  Media
                </Link>
              </li>
              <li>
                <a href="https://gopherlink.umn.edu/organization/vocalu" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  GopherLink
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Showcase
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="mb-4" style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: '20px'
            }}>
              Connect
            </h3>
            <div className="mb-4">
              <a 
                href="mailto:vocalu@umn.edu"
                className="text-white/70 hover:text-white transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
              >
                vocalu@umn.edu
              </a>
            </div>
            <div className="flex gap-3 mt-4">
              <a 
                href="https://instagram.com/vocaluminn" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/vocaluminn" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@vocaluminn" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://tiktok.com/@vocaluminn" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            © {currentYear} Vocal U A Cappella. This group is a Registered Student Organization and is independent of the University of Minnesota.
          </p>
        </div>
      </div>
    </footer>
  );
}