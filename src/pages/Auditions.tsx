import { memo, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { supabase } from '../utils/supabase';
import confetti from 'canvas-confetti';
import logoImage from 'figma:asset/d4630c01b543cc75980f0b293230859d29654fbb.png';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };
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
  const [slots, setSlots] = useState<AuditionSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingSlotId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<{ id: string, mode: 'save' | 'delete' } | null>(null);
  const [tempNames, setTempNames] = useState<Record<string, string>>({});
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSlots = useCallback(async () => {
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
    fetchSlots();
    const channel = supabase
      .channel('audition-updates')
      .on('postgres_changes', { event: '*', table: 'auditions', schema: 'public' }, () => {
        fetchSlots();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSlots]);

  const handleNameChange = (id: string, value: string) => {
    setTempNames(prev => ({ ...prev, [id]: value }));
  };

  const startConfirmation = (id: string, mode: 'save' | 'delete') => {
    setConfirmingId({ id, mode });
    setEmailInput('');
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
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
      if (mode === 'save') {
        const nameToSave = tempNames[id]?.trim();
        if (!nameToSave) {
          alert("Please enter a name first.");
          setIsSubmitting(false);
          return;
        }

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
          alert("Student ID doesn't match the one used to book this slot!");
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase
          .from('auditions')
          .update({
            name: null,
            email: null,
            status: 'Available'
          })
          .eq('id', id);
        
        if (error) throw error;
      }

      setConfirmingId(null);
      setEmailInput('');
      setEditingSlotId(null);
      setTempNames(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await fetchSlots();
    } catch (error: any) {
      console.error('Submission Error:', error);
      alert(`Could not update slot: ${error.message || 'Check your internet connection.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysData = [
    { day: 'Wednesday', date: 'Feb 18th' },
    { day: 'Thursday', date: 'Feb 19th' }
  ];

  const renderSlots = (daySlots: AuditionSlot[]) => {
    const half = Math.ceil(daySlots.length / 2);
    const col1 = daySlots.slice(0, half);
    const col2 = daySlots.slice(half);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1">
        {[col1, col2].map((column, colIdx) => (
          <div key={colIdx} className="space-y-0.5">
            <div className="grid grid-cols-10 gap-1 px-2 py-1 bg-gray-50 rounded text-[9px] font-bold text-gray-400 tracking-widest uppercase" style={fontInter}>
              <div className="col-span-3">TIME</div>
              <div className="col-span-7">NAME</div>
            </div>
            {column.map((slot) => {
              const isConfirming = confirmingId?.id === slot.id;
              const isBooked = slot.status === 'Booked';
              const isBreak = slot.status === 'Break';
              const hasText = (tempNames[slot.id] || '').trim().length > 0;
              const displayTime = slot.time.replace(' PM', '');

              return (
                <div 
                  key={slot.id} 
                  className={`grid grid-cols-10 gap-1 items-center p-1 rounded transition-all border ${
                    isConfirming ? 'border-[#8FA8C8] bg-[#8FA8C8]/5' : 
                    isBooked ? 'border-transparent bg-gray-50/50 opacity-80' : 
                    isBreak ? 'border-transparent bg-gray-100' : 
                    'border-transparent hover:border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="col-span-3 px-0.5">
                    <span className={`font-bold text-[12px] ${isBooked ? 'text-gray-400' : 'text-[#2B4C6F]'}`} style={fontInter}>{displayTime}</span>
                  </div>

                  <div className="col-span-7 relative group">
                    {isBreak ? (
                      <span className="italic text-gray-400 font-medium px-1.5 text-[9px] uppercase tracking-tighter" style={fontInter}>--- BREAK ---</span>
                    ) : isBooked ? (
                      <div className="flex items-center justify-between gap-1 px-1.5 py-0.5 bg-white rounded shadow-sm border border-gray-100">
                        <span className="font-bold text-[#2B4C6F] text-[12px] truncate" style={fontInter}>{slot.name}</span>
                        {!isConfirming && (
                          <button 
                            onClick={() => startConfirmation(slot.id, 'delete')} 
                            className="text-gray-300 hover:text-red-500 transition-opacity p-0.5"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          placeholder="Name"
                          className={`w-full px-1.5 py-0.5 bg-white border rounded outline-none transition-all text-[12px] font-bold pr-6 ${
                            editingId === slot.id ? 'border-[#8FA8C8]' : 'border-gray-200'
                          }`}
                          style={fontInter}
                          value={tempNames[slot.id] || ''}
                          onFocus={() => setEditingSlotId(slot.id)}
                          onChange={(e) => handleNameChange(slot.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && hasText) startConfirmation(slot.id, 'save');
                          }}
                        />
                        <AnimatePresence>
                          {hasText && !isBooked && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute right-1"
                            >
                              <button
                                onClick={() => startConfirmation(slot.id, 'save')}
                                className="p-0.5 bg-[#8FA8C8] text-white rounded hover:bg-[#7A97B7] shadow-sm transition-colors"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* 📧 Inline Mini Popup - Universal placement */}
                    <AnimatePresence>
                      {isConfirming && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 0 }}
                          animate={{ opacity: 1, scale: 1, y: 4 }}
                          exit={{ opacity: 0, scale: 0.9, y: 0 }}
                          className="absolute right-0 top-full z-20 bg-white shadow-2xl rounded-lg p-2 border-2 border-[#8FA8C8] flex flex-col gap-1.5 min-w-[140px]"
                        >
                          <div className="text-[8px] font-bold text-[#8FA8C8] uppercase tracking-wider" style={fontInter}>Student ID</div>
                          <div className="flex items-center gap-1">
                            <input 
                              autoFocus
                              type="text"
                              placeholder="lastname123"
                              className="flex-1 bg-gray-50 px-1.5 py-1 rounded text-[10px] outline-none font-bold min-w-0"
                              style={fontInter}
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') processAction();
                                if (e.key === 'Escape') setConfirmingId(null);
                              }}
                            />
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button 
                                onClick={processAction} 
                                disabled={isSubmitting || !emailInput.trim()} 
                                className="p-1 bg-[#8FA8C8] text-white rounded hover:bg-[#7A97B7] disabled:opacity-50"
                              >
                                {isSubmitting ? (
                                  <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                ) : (
                                  <Check className="w-2.5 h-2.5" />
                                )}
                              </button>
                              <button 
                                onClick={() => setConfirmingId(null)} 
                                disabled={isSubmitting}
                                className="p-1 bg-gray-100 text-gray-400 rounded hover:bg-gray-200"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
    <div className="pb-24">
      {/* Header with Logo and Animated Gradient */}
      <section className="relative py-6 flex flex-col items-center justify-center overflow-hidden mb-6 mx-3 md:mx-0 mt-4 animate-gradient shadow-xl" 
        style={{ 
          borderRadius: '24px',
          background: 'linear-gradient(-45deg, #2B4C6F, #3d5e82, #8FA8C8, #7A97B7)'
        }}>
        
        <div className="relative z-10 text-center px-6 w-full flex flex-col items-center">
          <Link to="/" className="mb-4 group">
            <img 
              src={logoImage} 
              alt="Vocal U Logo" 
              className="h-12 md:h-16 w-auto transition-transform group-hover:scale-105" 
            />
          </Link>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-white" style={{ ...fontYearbook, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '0.05em' }}>
              AUDITIONS
            </h1>
            <div className="flex justify-center gap-4 text-white/80 mt-1 font-bold tracking-widest text-[9px]" style={fontInter}>
              <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> FEB 18 & 19</div>
              <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 6:00 - 9:00</div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-2 md:px-4">
        {/* Sign Up Section */}
        <section className="bg-white rounded-[24px] shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="px-6 py-3 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-[#2B4C6F] opacity-80" style={{ ...fontYearbook, fontSize: '18px' }}>
              SIGN UP
            </h2>
          </div>

          <div className="p-2 md:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
              {daysData.map((dayInfo) => (
                <div key={dayInfo.day}>
                  <div className="flex items-baseline gap-2 mb-2 border-b border-gray-100 pb-1">
                    <h3 className="text-[#8FA8C8] text-base uppercase tracking-widest font-bold" style={fontYearbook}>{dayInfo.day}</h3>
                    <span className="text-[#8FA8C8]/60 text-xs font-bold uppercase tracking-wider" style={fontInter}>{dayInfo.date}</span>
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
        </section>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="bg-white p-6 rounded-[20px] shadow-lg border-t-4 border-[#8FA8C8]">
            <Users className="w-5 h-5 text-[#8FA8C8] mb-3" />
            <h3 className="text-[#2B4C6F] text-base mb-1" style={fontYearbook}>WALK-INS</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed" style={fontInter}>Didn't get a slot? Just come to the desk at the audition location and we'll fit you in.</p>
          </div>
          <div className="bg-white p-6 rounded-[20px] shadow-lg border-t-4 border-[#2B4C6F]">
            <Music className="w-5 h-5 text-[#2B4C6F] mb-3" />
            <h3 className="text-[#2B4C6F] text-base mb-1" style={fontYearbook}>PREPARATION</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed" style={fontInter}>Prepare 30-60s of any song that shows off your voice. Plus a quick chat!</p>
          </div>
          <div className="bg-white p-6 rounded-[20px] shadow-lg border-t-4 border-amber-400">
            <AlertCircle className="w-5 h-5 text-amber-500 mb-3" />
            <h3 className="text-[#2B4C6F] text-base mb-1" style={fontYearbook}>LOCATION</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed" style={fontInter}>UMN Campus. Room details will be sent to your student email after booking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
