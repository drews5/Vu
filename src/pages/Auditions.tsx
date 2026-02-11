import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Calendar, Clock, MapPin, RefreshCw, Check, Plus } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import confetti from 'canvas-confetti';
import logoImage from 'figma:asset/d4630c01b543cc75980f0b293230859d29654fbb.png';

interface TimeSlot {
  time: string;
  name: string | null;
  email: string | null;
}

interface AuditionDay {
  date: string;
  displayDate: string;
  slots: TimeSlot[];
}

interface WalkIn {
  time: string;
  name: string;
  email: string;
}

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-cee2d2a3`;
const BREAK_TIMES = ['18:30', '19:00', '19:30', '20:00', '20:30'];

function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 18; // 6 PM
  const endHour = 21; // 9 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const time24 = `${hour}:${minute.toString().padStart(2, '0')}`;
      
      // Skip 7:55pm (19:55)
      if (time24 === '19:55') continue;
      
      // Check if this is a break slot
      const isBreak = BREAK_TIMES.some(breakTime => time24.startsWith(breakTime));
      
      if (!isBreak) {
        slots.push({
          time: time24,
          name: null,
          email: null
        });
      }
    }
  }
  
  return slots;
}

function formatTime(time24: string): string {
  const [hour, minute] = time24.split(':').map(Number);
  const hour12 = hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minute.toString().padStart(2, '0')}`;
}

