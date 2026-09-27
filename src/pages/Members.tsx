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
                            The voices (and the beat) behind Vocal U.
                        </p>
                    </div>
                </div>
            </motion.section>
            <div className="vu-part-grid grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
                {memberGroups.map(({ part, members }, index) => (
                    <motion.section variants={childVariants} key={part} aria-labelledby={`member-part-${index}`}>
                        <div className="vu-part-sheet h-full px-6 pb-5 pt-8">
                            <span className="vu-part-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            <h2 id={`member-part-${index}`} className="mb-4 text-[#2B4C6F] font-yearbook" style={{ ...fontYearbook, fontSize: 'clamp(23px, 2.5vw, 30px)' }}>
                                {part}
                            </h2>
                            <ul>
                                {members.map((name) => (
                                    <li key={name} className="vu-member-line flex items-center gap-3 py-3 text-[#2B4C6F]">
                                        <span className="text-2xl text-[#8FA8C8]" aria-hidden="true">♪</span>
                                        <span className="font-yearbook" style={{ ...fontYearbook, fontSize: '20px', lineHeight: 1.25 }}>{name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.section>
                ))}
            </div>
            <ExploreMore currentPath="/members" />
        </PageTransition>
    );
}
