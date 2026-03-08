import { memo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PageTransition, childVariants } from '../components/PageTransition';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';

const fontInter = { fontFamily: 'Inter, sans-serif' };
const repertoire = [
    { title: 'Back to Black', artist: 'Amy Winehouse' },
    { title: 'Black Horse and the Cherry Tree', artist: 'KT Tunstall' },
    { title: 'Die With A Smile', artist: 'Bruno Mars & Lady Gaga' },
    { title: 'Disturbia', artist: 'Rihanna' },
    { title: "Let's Groove", artist: 'Earth, Wind, and Fire' },
    { title: 'Out My Way', artist: 'Leroy Sanchez' },
    { title: 'Santa Baby Tell Me', artist: 'Eartha Kitt, Ariana Grande' },
    { title: 'Ribs', artist: 'Lorde' },
    { title: 'Phineas & Ferb Medley', artist: 'Dan Povenmire' },
    { title: 'Oscar Winning Tears', artist: 'Raye' },
    { title: 'Teeth', artist: '5 Seconds of Summer' },
    { title: 'Wings', artist: 'Little Mix' },
    { title: 'All For Us', artist: 'Labrinth', note: 'Alumni Song' },
];
const SongCard = memo(function SongCard({
    song,
}: {
    song: { title: string; artist: string; note?: string };
}) {
    return (
        <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }} className="bg-white p-6 border border-[#8FA8C8] shadow-xl -translate-y-1 cursor-default group" style={{ borderRadius: '16px' }}>
            <h3 className="text-[#2B4C6F] mb-2 group-hover:text-[#8FA8C8] transition-colors font-yearbook" style={{ ...fontYearbook, fontSize: '20px' }}>
                {song.title}
            </h3>
            <p className="text-[#8FA8C8]" style={{ ...fontInter, fontSize: '15px' }}>
                {song.artist}
            </p>
            {song.note && (
                <p className="text-[#2B4C6F]/60 text-sm italic mt-1" style={fontInter}>
                    {song.note}
                </p>
            )}
        </motion.div>
    );
});
export function About() {
    const aboutDescription =
        'Learn about Vocal U, the University of Minnesota gender-inclusive a cappella group, including our mission, repertoire, and Twin Cities performances.';

    return (
        <PageTransition className="pb-8 md:pb-16">
            <Seo
                title="About Vocal U"
                description={aboutDescription}
                path="/about"
                keywords={['about Vocal U', 'UMN a cappella group', 'Minnesota student music group']}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'About', path: '/about' },
                ]}
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'AboutPage',
                    name: 'About Vocal U',
                    description: aboutDescription,
                    url: toAbsoluteUrl('/about'),
                    about: {
                        '@id': toAbsoluteUrl('/#organization'),
                    },
                }}
            />
            {/* Hero Section */}
            <motion.section variants={childVariants} style={{ marginTop: '25px', marginBottom: '25px' }}>
                <div className="relative overflow-hidden h-[165px] md:h-[265px] bg-[#2B4C6F] flex items-center justify-center" style={{ borderRadius: '16px' }}>
                    <h1 className="text-white px-4 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}>
                        About Us
                    </h1>
                </div>
            </motion.section>
            {/* Our Mission */}
            <motion.section variants={childVariants} style={{ marginBottom: '25px' }}>
                <h2 className="text-[#2B4C6F] mb-4 md:mb-6 px-4 md:px-0 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}>
                    Our Mission
                </h2>
                <div className="text-[#2B4C6F] leading-relaxed bg-white p-6 md:p-8 border border-gray-100 space-y-4" style={{ ...fontInter, fontSize: '17px', lineHeight: '1.7', borderRadius: '16px' }}>
                    <p>
                        Founded in 2011, Vocal U A Cappella is dedicated to fostering musical growth within our group while sharing our passion for the arts with the community.
                    </p>
                    <p>
                        We embrace our diversity of voices and backgrounds to perform at charity events that resonate with our
                        members, seek to build the University community at U of M events, and spread our harmonies in
                        the surrounding communities, especially the University District and greater Twin Cities area.
                        Our mission is to share the universal language of music through the unique form of a cappella,
                        reaching as many people as we can.
                    </p>
                    <div className="italic text-[#2B4C6F]/80 border-l-4 border-[#8FA8C8] pl-4">
                        "A cappella is a way to unify a huge world of culture with the human voice. By arranging,
                        practicing and performing, we are able to pay unique homage to some of today's greatest hits
                        and yesterday's greatest memories."
                        <div className="mt-2">- Vocal U A Cappella</div>
                    </div>
                </div>
            </motion.section>
            {/* Our Repertoire */}
            <motion.section variants={childVariants} style={{ marginBottom: '25px' }}>
                <h2 className="text-[#2B4C6F] mb-4 md:mb-6 px-4 md:px-0 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}>
                    Our Repertoire
                </h2>
                <p className="text-[#2B4C6F] mb-6 px-4 md:px-0" style={{ ...fontInter, fontSize: '17px', lineHeight: '1.7' }}>
                    Each semester, Vocal U chooses half of their existing songs to carry over and selects new songs
                    by a vote.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '25px' }}>
                    {repertoire.map((song, index) => (
                        <SongCard key={index} song={song} />
                    ))}
                </div>
            </motion.section>
            {/* Explore More Navigator */}
            <motion.section variants={childVariants} className="mt-20 border-t border-gray-100 pt-16">
                <h2 className="text-[#2B4C6F] mb-10 text-center font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 4vw, 36px)' }}>
                    EXPLORE MORE
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: 'Our Members', path: '/members' },
                        { name: 'Our Media', path: '/media' },
                        { name: 'Support Us', path: '/donate' },
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