export function Auditions() {
  const [auditionDays, setAuditionDays] = useState<AuditionDay[]>([
    { date: '2025-09-17', displayDate: 'Wednesday, September 17th', slots: generateTimeSlots() },
    { date: '2025-09-18', displayDate: 'Thursday, September 18th', slots: generateTimeSlots() }
  ]);
  
  const [walkIns, setWalkIns] = useState<WalkIn[]>([]);
  const [editingSlot, setEditingSlot] = useState<{dayIndex: number, slotIndex: number} | null>(null);
  const [tempName, setTempName] = useState<{[key: string]: string}>({});
  const [showEmailPopup, setShowEmailPopup] = useState<{dayIndex: number, slotIndex: number} | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState<{dayIndex: number, slotIndex: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<{dayIndex: number, slotIndex: number} | null>(null);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInEmail, setWalkInEmail] = useState('');
  const emailPopupRef = useRef<HTMLDivElement>(null);

  // Fetch data from Supabase
  const fetchAuditionData = async () => {
    try {
      const response = await fetch(`${API_URL}/auditions`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch auditions');
      }
      
      const data = await response.json();
      const slots = data.slots || [];
      
      // Populate the slots
      const newWednesdaySlots = generateTimeSlots();
      const newThursdaySlots = generateTimeSlots();
      const newWalkIns: WalkIn[] = [];
      
      slots.forEach((item: any) => {
        if (item.day === 'Wednesday') {
          const slot = newWednesdaySlots.find(s => s.time === item.time);
          if (slot) {
            slot.name = item.name;
            slot.email = item.email;
          }
        } else if (item.day === 'Thursday') {
          const slot = newThursdaySlots.find(s => s.time === item.time);
          if (slot) {
            slot.name = item.name;
            slot.email = item.email;
          }
        } else if (item.day === 'Walk-In') {
          newWalkIns.push({ time: item.time, name: item.name, email: item.email || '' });
        }
      });
      
      setAuditionDays([
        { date: '2025-09-17', displayDate: 'Wednesday, September 17th', slots: newWednesdaySlots },
        { date: '2025-09-18', displayDate: 'Thursday, September 18th', slots: newThursdaySlots }
      ]);
      setWalkIns(newWalkIns);
    } catch (error) {
      console.error('Error fetching audition data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchAuditionData();
    
    // Auto-refresh every 30 seconds (reduced from 10)
    const interval = setInterval(() => {
      fetchAuditionData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emailPopupRef.current && !emailPopupRef.current.contains(event.target as Node)) {
        setShowEmailPopup(null);
        setShowDeletePopup(null);
        setEmailInput('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAuditionData();
  };

  const handleNameChange = (dayIndex: number, slotIndex: number, value: string) => {
    setTempName(prev => ({ ...prev, [`${dayIndex}-${slotIndex}`]: value }));
    setEditingSlot({ dayIndex, slotIndex });
  };

  const handleShowEmailPopup = (dayIndex: number, slotIndex: number) => {
    const key = `${dayIndex}-${slotIndex}`;
    if (!tempName[key] || !tempName[key].trim()) {
      alert('Please enter your name');
      return;
    }
    setShowEmailPopup({ dayIndex, slotIndex });
    setEmailInput('');
  };

  const handleSignup = async (dayIndex: number, slotIndex: number) => {
    if (!emailInput.trim()) {
      alert('Please enter your email');
      return;
    }

    const day = dayIndex === 0 ? 'Wednesday' : 'Thursday';
    const time = auditionDays[dayIndex].slots[slotIndex].time;
    
    try {
      const response = await fetch(`${API_URL}/auditions/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          day: day,
          time: time,
          name: tempName[`${dayIndex}-${slotIndex}`],
          email: emailInput
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to sign up');
        return;
      }
      
      setShowEmailPopup(null);
      setEditingSlot(null);
      setTempName(prev => ({ ...prev, [`${dayIndex}-${slotIndex}`]: '' }));
      setEmailInput('');
      fetchAuditionData();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up. Please try again.');
    }
  };

  const handleShowDeletePopup = (dayIndex: number, slotIndex: number) => {
    setShowDeletePopup({ dayIndex, slotIndex });
    setEmailInput('');
  };

  const handleDelete = async (dayIndex: number, slotIndex: number) => {
    if (!emailInput.trim()) {
      alert('Please enter your email');
      return;
    }

    const slot = auditionDays[dayIndex].slots[slotIndex];
    
    if (slot.email && emailInput !== slot.email) {
      alert('Email does not match. Cannot delete this slot.');
      return;
    }

    const day = dayIndex === 0 ? 'Wednesday' : 'Thursday';
    const time = slot.time;
    
    try {
      const response = await fetch(`${API_URL}/auditions/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          day: day,
          time: time,
          name: slot.name
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to cancel');
        return;
      }
      
      setShowDeletePopup(null);
      setEmailInput('');
      fetchAuditionData();
    } catch (error) {
      console.error('Error canceling:', error);
      alert('Failed to cancel. Please try again.');
    }
  };

  const handleWalkInSubmit = async () => {
    if (!walkInName.trim() || !walkInEmail.trim()) {
      alert('Please enter both name and email');
      return;
    }
    
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      
      const response = await fetch(`${API_URL}/auditions/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          day: 'Walk-In',
          time: timeStr,
          name: walkInName,
          email: walkInEmail
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to sign up');
        return;
      }
      
      setShowWalkInModal(false);
      setWalkInName('');
      setWalkInEmail('');
      fetchAuditionData();
    } catch (error) {
      console.error('Error adding walk-in:', error);
      alert('Failed to add walk-in. Please try again.');
    }
  };

  const renderSlot = (slot: TimeSlot, dayIndex: number, slotIndex: number) => {
    const isEditing = editingSlot?.dayIndex === dayIndex && editingSlot?.slotIndex === slotIndex;
    const isHovered = hoveredSlot?.dayIndex === dayIndex && hoveredSlot?.slotIndex === slotIndex;
    const showingEmailPopup = showEmailPopup?.dayIndex === dayIndex && showEmailPopup?.slotIndex === slotIndex;
    const showingDeletePopup = showDeletePopup?.dayIndex === dayIndex && showDeletePopup?.slotIndex === slotIndex;
    
    return (
      <motion.div
        key={slotIndex}
        className="relative"
        onMouseEnter={() => setHoveredSlot({ dayIndex, slotIndex })}
        onMouseLeave={() => setHoveredSlot(null)}
      >
        <div className="flex items-stretch border border-[#A3B8D3] bg-white overflow-hidden hover:border-[#8FA8C8] transition-colors" style={{ borderRadius: '5px' }}>
          {/* Time section with gray background - Smaller width */}
          <div className="bg-gray-100 w-10 flex items-center justify-center border-r border-[#A3B8D3] flex-shrink-0">
            <span className="text-[#2B4C6F] font-semibold text-[9px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {formatTime(slot.time)}
            </span>
          </div>
          
          {/* Name section */}
          <div className="flex-1 relative min-w-0 flex items-center">
            {slot.name ? (
              // Filled slot - Show name and X button on hover
              <div className="flex items-center gap-1.5 w-full px-2 py-1.5">
                <div className="flex-1 text-[#2B4C6F] text-[10px] truncate" style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '500'
                }}>
                  {slot.name}
                </div>
                <button
                  onClick={() => handleShowDeletePopup(dayIndex, slotIndex)}
                  className={`text-white p-1 flex-shrink-0 transition-all ${isHovered ? 'bg-red-500 hover:bg-red-600 opacity-100' : 'bg-red-500 opacity-0 pointer-events-none'}`}
                  style={{ borderRadius: '3px' }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              // Empty slot - Show input and green check when typing
              <div className="flex items-center gap-1.5 w-full px-2 py-1.5">
                <input
                  type="text"
                  placeholder="Your name"
                  value={isEditing ? (tempName[`${dayIndex}-${slotIndex}`] || '') : ''}
                  onChange={(e) => handleNameChange(dayIndex, slotIndex, e.target.value)}
                  onFocus={() => setEditingSlot({ dayIndex, slotIndex })}
                  onBlur={() => {
                    // Don't clear if clicking the button
                    setTimeout(() => {
                      const key = `${dayIndex}-${slotIndex}`;
                      if (editingSlot?.dayIndex === dayIndex && editingSlot?.slotIndex === slotIndex) {
                        if (!tempName[key] || !tempName[key].trim()) {
                          setEditingSlot(null);
                        }
                      }
                    }, 200);
                  }}
                  className="flex-1 bg-transparent border-none focus:outline-none text-[#2B4C6F] placeholder-gray-400 text-[10px]"
                  style={{ 
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
                <button
                  onClick={() => handleShowEmailPopup(dayIndex, slotIndex)}
                  className={`text-white p-1 flex-shrink-0 transition-all ${
                    isEditing && tempName[`${dayIndex}-${slotIndex}`] && tempName[`${dayIndex}-${slotIndex}`].trim() 
                      ? 'bg-green-500 hover:bg-green-600 opacity-100' 
                      : 'bg-green-500 opacity-0 pointer-events-none'
                  }`}
                  style={{ borderRadius: '3px' }}
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Email Popup for Signup */}
        {showingEmailPopup && (
          <div
            ref={emailPopupRef}
            className="absolute top-full right-0 mt-1 bg-white shadow-xl border-2 border-[#8FA8C8] p-3"
            style={{ borderRadius: '8px', width: '200px', zIndex: 9999 }}
          >
            <div className="mb-2">
              <label className="block text-[#2B4C6F] text-xs mb-1 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Email *
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSignup(dayIndex, slotIndex);
                  }
                }}
                placeholder="your@email.com"
                autoFocus
                className="w-full px-2 py-1.5 border border-[#A3B8D3] focus:border-[#8FA8C8] focus:outline-none text-xs"
                style={{ borderRadius: '6px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <button
              onClick={() => handleSignup(dayIndex, slotIndex)}
              className="w-full bg-green-500 text-white px-3 py-1.5 hover:bg-green-600 text-xs font-semibold transition-colors"
              style={{ borderRadius: '6px', fontFamily: 'Inter, sans-serif' }}
            >
              Confirm Signup
            </button>
          </div>
        )}

        {/* Email Popup for Delete */}
        {showingDeletePopup && (
          <div
            ref={emailPopupRef}
            className="absolute top-full right-0 mt-1 bg-white shadow-xl border-2 border-red-400 p-3"
            style={{ borderRadius: '8px', width: '200px', zIndex: 9999 }}
          >
            <div className="mb-2">
              <label className="block text-red-700 text-xs mb-1 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Confirm Email *
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDelete(dayIndex, slotIndex);
                  }
                }}
                placeholder="your@email.com"
                autoFocus
                className="w-full px-2 py-1.5 border border-red-300 focus:border-red-500 focus:outline-none text-xs"
                style={{ borderRadius: '6px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <button
              onClick={() => handleDelete(dayIndex, slotIndex)}
              className="w-full bg-red-500 text-white px-3 py-1.5 hover:bg-red-600 text-xs font-semibold transition-colors"
              style={{ borderRadius: '6px', fontFamily: 'Inter, sans-serif' }}
            >
              Cancel Slot
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FA8C8] mx-auto mb-4"></div>
          <p className="text-[#2B4C6F]" style={{ fontFamily: 'Inter, sans-serif' }}>Loading audition slots...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-6"
    >
      {/* Header Banner - Static and Clean */}
      <div
        className="p-4 md:p-6 mb-4 shadow-lg"
        style={{ 
          marginTop: '25px', 
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #91a8c6 0%, #7A97B7 100%)'
        }}
      >
        <div className="flex items-center gap-4">
          {/* Logo - Clickable to home */}
          <a href="/" className="flex-shrink-0">
            <img src={logoImage} alt="Vocal U" className="h-12 md:h-16 w-auto" />
          </a>
          
          <div className="flex-1">
            <h1 
              className="text-white mb-1 text-2xl md:text-3xl"
              style={{
                fontFamily: "'Yearbook Solid', sans-serif",
                letterSpacing: '0.05em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              🎤 A CAPPELLA AUDITIONS
            </h1>
            <p 
              className="text-white/90 text-sm md:text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Type your name • September 17-18, 6-9pm
            </p>
          </div>
        </div>
      </div>

      {/* Audition Days - Side by side on mobile, 2 columns on desktop */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {auditionDays.map((day, dayIndex) => {
          return (
            <motion.div
              key={dayIndex}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + dayIndex * 0.1, duration: 0.6 }}
              className="bg-white shadow-md p-1.5 md:p-2"
              style={{ borderRadius: '8px' }}
            >
              <h2 className="text-[#2B4C6F] mb-1.5 pb-1 border-b border-[#8FA8C8]/20 text-sm md:text-base font-bold" style={{
                fontFamily: "'Yearbook Solid', sans-serif"
              }}>
                {dayIndex === 0 ? 'Wednesday 9/17' : 'Thursday 9/18'}
              </h2>

              {/* Mobile: Single column, Desktop: 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 md:gap-1.5">
                {/* Mobile: Show all slots in order */}
                <div className="md:hidden space-y-0.5">
                  {day.slots.map((slot, slotIndex) => {
                    const isBreak = BREAK_TIMES.some(breakTime => slot.time === breakTime);
                    if (isBreak) {
                      return (
                        <div key={slotIndex} className="bg-gray-100 px-1.5 py-0.5 flex items-center justify-center gap-0.5" style={{ borderRadius: '3px' }}>
                          <Clock className="w-2 h-2 text-gray-400" />
                          <span className="text-gray-400 italic text-[9px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Break
                          </span>
                        </div>
                      );
                    }
                    return renderSlot(slot, dayIndex, slotIndex);
                  })}
                </div>

                {/* Desktop: 2 Columns - Split slots in half */}
                <div className="hidden md:block space-y-0.5">
                  {day.slots.slice(0, Math.ceil(day.slots.length / 2)).map((slot, slotIndex) => {
                    return renderSlot(slot, dayIndex, slotIndex);
                  })}
                </div>

                <div className="hidden md:block space-y-0.5">
                  {day.slots.slice(Math.ceil(day.slots.length / 2)).map((slot, idx) => {
                    const slotIndex = Math.ceil(day.slots.length / 2) + idx;
                    return renderSlot(slot, dayIndex, slotIndex);
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Walk-Ins Section - Compact */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white shadow-md p-2 mb-2"
        style={{ borderRadius: '8px' }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-[#2B4C6F] text-xs font-bold" style={{
            fontFamily: "'Yearbook Solid', sans-serif"
          }}>
            Walk-Ins
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWalkInModal(true)}
            className="bg-[#8FA8C8] text-white px-2 py-1 flex items-center gap-1 hover:bg-[#7A97B7] text-[10px]"
            style={{
              fontFamily: "'Yearbook Solid', sans-serif",
              borderRadius: '4px'
            }}
          >
            <Plus className="w-2.5 h-2.5" />
            ADD
          </motion.button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {walkIns.map((walkin, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className="bg-[#8FA8C8]/10 p-1.5 flex items-center gap-1"
              style={{ borderRadius: '4px' }}
            >
              <Clock className="w-2.5 h-2.5 text-[#8FA8C8] flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[#2B4C6F] font-semibold text-[10px] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {walkin.name}
                </div>
                <div className="text-[#2B4C6F]/60 text-[9px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {walkin.time}
                </div>
              </div>
            </motion.div>
          ))}

          {walkIns.length === 0 && (
            <div className="col-span-full text-center py-2 text-gray-400 italic text-[10px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              No walk-ins yet
            </div>
          )}
        </div>
      </motion.section>

      {/* Marquee - Bigger */}
      <div className="overflow-hidden mb-4 bg-[#8FA8C8] py-3 md:py-4 shadow-md" style={{ borderRadius: '12px' }}>
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4">
              <span className="text-white text-base md:text-lg font-bold" style={{ fontFamily: "'Yearbook Solid', sans-serif" }}>
                ✨ JOIN VOCAL U
              </span>
              <span className="text-white text-base md:text-lg font-bold" style={{ fontFamily: "'Yearbook Solid', sans-serif" }}>
                🎤 NO EXPERIENCE
              </span>
              <span className="text-white text-base md:text-lg font-bold" style={{ fontFamily: "'Yearbook Solid', sans-serif" }}>
                🎵 ALL VOICES WELCOME
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* What to Expect - Bigger */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white p-6 md:p-8 shadow-lg"
        style={{ borderRadius: '16px' }}
      >
        <h2 className="text-[#2B4C6F] mb-4 md:mb-6 text-center text-xl md:text-2xl" style={{
          fontFamily: "'Yearbook Solid', sans-serif"
        }}>
          WHAT TO EXPECT
        </h2>

        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-4">
          {[
            { icon: '🎤', title: 'Vocal Exercise' },
            { icon: '🎵', title: 'Sing (1 min)' },
            { icon: '✨', title: 'Chat' }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-center p-4 md:p-6 bg-[#8FA8C8]/10 hover:bg-[#8FA8C8]/20 transition-colors"
              style={{ borderRadius: '12px' }}
            >
              <div className="text-4xl md:text-5xl mb-2">{item.icon}</div>
              <h3 className="text-[#2B4C6F] text-sm md:text-base font-semibold" style={{
                fontFamily: "'Yearbook Solid', sans-serif"
              }}>
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Details */}
        <div className="flex items-center justify-around bg-[#8FA8C8]/5 p-4 md:p-6 text-sm md:text-base" style={{ borderRadius: '12px' }}>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#8FA8C8]" />
            <span className="text-[#2B4C6F] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Sept 17-18</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#8FA8C8]" />
            <span className="text-[#2B4C6F] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>6-9 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#8FA8C8]" />
            <span className="text-[#2B4C6F] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>TBA</span>
          </div>
        </div>
      </motion.section>

      {/* Walk-In Modal */}
      <AnimatePresence>
        {showWalkInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowWalkInModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 max-w-sm w-full"
              style={{ borderRadius: '12px' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#2B4C6F] text-sm" style={{
                  fontFamily: "'Yearbook Solid', sans-serif"
                }}>
                  ADD WALK-IN
                </h3>
                <button
                  onClick={() => setShowWalkInModal(false)}
                  className="text-[#2B4C6F] hover:text-[#8FA8C8]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[#2B4C6F] mb-1 text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#A3B8D3] focus:border-[#8FA8C8] focus:outline-none text-xs"
                    style={{ borderRadius: '6px', fontFamily: 'Inter, sans-serif' }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-[#2B4C6F] mb-1 text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={walkInEmail}
                    onChange={(e) => setWalkInEmail(e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#A3B8D3] focus:border-[#8FA8C8] focus:outline-none text-xs"
                    style={{ borderRadius: '6px', fontFamily: 'Inter, sans-serif' }}
                    placeholder="your@email.com"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWalkInSubmit}
                  className="w-full bg-[#8FA8C8] text-white px-4 py-1.5 hover:bg-[#7A97B7] text-xs font-semibold"
                  style={{
                    fontFamily: "'Yearbook Solid', sans-serif",
                    borderRadius: '6px'
                  }}
                >
                  ADD TO LIST
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}