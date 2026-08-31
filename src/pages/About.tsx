import { memo } from 'react';
import { motion } from 'motion/react';
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
        <motion.div className="vu-panel vu-song-card bg-white p-6 border border-[#8FA8C8] cursor-default group" style={{ borderRadius: '16px' }}>
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
                <div className="vu-page-hero relative overflow-hidden h-[165px] md:h-[265px] bg-[#2B4C6F] flex items-center justify-center" style={{ borderRadius: '16px' }}>
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
                <div className="max-w-4xl space-y-4 px-4 text-[#2B4C6F] leading-relaxed md:px-0" style={{ ...fontInter, fontSize: '17px', lineHeight: '1.7' }}>
                    <p>
                        Vocal U is a gender-inclusive student a cappella group at the University of Minnesota. We perform pop arrangements on campus and around the Twin Cities.
                    </p>
                    <p>
                        We work to improve as musicians, make the group welcoming, and support university and community events through performance.
                    </p>
                </div>
            </motion.section>
            {/* Our Repertoire */}
            <motion.section variants={childVariants} style={{ marginBottom: '25px' }}>
                <h2 className="text-[#2B4C6F] mb-4 md:mb-6 px-4 md:px-0 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}>
                    Our Repertoire
                </h2>
                <p className="text-[#2B4C6F] mb-6 px-4 md:px-0" style={{ ...fontInter, fontSize: '17px', lineHeight: '1.7' }}>
                    Each semester, the group keeps some current arrangements and votes on new songs to add.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '25px' }}>
                    {repertoire.map((song, index) => (
                        <SongCard key={index} song={song} />
                    ))}
                </div>
            </motion.section>
        </PageTransition>
    );
}
