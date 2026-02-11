import heroBackground from 'figma:asset/c6e1c046d817a28039f023a187d9a15bab8acb31.png';
import fullLogo from 'figma:asset/6e321558ab9ee06d335e9a166fab86aa46ff5821.png';
import groupPhoto from 'figma:asset/91194fe61cc78fc80da50e07c2ba4be89812ea2b.png';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
import { EventCarousel } from '../components/EventCarousel';

export function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-0"
    >
      {/* Hero Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ marginTop: '25px', marginBottom: '25px' }}
      >
        <div className="relative overflow-hidden shadow-xl" style={{ borderRadius: '20px', height: '576px' }}>
          <img 
            src={heroBackground}
            alt="Vocal U Group"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(1.08) saturate(1.05)' }}
          />
          <div className="absolute inset-0 flex flex-col justify-between items-center py-8 md:py-12 px-4">
            <motion.div 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex-shrink-0"
            >
              <img 
                src={fullLogo} 
                alt="Vocal U - University of Minnesota's Premier A Cappella Group" 
                className="w-full max-w-[264px] md:max-w-[330px]"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
              />
            </motion.div>
            
            <div className="flex-grow"></div>
            
            <motion.a 
              href="https://artsticketing.wisc.edu/Online/default.asp?doWork::WScontent::loadArticle=Load&BOparam::WScontent::loadArticle::article_id=0BEF4201-2FB0-4E36-BC46-FB2625F51E03#buynow"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#2B4C6F] px-8 md:px-12 py-3 md:py-4 shadow-lg hover:bg-gray-100 transition-colors flex-shrink-0" 
              style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: 'clamp(16px, 2vw, 20px)',
                letterSpacing: '0.05em',
                borderRadius: '20px'
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                y: { delay: 1.7, duration: 0.6 },
                opacity: { delay: 1.7, duration: 0.6 },
                scale: { 
                  delay: 2.5,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }
              }}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              ICCA TICKETS
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* We Are Vocal U Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: '25px', marginBottom: '25px' }}>
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-4 md:px-0"
        >
          <h2 className="mb-6 md:mb-8">
            <span className="text-[#A3B8D3]" style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(32px, 6vw, 56px)'
            }}>WE ARE </span>
            <span className="text-[#2B4C6F]" style={{ 
              fontFamily: "'Yearbook Solid', sans-serif",
              fontSize: 'clamp(32px, 6vw, 56px)'
            }}>VOCAL U</span>
          </h2>
          
          <div className="space-y-4 text-[#2B4C6F] leading-relaxed mb-6" style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '17px',
            fontWeight: '400',
            lineHeight: '1.7'
          }}>
            <p>
              Vocal U is a gender-inclusive a cappella group at the University of Minnesota, established in 2011. We are a registered student organization dedicated to spreading our music across the Twin Cities and beyond, and having a great time while doing it.
            </p>
            <p>
              We come from all different majors and backgrounds, but we're all a part of VU because we love music and the arts. More than an a cappella group, Vocal U is a family. We support and push each other to be the best performers we can be, which translates to the stage.
            </p>
          </div>
          
          <motion.div whileHover={{ x: 5 }}>
            <Link 
              to="/about"
              className="inline-flex items-center gap-2 bg-[#8FA8C8] text-white px-8 py-3 shadow-lg hover:bg-[#7A97B7] transition-colors"
              style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: '18px',
                letterSpacing: '0.05em',
                borderRadius: '20px'
              }}
            >
              LEARN MORE
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden shadow-xl" 
          style={{ borderRadius: '20px' }}
          whileHover={{ scale: 1.02 }}
        >
          <img 
            src={groupPhoto}
            alt="Vocal U Group Members"
            className="w-full h-[300px] md:h-[500px] object-cover"
            style={{ filter: 'brightness(1.08) saturate(1.05)' }}
          />
        </motion.div>
      </section>

      {/* Events Section */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative py-12 md:py-16 px-6 md:px-12 mx-3 md:mx-0 overflow-hidden" 
        style={{ marginBottom: '25px', borderRadius: '20px' }}
      >
        {/* Animated Gradient Background */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(135deg, #91a8c6 0%, #7A97B7 50%, #91a8c6 100%)',
              'linear-gradient(135deg, #7A97B7 0%, #91a8c6 50%, #7A97B7 100%)',
              'linear-gradient(135deg, #91a8c6 0%, #7A97B7 50%, #91a8c6 100%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ borderRadius: '20px' }}
        />
        
        {/* Decorative Animated Circles */}
        <motion.div 
          className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-60 h-60 bg-black/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 relative pb-[50px] pt-[25px]">
            {/* Giant Background Title */}
            <motion.h2 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-white/50 select-none absolute inset-0 flex items-center justify-center" 
              style={{ 
                fontFamily: "'Yearbook Solid', sans-serif",
                fontSize: 'clamp(70px, 10vw, 100px)',
                letterSpacing: '0.05em',
                lineHeight: '1',
                fontWeight: 'bold'
              }}
            >
              EVENTS
            </motion.h2>
            
            {/* Overlaid Description - 70% of the way through */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute inset-x-0 flex items-center justify-center"
              style={{ top: '70%' }}
            >
              <p className="text-white text-center" style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(15px, 2vw, 18px)',
                fontWeight: '300',
                letterSpacing: '0.02em',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                Don't miss our upcoming performances!
              </p>
            </motion.div>
          </div>
          
          {/* Event Cards Carousel */}
          <div className="px-2 md:px-4">
            <EventCarousel />
          </div>

          {/* CTA Button Below Cards */}
          <motion.div 
            className="text-center mt-10"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link to="/events">
              <motion.div
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-white text-[#2B4C6F] px-12 py-5 shadow-2xl hover:bg-gray-50 transition-all relative overflow-hidden group"
                style={{ 
                  fontFamily: "'Yearbook Solid', sans-serif",
                  fontSize: '22px',
                  letterSpacing: '0.05em',
                  borderRadius: '25px'
                }}
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">VIEW ALL EVENTS</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-3 md:mx-0" 
        style={{ marginBottom: '25px' }}
      >
        <ContactForm />
      </motion.section>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}