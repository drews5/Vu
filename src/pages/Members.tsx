/// <reference types="vite/client" />
import { PageTransition, childVariants } from '../components/PageTransition';
import { ExploreMore } from '../components/ExploreMore';
import { motion } from 'motion/react';
import { Seo, toAbsoluteUrl, type SeoSchema } from '../components/Seo';
import { fontYearbook } from '../styles/fonts';
import memberGroups from '../data/memberGroups.json';

const members = memberGroups.flatMap(({ part, members }) => members.map((name) => ({ name, part })));

export function Members() {
    const membersDescription =
        'Meet the current singers of Vocal U, the University of Minnesota gender-inclusive a cappella group.';
    const membersSchema: SeoSchema[] = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Vocal U Members',
            description: membersDescription,
            url: toAbsoluteUrl('/members'),
            about: { '@id': toAbsoluteUrl('/#organization') },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Vocal U Members',
            itemListElement: members.map(({ name, part }, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: { '@type': 'Person', name, jobTitle: part },
            })),
        },
    ];

    return (
        <PageTransition className="pb-8 md:pb-16 px-4 md:px-0">
            <Seo
                title="Vocal U Members"
                description={membersDescription}
                path="/members"
                keywords={['Vocal U members', 'UMN a cappella members', 'Minnesota student singers']}
                breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Members', path: '/members' }]}
                schema={membersSchema}
            />
            <motion.section variants={childVariants} style={{ marginTop: '25px', marginBottom: '40px' }}>
                <div className="vu-page-hero bg-[#2B4C6F] flex items-center justify-center text-center py-12 md:py-20" style={{ borderRadius: '16px', minHeight: '300px' }}>
                    <div className="px-4">
                        <h1 className="text-white font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}>
                            Our Members
                        </h1>
                        <p className="text-white/80 mt-2 max-w-2xl mx-auto text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Meet the voices of Vocal U.
                        </p>
                    </div>
                </div>
            </motion.section>
            <div className="grid gap-x-8 gap-y-12 lg:grid-cols-2">
                {memberGroups.map(({ part, members }, index) => (
                    <motion.section variants={childVariants} key={part} aria-labelledby={`member-part-${index}`}>
                        <h2 id={`member-part-${index}`} className="mb-5 border-b-2 border-[#8FA8C8]/20 pb-3 text-center text-[#2B4C6F] font-yearbook" style={{ ...fontYearbook, fontSize: '24px', letterSpacing: '0.04em' }}>
                            {part}
                        </h2>
                        <ul className={`grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 ${members.length === 4 ? '' : 'sm:grid-cols-3'}`}>
                            {members.map((name) => {
                                const [firstName, ...lastName] = name.split(' ');
                                return (
                                    <li key={name} className="vu-panel vu-member-card flex min-h-32 items-center justify-center border border-[#8FA8C8] bg-white px-3 py-7 text-center text-[#2B4C6F]">
                                        <span className="vu-member-note" aria-hidden="true">♪</span>
                                        <h3 style={{ ...fontYearbook, fontSize: 'clamp(20px, 2vw, 26px)', lineHeight: 1.2 }}>
                                            <span className="block">{firstName}</span>{' '}
                                            <span className="block">{lastName.join(' ')}</span>
                                        </h3>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.section>
                ))}
            </div>
            <ExploreMore currentPath="/members" />
        </PageTransition>
    );
}
