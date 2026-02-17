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
import { supabase } from '../utils/supabase';
import confetti from 'canvas-confetti';

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
            email: emailInput.trim(), // We're using the 'email' column to store the ID
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

      // Success - Only reset state AFTER DB success
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
      alert(`Could not update slot: ${error.message || 'Check your internet connection or try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysData = [
    { day: 'Wednesday', date: 'Feb 18th' },
    { day: 'Thursday', date: 'Feb 19th' }
  ];

  return (
    <div className="pb-24">
      {/* 🚀 Header Section */}
      <section className="relative py-8 flex items-center justify-center overflow-hidden mb-8 mx-3 md:mx-0 mt-6" style={{ borderRadius: '32px' }}>
        <div 
          className="absolute inset-0 bg-[#2B4C6F] z-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, #3d5e82 0%, transparent 70%), radial-gradient(circle at 80% 70%, #8FA8C8 0%, transparent 70%)'
          }}
        />
        
        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-white" style={{ ...fontYearbook, fontSize: 'clamp(36px, 6vw, 60px)', letterSpacing: '0.05em' }}>
              AUDITIONS
            </h1>
            <div className="flex justify-center gap-6 text-white/80 mt-1 font-bold tracking-widest text-[10px]" style={fontInter}>
              <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> FEB 18 & 19</div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> 6:00 - 9:00 PM</div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {/* 📊 Sign Up Section */}
        <section className="bg-white rounded-[32px] shadow-2xl overflow-hidden mb-16 border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-50">
            <h2 className="text-[#2B4C6F] text-left opacity-80" style={{ ...fontYearbook, fontSize: '24px' }}>
              SIGN UP
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {daysData.map((dayInfo, dayIdx) => (
              <div key={dayInfo.day} className={`p-6 md:p-8 ${dayIdx === 0 ? 'lg:border-r border-gray-100' : ''}`}>
                <div className="flex items-baseline gap-2 mb-6">
                  <h3 className="text-[#8FA8C8] text-xl uppercase tracking-widest" style={fontYearbook}>{dayInfo.day}</h3>
                  <span className="text-[#8FA8C8]/60 text-sm font-bold uppercase tracking-wider" style={fontInter}>{dayInfo.date}</span>
                </div>

                {loading ? (
                  <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8FA8C8]" /></div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-10 gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                      <div className="col-span-3">TIME</div>
                      <div className="col-span-7">NAME</div>
                    </div>

                    {slots.filter(s => s.day === dayInfo.day).map((slot) => {
                      const isConfirming = confirmingId?.id === slot.id;
                      const isBooked = slot.status === 'Booked';
                      const isBreak = slot.status === 'Break';
                      const hasText = (tempNames[slot.id] || '').trim().length > 0;

                      return (
                        <div 
                          key={slot.id} 
                          className={`grid grid-cols-10 gap-2 items-center p-2 rounded-xl transition-all border ${
                            isConfirming ? 'border-[#8FA8C8] bg-[#8FA8C8]/5' : 
                            isBooked ? 'border-transparent bg-gray-50/50 opacity-80' : 
                            isBreak ? 'border-transparent bg-amber-50/30' : 
                            'border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className="col-span-3 px-2">
                            <span className={`font-bold text-sm ${isBooked ? 'text-gray-400' : 'text-[#2B4C6F]'}`} style={fontInter}>{slot.time}</span>
                          </div>

                          <div className="col-span-7 relative group">
                            {isBreak ? (
                              <span className="italic text-amber-600/40 font-medium px-3 text-[10px] uppercase">--- BREAK ---</span>
                            ) : isBooked ? (
                              <div className="flex items-center justify-between gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                <span className="font-bold text-[#2B4C6F] text-sm truncate">{slot.name}</span>
                                {!isConfirming && (
                                  <button 
                                    onClick={() => startConfirmation(slot.id, 'delete')} 
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="relative flex items-center">
                                <input
                                  type="text"
                                  placeholder="TYPE NAME..."
                                  className={`w-full px-3 py-2 bg-white border rounded-lg outline-none transition-all text-sm font-bold pr-10 ${
                                    editingId === slot.id ? 'border-[#8FA8C8]' : 'border-gray-200'
                                  }`}
                                  value={tempNames[slot.id] || ''}
                                  onFocus={() => setEditingSlotId(slot.id)}
                                  onChange={(e) => handleNameChange(slot.id, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && hasText) startConfirmation(slot.id, 'save');
                                  }}
                                />
                                <AnimatePresence>
                                  {hasText && (
                                    <motion.button
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.5 }}
                                      onClick={() => startConfirmation(slot.id, 'save')}
                                      className="absolute right-2 p-1 bg-[#8FA8C8] text-white rounded hover:bg-[#7A97B7] shadow-sm transition-colors"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </motion.button>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

                            {/* 📧 Inline Mini Popup - Positioned Below */}
                            <AnimatePresence>
                              {isConfirming && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9, y: 0 }}
                                  animate={{ opacity: 1, scale: 1, y: 10 }}
                                  exit={{ opacity: 0, scale: 0.9, y: 0 }}
                                  className="absolute left-0 right-0 top-full z-20 bg-white shadow-2xl rounded-xl p-3 border-2 border-[#8FA8C8] flex flex-col gap-2 max-w-[240px] mx-auto lg:mx-0"
                                >
                                  <div className="text-[9px] font-bold text-[#8FA8C8] uppercase tracking-wider">Verify Student ID (e.g. gopher123)</div>
                                  <div className="flex items-center gap-2">
                                    <input 
                                      autoFocus
                                      type="text"
                                      placeholder="Student ID"
                                      className="flex-1 bg-gray-50 px-2 py-1.5 rounded text-xs outline-none font-bold"
                                      value={emailInput}
                                      onChange={(e) => setEmailInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') processAction();
                                        if (e.key === 'Escape') setConfirmingId(null);
                                      }}
                                    />
                                    <button 
                                      onClick={processAction} 
                                      disabled={isSubmitting || !emailInput.trim()} 
                                      className="p-1.5 bg-[#8FA8C8] text-white rounded hover:bg-[#7A97B7] disabled:opacity-50"
                                    >
                                      {isSubmitting ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                      ) : (
                                        <Check className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                    <button 
                                      onClick={() => setConfirmingId(null)} 
                                      disabled={isSubmitting}
                                      className="p-1.5 bg-gray-100 text-gray-400 rounded hover:bg-gray-200"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 📚 Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[24px] shadow-lg border-t-4 border-[#8FA8C8]">
            <Users className="w-6 h-6 text-[#8FA8C8] mb-4" />
            <h3 className="text-[#2B4C6F] text-lg mb-2" style={fontYearbook}>WALK-INS</h3>
            <p className="text-gray-500 text-sm leading-relaxed" style={fontInter}>Didn't get a slot? Just come to the desk at the audition location and we'll fit you in.</p>
          </div>
          <div className="bg-white p-8 rounded-[24px] shadow-lg border-t-4 border-[#2B4C6F]">
            <Music className="w-6 h-6 text-[#2B4C6F] mb-4" />
            <h3 className="text-[#2B4C6F] text-lg mb-2" style={fontYearbook}>PREPARATION</h3>
            <p className="text-gray-500 text-sm leading-relaxed" style={fontInter}>Prepare 30-60s of any song that shows off your voice. Plus a quick chat!</p>
          </div>
          <div className="bg-white p-8 rounded-[24px] shadow-lg border-t-4 border-amber-400">
            <AlertCircle className="w-6 h-6 text-amber-500 mb-4" />
            <h3 className="text-[#2B4C6F] text-lg mb-2" style={fontYearbook}>LOCATION</h3>
            <p className="text-gray-500 text-sm leading-relaxed" style={fontInter}>UMN Campus. Exact room details will be sent to your student email after booking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
