import { memo, useEffect, useState, useMemo } from 'react';
import { Instagram, Music } from 'lucide-react';
import { supabase } from '../utils/supabase';

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

  return (
    <div
      className="bg-white p-3 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden"
      style={{ borderRadius: '12px' }}
    >
      {member.is_vp && (
        <div className="absolute top-2 right-[-35px] bg-[#8FA8C8] text-white py-1 px-10 rotate-45 text-[8px] font-bold tracking-widest z-10">
          VP
        </div>
      )}
      <div className="w-16 h-16 bg-[#91a8c6]/10 rounded-full mb-2 flex items-center justify-center overflow-hidden">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <Music className="w-8 h-8 text-[#91a8c6]" />
        )}
      </div>
      <h3 className="text-[#2B4C6F] text-base mb-0.5 leading-tight" style={fontYearbook}>
        <div className="block">{firstName}</div>
        <div className="block">{lastName}</div>
      </h3>
      <p className="text-[#8FA8C8] font-bold text-[10px] tracking-wider mb-1">{member.role}</p>
      <div className="space-y-0 text-[11px] text-[#2B4C6F]/70" style={{ fontFamily: 'Inter, sans-serif' }}>
        <p>{member.major}</p>
        <p>{member.year}</p>
      </div>
      {member.instagram && (
        <div className="mt-2 flex gap-2">
          <a href={`https://instagram.com/${member.instagram}`} target="_blank" rel="noreferrer">
            <Instagram className="w-3.5 h-3.5 text-[#8FA8C8] cursor-pointer hover:text-[#2B4C6F]" />
          </a>
        </div>
      )}
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
        setMembers(data.map((m: any) => ({
          name: m.name,
          role: m.role,
          part: m.part,
          major: m.major,
          year: m.year,
          photo: m.photo_url,
          instagram: m.instagram,
          is_vp: m.is_vp
        })));
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

    // Sort the parts based on PART_ORDER
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
    <div className="pb-8 md:pb-16">
      {/* Hero Section */}
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="bg-[#2B4C6F] py-10 md:py-16 px-4 text-center"
          style={{ borderRadius: '16px' }}
        >
          <h1
            className="text-white"
            style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}
          >
            OUR MEMBERS
          </h1>
          <p
            className="text-white/80 mt-2 max-w-2xl mx-auto text-sm md:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Meet the talented individuals who make up the Vocal U family.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8FA8C8]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
          {groupedMembers.map(({ part, members }) => (
            <section key={part} className="flex flex-col">
              <h2 
                className="text-[#2B4C6F] mb-6 uppercase tracking-widest border-b-2 border-[#8FA8C8]/20 pb-2 text-center"
                style={{ ...fontYearbook, fontSize: '18px' }}
              >
                {part === 'Bass/Bari' ? 'Bass / Bari' : 
                 part === 'Vocal Percussionist' ? 'Percussion' :
                 part === 'Member' ? 'Members' :
                 part.endsWith('s') ? part : `${part}s`}
              </h2>
              <div className="flex flex-col gap-4">
                {members.map((member, index) => (
                  <MemberCard key={index} member={member} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
