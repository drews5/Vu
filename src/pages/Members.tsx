import { memo, useEffect, useState, useMemo } from 'react';
import { PageShell } from '../components/PageShell';
import { Instagram, Music } from 'lucide-react';
import { loadSupabase } from '../utils/loadSupabase';
import { Seo, toAbsoluteUrl } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';
import groupPhoto from '../assets/group-photo.webp';

const memberPhotos = import.meta.glob('../assets/members/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
interface Member {
    name: string;
    role: string;
    part: string;
    major: string;
    year: string;
    photo?: string;
    instagram?: string;
    isVocalPercussionist?: boolean;
}
type MemberRow = {
    name: string;
    role: string;
    part: string;
    major: string;
    year: string;
    photo_url?: string;
    instagram?: string;
    is_vp?: boolean;
};
const MemberCard = memo(function MemberCard({ member }: { member: Member }) {
    const nameParts = member.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return (
        <article className="relative flex w-full flex-col items-center overflow-hidden rounded-xl border border-[#dce5ed] bg-white p-3 text-center">
            <div className="relative mb-3 aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#eef3f7]">
                {member.photo ? (
                    <img src={member.photo} alt={`${member.name}, Vocal U member`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-10 h-10 text-[#91a8c6]/40" />
                    </div>
                )}
                {member.isVocalPercussionist && (
                    <div className="absolute inset-x-0 bottom-0 bg-[#2e4c6d]/92 px-2 py-1.5 text-[9px] font-semibold text-white">
                        Vocal percussion
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
                        <a href={`https://instagram.com/${member.instagram}`} target="_blank" rel="noreferrer" className="inline-block rounded-md p-1 text-[#7895b7] transition-colors hover:text-[#2e4c6d]" aria-label={`${member.name} on Instagram`}>
                            <Instagram className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </div>
        </article>
    );
});
const PART_ORDER = ['Soprano', 'Mezzo', 'Alto', 'Tenor', 'Bass/Bari', 'Vocal Percussionist', 'Member'];
export function Members() {
    const membersDescription =
        'Meet the current singers of Vocal U, the University of Minnesota gender-inclusive a cappella group, and get to know the voices behind the performances.';
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function fetchMembers() {
            const supabase = await loadSupabase();
            const { data, error } = await supabase
                .from('members')
                .select('name,role,part,major,year,photo_url,instagram,is_vp')
                .order('display_order', { ascending: true });
            if (error) {
                console.error('Error fetching members:', error);
            } else {
                if (cancelled) {
                    return;
                }

                setMembers(((data || []) as MemberRow[]).map((m) => {
                    const localPhotoKey = `../assets/members/${m.name}.jpg`;
                    return {
                        name: m.name,
                        role: m.role,
                        part: m.is_vp ? 'Vocal Percussionist' : m.part,
                        major: m.major,
                        year: m.year,
                        photo: memberPhotos[localPhotoKey] || m.photo_url,
                        instagram: m.instagram,
                        isVocalPercussionist: Boolean(m.is_vp)
                    };
                }));
            }
            if (!cancelled) {
                setLoading(false);
            }
        }
        void fetchMembers();
        return () => {
            cancelled = true;
        };
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
    const membersSchema: Array<Record<string, unknown>> = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Vocal U Members',
            description: membersDescription,
            url: toAbsoluteUrl('/members'),
            about: {
                '@id': toAbsoluteUrl('/#organization'),
            },
        },
    ];

    if (members.length > 0) {
        membersSchema.push({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Vocal U Members',
            itemListElement: members.map((member, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Person',
                    name: member.name,
                    jobTitle: member.role,
                },
            })),
        });
    }

    return (
        <PageShell className="pb-8 md:pb-16 px-4 md:px-0">
            <Seo
                title="Vocal U Members"
                description={membersDescription}
                path="/members"
                keywords={['Vocal U members', 'UMN a cappella members', 'Minnesota student singers']}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Members', path: '/members' },
                ]}
                schema={membersSchema}
            />
            {/* Hero Section */}
            <section style={{ marginTop: '25px', marginBottom: '40px' }}>
                <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl py-12 text-center md:min-h-[320px] md:py-20">
                    <img src={groupPhoto} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
                    <div className="absolute inset-0 bg-[#2e4c6d]/82" />
                    <div className="relative z-10 px-4">
                        <h1 className="text-white relative font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}>
                            Our Members
                        </h1>
                        <p className="text-white/80 mt-2 max-w-2xl mx-auto text-sm md:text-base relative" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Meet the voices of Vocal U.
                        </p>
                    </div>
                </div>
            </section>
            {loading ? (
                <div className="flex justify-center py-12" role="status">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8FA8C8]" />
                    <span className="sr-only">Loading members</span>
                </div>
            ) : groupedMembers.length === 0 ? (
                <div className="rounded-2xl border border-[#dce5ed] bg-[#f4f7fa] px-6 py-8 text-[#2e4c6d]/72">
                    The member list could not load. Visit <a href="https://www.instagram.com/vocal_u" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#2e4c6d] underline decoration-[#91a8c6] underline-offset-4">@vocal_u</a> to meet the group.
                </div>
            ) : (
                <div className="space-y-12">
                    {groupedMembers.map(({ part, members }) => (
                            <section key={part}>
                                <h2 className="text-[#2B4C6F] mb-6 tracking-widest border-b-2 border-[#8FA8C8]/20 pb-2 text-center w-full font-yearbook" style={{ ...fontYearbook, fontSize: '18px' }}>
                                    {part === 'Bass/Bari' ? 'Bass / Bari' :
                                        part === 'Vocal Percussionist' ? 'Percussion' :
                                            part === 'Member' ? 'Members' :
                                                part.endsWith('s') ? part : `${part}s`}
                                </h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {members.map((member) => (
                                        <MemberCard key={member.name} member={member} />
                                    ))}
                                </div>
                            </section>
                    ))}
                </div>
            )}
        </PageShell>
    );
}
