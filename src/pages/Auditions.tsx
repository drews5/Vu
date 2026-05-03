import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition, childVariants } from '../components/PageTransition';
import {
  Clock,
  Users,
  Calendar,
  X,
  AlertCircle,
  Check,
  Trash2,
  Music
} from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import logoImage from 'figma:asset/d4630c01b543cc75980f0b293230859d29654fbb.png';
import { loadSupabase } from '../utils/loadSupabase';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';

const fontInter = { fontFamily: 'Inter, sans-serif' };
interface AuditionSlot {
  id: string;
  time: string;
  day: string;
  status: 'Available' | 'Booked' | 'Break';
  name?: string;
  email?: string;
}
export function Auditions() {
  const auditionsDescription =
    'Audition for Vocal U at the University of Minnesota. View audition timing, sign-up details, preparation tips, and callback information for the group.';
  const [slots, setSlots] = useState<AuditionSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingSlotId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<{ id: string, mode: 'save' | 'delete' } | null>(null);
  const [tempNames, setTempNames] = useState<Record<string, string>>({});
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState<{ id: string, name: string } | null>(null);

  const fetchSlots = useCallback(async () => {
    const supabase = await loadSupabase();
    const { data, error } = await supabase
      .from('auditions')
      .select('*')
      .order('time', { ascending: true });
    if (error) {
      console.error('Error fetching audition slots:', error);
    } else {
      setSlots(data.map((r: any) => ({
        id: r.id,
        day: r.day,
        time: r.time,
        status: r.status,
        name: r.name,
        email: r.email,
      })));
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    let isActive = true;
    let removeRealtimeChannel: (() => void) | undefined;

    const initializeSlots = async () => {
      const supabase = await loadSupabase();
      if (!isActive) {
        return;
      }

      await fetchSlots();
      const channel = supabase
        .channel('audition-updates')
        .on('postgres_changes', { event: '*', table: 'auditions', schema: 'public' }, () => {
          void fetchSlots();
        })
        .subscribe();

      removeRealtimeChannel = () => {
        void supabase.removeChannel(channel);
      };
    };

    void initializeSlots();
    return () => {
      isActive = false;
      removeRealtimeChannel?.();
    };
  }, [fetchSlots]);
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const intervalId = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        window.clearInterval(intervalId);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleNameChange = (id: string, value: string) => {
    setTempNames(prev => ({ ...prev, [id]: value }));
  };
  const startConfirmation = (id: string, mode: 'save' | 'delete') => {
    setConfirmingId({ id, mode });
    setEmailInput('');
  };
  const processAction = async () => {
    if (!confirmingId || !emailInput.trim()) return;
    setIsSubmitting(true);
    const { id, mode } = confirmingId;
    const slot = slots.find(s => s.id === id);
    if (!slot) {
      alert("Slot no longer exists.");
      setIsSubmitting(false);
      setConfirmingId(null);
      return;
    }
    try {
      const supabase = await loadSupabase();
      if (mode === 'save') {
        const nameToSave = tempNames[id]?.trim();
        if (!nameToSave) return;
        const { error } = await supabase
          .from('auditions')
          .update({
            name: nameToSave,
            email: emailInput.trim().toLowerCase(),
            status: 'Booked'
          })
          .eq('id', id);
        if (error) throw error;
        triggerConfetti();
      } else {
        // Delete mode
        if (emailInput.trim().toLowerCase() !== slot.email?.trim().toLowerCase()) {
          alert("Student ID doesn't match!");
          setIsSubmitting(false);
          return;
        }
        setShowDeleteWarning({ id: slot.id, name: slot.name || 'Singer' });
        setConfirmingId(null);
        setEmailInput('');
        setIsSubmitting(false);
        return;
      }
      setConfirmingId(null);
      setEmailInput('');
      setEditingSlotId(null);
      await fetchSlots();
    } catch (error: any) {
      console.error('Submission Error:', error);
      alert(`Error updating slot.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const confirmDeletion = async () => {
    if (!showDeleteWarning) return;
    setIsSubmitting(true);
    try {
      const supabase = await loadSupabase();
      const { error } = await supabase
        .from('auditions')
        .update({
          name: null,
          email: null,
          status: 'Available'
        })
        .eq('id', showDeleteWarning.id);
      if (error) throw error;
      setShowDeleteWarning(null);
      await fetchSlots();
    } catch (error: any) {
      console.error('Delete Error:', error);
      alert("Could not cancel booking.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const daysData = [
    { day: 'Wednesday', date: 'September 18' },
    { day: 'Thursday', date: 'September 19' }
  ];
  const renderSlots = (daySlots: AuditionSlot[]) => {
    const half = Math.ceil(daySlots.length / 2);
    const col1 = daySlots.slice(0, half);
    const col2 = daySlots.slice(half);
    return (
      <div className="grid min-w-0 grid-cols-1 gap-x-2 gap-y-3 lg:grid-cols-2">
        {[col1, col2].map((column, colIdx) => (
          <div key={colIdx} className="space-y-1.5">
            <div className="grid grid-cols-12 gap-1 rounded-xl bg-gray-50 px-2 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 md:text-[11px]" style={fontInter}>
              <div className="col-span-2">Time</div>
              <div className="col-span-10 pl-1">Name</div>
            </div>
            {column.map((slot) => {
              const isConfirming = confirmingId?.id === slot.id;
              const isBooked = slot.status === 'Booked';
              const isBreak = slot.status === 'Break';
              const hasText = (tempNames[slot.id] || '').trim().length > 0;
              const displayTime = slot.time.replace(' PM', '');
              return (
                <div key={slot.id} className={`grid grid-cols-12 gap-1 items-center rounded-2xl border p-1.5 transition-all ${isConfirming ? 'border-[#8FA8C8] bg-[#8FA8C8]/5' : isBooked ? 'border-transparent bg-gray-50/60 opacity-80' : isBreak ? 'border-transparent bg-gray-100' : 'border-transparent hover:border-gray-100 hover:bg-gray-50'}`}>
                  <div className="col-span-2 px-1 text-left">
                    <span className={`font-bold text-[10px] md:text-[12px] tracking-tight ${isBooked ? 'text-gray-400' : 'text-[#2B4C6F]'}`} style={{ ...fontInter, letterSpacing: '-0.02em' }}>{displayTime}</span>
                  </div>
                  <div className="col-span-10 relative group">
                    {isBreak ? (
                      <span className="italic text-gray-400 font-medium px-1 md:px-1.5 text-[8px] md:text-[9px] tracking-tighter" style={fontInter}>---</span>
                    ) : isBooked ? (
                      <div className="flex items-center justify-between gap-0.5 md:gap-1 px-1 md:px-1.5 py-0.5 bg-white rounded shadow-sm border border-gray-100 h-full relative overflow-hidden">
                        <AnimatePresence mode="wait">
                          {isConfirming ? (
                            <motion.div key="cancel-input" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="w-full relative flex items-center">
                              <input autoFocus type="text" placeholder="ID to Cancel" className="w-full bg-red-50/50 border border-red-200 px-2 py-1 md:py-1.5 rounded-md text-[10px] md:text-[12px] outline-none font-bold pr-[56px] md:pr-[64px]" style={fontInter} value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') processAction();
                                  if (e.key === 'Escape') setConfirmingId(null);
                                }}
                              />
                              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button onClick={processAction} className="p-1 md:p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors active:scale-95 flex items-center justify-center">
                                  {isSubmitting ? <div className="w-3 h-3 md:w-3.5 md:h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Check className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                                </button>
                                <button onClick={() => setConfirmingId(null)} className="p-1 md:p-1.5 bg-white border border-gray-200 text-gray-400 rounded hover:bg-gray-50 transition-colors active:scale-95 flex items-center justify-center">
                                  <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div key="booked-info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-between w-full">
                              <span className="font-bold text-[#2B4C6F] text-[10px] md:text-[12px] truncate" style={fontInter}>{slot.name}</span>
                              <button onClick={() => startConfirmation(slot.id, 'delete')}
                                className="text-gray-300 hover:text-red-500 transition-colors p-0.5 md:p-1"
                              >
                                <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="relative flex items-center w-full">
                        <AnimatePresence mode="wait">
                          {isConfirming ? (
                            <motion.div key="id-input" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="w-full relative flex items-center">
                              <input autoFocus type="text" placeholder="Student ID (x500)" className="w-full px-2 py-1 md:py-1.5 bg-green-50/50 border-2 border-green-200 rounded-lg outline-none text-[11px] md:text-[13px] font-bold pr-[64px] md:pr-[72px]" style={fontInter} value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && emailInput.trim()) processAction();
                                  if (e.key === 'Escape') setConfirmingId(null);
                                }}
                              />
                              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {emailInput.trim() && (
                                  <button onClick={processAction} disabled={isSubmitting} className="p-1 md:p-1.5 bg-green-500 text-white rounded md:rounded-md shadow-sm hover:bg-green-600 transition-all active:scale-90 flex items-center justify-center">
                                    {isSubmitting ? (
                                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                    ) : (
                                      <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[3px]" />
                                    )}
                                  </button>
                                )}
                                <button onClick={() => setConfirmingId(null)}
                                  className="p-1 md:p-1.5 bg-white border border-gray-200 text-gray-400 rounded md:rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors"
                                >
                                  <X className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div key="name-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="relative w-full">
                              <input type="text" placeholder="Name" className={`w-full px-1.5 md:px-2 py-1 md:py-1.5 bg-white border-2 rounded-lg outline-none transition-all text-[11px] md:text-[13px] font-bold pr-[32px] md:pr-[40px] ${editingId === slot.id ? 'border-[#8FA8C8]' : 'border-gray-100'}`} style={fontInter} value={tempNames[slot.id] || ''} onFocus={() => setEditingSlotId(slot.id)}
                                onChange={(e) => handleNameChange(slot.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && hasText) startConfirmation(slot.id, 'save');
                                }}
                              />
                              <AnimatePresence>
                                {hasText && (
                                  <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} onClick={() => startConfirmation(slot.id, 'save')}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 md:p-2 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-md active:scale-95 flex items-center justify-center min-w-[24px] min-h-[24px] md:min-w-[28px] md:min-h-[28px]"
                                  >
                                    <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[3px]" />
                                  </motion.button>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  return (
    <PageTransition className="pb-20 md:pb-24">
      <Seo
        title="Audition for Vocal U"
        description={auditionsDescription}
        path="/auditions"
        keywords={['Vocal U auditions', 'UMN a cappella auditions', 'Minnesota student singing auditions']}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Auditions', path: '/auditions' },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Vocal U Auditions',
          description: auditionsDescription,
          url: toAbsoluteUrl('/auditions'),
          about: {
            '@id': toAbsoluteUrl('/#organization'),
          },
          audience: {
            '@type': 'Audience',
            audienceType: 'University of Minnesota students',
          },
        }}
      />
      <motion.section variants={childVariants} className="relative mb-4 flex items-center justify-center overflow-hidden border border-gray-100 px-4 py-5 shadow-sm md:mb-6 md:px-6 md:py-8" style={{ borderRadius: '18px', background: 'linear-gradient(135deg, #8FA8C8 0%, #7F99B8 100%)' }}>
        <div className="relative z-10 flex w-full items-center justify-center gap-6 px-2 text-center md:gap-10">
          <div className="shrink-0 hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/" className="group cursor-pointer">
              <img src={logoImage} alt="Vocal U Logo" className="h-14 md:h-20 w-auto" />
            </Link>
          </div>
          <div className="text-left">
            <div className="text-white">
              <h1 className="text-white" style={{ ...fontYearbook, fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '0.05em', lineHeight: '1' }}>
                AUDITIONS
              </h1>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold tracking-widest text-white/90 md:text-[14px]" style={fontInter}>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 md:w-5 md:h-5" /> Sep 18/19</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 md:w-5 md:h-5" /> 6-9 PM</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <div className="px-0">
        {/* Sign Up Section */}
        <motion.section variants={childVariants} className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4 md:mb-[25px] border border-gray-100">
          <div className="px-4 py-2 md:px-6 md:py-3 border-b border-gray-50 flex justify-center items-center">
            <h2 className="text-[#2B4C6F] opacity-80" style={{ ...fontYearbook, fontSize: '18px' }}>
              SIGN UP
            </h2>
          </div>
          <div className="p-3 md:p-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
              {daysData.map((dayInfo) => (
                <div key={dayInfo.day} className="rounded-[22px] border border-gray-100 bg-[#fcfdff] p-3 md:p-4">
                  <div className="flex flex-col items-center mb-3">
                    <h3 className="text-[#2B4C6F] font-bold text-center whitespace-nowrap" style={{ ...fontInter, fontSize: 'clamp(11px, 1.4vw, 15px)' }}>
                      {dayInfo.day}, {dayInfo.date}
                    </h3>
                    <div className="w-full h-[1px] bg-[#8FA8C8] mt-1.5" />
                  </div>
                  {loading ? (
                    <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8FA8C8]" /></div>
                  ) : (
                    renderSlots(slots.filter(s => s.day === dayInfo.day))
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.section>
        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          <motion.div variants={childVariants} className="relative h-full overflow-hidden rounded-[28px] border border-gray-100 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8 group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#8FA8C8]/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
            <div className="bg-[#8FA8C8]/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative z-10 rotate-3 transition-transform duration-500 group-hover:rotate-0">
              <Users className="w-10 h-10 text-[#2B4C6F]" />
            </div>
            <h3 className="text-[#2B4C6F] text-2xl md:text-[30px] mb-4 font-yearbook relative z-10" style={fontYearbook}>ARRIVAL</h3>
            <p className="text-gray-700 text-[15px] md:text-[17px] leading-relaxed relative z-10 font-medium" style={fontInter}>
              Please arrive <span className="font-bold text-[#2B4C6F]">15 minutes</span> before your slot to check in. If you're a walk-in, come by the desk and we'll fit you into the next available gap!
            </p>
          </motion.div>

          <motion.div variants={childVariants} className="relative h-full overflow-hidden rounded-[28px] border border-[#2B4C6F]/10 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8 group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#2B4C6F]/5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
            <div className="bg-[#2B4C6F]/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative z-10 -rotate-3 transition-transform duration-500 group-hover:rotate-0">
              <Music className="w-10 h-10 text-[#2B4C6F]" />
            </div>
            <h3 className="text-[#2B4C6F] text-2xl md:text-[30px] mb-4 font-yearbook relative z-10" style={fontYearbook}>PREPARATION</h3>
            <p className="text-gray-700 text-[15px] md:text-[17px] leading-relaxed relative z-10 font-medium" style={fontInter}>
              Prepare <span className="font-bold text-[#2B4C6F]">~60 seconds</span> (verse and a chorus) of a contemporary song (Pop, Rock, R&B, etc.) that showcases your voice. Just bring your talent!
            </p>
          </motion.div>

          <motion.div variants={childVariants} className="relative h-full overflow-hidden rounded-[28px] border border-gray-100 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8 group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#8FA8C8]/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
            <div className="bg-[#8FA8C8]/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative z-10 rotate-3 transition-transform duration-500 group-hover:rotate-0">
              <Clock className="w-10 h-10 text-[#2B4C6F]" />
            </div>
            <h3 className="text-[#2B4C6F] text-2xl md:text-[30px] mb-4 font-yearbook relative z-10" style={fontYearbook}>THE PROCESS</h3>
            <p className="text-gray-700 text-[15px] md:text-[17px] leading-relaxed relative z-10 font-medium" style={fontInter}>
              The process involves introducing yourself, a <span className="font-bold text-[#2B4C6F]">warm up/range check</span>, and then singing your prepared song!
            </p>
          </motion.div>
        </div>
        {/* FAQ / Advice Section */}
        <motion.section variants={childVariants} className="mt-12 bg-[#2B4C6F] p-7 md:p-10 text-white overflow-hidden relative" style={{ borderRadius: '24px' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr),340px]">
            <div>
              <h2 className="text-3xl mb-6 font-yearbook" style={fontYearbook}>AUDITION TIPS</h2>
              <div className="space-y-4 text-white/75" style={fontInter}>
                <div className="flex gap-4">
                  <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</div>
                  <p>Choose a song you've sung many times before. Nerves are real and familiarity is your best friend!</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</div>
                  <p>Warm up your voice before you arrive. Use your shower time or the walk to the audition!</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</div>
                  <p>Be yourself! We're not just looking for great voices, we're looking for great people to join our Vocal U family.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-6 md:p-8 border border-white/20 backdrop-blur-sm" style={{ borderRadius: '18px' }}>
              <h3 className="text-xl mb-4 font-yearbook" style={fontYearbook}>WHAT'S NEXT?</h3>
              <p className="text-white/70 mb-6" style={fontInter}>
                After initial auditions, we'll send out callback notifications via email. Callbacks are held the following week after auditions.
              </p>
              <div className="flex items-center gap-3 text-sm font-bold tracking-widest bg-white text-[#2B4C6F] px-4 py-2 rounded-lg w-fit">
                <Check className="w-4 h-4" /> GOOD LUCK!
              </div>
            </div>
          </div>
        </motion.section>
        {/* Explore More Navigator */}
        <motion.section variants={childVariants} className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="text-[#2B4C6F] mb-10 text-center font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(28px, 4vw, 36px)' }}>
            EXPLORE MORE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'About Us', path: '/about' },
              { name: 'Our Members', path: '/members' },
              { name: 'Our Media', path: '/media' },
              { name: 'Support Us', path: '/donate' }
            ].map((item) => (
              <Link key={item.path} to={item.path} className="group bg-white p-8 border border-gray-100 hover:border-[#8FA8C8] shadow-sm hover:shadow-xl transition-all duration-300 text-center" style={{ borderRadius: '20px' }}>
                <h3 className="text-[#2B4C6F] text-lg font-yearbook group-hover:text-[#8FA8C8] transition-colors" style={fontYearbook}>
                  {item.name}
                </h3>
                <p className="text-[#8FA8C8] text-xs mt-2 tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  LEARN MORE
                </p>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
      {/* Delete Warning Modal */}
      <AnimatePresence>
        {showDeleteWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteWarning(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white shadow-2xl rounded-[32px] p-8 border border-red-500/10 flex flex-col gap-6 text-center">
              <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-[#2B4C6F] text-2xl font-yearbook" style={fontYearbook}>Wait!</h3>
                <p className="text-gray-600 text-[14px] leading-relaxed" style={fontInter}>
                  We'd still love to hear you sing, <span className="font-bold">{showDeleteWarning.name}</span>!
                </p>
                <p className="text-gray-500 text-[12px] leading-relaxed" style={fontInter}>
                  If this time no longer works, we strongly suggest picking a new slot instead of cancelling. Remember, this spot could have been taken by someone else!
                </p>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <button onClick={() => setShowDeleteWarning(null)}
                  className="w-full py-4 bg-[#8FA8C8] text-white rounded-2xl hover:bg-[#7A97B7] shadow-xl shadow-[#8FA8C8]/20 transition-all active:scale-[0.98] font-bold tracking-[0.1em] text-sm flex items-center justify-center gap-2"
                  style={fontInter}
                >
                  KEEP MY SPOT
                </button>
                <button onClick={confirmDeletion} disabled={isSubmitting} className="w-full py-3 bg-transparent text-gray-400 hover:text-red-500 rounded-xl transition-colors text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2" style={fontInter}>
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                  ) : (
                    "Proceed to Cancel"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
