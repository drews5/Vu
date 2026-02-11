import { motion } from 'motion/react';

export function About() {
  const repertoire = [
    { title: 'Back to Black', artist: 'Amy Winehouse' },
    { title: 'BLACK HORSE AND THE CHERRY TREE', artist: 'KT Tunstall' },
    { title: 'DIE WITH A SMILE', artist: 'Bruno Mars & Lady Gaga' },
    { title: 'Disturbia', artist: 'Rihanna' },
    { title: "Let's Groove", artist: 'Earth, Wind, and Fire' },
    { title: 'Out My Way', artist: 'Leroy Sanchez' },
    { title: 'SANTA BABY TELL ME', artist: 'Eartha Kitt, Ariana Grande' },
    { title: 'RIBS', artist: 'Lorde' },
    { title: 'PHINEAS & FERB MEDLEY', artist: 'Dan Povenmire' },
    { title: 'OSCAR WINNING TEARS', artist: 'Raye' },
    { title: 'TEETH', artist: '5 Seconds of Summer' },
    { title: 'WINGS', artist: 'Little Mix' },
    { title: 'All FOR US', artist: 'Labrinth', note: 'Alumni Song' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-8 md:pb-16"
    >
      {/* Hero Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ marginTop: '25px', marginBottom: '25px' }}
      >
        <div className="relative overflow-hidden shadow-xl h-[250px] md:h-[400px] bg-[#2B4C6F] flex items-center justify-center" style={{ borderRadius: '20px' }}>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white px-4" 
            style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(48px, 10vw, 96px)',
              letterSpacing: '0.05em'
            }}
          >
            ABOUT US
          </motion.h1>
        </div>
      </motion.section>

      {/* Our Mission */}
      <motion.section 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '25px' }}
      >
        <h2 className="text-[#2B4C6F] mb-4 md:mb-6 px-4 md:px-0" style={{ 
          fontFamily: "'Yearbook Solid', sans-serif",
          fontSize: 'clamp(32px, 6vw, 48px)'
        }}>
          Our Mission
        </h2>
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="text-[#2B4C6F] leading-relaxed bg-white p-6 md:p-8 shadow-lg space-y-4" 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '17px',
            lineHeight: '1.7',
            borderRadius: '20px'
          }}
        >
          <p>
            Established in 2011, Vocal U A Cappella seeks to develop musical talent within its own members and to display and promote the arts among audiences!
          </p>
          <p>
            We use our variety in sound and person to perform at charity events that resonate with our members, seek to build the University community at U of M events, and spread our harmonies in the surrounding communities, especially the University District and greater Twin Cities area. Our goal is to share the universal language that is music through the unique form of a cappella to as many people as possible.
          </p>
          <div className="italic text-[#2B4C6F]/80 border-l-4 border-[#8FA8C8] pl-4">
            "A cappella is a way to unify a huge world of culture with the human voice. By arranging, practicing and performing, we are able to pay unique homage to some of today's greatest hits and yesterday's greatest memories."
            <div className="mt-2">- Vocal U A Cappella</div>
          </div>
        </motion.div>
      </motion.section>

      {/* Our Repertoire */}
      <motion.section 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '25px' }}
      >
        <h2 className="text-[#2B4C6F] mb-4 md:mb-6 px-4 md:px-0" style={{ 
          fontFamily: "'Yearbook Solid', sans-serif",
          fontSize: 'clamp(32px, 6vw, 48px)'
        }}>
          Our Repertoire
        </h2>
        <p className="text-[#2B4C6F] mb-6 px-4 md:px-0" style={{ 
          fontFamily: 'Inter, sans-serif',
          fontSize: '17px',
          lineHeight: '1.7'
        }}>
          Each semester, Vocal U chooses half of their existing songs to carry over and selects new songs by a vote.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '25px' }}>
          {repertoire.map((song, index) => (
            <motion.div 
              key={index} 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-6 shadow-lg" 
              style={{ borderRadius: '20px' }}
            >
              <h3 className="text-[#2B4C6F] mb-2" style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: '20px'
              }}>
                {song.title}
              </h3>
              <p className="text-[#8FA8C8]" style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px'
              }}>
                {song.artist}
              </p>
              {song.note && (
                <p className="text-[#2B4C6F]/60 text-sm italic mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {song.note}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
