import { motion } from 'motion/react';
import { Instagram, Music } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const members = [
  { name: 'Alex Johnson', role: 'President', part: 'Baritone', major: 'Music Education', year: 'Senior' },
  { name: 'Sarah Miller', role: 'Business Manager', part: 'Soprano', major: 'Marketing', year: 'Junior' },
  { name: 'Jordan Lee', role: 'Music Director', part: 'Tenor', major: 'Composition', year: 'Senior' },
  { name: 'Maya Patel', role: 'Social Chair', part: 'Alto', major: 'Psychology', year: 'Sophomore' },
  { name: 'Chris Evans', role: 'Member', part: 'Bass', major: 'Engineering', year: 'Freshman' },
  { name: 'Elena Rodriguez', role: 'Member', part: 'Mezzo', major: 'Political Science', year: 'Junior' },
  { name: 'Sam Taylor', role: 'Member', part: 'Tenor', major: 'Computer Science', year: 'Sophomore' },
  { name: 'Grace Kim', role: 'Member', part: 'Soprano', major: 'Biology', year: 'Senior' },
];

export function Members() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-8 md:pb-16"
    >
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ marginTop: '25px', marginBottom: '25px' }}
      >
        <div className="bg-[#2B4C6F] shadow-xl py-16 md:py-24 px-4 text-center" style={{ borderRadius: '20px' }}>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white" 
            style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(48px, 10vw, 96px)',
              letterSpacing: '0.05em'
            }}
          >
            OUR MEMBERS
          </motion.h1>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto font-inter">
            Meet the talented individuals who make up the Vocal U family. We come from all majors and backgrounds, united by our love for music.
          </p>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '25px' }}>
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="bg-white p-6 shadow-lg flex flex-col items-center text-center"
            style={{ borderRadius: '20px' }}
          >
            <div className="w-32 h-32 bg-[#91a8c6]/20 rounded-full mb-4 flex items-center justify-center overflow-hidden">
               <Music className="w-12 h-12 text-[#91a8c6]" />
            </div>
            <h3 className="text-[#2B4C6F] text-xl mb-1" style={{ fontFamily: "'Yearbook Solid', sans-serif" }}>
              {member.name}
            </h3>
            <p className="text-[#8FA8C8] font-bold text-sm uppercase tracking-wider mb-2">
              {member.role}
            </p>
            <div className="space-y-1 text-sm text-[#2B4C6F]/70 font-inter">
              <p>{member.part}</p>
              <p>{member.major} • {member.year}</p>
            </div>
            <motion.div 
              className="mt-4 flex gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <Instagram className="w-5 h-5 text-[#8FA8C8] cursor-pointer hover:text-[#2B4C6F]" />
            </motion.div>
          </motion.div>
        ))}
      </section>
    </motion.div>
  );
}
