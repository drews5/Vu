import { Mail, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { useState, useCallback } from 'react';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
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
          setFormData({ name: '', email: '', subject: '', message: '' });
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
    'w-full px-4 py-3 border-2 border-[#A3B8D3] focus:border-[#8FA8C8] focus:outline-none transition-colors';
  const inputStyle = { borderRadius: '12px', ...fontInter, fontSize: '16px' };

  return (
    <div className="pb-8 md:pb-16">
      {/* Hero Section */}
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="bg-[#8FA8C8] shadow-xl py-16 md:py-24 px-4 md:px-8"
          style={{ borderRadius: '20px' }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <h1
              className="text-white mb-4"
              style={{ ...fontYearbook, fontSize: 'clamp(48px, 10vw, 96px)', letterSpacing: '0.05em' }}
            >
              CONTACT US
            </h1>
            <p className="text-white" style={{ ...fontInter, fontSize: '17px' }}>
              We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '25px' }}>
        {/* Contact Form */}
        <div className="bg-white p-6 md:p-8 shadow-lg" style={{ borderRadius: '20px' }}>
          <h2
            className="text-[#2B4C6F] mb-6"
            style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}
          >
            SEND US A MESSAGE
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-[#2B4C6F] mb-2"
                style={{ ...fontInter, fontSize: '16px' }}
              >
                Name
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-[#2B4C6F] mb-2"
                style={{ ...fontInter, fontSize: '16px' }}
              >
                Email
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-[#2B4C6F] mb-2"
                style={{ ...fontInter, fontSize: '16px' }}
              >
                Subject
              </label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-[#2B4C6F] mb-2"
                style={{ ...fontInter, fontSize: '16px' }}
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-[#8FA8C8] text-white px-8 py-4 hover:bg-[#7A97B7] transition-all shadow-lg disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                ...fontYearbook,
                fontSize: '18px',
                letterSpacing: '0.05em',
                borderRadius: '20px',
              }}
            >
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

        {/* Contact Info */}
        <div className="space-y-6">
          <div
            className="bg-white p-6 md:p-8 shadow-lg hover:scale-[1.02] transition-transform"
            style={{ borderRadius: '20px' }}
          >
            <h2
              className="text-[#2B4C6F] mb-6"
              style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}
            >
              GET IN TOUCH
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#8FA8C8] p-3" style={{ borderRadius: '15px' }}>
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    className="text-[#2B4C6F] mb-1"
                    style={{ ...fontInter, fontSize: '17px', fontWeight: '600' }}
                  >
                    Email
                  </h3>
                  <p className="text-[#2B4C6F]/80" style={{ ...fontInter, fontSize: '16px' }}>
                    vocalu@umn.edu
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#8FA8C8] p-3" style={{ borderRadius: '15px' }}>
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    className="text-[#2B4C6F] mb-1"
                    style={{ ...fontInter, fontSize: '17px', fontWeight: '600' }}
                  >
                    Instagram DMs
                  </h3>
                  <a
                    href="https://instagram.com/vocaluminn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8FA8C8] hover:text-[#7A97B7] transition-colors"
                    style={{ ...fontInter, fontSize: '16px' }}
                  >
                    @vocaluminn
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white p-6 md:p-8 shadow-lg hover:scale-[1.02] transition-transform"
            style={{ borderRadius: '20px' }}
          >
            <h2
              className="text-[#2B4C6F] mb-6"
              style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}
            >
              FOLLOW US
            </h2>

            <div className="flex gap-4">
              {[
                { href: 'https://instagram.com/vocaluminn', label: 'Instagram', Icon: Instagram },
                { href: 'https://facebook.com/vocaluminn', label: 'Facebook', Icon: Facebook },
                { href: 'https://youtube.com/@vocaluminn', label: 'YouTube', Icon: Youtube },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#8FA8C8] p-4 hover:bg-[#7A97B7] transition-all hover:scale-110 hover:rotate-[5deg] active:scale-90"
                  aria-label={s.label}
                  style={{ borderRadius: '15px' }}
                >
                  <s.Icon className="w-6 h-6 text-white" />
                </a>
              ))}
            </div>
          </div>

          <div
            className="bg-[#8FA8C8] p-6 md:p-8 shadow-lg text-white hover:scale-[1.02] transition-transform"
            style={{ borderRadius: '20px' }}
          >
            <h2
              className="mb-4"
              style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}
            >
              INTERESTED IN JOINING?
            </h2>
            <p
              className="mb-6 leading-relaxed"
              style={{ ...fontInter, fontSize: '16px', lineHeight: '1.7' }}
            >
              We hold auditions at the beginning of each semester. Follow us on social media to stay
              updated on audition dates and other opportunities to get involved!
            </p>
            <button
              className="bg-white text-[#2B4C6F] px-6 md:px-8 py-3 hover:bg-gray-100 transition-all hover:scale-105 active:scale-[0.98]"
              style={{ ...fontYearbook, fontSize: '16px', letterSpacing: '0.05em', borderRadius: '20px' }}
            >
              AUDITION INFO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
