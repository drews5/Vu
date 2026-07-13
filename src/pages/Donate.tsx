import { ArrowUpRight, Heart, Star } from 'lucide-react';
import logoImage from '../assets/d4630c01b543cc75980f0b293230859d29654fbb.png';
import { PageHero } from '../components/PageHero';
import { PageShell } from '../components/PageShell';
import { Seo, toAbsoluteUrl } from '../components/Seo';

export function Donate() {
  const donateDescription =
    'Support Vocal U with a secure donation to help cover travel, showcase costs, and competition fees for the University of Minnesota a cappella group.';

  return (
    <PageShell className="min-h-screen pb-8 md:pb-16">
      <Seo
        title="Support Vocal U"
        description={donateDescription}
        path="/donate"
        keywords={['donate to Vocal U', 'support Vocal U', 'UMN a cappella donation', 'Vocal U fundraiser']}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Donate', path: '/donate' }]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Support Vocal U',
          description: donateDescription,
          url: toAbsoluteUrl('/donate'),
          about: { '@id': toAbsoluteUrl('/#organization') },
          potentialAction: [
            { '@type': 'DonateAction', target: 'https://givebutter.com/vu' },
            { '@type': 'DonateAction', target: 'https://venmo.com/u/vocalu' },
          ],
        }}
      />

      <PageHero
        title="Support the sound"
        eyebrow="Student powered"
        description="Every gift helps us travel, compete, commission arrangements, and put on the shows we are proud of."
        stamp="Thank you!"
      />

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <section
          className="overflow-hidden rounded-[26px] border border-[#dce5ed] bg-white shadow-[0_14px_38px_rgba(35,61,85,0.08)] lg:col-span-7"
          aria-labelledby="givebutter-heading"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#dce5ed] bg-[#f4f7fa] px-5 py-4">
            <h2 id="givebutter-heading" className="text-xl text-[#2e4c6d]">Donate online</h2>
            <a href="https://givebutter.com/vu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[#2e4c6d] hover:text-[#7895b7]">
              Open Givebutter <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="relative min-h-[760px] bg-white">
            <iframe
              src="https://givebutter.com/embed/c/vu"
              className="absolute inset-0 h-full w-full border-0"
              title="Donate to Vocal U through Givebutter"
              allow="payment"
              loading="lazy"
            />
          </div>
        </section>

        <div className="space-y-6 lg:col-span-5">
          <section className="overflow-hidden rounded-[26px] border border-[#dce5ed] bg-white shadow-[0_14px_38px_rgba(35,61,85,0.08)] transition-transform duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-3 bg-[#008cff] px-6 py-4 text-white">
              <svg viewBox="0 0 512 512" className="h-7 w-7" aria-hidden="true">
                <path fill="currentColor" d="M364.178 131.79c8.97 14.762 13.013 29.966 13.013 49.172 0 61.26-52.48 140.84-95.074 196.72h-97.285l-39.016-232.48 85.185-8.06 20.627 165.426c19.275-31.29 43.062-80.464 43.062-113.989 0-18.35-3.155-30.85-8.085-41.142l77.573-15.648z" />
              </svg>
              <h2 className="text-xl text-white">Donate with Venmo</h2>
            </div>
            <div className="p-7 text-center md:p-8">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#91a8c6]">
                <img src={logoImage} alt="" className="h-14 w-auto" />
              </div>
              <p className="mt-5 text-lg font-semibold text-[#2e4c6d]">Vocal U A Cappella</p>
              <p className="mt-1 text-base font-semibold text-[#008cff]">@vocalu</p>
              <a
                href="https://venmo.com/u/vocalu"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#008cff] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0074d9]"
              >
                Open Venmo
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-[#dce5ed] bg-white p-7 md:p-8">
            <h2 className="text-3xl text-[#2e4c6d]">Other ways to help</h2>
            <div className="mt-6 space-y-6">
              <div className="flex gap-4">
                <div className="h-fit rounded-xl bg-[#91a8c6]/12 p-3 text-[#7895b7]">
                  <Heart className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl text-[#2e4c6d]">Share our work</h3>
                  <p className="mt-1 text-sm leading-6 text-[#2e4c6d]/70">Follow Vocal U, share an event, or bring a friend to a show.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-fit rounded-xl bg-[#91a8c6]/12 p-3 text-[#7895b7]">
                  <Star className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl text-[#2e4c6d]">Book a performance</h3>
                  <p className="mt-1 text-sm leading-6 text-[#2e4c6d]/70">Invite us to perform at a campus event, fundraiser, celebration, or community gathering.</p>
                  <a href="mailto:vocalu@umn.edu?subject=Performance%20booking" className="mt-2 inline-block text-sm font-semibold text-[#2e4c6d] underline decoration-[#91a8c6] underline-offset-4">Email Vocal U</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
