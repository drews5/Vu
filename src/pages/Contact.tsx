import { Mail, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PageTransition, childVariants } from '../components/PageTransition';
import { Seo, toAbsoluteUrl } from '../components/Seo';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
const fontInter = { fontFamily: 'Inter, sans-serif' };
const TikTokIcon = ({ className }: { className?: string }) => {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
};
export function Contact() {
    const contactDescription =
        'Contact Vocal U for bookings, collaboration requests, general questions, or audition information through email, social media, or the site contact form.';
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
        <PageTransition className="pb-8 md:pb-16">
            <Seo
                title="Contact Vocal U"
                description={contactDescription}
                path="/contact"
                keywords={['contact Vocal U', 'book Vocal U', 'Vocal U email', 'UMN a cappella booking']}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Contact', path: '/contact' },
                ]}
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    name: 'Contact Vocal U',
                    description: contactDescription,
                    url: toAbsoluteUrl('/contact'),
                    about: {
                        '@id': toAbsoluteUrl('/#organization'),
                    },
                    mainEntity: {
                        '@type': 'ContactPoint',
                        email: 'mailto:vocalu@umn.edu',
                        contactType: 'bookings and general inquiries',
                        availableLanguage: 'English',
                    },
                }}
            />
            {/* Hero Section */}
            <motion.section variants={childVariants} style={{ marginTop: '25px', marginBottom: '25px' }}>
                <div className="bg-[#8FA8C8] py-10 md:py-16 px-4 md:px-8 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="max-w-5xl mx-auto text-center">
                        <h1 className="text-white mb-2 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}>
                            Contact Us
                        </h1>
                        <p className="text-white text-sm md:text-base" style={fontInter}>
                            We'd love to hear from you!
                        </p>
                    </div>
                </div>
            </motion.section>
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '25px' }}>
                {/* Contact Form */}
                <motion.div variants={childVariants} className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm" style={{ borderRadius: '16px' }}>
                    <h2 className="text-[#2B4C6F] mb-6 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}>
                        Send us a message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="contact-name" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                                Name
                            </label>
                            <input type="text" id="contact-name" name="name" value={formData.name} onChange={handleChange} required className={inputClass} style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                                Email
                            </label>
                            <input type="email" id="contact-email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="contact-subject" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                                Subject
                            </label>
                            <input type="text" id="contact-subject" name="subject" value={formData.subject} onChange={handleChange} required className={inputClass} style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="contact-message" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                                Message
                            </label>
                            <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} style={inputStyle} />
                        </div>
                        <motion.button type="submit" disabled={status === 'sending'} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="w-full bg-[#8FA8C8] text-white px-8 py-4 hover:bg-[#2B4C6F] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer font-yearbook" style={{ ...fontYearbook, fontSize: '18px', letterSpacing: '0.05em', borderRadius: '20px', }}>
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </motion.button>
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
                </motion.div>
                {/* Contact Info */}
                <div className="space-y-6">
                    <motion.div variants={childVariants} className="bg-white p-6 md:p-8 border border-gray-100" style={{ borderRadius: '16px' }}>
                        <h2 className="text-[#2B4C6F] mb-6 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}>
                            Get in Touch
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[#8FA8C8] p-3" style={{ borderRadius: '12px' }}>
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-[#2B4C6F] mb-1" style={{ ...fontInter, fontSize: '17px', fontWeight: '600' }}>
                                        Email
                                    </h3>
                                    <p className="text-[#2B4C6F]/80" style={{ ...fontInter, fontSize: '16px' }}>
                                        vocalu@umn.edu
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-[#8FA8C8] p-3" style={{ borderRadius: '12px' }}>
                                    <MessageCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-[#2B4C6F] mb-1" style={{ ...fontInter, fontSize: '17px', fontWeight: '600' }}>
                                        Instagram DMs
                                    </h3>
                                    <a href="https://www.instagram.com/vocal_u" target="_blank" rel="noopener noreferrer" className="text-[#8FA8C8] hover:text-[#2B4C6F] transition-all duration-300 inline-block hover:underline underline-offset-2" style={{ ...fontInter, fontSize: '16px' }}>
                                        @vocal_u
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div variants={childVariants} className="bg-white p-6 md:p-8 border border-gray-100" style={{ borderRadius: '16px' }}>
                        <h2 className="text-[#2B4C6F] mb-6 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}>
                            Follow Us
                        </h2>
                        <div className="flex gap-4">
                            {[
                                { href: 'https://www.instagram.com/vocal_u', label: 'Instagram', Icon: Instagram },
                                { href: 'https://www.facebook.com/vocaluacappella/', label: 'Facebook', Icon: Facebook },
                                { href: 'https://www.youtube.com/@vocal-u', label: 'YouTube', Icon: Youtube },
                                { href: 'https://www.tiktok.com/@vocalumn', label: 'TikTok', Icon: TikTokIcon },
                            ].map((s) => (
                                <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-[#8FA8C8] p-4 hover:bg-[#2B4C6F] transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer" aria-label={s.label} style={{ borderRadius: '12px' }}>
                                    <s.Icon className="w-6 h-6 text-white" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div variants={childVariants} className="bg-[#8FA8C8] p-6 md:p-8 text-white" style={{ borderRadius: '16px' }}>
                        <h2 className="mb-4 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}>
                            Interested in joining?
                        </h2>
                        <p className="mb-6 leading-relaxed" style={{ ...fontInter, fontSize: '16px', lineHeight: '1.7' }}>
                            We hold auditions at the beginning of each semester. Follow us on social media to stay
                            updated on audition dates and other opportunities to get involved!
                        </p>
                        <motion.div whileHover={{ x: 6 }} whileTap={{ scale: 0.97 }} className="inline-block">
                            <Link to="/auditions" className="bg-white text-[#2B4C6F] px-6 md:px-8 py-3 border border-gray-100 hover:bg-[#8FA8C8]/10 hover:border-[#8FA8C8]/50 transition-all duration-300 hover:shadow-xl inline-block cursor-pointer font-yearbook" style={{ ...fontYearbook, fontSize: '16px', letterSpacing: '0.05em', borderRadius: '12px' }}>
                                Audition Info →
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
