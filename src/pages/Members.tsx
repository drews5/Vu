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
  return (
    <div
      className="bg-white p-6 shadow-lg flex flex-col items-center text-center hover:-translate-y-2 transition-transform relative overflow-hidden"
      style={{ borderRadius: '20px' }}
    >
      {member.is_vp && (
        <div className="absolute top-4 right-[-35px] bg-[#8FA8C8] text-white py-1 px-10 rotate-45 text-[10px] font-bold tracking-widest shadow-sm z-10">
          VP
        </div>
      )}
      <div className="w-32 h-32 bg-[#91a8c6]/20 rounded-full mb-4 flex items-center justify-center overflow-hidden">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <Music className="w-12 h-12 text-[#91a8c6]" />
        )}
      </div>
      <h3 className="text-[#2B4C6F] text-xl mb-1" style={fontYearbook}>
        {member.name}
      </h3>
      <p className="text-[#8FA8C8] font-bold text-sm uppercase tracking-wider mb-2">{member.role}</p>
      <div className="space-y-1 text-sm text-[#2B4C6F]/70" style={{ fontFamily: 'Inter, sans-serif' }}>
        <p>{member.part}</p>
        <p>{member.major}</p>
        <p>{member.year}</p>
      </div>
      {member.instagram && (
        <div className="mt-4 flex gap-2 hover:scale-110 transition-transform">
          <a href={`https://instagram.com/${member.instagram}`} target="_blank" rel="noreferrer">
            <Instagram className="w-5 h-5 text-[#8FA8C8] cursor-pointer hover:text-[#2B4C6F]" />
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
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="bg-[#2B4C6F] shadow-xl py-16 md:py-24 px-4 text-center"
          style={{ borderRadius: '20px' }}
        >
          <h1
            className="text-white"
            style={{ ...fontYearbook, fontSize: 'clamp(48px, 10vw, 96px)', letterSpacing: '0.05em' }}
          >
            OUR MEMBERS
          </h1>
          <p
            className="text-white/80 mt-4 max-w-2xl mx-auto"
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
        <div className="space-y-12">
          {groupedMembers.map(({ part, members }) => (
            <section key={part}>
              <h2 
                className="text-[#2B4C6F] mb-6 px-4 md:px-0 uppercase tracking-widest border-b-2 border-[#8FA8C8]/20 pb-2"
                style={{ ...fontYearbook, fontSize: '28px' }}
              >
                {part === 'Bass/Bari' ? 'Bass / Baritones' : `${part}s`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '25px' }}>
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
