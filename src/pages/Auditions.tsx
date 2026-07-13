import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { PageShell } from '../components/PageShell';
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
import logoImage from '../assets/d4630c01b543cc75980f0b293230859d29654fbb.png';
import { loadSupabase } from '../utils/loadSupabase';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';

const fontInter = { fontFamily: 'Inter, sans-serif' };
const confettiColors = ['#91a8c6', '#2e4c6d', '#ffffff', '#f3c969', '#d9a7c7'];

function AuditionCelebration() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden" aria-hidden="true">
      {Array.from({ length: 34 }, (_, index) => {
        const style = {
          left: `${(index * 29) % 100}%`,
          backgroundColor: confettiColors[index % confettiColors.length],
          animationDelay: `${(index % 8) * 45}ms`,
          animationDuration: `${1050 + (index % 6) * 120}ms`,
          '--confetti-drift': `${((index * 17) % 160) - 80}px`,
        } as CSSProperties;

        return <span key={index} className="confetti-piece" style={style} />;
      })}
    </div>
  );
}

interface AuditionSlot {
  id: string;
  time: string;
  day: string;
  status: 'Available' | 'Booked' | 'Break';
  name?: string;
}
export function Auditions() {
  const auditionsDescription =
    'Audition for Vocal U at the University of Minnesota. View audition timing, sign-up details, preparation tips, and callback information for the group.';
  const [slots, setSlots] = useState<AuditionSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingSlotId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<{ id: string, mode: 'save' | 'delete' } | null>(null);
  const [tempNames, setTempNames] = useState<Record<string, string>>({});
  const [studentIdInput, setStudentIdInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState<{ id: string, name: string, studentId: string } | null>(null);
  const [notice, setNotice] = useState('');
  const [celebrating, setCelebrating] = useState(false);

  const fetchSlots = useCallback(async () => {
    const supabase = await loadSupabase();
    const { data, error } = await supabase
      .from('auditions')
      .select('id,day,time,status,name')
      .order('time', { ascending: true });
    if (error) {
      console.error('Error fetching audition slots:', error);
    } else {
      setSlots((data || []).map((r) => ({
        id: r.id,
        day: r.day,
        time: r.time,
        status: r.status,
        name: r.name,
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
  useEffect(() => {
    if (!showDeleteWarning) return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowDeleteWarning(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDeleteWarning]);
  const handleNameChange = (id: string, value: string) => {
    setTempNames(prev => ({ ...prev, [id]: value }));
  };
  const startConfirmation = (id: string, mode: 'save' | 'delete') => {
    setConfirmingId({ id, mode });
    setStudentIdInput('');
  };
  const processAction = async () => {
    if (!confirmingId || !studentIdInput.trim()) return;
    setIsSubmitting(true);
    const { id, mode } = confirmingId;
    const slot = slots.find(s => s.id === id);
    if (!slot) {
      setNotice('That slot is no longer available. Refresh and choose another time.');
      setIsSubmitting(false);
      setConfirmingId(null);
      return;
    }
    try {
      const supabase = await loadSupabase();
      if (mode === 'save') {
        const nameToSave = tempNames[id]?.trim();
        if (!nameToSave) return;
        const { data, error } = await supabase
          .from('auditions')
          .update({
            name: nameToSave,
            email: studentIdInput.trim().toLowerCase(),
            status: 'Booked'
          })
          .eq('id', id)
          .eq('status', 'Available')
          .select('id')
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Slot is no longer available');
        setNotice(`You’re signed up for ${slot.day} at ${slot.time}.`);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setCelebrating(true);
          window.setTimeout(() => setCelebrating(false), 1900);
        }
      } else {
        setShowDeleteWarning({ id: slot.id, name: slot.name || 'Singer', studentId: studentIdInput.trim().toLowerCase() });
        setConfirmingId(null);
        setStudentIdInput('');
        setIsSubmitting(false);
        return;
      }
      setConfirmingId(null);
      setStudentIdInput('');
      setEditingSlotId(null);
      setTempNames((current) => ({ ...current, [id]: '' }));
      await fetchSlots();
    } catch (error) {
      console.error('Submission Error:', error);
      setNotice('That slot changed before the update finished. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const confirmDeletion = async () => {
    if (!showDeleteWarning) return;
    setIsSubmitting(true);
    try {
      const supabase = await loadSupabase();
      const { data, error } = await supabase
        .from('auditions')
        .update({
          name: null,
          email: null,
          status: 'Available'
        })
        .eq('id', showDeleteWarning.id)
        .eq('email', showDeleteWarning.studentId)
        .eq('status', 'Booked')
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Student ID did not match');
      setNotice('Your audition slot was canceled.');
      setShowDeleteWarning(null);
      await fetchSlots();
    } catch (error) {
      console.error('Delete Error:', error);
      setNotice('The student ID did not match, or the slot changed.');
      setShowDeleteWarning(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  const daysData = [
    { day: 'Wednesday', date: 'September 16, 2026' },
    { day: 'Thursday', date: 'September 17, 2026' }
  ];
  const renderSlots = (daySlots: AuditionSlot[]) => {
    return (
      <div className="min-w-0 space-y-1.5">
        <div className="grid grid-cols-[3.4rem_minmax(0,1fr)] gap-1.5 rounded-lg bg-gray-50 px-2 py-1.5 text-[10px] font-semibold tracking-wide text-gray-500" style={fontInter}>
          <div>Time</div>
          <div>Name</div>
        </div>
            {daySlots.map((slot) => {
              const isConfirming = confirmingId?.id === slot.id;
              const isBooked = slot.status === 'Booked';
              const isBreak = slot.status === 'Break';
              const hasText = (tempNames[slot.id] || '').trim().length > 0;
              const displayTime = slot.time.replace(' PM', '');
              return (
                <div key={slot.id} className={`grid grid-cols-[3.4rem_minmax(0,1fr)] items-center gap-1.5 rounded-lg border p-1 transition-colors ${isConfirming ? 'border-[#8FA8C8] bg-[#8FA8C8]/5' : isBooked ? 'border-transparent bg-gray-50/70' : isBreak ? 'border-transparent bg-gray-100' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'}`}>
                  <div className="px-1 text-left">
                    <span className={`text-[11px] font-semibold tracking-tight md:text-xs ${isBooked ? 'text-gray-400' : 'text-[#2B4C6F]'}`} style={{ ...fontInter, letterSpacing: '-0.02em' }}>{displayTime}</span>
                  </div>
                  <div className="relative group min-w-0">
                    {isBreak ? (
                      <span className="px-1 text-[11px] italic text-gray-400" style={fontInter}>Break</span>
                    ) : isBooked ? (
                      <div className="flex min-h-[22px] items-center justify-between gap-0.5 px-1 py-0.5 bg-white rounded border border-gray-100 h-full relative overflow-hidden md:min-h-[28px] md:rounded-md md:px-1.5">
                          {isConfirming ? (
                            <div className="w-full relative flex items-center">
                              <input autoFocus type="text" placeholder="Student ID" aria-label="Student ID used to reserve this slot" autoCapitalize="none" autoComplete="username" maxLength={160} className="w-full rounded-md border border-red-200 bg-red-50/50 px-2 py-1.5 pr-[64px] text-xs font-semibold outline-none focus:border-red-400" style={fontInter} value={studentIdInput} onChange={(e) => setStudentIdInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') processAction();
                                  if (e.key === 'Escape') setConfirmingId(null);
                                }}
                              />
                              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 md:right-1 md:gap-1">
                                <button onClick={processAction} aria-label="Continue cancellation" className="flex items-center justify-center rounded bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600">
                                  {isSubmitting ? <div className="w-3 h-3 md:w-3.5 md:h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Check className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                                </button>
                                <button onClick={() => setConfirmingId(null)} aria-label="Close cancellation" className="flex items-center justify-center rounded border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50">
                                  <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-[#2B4C6F] text-[9px] md:text-[12px] truncate" style={fontInter}>{slot.name}</span>
                              <button onClick={() => startConfirmation(slot.id, 'delete')}
                                className="rounded p-1 text-gray-400 transition-colors hover:text-red-600" aria-label={`Cancel ${slot.name || 'this'} audition slot`}
                              >
                                <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              </button>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="relative flex items-center w-full">
                          {isConfirming ? (
                            <div className="w-full relative flex items-center">
                              <input autoFocus type="text" placeholder="Student ID" aria-label="University of Minnesota student ID" autoCapitalize="none" autoComplete="username" maxLength={160} className="w-full rounded-md border border-green-200 bg-green-50/50 px-2 py-1.5 pr-[72px] text-xs font-semibold outline-none focus:border-green-500" style={fontInter} value={studentIdInput} onChange={(e) => setStudentIdInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && studentIdInput.trim()) processAction();
                                  if (e.key === 'Escape') setConfirmingId(null);
                                }}
                              />
                              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 md:right-1 md:gap-1">
                                {studentIdInput.trim() && (
                                  <button onClick={processAction} disabled={isSubmitting} aria-label="Reserve audition slot" className="flex items-center justify-center rounded-md bg-green-600 p-1.5 text-white hover:bg-green-700 disabled:opacity-50">
                                    {isSubmitting ? (
                                      <div className="w-3 h-3 md:w-5 md:h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                    ) : (
                                      <Check className="w-3 h-3 md:w-5 md:h-5 stroke-[3px]" />
                                    )}
                                  </button>
                                )}
                                <button onClick={() => setConfirmingId(null)} aria-label="Cancel reservation"
                                  className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50"
                                >
                                  <X className="w-3 h-3 md:w-5 md:h-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative w-full">
                              <input type="text" placeholder="Your name" aria-label={`Name for ${slot.day} at ${slot.time}`} autoComplete="name" maxLength={100} className={`w-full rounded-md border bg-white px-2 py-1.5 pr-[40px] text-xs font-semibold outline-none transition-colors ${editingId === slot.id ? 'border-[#8FA8C8]' : 'border-gray-200'}`} style={fontInter} value={tempNames[slot.id] || ''} onFocus={() => setEditingSlotId(slot.id)}
                                onChange={(e) => handleNameChange(slot.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && hasText) startConfirmation(slot.id, 'save');
                                }}
                              />
                                {hasText && (
                                  <button onClick={() => startConfirmation(slot.id, 'save')} aria-label="Continue reservation"
                                    className="absolute right-1 top-1/2 flex min-h-[28px] min-w-[28px] -translate-y-1/2 items-center justify-center rounded bg-green-600 p-1.5 text-white hover:bg-green-700"
                                  >
                                    <Check className="w-3 h-3 md:w-5 md:h-5 stroke-[3px]" />
                                  </button>
                                )}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    );
  };
  return (
    <PageShell className="pb-20 md:pb-24">
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
      {celebrating && <AuditionCelebration />}
      <section className="relative mb-3 flex items-center justify-center overflow-hidden rounded-[26px] bg-gradient-to-br from-[#7895b7] via-[#91a8c6] to-[#abc0d9] px-4 py-4 shadow-[0_16px_42px_rgba(35,61,85,0.14)] md:mb-6 md:px-6 md:py-7">
        <div className="absolute -left-10 -top-12 h-32 w-32 rounded-full border-[24px] border-white/8" aria-hidden="true" />
        <Music className="absolute bottom-3 right-5 h-14 w-14 -rotate-12 text-white/10" aria-hidden="true" />
        <div className="relative z-10 flex w-full items-center justify-center gap-3 px-1 text-center md:gap-10">
          <div className="shrink-0 hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/" className="group cursor-pointer">
              <img src={logoImage} alt="Vocal U Logo" className="h-10 md:h-20 w-auto" />
            </Link>
          </div>
          <div className="text-left">
            <div className="text-white">
              <h1 className="text-white" style={{ ...fontYearbook, fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '0.05em', lineHeight: '1' }}>
                Auditions
              </h1>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold tracking-widest text-white/90 md:mt-2 md:gap-x-5 md:gap-y-2 md:text-[14px]" style={fontInter}>
                <div className="flex items-center gap-1 md:gap-2"><Calendar className="w-3 h-3 md:w-5 md:h-5" /> Sep 16–17, 2026</div>
                <div className="flex items-center gap-1 md:gap-2"><Clock className="w-3 h-3 md:w-5 md:h-5" /> 6-9 PM</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="px-0">
        {/* Sign Up Section */}
        <section className="mb-4 overflow-hidden rounded-[26px] border border-[#dce5ed] bg-white shadow-[0_16px_42px_rgba(35,61,85,0.09)] md:mb-[25px]">
          <div className="px-2 py-1 md:px-6 md:py-3 border-b border-gray-50 flex justify-center items-center">
            <h2 className="text-[#2B4C6F] opacity-80" style={{ ...fontYearbook, fontSize: 'clamp(18px, 3vw, 24px)' }}>
              Sign up
            </h2>
          </div>
          <p className="min-h-6 px-4 pt-3 text-center text-sm font-medium text-[#2e4c6d]" aria-live="polite">{notice}</p>
          <div className="p-1 md:p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:gap-6">
              {daysData.map((dayInfo) => (
                <div key={dayInfo.day} className="rounded-lg border border-gray-100 bg-[#fcfdff] p-1 md:rounded-[22px] md:p-4 min-w-0">
                  <div className="flex flex-col items-center mb-1 md:mb-3">
                    <h3 className="text-[#2B4C6F] font-bold text-center whitespace-nowrap" style={{ ...fontInter, fontSize: 'clamp(9px, 2.3vw, 15px)' }}>
                      {dayInfo.day}, {dayInfo.date}
                    </h3>
                    <div className="w-full h-[1px] bg-[#8FA8C8] mt-1 md:mt-1.5" />
                  </div>
                  {loading ? (
                    <div className="py-12 flex justify-center" role="status"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8FA8C8]" /><span className="sr-only">Loading audition times</span></div>
                  ) : (
                    renderSlots(slots.filter(s => s.day === dayInfo.day))
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          <div className="group relative h-full overflow-hidden rounded-[24px] border border-[#dce5ed] bg-white p-7 shadow-[0_10px_28px_rgba(35,61,85,0.06)] transition-[transform,box-shadow] hover:-translate-y-1 hover:-rotate-[0.35deg] hover:shadow-[0_18px_38px_rgba(35,61,85,0.12)] md:p-8">
            <div className="absolute right-0 top-0 h-2 w-20 rounded-bl-full bg-[#91a8c6]" aria-hidden="true" />
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#91a8c6]/14">
              <Users className="h-6 w-6 text-[#2B4C6F]" />
            </div>
            <h3 className="mb-3 text-2xl text-[#2B4C6F] md:text-[30px]" style={fontYearbook}>Arrival</h3>
            <p className="text-[15px] font-medium leading-relaxed text-gray-700 md:text-[17px]" style={fontInter}>
              Please arrive <span className="font-bold text-[#2B4C6F]">15 minutes</span> before your slot to check in. If you're a walk-in, come by the desk and we'll fit you into the next available gap!
            </p>
          </div>

          <div className="group relative h-full overflow-hidden rounded-[24px] border border-[#dce5ed] bg-white p-7 shadow-[0_10px_28px_rgba(35,61,85,0.06)] transition-[transform,box-shadow] hover:-translate-y-1 hover:rotate-[0.35deg] hover:shadow-[0_18px_38px_rgba(35,61,85,0.12)] md:p-8">
            <div className="absolute right-0 top-0 h-2 w-20 rounded-bl-full bg-[#2e4c6d]" aria-hidden="true" />
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2e4c6d]/10">
              <Music className="h-6 w-6 text-[#2B4C6F]" />
            </div>
            <h3 className="mb-3 text-2xl text-[#2B4C6F] md:text-[30px]" style={fontYearbook}>Preparation</h3>
            <p className="text-[15px] font-medium leading-relaxed text-gray-700 md:text-[17px]" style={fontInter}>
              Prepare <span className="font-bold text-[#2B4C6F]">~60 seconds</span> (verse and a chorus) of a contemporary song (Pop, Rock, R&B, etc.) that showcases your voice. Just bring your talent!
            </p>
          </div>

          <div className="group relative h-full overflow-hidden rounded-[24px] border border-[#dce5ed] bg-white p-7 shadow-[0_10px_28px_rgba(35,61,85,0.06)] transition-[transform,box-shadow] hover:-translate-y-1 hover:-rotate-[0.35deg] hover:shadow-[0_18px_38px_rgba(35,61,85,0.12)] md:p-8">
            <div className="absolute right-0 top-0 h-2 w-20 rounded-bl-full bg-[#91a8c6]" aria-hidden="true" />
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#91a8c6]/14">
              <Clock className="h-6 w-6 text-[#2B4C6F]" />
            </div>
            <h3 className="mb-3 text-2xl text-[#2B4C6F] md:text-[30px]" style={fontYearbook}>The process</h3>
            <p className="text-[15px] font-medium leading-relaxed text-gray-700 md:text-[17px]" style={fontInter}>
              The process involves introducing yourself, a <span className="font-bold text-[#2B4C6F]">warm up/range check</span>, and then singing your prepared song!
            </p>
          </div>
        </div>
        {/* FAQ / Advice Section */}
        <section className="mt-12 overflow-hidden rounded-2xl bg-[#2B4C6F] p-7 text-white md:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr),340px]">
            <div>
              <h2 className="mb-6 text-3xl" style={fontYearbook}>Audition tips</h2>
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
              <h3 className="mb-4 text-xl" style={fontYearbook}>What’s next?</h3>
              <p className="text-white/70 mb-6" style={fontInter}>
                After initial auditions, we'll send out callback notifications via email. Callbacks are held the following week after auditions.
              </p>
              <div className="flex w-fit items-center gap-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#2B4C6F]">
                <Check className="w-4 h-4" /> Good luck
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Delete Warning Modal */}
        {showDeleteWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div onClick={() => setShowDeleteWarning(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <div className="relative flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-red-500/10 bg-white p-8 text-center shadow-xl" role="dialog" aria-modal="true" aria-labelledby="cancel-slot-title">
              <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-3">
                <h3 id="cancel-slot-title" className="text-2xl text-[#2B4C6F]" style={fontYearbook}>Cancel this slot?</h3>
                <p className="text-gray-600 text-[14px] leading-relaxed" style={fontInter}>
                  This will cancel the reservation for <span className="font-bold">{showDeleteWarning.name}</span>.
                </p>
                <p className="text-gray-500 text-[12px] leading-relaxed" style={fontInter}>
                  The time will become available for another singer. You can choose a new slot after canceling.
                </p>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <button autoFocus onClick={() => setShowDeleteWarning(null)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8FA8C8] py-4 text-sm font-semibold text-white transition-colors hover:bg-[#7A97B7]"
                  style={fontInter}
                >
                  Keep my spot
                </button>
                <button onClick={confirmDeletion} disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-transparent py-3 text-xs font-semibold text-gray-500 transition-colors hover:text-red-600" style={fontInter}>
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                  ) : (
                    "Cancel my slot"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </PageShell>
  );
}
