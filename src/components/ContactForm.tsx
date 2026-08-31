import { useState, useCallback, memo } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fontYearbook } from '../styles/fonts';

const fontInter = { fontFamily: 'Inter, sans-serif' };
const ContactInfo = memo(function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm" style={{ borderRadius: '16px' }}>
        <h3 className="text-[#2B4C6F] mb-6" style={{ ...fontYearbook, fontSize: 'clamp(24px, 4vw, 28px)' }}>
          CONTACT INFORMATION
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-[#8FA8C8] p-3 flex-shrink-0" style={{ borderRadius: '12px' }}>
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-[#2B4C6F] mb-1" style={{ ...fontInter, fontSize: '16px', fontWeight: '600' }}>
                Email
              </h4>
              <a href="mailto:vocalu@umn.edu" className="text-[#8FA8C8] hover:text-[#2B4C6F] hover:underline underline-offset-2 transition-all duration-300" style={{ ...fontInter, fontSize: '15px' }}>
                vocalu@umn.edu
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-[#8FA8C8] p-3 flex-shrink-0" style={{ borderRadius: '12px' }}>
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-[#2B4C6F] mb-1" style={{ ...fontInter, fontSize: '16px', fontWeight: '600' }}>
                Instagram DMs
              </h4>
              <a href="https://www.instagram.com/vocal_u" target="_blank" rel="noopener noreferrer" className="text-[#8FA8C8] hover:text-[#2B4C6F] hover:underline underline-offset-2 transition-all duration-300" style={{ ...fontInter, fontSize: '15px' }}>
                @vocal_u
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#8FA8C8] p-6 md:p-8 text-white shadow-sm" style={{ borderRadius: '16px' }}>
        <h3 className="mb-4" style={{ ...fontYearbook, fontSize: 'clamp(24px, 4vw, 28px)' }}>
          INTERESTED IN JOINING?
        </h3>
        <p className="mb-6 leading-relaxed" style={{ ...fontInter, fontSize: '15px', lineHeight: '1.7' }}>
          We hold auditions at the beginning of each semester. Follow us on social media to stay updated
          on audition dates and other opportunities to get involved!
        </p>
        <Link to="/auditions" className="bg-white text-[#2B4C6F] px-6 md:px-8 py-3 hover:bg-[#2B4C6F] hover:text-white hover:translate-x-1.5 active:scale-[0.97] transition-all duration-200 inline-block cursor-pointer" style={{ ...fontYearbook, fontSize: '16px', letterSpacing: '0.05em', borderRadius: '12px' }}>
          AUDITION INFO →
        </Link>
      </div>
    </div>
  );
});
export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('sending');
      try {
        const response = await fetch('https://formspree.io/f/xanygerw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', message: '' });
          setTimeout(() => setStatus(''), 3000);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    },
    [formData]
  );
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);
  const inputClass =
    'w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-[#8FA8C8] focus:ring-4 focus:ring-[#8FA8C8]/20 focus:outline-none transition-all duration-300';
  const inputStyle = { borderRadius: '12px', ...fontInter, fontSize: '16px' };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm" style={{ borderRadius: '16px' }}>
        <h2 className="text-[#2B4C6F] mb-2" style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}>
          GET IN TOUCH
        </h2>
        <p className="text-[#2B4C6F]/70 mb-6" style={{ ...fontInter, fontSize: '16px' }}>
          Reach out about booking and audition information, collaborations, or general inquiries.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="home-name" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                Name
              </label>
              <input type="text" id="home-name" name="name" value={formData.name} onChange={handleChange} required className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="home-email" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                Email
              </label>
              <input type="email" id="home-email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label htmlFor="home-message" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
              Message
            </label>
            <textarea id="home-message" name="message" value={formData.message} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} style={inputStyle} />
          </div>
          <button type="submit" disabled={status === 'sending'} className="w-full bg-[#2B4C6F] text-white px-8 py-4 border border-[#2B4C6F] hover:bg-[#8FA8C8] hover:border-[#8FA8C8] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 disabled:opacity-50 cursor-pointer" style={{ ...fontYearbook, fontSize: '18px', letterSpacing: '0.05em', borderRadius: '12px' }}>
            {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
          {status === 'success' && (
            <p className="text-green-600 text-center" style={fontInter}>
              Thank you! Your message has been sent.
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-center" style={fontInter}>
              Oops! Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
      <ContactInfo />
    </div>
  );
}
