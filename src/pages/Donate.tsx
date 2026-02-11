import { motion } from 'motion/react';
import { Heart, DollarSign, Star } from 'lucide-react';

export function Donate() {
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
        <div className="bg-[#91a8c6] shadow-xl py-16 md:py-24 px-4 text-center text-white" style={{ borderRadius: '20px' }}>
          <h1 
            style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(48px, 10vw, 96px)',
              letterSpacing: '0.05em'
            }}
          >
            SUPPORT US
          </h1>
          <p className="mt-4 max-w-2xl mx-auto font-inter text-lg opacity-90">
            Vocal U is a self-funded student organization. Your donations help us cover travel, recording costs, and competition fees.
          </p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '25px', marginBottom: '40px' }}>
        {[
          { title: 'Friend of VU', amount: '$25', description: 'Covers sheet music for one group member.', icon: Heart },
          { title: 'Music Maker', amount: '$50', description: 'Helps us purchase new arrangements.', icon: Star },
          { title: 'Patron', amount: '$100+', description: 'Supports our travel to competitions like ICCA.', icon: DollarSign },
        ].map((tier, index) => (
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 shadow-lg text-center flex flex-col items-center"
            style={{ borderRadius: '20px' }}
          >
            <div className="bg-[#91a8c6]/10 p-4 rounded-full mb-4">
              <tier.icon className="w-8 h-8 text-[#91a8c6]" />
            </div>
            <h3 className="text-[#2B4C6F] text-2xl mb-2" style={{ fontFamily: "'Yearbook Solid', sans-serif" }}>
              {tier.title}
            </h3>
            <div className="text-[#8FA8C8] text-4xl font-bold mb-4" style={{ fontFamily: "'Yearbook Solid', sans-serif" }}>
              {tier.amount}
            </div>
            <p className="text-[#2B4C6F]/70 font-inter mb-6">
              {tier.description}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#8FA8C8] text-white py-3 font-bold uppercase tracking-widest"
              style={{ borderRadius: '15px', fontFamily: "'Yearbook Solid', sans-serif" }}
            >
              DONATE
            </motion.button>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-white p-8 shadow-lg"
        style={{ borderRadius: '20px' }}
      >
        <h2 className="text-[#2B4C6F] text-2xl mb-4 text-center" style={{ fontFamily: "'Yearbook Solid', sans-serif" }}>
          OTHER WAYS TO HELP
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#2B4C6F]/80 font-inter">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-[#2B4C6F]">Spread the Word</h3>
            <p>Follow us on Instagram and TikTok, share our posts, and tell your friends about our upcoming shows!</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-[#2B4C6F]">Venmo</h3>
            <p>You can also donate directly via Venmo @VocalU-UMN. Every dollar counts towards our next recording!</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
