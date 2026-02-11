import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Youtube, Facebook } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from 'figma:asset/d4630c01b543cc75980f0b293230859d29654fbb.png';

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  const navItems = [
    { name: 'HOME', path: '/' },
    { 
      name: 'ABOUT', 
      path: '/about',
      dropdown: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Members', path: '/members' },
        { name: 'Media', path: '/media' },
        { name: 'Donate', path: '/donate' },
        { name: 'Auditions', path: '/auditions' }
      ]
    },
    { name: 'EVENTS', path: '/events' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="bg-[#8FA8C8] mx-3 md:mx-[50px] mt-[25px] px-4 md:px-8 py-4 shadow-lg relative z-50" style={{ borderRadius: '20px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between relative">
          <Link to="/" className="flex items-center">
            <motion.img 
              src={logoImage} 
              alt="Vocal U" 
              className="h-16 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </Link>
          
          <nav className="flex items-center absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item, index) => (
              <div key={item.path} className="flex items-center">
                {item.dropdown ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                  >
                    <div
                      className={`px-4 py-2 cursor-default transition-all duration-200 ${
                        location.pathname.includes('/about') || location.pathname === '/members' || location.pathname === '/media' || location.pathname === '/donate' || location.pathname === '/auditions'
                          ? 'text-white'
                          : 'text-white/90 hover:text-white'
                      }`}
                      style={{ 
                        fontFamily: "'Yearbook Solid', sans-serif",
                        fontSize: '22px',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {item.name}
                    </div>
                    
                    <AnimatePresence>
                      {aboutDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 bg-white shadow-lg py-2 min-w-[200px] z-50"
                          style={{ borderRadius: '12px' }}
                        >
                          {item.dropdown.map((dropItem, i) => (
                            <motion.div
                              key={dropItem.path}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <Link
                                to={dropItem.path}
                                className="block px-6 py-2 text-[#2B4C6F] hover:bg-[#8FA8C8]/10 transition-colors"
                                style={{ 
                                  fontFamily: "'Yearbook Solid', sans-serif",
                                  fontSize: '18px'
                                }}
                              >
                                {dropItem.name}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-4 py-2 transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-white'
                        : 'text-white/90 hover:text-white hover:scale-105'
                    }`}
                    style={{ 
                      fontFamily: "'Yearbook Solid', sans-serif",
                      fontSize: '22px',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.name}
                  </Link>
                )}
                {index < navItems.length - 1 && (
                  <div className="h-6 w-[1px] bg-white/30" />
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.a 
              href="https://instagram.com/vocaluminn" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-2 hover:bg-white/90 transition-colors"
              aria-label="Instagram"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="w-5 h-5 text-[#8FA8C8]" />
            </motion.a>
            <motion.a 
              href="https://facebook.com/vocaluminn" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-2 hover:bg-white/90 transition-colors"
              aria-label="Facebook"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Facebook className="w-5 h-5 text-[#8FA8C8]" />
            </motion.a>
            <motion.a 
              href="https://tiktok.com/@vocaluminn" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-2 hover:bg-white/90 transition-colors"
              aria-label="TikTok"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-[#8FA8C8]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </motion.a>
            <motion.a 
              href="https://youtube.com/@vocaluminn" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-2 hover:bg-white/90 transition-colors"
              aria-label="YouTube"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Youtube className="w-5 h-5 text-[#8FA8C8]" />
            </motion.a>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="Vocal U" className="h-12 w-auto" />
            </Link>
            
            <motion.button 
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <nav className="mt-4 pt-4 border-t border-white/30">
                  {navItems.map((item, index) => (
                    <motion.div 
                      key={item.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.dropdown ? (
                        <div>
                          <button
                            onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                            className="w-full text-left px-4 py-3 text-white/90"
                            style={{ 
                              fontFamily: "'Yearbook Solid', sans-serif",
                              fontSize: '20px',
                              letterSpacing: '0.05em'
                            }}
                          >
                            {item.name}
                          </button>
                          <AnimatePresence>
                            {aboutDropdownOpen && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="pl-4 overflow-hidden"
                              >
                                {item.dropdown.map((dropItem, i) => (
                                  <motion.div
                                    key={dropItem.path}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                  >
                                    <Link
                                      to={dropItem.path}
                                      onClick={() => {
                                        setMobileMenuOpen(false);
                                        setAboutDropdownOpen(false);
                                      }}
                                      className="block px-4 py-2 text-white/80"
                                      style={{ 
                                        fontFamily: "'Yearbook Solid', sans-serif",
                                        fontSize: '18px'
                                      }}
                                    >
                                      {dropItem.name}
                                    </Link>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-4 py-3 transition-all duration-200 ${
                            location.pathname === item.path
                              ? 'text-white'
                              : 'text-white/90 hover:text-white'
                          }`}
                          style={{ 
                            fontFamily: "'Yearbook Solid', sans-serif",
                            fontSize: '20px',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Social Media Icons in Mobile Menu */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 px-4 py-4 mt-2"
                  >
                    <motion.a 
                      href="https://instagram.com/vocaluminn" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-full p-2"
                      aria-label="Instagram"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Instagram className="w-4 h-4 text-[#8FA8C8]" />
                    </motion.a>
                    <motion.a 
                      href="https://facebook.com/vocaluminn" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-full p-2"
                      aria-label="Facebook"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Facebook className="w-4 h-4 text-[#8FA8C8]" />
                    </motion.a>
                    <motion.a 
                      href="https://tiktok.com/@vocaluminn" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-full p-2"
                      aria-label="TikTok"
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-4 h-4 text-[#8FA8C8]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </motion.a>
                    <motion.a 
                      href="https://youtube.com/@vocaluminn" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-full p-2"
                      aria-label="YouTube"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Youtube className="w-4 h-4 text-[#8FA8C8]" />
                    </motion.a>
                  </motion.div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}