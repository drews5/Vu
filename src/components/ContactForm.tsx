import { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
        setFormData({ name: '', email: '', message: '' });
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-3 md:mx-0">
      {/* Contact Form */}
      <motion.div 
        initial={{ x: -30, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 md:p-8 shadow-lg" 
        style={{ borderRadius: '20px' }}
      >
        <h2 className="text-[#2B4C6F] mb-2" style={{ 
          fontFamily: "'Yearbook Solid', sans-serif",
          fontSize: 'clamp(28px, 5vw, 36px)'
        }}>
          GET IN TOUCH
        </h2>
        <p className="text-[#2B4C6F]/70 mb-6" style={{ 
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px'
        }}>
          Reach out about booking and audition information, collaborations, or general inquiries.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 md:p-8 shadow-lg" 
          style={{ borderRadius: '20px' }}
        >
          <h3 className="text-[#2B4C6F] mb-6" style={{ 
            fontFamily: "'Yearbook Solid', sans-serif",
            fontSize: 'clamp(24px, 4vw, 28px)'
          }}>
            CONTACT INFORMATION
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-[#8FA8C8] p-3 flex-shrink-0" style={{ borderRadius: '12px' }}>
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-[#2B4C6F] mb-1" style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>Email</h4>
                <a 
                  href="mailto:vocalu@umn.edu"
                  className="text-[#8FA8C8] hover:text-[#7A97B7] transition-colors"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px'
                  }}
                >
                  vocalu@umn.edu
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#8FA8C8] p-3 flex-shrink-0" style={{ borderRadius: '12px' }}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-[#2B4C6F] mb-1" style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>Location</h4>
                <p className="text-[#2B4C6F]/80" style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px'
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
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-[#8FA8C8] p-6 md:p-8 shadow-lg text-white" 
          style={{ borderRadius: '20px' }}
        >
          <h3 className="mb-4" style={{ 
            fontFamily: "'Yearbook Solid', sans-serif",
            fontSize: 'clamp(24px, 4vw, 28px)'
          }}>
            INTERESTED IN JOINING?
          </h3>
          <p className="mb-6 leading-relaxed" style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            lineHeight: '1.7'
          }}>
            We hold auditions at the beginning of each semester. Follow us on social media to stay updated on audition dates and other opportunities to get involved!
          </p>
          <Link to="/auditions">
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
          </Link>
        </motion.div>
      </div>
    </div>
  );
}