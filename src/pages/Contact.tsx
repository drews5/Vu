import { Mail, Instagram, Facebook, Youtube, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xanygerw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-8 md:pb-16"
    >
      {/* Hero Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ marginTop: '25px', marginBottom: '25px' }}
      >
        <div className="bg-[#8FA8C8] shadow-xl py-16 md:py-24 px-4 md:px-8" style={{ borderRadius: '20px' }}>
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white mb-4" 
              style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: 'clamp(48px, 10vw, 96px)',
                letterSpacing: '0.05em'
              }}
            >
              CONTACT US
            </motion.h1>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-white" 
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '17px'
              }}
            >
              We'd love to hear from you!
            </motion.p>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '25px' }}>
        {/* Contact Form */}
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white p-6 md:p-8 shadow-lg" 
          style={{ borderRadius: '20px' }}
        >
          <h2 className="text-[#2B4C6F] mb-6" style={{ 
            fontFamily: "'Yearbook Solid', sans-serif",
            fontSize: 'clamp(28px, 5vw, 36px)'
          }}>
            SEND US A MESSAGE
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-[#2B4C6F] mb-2" style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px'
              }}>
                Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#A3B8D3] focus:border-[#8FA8C8] focus:outline-none transition-colors"
                style={{ 
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-[#2B4C6F] mb-2" style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px'
              }}>
                Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#A3B8D3] focus:border-[#8FA8C8] focus:outline-none transition-colors"
                style={{ 
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-[#2B4C6F] mb-2" style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px'
              }}>
                Subject
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#A3B8D3] focus:border-[#8FA8C8] focus:outline-none transition-colors"
                style={{ 
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-[#2B4C6F] mb-2" style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px'
              }}>
                Message
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border-2 border-[#A3B8D3] focus:border-[#8FA8C8] focus:outline-none transition-colors resize-none"
                style={{ 
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-[#8FA8C8] text-white px-8 py-4 hover:bg-[#7A97B7] transition-colors shadow-lg disabled:opacity-50"
              style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: '18px',
                letterSpacing: '0.05em',
                borderRadius: '20px'
              }}
            >
              {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
            </motion.button>

            {status === 'success' && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 text-center" 
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Thank you! Your message has been sent.
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-center" 
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Oops! Something went wrong. Please try again.
              </motion.p>
            )}
          </form>
        </motion.div>

        {/* Contact Info */}
        <div className="space-y-6">
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 md:p-8 shadow-lg" 
            style={{ borderRadius: '20px' }}
          >
            <h2 className="text-[#2B4C6F] mb-6" style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(28px, 5vw, 36px)'
            }}>
              GET IN TOUCH
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#8FA8C8] p-3" style={{ borderRadius: '15px' }}>
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#2B4C6F] mb-1" style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '17px',
                    fontWeight: '600'
                  }}>Email</h3>
                  <p className="text-[#2B4C6F]/80" style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px'
                  }}>vocalu@umn.edu</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#8FA8C8] p-3" style={{ borderRadius: '15px' }}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#2B4C6F] mb-1" style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '17px',
                    fontWeight: '600'
                  }}>Location</h3>
                  <p className="text-[#2B4C6F]/80" style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px'
                  }}>
                    University of Minnesota<br />
                    Minneapolis, MN 55455
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 md:p-8 shadow-lg" 
            style={{ borderRadius: '20px' }}
          >
            <h2 className="text-[#2B4C6F] mb-6" style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(28px, 5vw, 36px)'
            }}>
              FOLLOW US
            </h2>
            
            <div className="flex gap-4">
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://instagram.com/vocaluminn" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#8FA8C8] p-4 hover:bg-[#7A97B7] transition-colors"
                aria-label="Instagram"
                style={{ borderRadius: '15px' }}
              >
                <Instagram className="w-6 h-6 text-white" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://facebook.com/vocaluminn" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#8FA8C8] p-4 hover:bg-[#7A97B7] transition-colors"
                aria-label="Facebook"
                style={{ borderRadius: '15px' }}
              >
                <Facebook className="w-6 h-6 text-white" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://youtube.com/@vocaluminn" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#8FA8C8] p-4 hover:bg-[#7A97B7] transition-colors"
                aria-label="YouTube"
                style={{ borderRadius: '15px' }}
              >
                <Youtube className="w-6 h-6 text-white" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#8FA8C8] p-6 md:p-8 shadow-lg text-white" 
            style={{ borderRadius: '20px' }}
          >
            <h2 className="mb-4" style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(28px, 5vw, 36px)'
            }}>
              INTERESTED IN JOINING?
            </h2>
            <p className="mb-6 leading-relaxed" style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: '1.7'
            }}>
              We hold auditions at the beginning of each semester. Follow us on social media to stay updated on audition dates and other opportunities to get involved!
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-[#2B4C6F] px-6 md:px-8 py-3 hover:bg-gray-100 transition-colors" 
              style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: '16px',
                letterSpacing: '0.05em',
                borderRadius: '20px'
              }}
            >
              AUDITION INFO
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
