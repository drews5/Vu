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
import { SiGmail } from 'react-icons/si';
import logoImage from '../assets/d4630c01b543cc75980f0b293230859d29654fbb.png';
import { loadSupabase } from '../utils/loadSupabase';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';

const fontInter = { fontFamily: 'Inter, sans-serif' };
const isUmnInternetId = (value: string) => /^[^@\s]+$/.test(value.trim());
const toUmnEmail = (internetId: string) => `${internetId.trim().toLowerCase()}@umn.edu`;
const normalizeInternetId = (value: string) => value.split('@', 1)[0].replace(/\s/g, '');

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
    'Sign up for a Vocal U audition at the University of Minnesota on September 16 or 17, 2026.';
  const [slots, setSlots] = useState<AuditionSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editingId, setEditingSlotId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<{ id: string, mode: 'save' | 'delete' } | null>(null);
  const [tempNames, setTempNames] = useState<Record<string, string>>({});
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState<{ id: string, name: string } | null>(null);

  const fetchSlots = useCallback(async () => {
    try {
      const supabase = await loadSupabase();
      const { data, error } = await Promise.race([
        supabase
          .from('auditions')
          .select('*')
          .order('time', { ascending: true }),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('Audition signup request timed out.')), 4000);
        }),
      ]);
      if (error) throw error;

      setSlots(data.map((r: any) => ({
          id: r.id,
          day: r.day,
          time: r.time,
          status: r.status,
          name: r.name,
          email: r.email,
        })));
      setLoadError(false);
    } catch (error) {
      console.error('Error fetching audition slots:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let isActive = true;
    let removeRealtimeChannel: (() => void) | undefined;

    const initializeSlots = async () => {
      try {
        const supabase = await loadSupabase();
        if (!isActive) return;

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
      } catch (error) {
        console.error('Could not initialize audition signup:', error);
        if (isActive) {
          setLoadError(true);
          setLoading(false);
        }
      }
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
    if (!isUmnInternetId(emailInput)) {
      alert('Please enter your UMN Internet ID.');
      return;
    }
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
            email: toUmnEmail(emailInput),
            status: 'Booked'
          })
          .eq('id', id);
        if (error) throw error;
        triggerConfetti();
      } else {
        // Delete mode
        if (toUmnEmail(emailInput) !== slot.email?.trim().toLowerCase()) {
          alert("That @umn.edu email doesn't match this signup.");
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
      setTempNames((previousNames) => {
        const nextNames = { ...previousNames };
        delete nextNames[showDeleteWarning.id];
        return nextNames;
      });
      setEditingSlotId((currentId) => currentId === showDeleteWarning.id ? null : currentId);
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
    { day: 'Wednesday', date: 'September 16' },
    { day: 'Thursday', date: 'September 17' }
  ];
  const orderedTimes = Array.from(new Set(slots.map((slot) => slot.time)));
  const slotLookup = new Map(slots.map((slot) => [`${slot.day}:${slot.time}`, slot]));

  const renderSlotCell = (slot: AuditionSlot) => {
    const isConfirming = confirmingId?.id === slot.id;
    const isBooked = slot.status === 'Booked';
    const isBreak = slot.status === 'Break';
    const hasText = (tempNames[slot.id] || '').trim().length > 0;

    if (isBreak) {
      return (
        <div className="flex h-7 items-center bg-gray-100 px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400 md:h-8 md:text-[10px]" style={fontInter}>
          Break
        </div>
      );
    }

    if (isBooked && !isConfirming) {
      return (
        <div className="flex h-7 min-w-0 items-center bg-[#F7F9FC] md:h-8">
          <span className="audition-slot-name min-w-0 flex-1 truncate px-2 font-semibold text-[#2B4C6F]" style={fontInter}>{slot.name}</span>
          <button
            type="button"
            onClick={() => startConfirmation(slot.id, 'delete')}
            className="flex h-full w-6 shrink-0 items-center justify-center border-l border-[#DDE7F0]/70 text-[#2B4C6F]/20 transition-colors hover:bg-[#F4F7FA] hover:text-[#2B4C6F]/45 focus-visible:text-[#2B4C6F]/55 md:w-8"
            aria-label={`Cancel ${slot.day} ${slot.time} audition for ${slot.name || 'this singer'}`}
          >
            <Trash2 className="size-3 md:size-3.5" />
          </button>
        </div>
      );
    }

    if (isConfirming) {
      const isDeleting = confirmingId?.mode === 'delete';
      return (
        <div className={`relative flex h-7 items-center md:h-8 ${isDeleting ? 'bg-red-50' : 'bg-green-50'}`}>
          <input
            autoFocus
            type="text"
            inputMode="text"
            autoComplete="username"
            placeholder="Internet ID"
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-[9px] font-semibold text-[#2B4C6F] outline-none placeholder:text-gray-400 md:text-[12px]"
            style={fontInter}
            value={emailInput}
            onChange={(event) => setEmailInput(normalizeInternetId(event.target.value))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && emailInput.trim()) void processAction();
              if (event.key === 'Escape') setConfirmingId(null);
            }}
            aria-label={`University of Minnesota Internet ID for ${slot.day} at ${slot.time}`}
          />
          <span className="shrink-0 text-[9px] font-semibold text-[#2B4C6F]/70 md:text-[11px]" style={fontInter} aria-hidden="true">
            @umn.edu
          </span>
          <div className="ml-1 flex h-full shrink-0">
            <button
              type="button"
              onClick={() => void processAction()}
              disabled={!isUmnInternetId(emailInput) || isSubmitting}
              className={`flex h-full w-8 items-center justify-center border-l border-white/70 text-white transition-colors disabled:opacity-40 ${isDeleting ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              aria-label={isDeleting ? 'Confirm cancellation' : 'Confirm signup'}
            >
              {isSubmitting ? <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Check className="size-4 stroke-[3px]" />}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingId(null)}
              className="flex h-full w-8 items-center justify-center border-l border-[#DDE7F0] bg-white text-gray-400 transition-colors hover:bg-gray-50"
              aria-label="Close confirmation"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-7 md:h-8">
        <input
          type="text"
          placeholder="Type name"
          className={`audition-slot-name h-full w-full border-0 bg-white px-2 pr-9 font-semibold text-[#2B4C6F] outline-none transition-colors placeholder:font-normal placeholder:text-gray-400 hover:bg-[#FBFDFF] focus:bg-[#EEF4FA] focus:ring-2 focus:ring-inset focus:ring-[#8FA8C8] ${editingId === slot.id ? 'bg-[#EEF4FA]' : ''}`}
          style={fontInter}
          value={tempNames[slot.id] || ''}
          onFocus={() => setEditingSlotId(slot.id)}
          onChange={(event) => handleNameChange(slot.id, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && hasText) startConfirmation(slot.id, 'save');
          }}
          aria-label={`Name for ${slot.day} at ${slot.time}`}
        />
        {hasText && (
          <button
            type="button"
            onClick={() => startConfirmation(slot.id, 'save')}
            className="absolute inset-y-0 right-0 flex w-8 items-center justify-center border-l border-green-200 bg-green-500 text-white transition-colors hover:bg-green-600"
            aria-label={`Continue signup for ${slot.day} at ${slot.time}`}
          >
            <Check className="size-4 stroke-[3px]" />
          </button>
        )}
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
      <motion.section
        variants={childVariants}
        className="vu-page-hero relative mb-2 flex items-center justify-center overflow-hidden border border-white/30 px-3 py-2.5 md:mb-6 md:px-6 md:py-8"
        style={{
          borderRadius: '18px',
          background: '#8FA8C8',
        }}
      >
        <div className="relative z-10 flex w-full items-center justify-center gap-3 px-1 text-center md:gap-10">
          <div className="shrink-0 hover:-translate-y-0.5 transition-transform duration-200">
            <Link to="/" className="group cursor-pointer">
              <img src={logoImage} alt="Vocal U Logo" className="h-10 md:h-20 w-auto" />
            </Link>
          </div>
          <div className="text-left">
            <div className="text-white">
              <h1 className="text-white" style={{ ...fontYearbook, fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '0.05em', lineHeight: '1' }}>
                AUDITIONS
              </h1>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold tracking-widest text-white/90 md:mt-2 md:gap-x-5 md:gap-y-2 md:text-[14px]" style={fontInter}>
                <div className="flex items-center gap-1 md:gap-2"><Calendar className="w-3 h-3 md:w-5 md:h-5" /> September 16 &amp; 17</div>
                <div className="flex items-center gap-1 md:gap-2"><Clock className="w-3 h-3 md:w-5 md:h-5" /> 6-9 PM</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <div className="px-0">
        {/* Sign Up Section */}
        <motion.section variants={childVariants} className="mb-4 overflow-hidden rounded-xl border border-[#DDE7F0] bg-white md:mb-[25px] md:rounded-2xl">
          <div className="flex flex-wrap items-baseline justify-between gap-1 border-b border-[#DDE7F0] px-3 py-2 md:px-4">
            <h2 className="text-[#2B4C6F]" style={{ ...fontYearbook, fontSize: 'clamp(15px, 3vw, 20px)' }}>
              AUDITION SIGN-UP SHEET
            </h2>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#2B4C6F]/45 md:text-[10px]" style={fontInter}>
              Enter your name in an open cell
            </p>
          </div>
          {loading ? (
            <div className="flex min-h-64 items-center justify-center py-12"><div className="size-6 animate-spin rounded-full border-b-2 border-[#8FA8C8]" /></div>
          ) : loadError && slots.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center" style={fontInter}>
              <h3 className="text-lg font-semibold text-[#2B4C6F]">Email us to sign up</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#2B4C6F]/70">
                The online signup sheet is unavailable. Email <a className="font-semibold text-[#2B4C6F] underline decoration-[#8FA8C8] underline-offset-4" href="mailto:vocalu@umn.edu">vocalu@umn.edu</a> with your name and preferred audition time.
              </p>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=vocalu%40umn.edu&su=Audition%20signup"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2.5 rounded-lg border border-[#DDE7F0] bg-white px-5 py-2.5 text-sm font-semibold text-[#2B4C6F] transition-colors hover:bg-[#F4F7FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FA8C8]"
              >
                <SiGmail className="size-[18px] text-[#EA4335]" aria-hidden="true" />
                Email Vocal U in Gmail
              </a>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full table-fixed border-collapse text-left" aria-label="Audition signup times for Wednesday, September 16 and Thursday, September 17">
                <colgroup>
                  <col className="w-1/2" />
                  <col className="w-1/2" />
                </colgroup>
                <thead className="bg-[#2B4C6F] text-white">
                  <tr>
                    {daysData.map((dayInfo) => (
                      <th key={dayInfo.day} scope="col" className="border-r border-white/20 px-1.5 py-2 text-center last:border-r-0 md:px-3 md:text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.08em] md:text-[12px]" style={fontInter}>{dayInfo.day}</span>
                        <span className="block text-[9px] font-medium text-white/70 md:text-[10px]" style={fontInter}>{dayInfo.date}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE7F0]">
                  {orderedTimes.map((time) => (
                    <tr key={time} className="group/row transition-colors hover:bg-[#FBFDFF]">
                      {daysData.map((dayInfo) => {
                        const slot = slotLookup.get(`${dayInfo.day}:${time}`);
                        const isConfirmingSlot = slot && confirmingId?.id === slot.id;
                        return (
                          <td key={dayInfo.day} className="border-r border-[#DDE7F0] p-0 last:border-r-0">
                            <div className="grid grid-cols-[2.35rem_minmax(0,1fr)] md:grid-cols-[4.25rem_minmax(0,1fr)]">
                              {!isConfirmingSlot && (
                                <span className="flex h-7 items-center justify-center border-r border-[#DDE7F0] bg-[#F4F7FA] text-[8px] font-bold text-[#2B4C6F] md:h-8 md:text-[11px]" style={fontInter}>
                                  {time.replace(' PM', '')}
                                </span>
                              )}
                              <div className={`min-w-0 ${isConfirmingSlot ? 'col-span-2' : ''}`}>
                                {slot ? renderSlotCell(slot) : <div className="h-7 bg-gray-50 md:h-8" aria-hidden="true" />}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
        {/* Audition overview */}
        <motion.section variants={childVariants} className="overflow-hidden rounded-2xl border border-[#DDE7F0] bg-white">
          <div className="border-b border-[#DDE7F0] px-5 py-5 md:flex md:items-end md:justify-between md:gap-8 md:px-7 md:py-6">
            <div>
              <h2 className="text-[#2B4C6F] font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.05 }}>
                What to expect
              </h2>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#2B4C6F]/60 md:mt-0 md:text-right" style={fontInter}>
              Here is what to bring and what will happen when you arrive.
            </p>
          </div>
          <div className="grid divide-y divide-[#DDE7F0] md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              {
                title: 'Arrive early',
                Icon: Users,
                body: <>Check in <strong className="font-semibold text-[#2B4C6F]">15 minutes before</strong> your slot. Walk-ins are welcome when space allows.</>,
              },
              {
                title: 'Bring a song',
                Icon: Music,
                body: <>Bring about <strong className="font-semibold text-[#2B4C6F]">60 seconds</strong> of a contemporary song that feels comfortable and shows your voice.</>,
              },
              {
                title: 'What happens',
                Icon: Clock,
                body: <>We will introduce ourselves, guide you through a short warm-up and range check, then hear your prepared song.</>,
              },
            ].map((item) => (
              <article key={item.title} className="p-5 md:p-6 lg:p-7">
                <div className="mb-4">
                  <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#EEF4FA] text-[#2B4C6F]">
                    <item.Icon className="size-[18px]" />
                  </span>
                </div>
                <h3 className="mb-2 text-[21px] text-[#2B4C6F] font-yearbook" style={fontYearbook}>{item.title}</h3>
                <p className="text-[14px] leading-6 text-[#2B4C6F]/65" style={fontInter}>{item.body}</p>
              </article>
            ))}
          </div>
        </motion.section>

        {/* Advice and callbacks */}
        <motion.section variants={childVariants} className="mt-6 overflow-hidden rounded-2xl border border-[#DDE7F0] bg-[#F8FBFE]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-5 md:p-7 lg:p-8">
              <h2 className="text-[#2B4C6F] font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.05 }}>
                How to prepare
              </h2>
              <ul className="mt-5 divide-y divide-[#DDE7F0] border-y border-[#DDE7F0]">
                {[
                  { title: 'Choose a song you know.', detail: 'Pick a song you have sung many times.' },
                  { title: 'Warm up before you arrive.', detail: 'Give your voice time to wake up before check-in.' },
                  { title: 'Be yourself.', detail: 'We want to hear your voice and meet you.' },
                ].map((tip) => (
                  <li key={tip.title} className="py-4">
                    <p className="text-sm font-semibold text-[#2B4C6F]" style={fontInter}>{tip.title}</p>
                    <p className="mt-1 text-[13px] leading-5 text-[#2B4C6F]/60" style={fontInter}>{tip.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="border-t border-[#DDE7F0] bg-white p-5 lg:border-l lg:border-t-0 lg:p-8" aria-labelledby="callbacks-heading">
              <Calendar className="mb-5 size-5 text-[#8FA8C8]" aria-hidden="true" />
              <h3 id="callbacks-heading" className="text-[24px] text-[#2B4C6F] font-yearbook" style={fontYearbook}>Callbacks</h3>
              <p className="mt-3 text-sm leading-6 text-[#2B4C6F]/65" style={fontInter}>
                Callback invitations and next steps will be sent after initial auditions. Callbacks take place the following week.
              </p>
              <div className="mt-6 flex items-start gap-2.5 border-t border-[#DDE7F0] pt-4 text-[12px] leading-5 text-[#2B4C6F]/60" style={fontInter}>
                <Check className="mt-0.5 size-4 shrink-0 text-[#8FA8C8]" aria-hidden="true" />
                <span>Watch your @umn.edu inbox for your result and any scheduling details.</span>
              </div>
            </aside>
          </div>
        </motion.section>
      </div>
      {/* Delete Warning Modal */}
      <AnimatePresence>
        {showDeleteWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteWarning(null)}
              className="absolute inset-0 bg-black/55"
            />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="relative flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 text-center">
              <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="size-5 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl text-[#2B4C6F] font-yearbook" style={fontYearbook}>Cancel this audition?</h3>
                <p className="text-gray-600 text-[14px] leading-relaxed" style={fontInter}>
                  This will remove <span className="font-semibold">{showDeleteWarning.name}</span> from the signup sheet.
                </p>
                <p className="text-gray-500 text-[12px] leading-relaxed" style={fontInter}>
                  If you need a different time, cancel this slot and choose another available one.
                </p>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <button onClick={() => setShowDeleteWarning(null)}
                  className="flex w-full items-center justify-center rounded-xl bg-[#8FA8C8] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7A97B7] active:scale-[0.98]"
                  style={fontInter}
                >
                  Keep my spot
                </button>
                <button onClick={confirmDeletion} disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-transparent py-3 text-sm font-medium text-gray-400 transition-colors hover:text-red-500" style={fontInter}>
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                  ) : (
                    "Cancel audition"
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
