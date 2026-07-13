import { memo } from 'react';
import { PageHero } from '../components/PageHero';
import { PageShell } from '../components/PageShell';
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
        <article className="group relative overflow-hidden rounded-2xl border border-[#dce5ed] bg-white p-5 shadow-[0_8px_24px_rgba(35,61,85,0.06)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:rotate-[0.35deg] hover:border-[#91a8c6] hover:shadow-[0_16px_34px_rgba(35,61,85,0.12)] md:p-6">
            <span className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-[#91a8c6]/10 transition-transform duration-300 group-hover:scale-125" aria-hidden="true" />
            <h3 className="mb-2 text-xl text-[#2e4c6d]" style={fontYearbook}>
                {song.title}
            </h3>
            <p className="text-[15px] text-[#7895b7]" style={fontInter}>
                {song.artist}
            </p>
            {song.note && (
                <p className="text-[#2B4C6F]/60 text-sm italic mt-1" style={fontInter}>
                    {song.note}
                </p>
            )}
        </article>
    );
});
export function About() {
    const aboutDescription =
        'Learn about Vocal U, the University of Minnesota gender-inclusive a cappella group, including our mission, repertoire, and Twin Cities performances.';

    return (
        <PageShell className="pb-8 md:pb-16">
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
            <PageHero
                title="About us"
                eyebrow="Singing together since 2011"
                description="Different majors, different voices, one group that genuinely likes making music together."
                tone="navy"
                stamp="Minnesota made"
            />
            {/* Our Mission */}
            <section style={{ marginBottom: '25px' }}>
                <h2 className="text-[#2B4C6F] mb-4 md:mb-6 px-4 md:px-0 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}>
                    Our Mission
                </h2>
                <div className="relative space-y-4 overflow-hidden rounded-[26px] border border-[#dce5ed] bg-white p-6 leading-relaxed text-[#2e4c6d] shadow-[0_14px_38px_rgba(35,61,85,0.08)] md:p-9" style={{ ...fontInter, fontSize: '17px', lineHeight: '1.7' }}>
                    <div className="absolute right-0 top-0 h-3 w-32 rounded-bl-full bg-[#91a8c6]" aria-hidden="true" />
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
                    <blockquote className="border-l-4 border-[#91a8c6] pl-4 italic text-[#2e4c6d]/80">
                        "A cappella is a way to unify a huge world of culture with the human voice. By arranging,
                        practicing and performing, we are able to pay unique homage to some of today's greatest hits
                        and yesterday's greatest memories."
                        <footer className="mt-2 not-italic">Vocal U A Cappella</footer>
                    </blockquote>
                </div>
            </section>
            {/* Our Repertoire */}
            <section style={{ marginBottom: '25px' }}>
                <h2 className="text-[#2B4C6F] mb-4 md:mb-6 px-4 md:px-0 font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}>
                    Our Repertoire
                </h2>
                <p className="text-[#2B4C6F] mb-6 px-4 md:px-0" style={{ ...fontInter, fontSize: '17px', lineHeight: '1.7' }}>
                    Each semester, we carry over part of our set and vote on new songs together.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '25px' }}>
                    {repertoire.map((song) => (
                        <SongCard key={song.title} song={song} />
                    ))}
                </div>
            </section>
        </PageShell>
    );
}
