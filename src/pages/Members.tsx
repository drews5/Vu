/// <reference types="vite/client" />
import { memo, useEffect, useState, useMemo } from 'react';
import { Instagram, Music } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { motion } from 'motion/react';

const memberPhotos = import.meta.glob('../assets/members/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
const heroPhotos = import.meta.glob('../assets/group_photos/*.jpg', { eager: true, import: 'default' });
const heroImageUrls = Object.values(heroPhotos) as string[];

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };

interface Member {
  name: string;
  role: string;
  part: string;
  major: string;
  year: string;
  photo?: string;
  instagram?: string;
  is_vp?: boolean;
}

const MemberCard = memo(function MemberCard({ member }: { member: Member }) {
  const nameParts = member.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  const isDaniel = member.name === 'Daniel Ho';

  return (
    <div
      className="bg-white p-3 border border-[#8FA8C8] flex flex-col items-center text-center relative overflow-hidden shadow-xl w-full"
      style={{ borderRadius: '12px' }}
    >
      {!isDaniel && member.is_vp && (
        <div className="absolute top-2 right-[-35px] bg-[#8FA8C8] text-white py-1 px-10 rotate-45 text-[8px] tracking-widest z-10 shadow-sm">
          Vice President
        </div>
      )}

      {/* Photo Container - Rounded Rectangle */}
      <div className="w-full aspect-[4/5] bg-[#91a8c6]/10 mb-3 overflow-hidden border border-gray-50 relative" style={{ borderRadius: '8px' }}>
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover"
            style={{
              imageRendering: 'auto',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-10 h-10 text-[#91a8c6]/40" />
          </div>
        )}

        {/* Daniel's Custom Banner at the bottom of the photo */}
        {isDaniel && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#2B4C6F] text-white py-1 text-[8px] tracking-widest z-20 shadow-sm font-sans">
            Vocal Percussionist
          </div>
        )}
      </div>

      <div className="w-full flex flex-col items-center">
        <h3 className="text-[#2B4C6F] text-lg mb-1 leading-none" style={fontYearbook}>
          <span className="block">{firstName}</span>
          <span className="block">{lastName}</span>
        </h3>
        <div className="space-y-0.5 text-[11px] leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
          <p className="text-[#8FA8C8] tracking-wider mb-2">{member.role}</p>
          <p className="text-[#2B4C6F]/80">{member.major}</p>
          <p className="text-[#2B4C6F]/50">{member.year}</p>
        </div>

        {member.instagram && (
          <div className="mt-2.5">
            <motion.a
              href={`https://instagram.com/${member.instagram}`}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-[#8FA8C8] hover:text-[#2B4C6F] transition-colors duration-200 inline-block p-1 cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </motion.a>
          </div>
        )}
      </div>
    </div>
  );
});

const PART_ORDER = ['Soprano', 'Mezzo', 'Alto', 'Tenor', 'Bass/Bari', 'Vocal Percussionist', 'Member'];

export function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching members:', error);
      } else {
        setMembers(data.map((m: any) => {
          const localPhotoKey = `../assets/members/${m.name}.jpg`;
          return {
            name: m.name,
            role: m.role,
            part: m.part,
            major: m.major,
            year: m.year,
            photo: memberPhotos[localPhotoKey] || m.photo_url,
            instagram: m.instagram,
            is_vp: m.is_vp
          };
        }));
      }
      setLoading(false);
    }

    fetchMembers();
  }, []);

  const groupedMembers = useMemo(() => {
    const groups: Record<string, Member[]> = {};

    members.forEach(member => {
      const part = member.part || 'Member';
      if (!groups[part]) {
        groups[part] = [];
      }
      groups[part].push(member);
    });

    return Object.keys(groups).sort((a, b) => {
      const indexA = PART_ORDER.indexOf(a);
      const indexB = PART_ORDER.indexOf(b);

      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    }).map(part => ({
      part,
      members: groups[part]
    }));
  }, [members]);

  return (
    <div className="pb-8 md:pb-16 px-4 md:px-0">
      {/* Hero Section */}
      <section style={{ marginTop: '25px', marginBottom: '40px' }}>
        <div
          className="bg-[#2B4C6F] relative overflow-hidden flex items-center justify-center text-center py-12 md:py-20"
          style={{ borderRadius: '16px', minHeight: '300px' }}
        >
          {/* Background Images */}
          <div className="absolute inset-0 flex w-full h-full">
            {heroImageUrls.length > 0 ? (
              heroImageUrls.map((src, i) => (
                <div key={i} className="flex-1 h-full relative overflow-hidden">
                  <img src={src} className="absolute inset-0 w-full h-full object-cover" alt="Group photo" />
                </div>
              ))
            ) : (
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#8FA8C833,transparent)]" />
            )}
          </div>

          {/* Navy Overlay */}
          <div className="absolute inset-0 bg-[#2B4C6F]/85" />

          <div className="relative z-10 px-4">
            <h1
              className="text-white relative font-yearbook"
              style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}
            >
              Our Members
            </h1>
            <p
              className="text-white/80 mt-2 max-w-2xl mx-auto text-sm md:text-base relative"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Meet the voices of Vocal U.
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8FA8C8]" />
        </div>
      ) : (
        /* Flex container for sections that allows them to grow proportional to their card count */
        <div className="flex flex-wrap gap-x-8 gap-y-12 items-start justify-center">
          {groupedMembers.map(({ part, members }) => {
            const isBass = part === 'Bass/Bari';
            const colCount = isBass ? 4 : 3;
            return (
              <section
                key={part}
                className="flex flex-col items-center"
                style={{
                  flex: `1 1 ${colCount * 180}px`, // Proportional growth
                  maxWidth: isBass ? '900px' : '700px'
                }}
              >
                <h2
                  className="text-[#2B4C6F] mb-6 tracking-widest border-b-2 border-[#8FA8C8]/20 pb-2 text-center w-full font-yearbook"
                  style={{ ...fontYearbook, fontSize: '18px' }}
                >
                  {part === 'Bass/Bari' ? 'Bass / Bari' :
                    part === 'Vocal Percussionist' ? 'Percussion' :
                      part === 'Member' ? 'Members' :
                        part.endsWith('s') ? part : `${part}s`}
                </h2>
                {/* Card Grid: Using standard column counts to keep card sizes uniform */}
                <div className={`grid gap-4 w-full ${isBass ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
                  {members.map((member, index) => (
                    <MemberCard key={index} member={member} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
