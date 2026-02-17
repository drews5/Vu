import { memo } from 'react';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
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
    <div
      className="bg-white p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
      style={{ borderRadius: '20px' }}
    >
      <h3 className="text-[#2B4C6F] mb-2" style={{ ...fontYearbook, fontSize: '20px' }}>
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
    </div>
  );
});

export function About() {
  return (
    <div className="pb-8 md:pb-16">
      {/* Hero Section */}
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="relative overflow-hidden shadow-xl h-[250px] md:h-[400px] bg-[#2B4C6F] flex items-center justify-center"
          style={{ borderRadius: '20px' }}
        >
          <h1
            className="text-white px-4"
            style={{ ...fontYearbook, fontSize: 'clamp(48px, 10vw, 96px)', letterSpacing: '0.05em' }}
          >
            ABOUT US
          </h1>
        </div>
      </section>

      {/* Our Mission */}
      <section style={{ marginBottom: '25px' }}>
        <h2
          className="text-[#2B4C6F] mb-4 md:mb-6 px-4 md:px-0"
          style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}
        >
          Our Mission
        </h2>
        <div
          className="text-[#2B4C6F] leading-relaxed bg-white p-6 md:p-8 shadow-lg space-y-4 hover:shadow-xl transition-shadow"
          style={{ ...fontInter, fontSize: '17px', lineHeight: '1.7', borderRadius: '20px' }}
        >
          <p>
            Established in 2011, Vocal U A Cappella seeks to develop musical talent within its own members
            and to display and promote the arts among audiences!
          </p>
          <p>
            We use our variety in sound and person to perform at charity events that resonate with our
            members, seek to build the University community at U of M events, and spread our harmonies in
            the surrounding communities, especially the University District and greater Twin Cities area.
            Our goal is to share the universal language that is music through the unique form of a cappella
            to as many people as possible.
          </p>
          <div className="italic text-[#2B4C6F]/80 border-l-4 border-[#8FA8C8] pl-4">
            "A cappella is a way to unify a huge world of culture with the human voice. By arranging,
            practicing and performing, we are able to pay unique homage to some of today's greatest hits
            and yesterday's greatest memories."
            <div className="mt-2">- Vocal U A Cappella</div>
          </div>
        </div>
      </section>

      {/* Our Repertoire */}
      <section style={{ marginBottom: '25px' }}>
        <h2
          className="text-[#2B4C6F] mb-4 md:mb-6 px-4 md:px-0"
          style={{ ...fontYearbook, fontSize: 'clamp(32px, 6vw, 48px)' }}
        >
          Our Repertoire
        </h2>
        <p
          className="text-[#2B4C6F] mb-6 px-4 md:px-0"
          style={{ ...fontInter, fontSize: '17px', lineHeight: '1.7' }}
        >
          Each semester, Vocal U chooses half of their existing songs to carry over and selects new songs
          by a vote.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '25px' }}>
          {repertoire.map((song, index) => (
            <SongCard key={index} song={song} />
          ))}
        </div>
      </section>
    </div>
  );
}
