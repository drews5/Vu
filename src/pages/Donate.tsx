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
    <div className="pb-8 md:pb-16 min-h-screen">
      <section style={{ marginTop: '25px', marginBottom: '25px' }}>
        <div
          className="bg-[#91a8c6] shadow-xl py-12 md:py-16 px-4 text-center text-white"
          style={{ borderRadius: '20px' }}
        >
          <h1
            style={{ ...fontYearbook, fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.05em' }}
          >
            SUPPORT US
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg opacity-90" style={{ fontFamily: 'Inter, sans-serif' }}>
            Vocal U is a self-funded student organization. Your donations help us cover travel, recording
            costs, and competition fees.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Givebutter Embed Container (8/12 columns) */}
        <div 
          className="lg:col-span-7 bg-white shadow-2xl overflow-hidden relative flex flex-col" 
          style={{ 
            borderRadius: '24px',
            minHeight: '800px',
            width: '100%',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <span className="text-[#2B4C6F] font-bold text-sm" style={fontInter}>Givebutter Secure Donation</span>
            <a 
              href="https://givebutter.com/vu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8FA8C8] text-xs hover:underline font-bold"
              style={fontInter}
            >
              Open in new tab ↗
            </a>
          </div>
          <div className="flex-grow relative bg-gray-50/50">
            <iframe
              src="https://givebutter.com/embed/c/vu"
              className="w-full h-full border-0 absolute inset-0"
              title="Vocal U Donation"
              allow="payment"
            />
          </div>
        </div>

        {/* Right: Other Ways & Venmo (5/12 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Venmo Card */}
          <div className="bg-[#008CFF] p-8 shadow-xl text-white flex flex-col items-center text-center group transition-transform hover:scale-[1.02]" style={{ borderRadius: '24px' }}>
            <div className="bg-white p-4 rounded-full mb-4 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#008CFF] fill-current">
                <path d="M19.011 2.399h-14.022c-1.42 0-2.589 1.169-2.589 2.589v14.022c0 1.42 1.169 2.589 2.589 2.589h14.022c1.42 0 2.589-1.169 2.589-2.589v-14.022c0-1.42-1.169-2.589-2.589-2.589zm-4.706 14.153c-1.049 1.139-2.482 1.635-4.298 1.488-1.554-.124-2.735-.85-3.543-2.178-.711-1.169-.916-2.502-.615-3.999.301-1.497.943-2.618 1.926-3.364s2.219-1.119 3.708-1.119c.969 0 1.834.205 2.595.615.761.411 1.348.981 1.761 1.711.413.73.619 1.558.619 2.484 0 1.058-.23 2.016-.69 2.873-.46.857-1.114 1.488-1.963 1.894-.849.406-1.789.609-2.82.609-1.031 0-1.892-.205-2.583-.615-.691-.41-1.139-.993-1.344-1.75-.205-.757-.102-1.616.309-2.576l.161-.349h2.394l-.151.328c-.287.625-.333 1.129-.138 1.511.195.382.551.573 1.068.573s.912-.191 1.185-.573c.273-.382.409-.886.409-1.511 0-.625-.136-1.129-.409-1.511-.273-.382-.668-.573-1.185-.573s-.91.191-1.177.573c-.267.382-.401.886-.401 1.511 0 .625.134 1.129.401 1.511.267.382.66.573 1.177.573.517 0 .873-.191 1.068-.573.195-.382.253-.886.174-1.511h.02c.002.321.003.623.003.905 0 .918-.179 1.74-.537 2.466z"/>
              </svg>
            </div>
            <h2 className="text-3xl mb-1" style={fontYearbook}>Venmo</h2>
            <p className="text-xl mb-6 font-bold tracking-tight" style={fontInter}>@vocalu</p>
            <a 
              href="https://venmo.com/u/vocalu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-white text-[#008CFF] py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-50 transition-colors uppercase tracking-widest"
              style={fontYearbook}
            >
              Open Venmo
            </a>
          </div>

          {/* Other Ways to Help */}
          <div className="bg-white p-8 shadow-xl" style={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h2 className="text-[#2B4C6F] text-2xl mb-8 border-b pb-4" style={fontYearbook}>
              Other Ways to Help
            </h2>
            
            <div className="space-y-8" style={fontInter}>
              <div className="flex gap-4">
                <div className="bg-[#8FA8C8]/10 p-3 rounded-2xl h-fit">
                  <Heart className="w-6 h-6 text-[#8FA8C8]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2B4C6F] text-lg mb-1">Spread the Word</h3>
                  <p className="text-[#2B4C6F]/70 text-sm leading-relaxed">
                    Follow us on Instagram and TikTok, share our posts, and tell your friends about our upcoming shows!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-[#8FA8C8]/10 p-3 rounded-2xl h-fit">
                  <Star className="w-6 h-6 text-[#8FA8C8]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2B4C6F] text-lg mb-1">Corporate Matching</h3>
                  <p className="text-[#2B4C6F]/70 text-sm leading-relaxed">
                    Check if your employer matches donations to student organizations or non-profits.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-2">Note</p>
                <p className="text-xs text-[#2B4C6F]/60 leading-relaxed italic">
                  Vocal U is a self-funded student organization. Every contribution goes directly toward our music and performances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
