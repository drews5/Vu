import { memo } from 'react';
import { Heart, DollarSign, Star } from 'lucide-react';

const fontYearbook = { fontFamily: "'Yearbook Solid', sans-serif" };

const tiers = [
  { title: 'Friend of VU', amount: '$25', description: 'Covers sheet music for one group member.', Icon: Heart },
  { title: 'Music Maker', amount: '$50', description: 'Helps us purchase new arrangements.', Icon: Star },
  { title: 'Patron', amount: '$100+', description: 'Supports our travel to competitions like ICCA.', Icon: DollarSign },
];

const TierCard = memo(function TierCard({
  tier,
}: {
  tier: { title: string; amount: string; description: string; Icon: React.ComponentType<{ className?: string }> };
}) {
  return (
    <div
      className="bg-white p-8 shadow-lg text-center flex flex-col items-center"
      style={{ borderRadius: '20px' }}
    >
      <div className="bg-[#91a8c6]/10 p-4 rounded-full mb-4">
        <tier.Icon className="w-8 h-8 text-[#91a8c6]" />
      </div>
      <h3 className="text-[#2B4C6F] text-2xl mb-2" style={fontYearbook}>
        {tier.title}
      </h3>
      <div className="text-[#8FA8C8] text-4xl font-bold mb-4" style={fontYearbook}>
        {tier.amount}
      </div>
      <p className="text-[#2B4C6F]/70 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        {tier.description}
      </p>
      <button
        className="w-full bg-[#8FA8C8] text-white py-3 font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
        style={{ borderRadius: '15px', ...fontYearbook }}
      >
        DONATE
      </button>
    </div>
  );
});

export function Donate() {
  return (
    <div className="pb-8 md:pb-16">
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="bg-[#91a8c6] shadow-xl py-16 md:py-24 px-4 text-center text-white"
          style={{ borderRadius: '20px' }}
        >
          <h1
            style={{ ...fontYearbook, fontSize: 'clamp(48px, 10vw, 96px)', letterSpacing: '0.05em' }}
          >
            SUPPORT US
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90" style={{ fontFamily: 'Inter, sans-serif' }}>
            Vocal U is a self-funded student organization. Your donations help us cover travel, recording
            costs, and competition fees.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '25px', marginBottom: '40px' }}>
        {tiers.map((tier, index) => (
          <TierCard key={index} tier={tier} />
        ))}
      </div>

      <div className="bg-white p-8 shadow-lg" style={{ borderRadius: '20px' }}>
        <h2 className="text-[#2B4C6F] text-2xl mb-4 text-center" style={fontYearbook}>
          OTHER WAYS TO HELP
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#2B4C6F]/80"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-[#2B4C6F]">Spread the Word</h3>
            <p>
              Follow us on Instagram and TikTok, share our posts, and tell your friends about our upcoming
              shows!
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-[#2B4C6F]">Venmo</h3>
            <p>
              You can also donate directly via Venmo @VocalU-UMN. Every dollar counts towards our next
              recording!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
