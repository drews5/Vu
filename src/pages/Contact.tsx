import { Mail, MessageCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { PageShell } from '../components/PageShell';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';
import { SocialLinks } from '../components/SocialLinks';

const fontInter = { fontFamily: 'Inter, sans-serif' };
export function Contact() {
    const contactDescription =
        'Contact Vocal U for bookings, collaboration requests, general questions, or audition information through email, social media, or the site contact form.';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
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
                    setTimeout(() => setStatus('idle'), 3000);
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
        'w-full rounded-xl border border-[#b9c9d9] bg-white px-4 py-3 focus:border-[#7895b7] focus:ring-4 focus:ring-[#91a8c6]/18 focus:outline-none transition-[border-color,box-shadow]';
    const inputStyle = { borderRadius: '12px', ...fontInter, fontSize: '16px' };
    return (
        <PageShell className="pb-8 md:pb-16">
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
            <PageHero
                title="Say hello"
                eyebrow="We would love to hear from you"
                description="Bookings, collaborations, auditions, or a quick question. Send it our way."
                stamp="Let’s make something"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '25px' }}>
                {/* Contact Form */}
                <div className="rounded-[26px] border border-[#dce5ed] bg-white p-6 shadow-[0_14px_38px_rgba(35,61,85,0.08)] md:p-8">
                    <h2 className="text-[#2B4C6F] mb-6 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}>
                        Send us a message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="contact-name" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                                Name
                            </label>
                            <input type="text" id="contact-name" name="name" autoComplete="name" maxLength={100} value={formData.name} onChange={handleChange} required className={inputClass} style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                                Email
                            </label>
                            <input type="email" id="contact-email" name="email" autoComplete="email" maxLength={160} value={formData.email} onChange={handleChange} required className={inputClass} style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="contact-subject" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                                Subject
                            </label>
                            <input type="text" id="contact-subject" name="subject" maxLength={140} value={formData.subject} onChange={handleChange} required className={inputClass} style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="contact-message" className="block text-[#2B4C6F] mb-2" style={{ ...fontInter, fontSize: '16px' }}>
                                Message
                            </label>
                            <textarea id="contact-message" name="message" maxLength={4000} value={formData.message} onChange={handleChange} required rows={5} className={`${inputClass} resize-y`} style={inputStyle} />
                        </div>
                        <button type="submit" disabled={status === 'sending'} className="w-full rounded-xl bg-[#2e4c6d] px-8 py-4 font-semibold text-white transition-colors duration-200 hover:bg-[#7895b7] disabled:cursor-wait disabled:opacity-50">
                            {status === 'sending' ? 'Sending...' : 'Send message'}
                        </button>
                        <div aria-live="polite" className="min-h-6 text-center" style={fontInter}>
                            {status === 'success' && <p className="text-green-700">Your message was sent. We’ll be in touch.</p>}
                            {status === 'error' && <p className="text-red-700">The form could not send. Email vocalu@umn.edu instead.</p>}
                        </div>
                    </form>
                </div>
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="rounded-[24px] border border-[#dce5ed] bg-white p-6 shadow-[0_10px_28px_rgba(35,61,85,0.06)] transition-transform hover:-translate-y-1 md:p-8">
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
                                    <a href="mailto:vocalu@umn.edu" className="text-[#2B4C6F]/80 hover:text-[#7895b7] hover:underline underline-offset-4" style={{ ...fontInter, fontSize: '16px' }}>
                                        vocalu@umn.edu
                                    </a>
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
                    </div>
                    <div className="rounded-[24px] border border-[#dce5ed] bg-white p-6 shadow-[0_10px_28px_rgba(35,61,85,0.06)] transition-transform hover:rotate-[0.35deg] md:p-8">
                        <h2 className="text-[#2B4C6F] mb-6 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}>
                            Follow Us
                        </h2>
                        <SocialLinks
                            className="flex flex-wrap gap-3"
                            linkClassName="rounded-xl bg-[#91a8c6] p-3.5 text-white transition-colors hover:bg-[#2e4c6d]"
                            iconClassName="h-5 w-5"
                        />
                    </div>
                    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#7895b7] to-[#91a8c6] p-6 text-white shadow-[0_14px_36px_rgba(35,61,85,0.12)] md:p-8">
                        <div className="absolute -right-8 -top-10 select-none text-8xl text-white/[0.08]" style={{ fontFamily: 'var(--font-yearbook-stack)' }} aria-hidden="true">VU</div>
                        <h2 className="mb-4 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 5vw, 36px)' }}>
                            Interested in joining?
                        </h2>
                        <p className="mb-6 leading-relaxed" style={{ ...fontInter, fontSize: '16px', lineHeight: '1.7' }}>
                            We hold auditions at the beginning of each semester. Follow us on social media to stay
                            updated on audition dates and other opportunities to get involved!
                        </p>
                        <div className="inline-block">
                            <Link to="/auditions" className="inline-block rounded-xl border border-white bg-white px-6 py-3 text-[#2B4C6F] transition-colors duration-200 hover:bg-transparent hover:text-white md:px-8" style={{ ...fontYearbook, fontSize: '16px', letterSpacing: '0.05em' }}>
                                Audition Info →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
