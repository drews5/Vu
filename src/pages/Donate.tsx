import { memo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PageTransition, childVariants } from '../components/PageTransition';
import { Heart, Star, Check } from 'lucide-react';
import logoImage from 'figma:asset/d4630c01b543cc75980f0b293230859d29654fbb.png';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';

const fontInter = { fontFamily: 'Inter, sans-serif' };
export function Donate() {
    const donateDescription =
        'Support Vocal U with a secure donation to help cover travel, showcase costs, and competition fees for the University of Minnesota a cappella group.';

    return (
        <PageTransition className="pb-8 md:pb-16 min-h-screen">
            <Seo
                title="Support Vocal U"
                description={donateDescription}
                path="/donate"
                keywords={['donate to Vocal U', 'support Vocal U', 'UMN a cappella donation', 'Vocal U fundraiser']}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Donate', path: '/donate' },
                ]}
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Support Vocal U',
                    description: donateDescription,
                    url: toAbsoluteUrl('/donate'),
                    about: {
                        '@id': toAbsoluteUrl('/#organization'),
                    },
                    potentialAction: [
                        {
                            '@type': 'DonateAction',
                            target: 'https://givebutter.com/vu',
                        },
                        {
                            '@type': 'DonateAction',
                            target: 'https://venmo.com/u/vocalu',
                        },
                    ],
                }}
            />
            {/* Hero Section */}
            <motion.section variants={childVariants} style={{ marginTop: '25px', marginBottom: '25px' }}>
                <div className="bg-[#91a8c6] py-8 md:py-12 px-4 text-center text-white border border-gray-100 shadow-sm" style={{ borderRadius: '16px' }}>
                    <h1 className="font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 64px)', letterSpacing: '0.05em' }}>
                        Support Us
                    </h1>
                    <p className="mt-2 max-w-2xl mx-auto text-sm md:text-base opacity-90" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Vocal U is a self-funded student organization. Your donations help us cover travel, event
                        costs, and competition fees.
                    </p>
                </div>
            </motion.section>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Venmo Section (TOP on Mobile, RIGHT on Desktop) */}
                <motion.div variants={childVariants} className="order-1 lg:order-2 lg:col-span-5 space-y-6">
                    {/* Venmo Card - Authentic Venmo Styling */}
                    <div className="bg-white p-0 border border-gray-100 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
                        {/* Venmo Header */}
                        <div className="bg-[#008CFF] py-4 px-6 flex justify-between items-center">
                            <svg viewBox="0 0 512 512" className="w-8 h-8">
                                <path fill="#ffffff" d="M364.178 131.79c8.97 14.762 13.013 29.966 13.013 49.172 0 61.26-52.48 140.84-95.074 196.72h-97.285l-39.016-232.48 85.185-8.06 20.627 165.426c19.275-31.29 43.062-80.464 43.062-113.989 0-18.35-3.155-30.85-8.085-41.142l77.573-15.648z" />
                            </svg>
                            <div className="bg-white/20 px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest" style={fontInter}>Profile</div>
                        </div>
                        {/* Profile Content */}
                        <div className="p-8 flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 flex items-center justify-center bg-[#8FA8C8] border-4 border-white shadow-sm" style={{ borderRadius: '50%' }}>
                                    <img src={logoImage} alt="Vocal U" className="w-20 h-auto" />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-[#008CFF] p-2 rounded-full border-2 border-white shadow-sm">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-[#3D4248] mb-0.5" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Vocal U A Cappella</h2>
                            <p className="text-[#008CFF] font-bold text-lg mb-6" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>@vocalu</p>
                            <div className="w-full space-y-3">
                                <motion.a href="https://venmo.com/u/vocalu" target="_blank" rel="noopener noreferrer" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="block w-full bg-[#008CFF] text-white py-4 rounded-full font-bold text-lg shadow-sm hover:bg-[#0074D9] transition-all duration-300 text-center cursor-pointer shadow-md font-yearbook" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                                    Pay or Request
                                </motion.a>
                            </div>
                        </div>
                        {/* Venmo Footer Tip */}
                        <div className="bg-gray-50 py-4 px-8 border-t border-gray-100">
                            <p className="text-[11px] text-gray-400 leading-tight text-center" style={fontInter}>
                                Payments are secure and processed directly by Venmo.
                                Vocal U is a self-funded student organization.
                            </p>
                        </div>
                    </div>
                </motion.div>
                {/* Givebutter Embed Container (Left on Desktop, MIDDLE on Mobile) */}
                <motion.div variants={childVariants} className="order-2 lg:order-1 lg:col-span-7 lg:row-span-2 bg-white shadow-sm overflow-hidden relative flex flex-col border border-gray-100" style={{ borderRadius: '16px', minHeight: '800px', width: '100%' }}>
                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-[#2B4C6F] font-bold text-sm" style={fontInter}>Givebutter Secure Donation</span>
                        <a href="https://givebutter.com/vu" target="_blank" rel="noopener noreferrer" className="text-[#8FA8C8] text-xs hover:text-[#2B4C6F] hover:underline transition-all duration-300 font-bold underline-offset-2" style={fontInter}>
                            Open in new tab ↗
                        </a>
                    </div>
                    <div className="flex-grow relative bg-gray-50/50">
                        <iframe src="https://givebutter.com/embed/c/vu" className="w-full h-full border-0 absolute inset-0" title="Vocal U Donation" allow="payment" />
                    </div>
                </motion.div>
                {/* Other Ways to Help Section (BOTTOM on Mobile, RIGHT on Desktop) */}
                <motion.div variants={childVariants} className="order-3 lg:order-2 lg:col-span-5 space-y-6">
                    <div className="bg-white p-8 border border-gray-100 shadow-sm" style={{ borderRadius: '16px' }}>
                        <h2 className="text-[#2B4C6F] text-2xl mb-8 border-b pb-4" style={fontYearbook}>
                            Other Ways to Help
                        </h2>
                        <div className="space-y-8" style={fontInter}>
                            <div className="flex gap-4">
                                <div className="bg-[#8FA8C8]/10 p-3 rounded-xl h-fit">
                                    <Heart className="w-6 h-6 text-[#8FA8C8]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#2B4C6F] text-lg mb-1">Spread the Word</h3>
                                    <p className="text-[#2B4C6F]/70 text-sm leading-relaxed">
                                        Follow us on Instagram and TikTok, share our posts, and tell your friends about our upcoming shows!
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-[#8FA8C8]/10 p-3 rounded-xl h-fit">
                                    <Star className="w-6 h-6 text-[#8FA8C8]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#2B4C6F] text-lg mb-1">Book Us for a Gig</h3>
                                    <p className="text-[#2B4C6F]/70 text-sm leading-relaxed">
                                        Have us perform at your next event! We love collaborating with other groups and performing for the community.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            {/* Explore More Navigator */}
            <motion.section variants={childVariants} className="mt-24 border-t border-gray-100 pt-16">
                <h2 className="text-[#2B4C6F] mb-10 text-center font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 4vw, 36px)' }}>
                    EXPLORE MORE
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: 'About Us', path: '/about' },
                        { name: 'Our Members', path: '/members' },
                        { name: 'Our Media', path: '/media' },
                        { name: 'Join Us', path: '/auditions' }
                    ].map((item) => (
                        <Link key={item.path} to={item.path} className="group bg-white p-8 border border-gray-100 hover:border-[#8FA8C8] shadow-sm hover:shadow-xl transition-all duration-300 text-center" style={{ borderRadius: '20px' }}>
                            <h3 className="text-[#2B4C6F] text-lg font-yearbook group-hover:text-[#8FA8C8] transition-colors" style={fontYearbook}>
                                {item.name}
                            </h3>
                            <p className="text-[#8FA8C8] text-xs mt-2 tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                LEARN MORE →
                            </p>
                        </Link>
                    ))}
                </div>
            </motion.section>
        </PageTransition>
    );
}
