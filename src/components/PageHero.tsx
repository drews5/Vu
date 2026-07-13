import { motion } from 'motion/react';
import { Music2, Sparkles } from 'lucide-react';
import { childReveal } from './PageShell';

type PageHeroProps = {
  title: string;
  eyebrow: string;
  description: string;
  tone?: 'blue' | 'navy';
  stamp?: string;
};

export function PageHero({ title, eyebrow, description, tone = 'blue', stamp = 'Vocal U' }: PageHeroProps) {
  const background = tone === 'navy'
    ? 'from-[#243f5d] via-[#2e4c6d] to-[#426789]'
    : 'from-[#7895b7] via-[#91a8c6] to-[#abc0d9]';

  return (
    <motion.section variants={childReveal} className="my-6 md:my-7">
      <div className={`relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br ${background} px-6 py-12 text-white shadow-[0_18px_45px_rgba(35,61,85,0.14)] md:px-10 md:py-16`}>
        <div className="absolute -right-9 -top-12 -z-10 select-none text-[11rem] leading-none text-white/[0.075]" style={{ fontFamily: 'var(--font-yearbook-stack)' }} aria-hidden="true">
          VU
        </div>
        <div className="absolute -bottom-12 -left-10 -z-10 h-40 w-40 rounded-full border-[28px] border-white/[0.07]" aria-hidden="true" />
        <Music2 className="absolute left-[9%] top-6 h-7 w-7 -rotate-12 text-white/22 md:h-9 md:w-9" aria-hidden="true" />
        <Sparkles className="absolute bottom-7 right-[10%] h-8 w-8 rotate-12 text-white/28 md:h-10 md:w-10" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-white/28 bg-white/12 px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {eyebrow}
          </div>
          <h1 className="text-[clamp(3.1rem,9vw,6rem)] leading-[0.9] tracking-[0.025em] text-white">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/86 md:text-base md:leading-7">{description}</p>
        </div>

        <div className="absolute bottom-4 right-5 rotate-[-4deg] rounded-lg border border-white/24 bg-[#2e4c6d]/28 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white/78 backdrop-blur-sm" aria-hidden="true">
          {stamp}
        </div>
      </div>
    </motion.section>
  );
}
