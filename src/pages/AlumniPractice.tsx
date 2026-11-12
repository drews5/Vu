import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Download, FileMusic, Headphones, Music2, Repeat2, Volume2 } from 'lucide-react';
import { Seo } from '../components/Seo';

type Track = { name: string; file: string; category: 'Mixes' | 'Voice parts' | 'Solos' };
const root = '/practice/all-for-us/';
const asset = (file: string) => root + encodeURIComponent(file);
const tracks: Track[] = [
  { name: 'Full mix', file: 'All For Us FINAL.mp3', category: 'Mixes' },
  { name: 'Faster mix', file: 'All For Us (faster).mp3', category: 'Mixes' },
  { name: 'Soprano', file: 'Soprano Part (All For Us).mp3', category: 'Voice parts' },
  { name: 'Mezzo', file: 'Mezzo Part (All For Us).mp3', category: 'Voice parts' },
  { name: 'Alto', file: 'Alto Part (All For Us).mp3', category: 'Voice parts' },
  { name: 'Tenor', file: 'Tenor Part (All For Us).mp3', category: 'Voice parts' },
  { name: 'Bass', file: 'Bass Part (All For Us).mp3', category: 'Voice parts' },
  { name: 'Labrinth solo', file: 'Labrinth Solo (All For Us).mp3', category: 'Solos' },
  { name: 'Zendaya solo', file: 'Zendaya Solo (All For Us).mp3', category: 'Solos' },
];
const scores = [
  { name: 'Final full score', description: '10-page PDF', file: 'All For Us FINAL SCORE.pdf' },
  { name: 'Additional score', description: '11-page PDF', file: 'All_For_Us.pdf' },
];
const allFiles = [...tracks.map(t => t.file), ...scores.map(s => s.file)];
const speeds = [0.75, 0.9, 1, 1.1, 1.25];

export function AlumniPractice() {
  const [selected, setSelected] = useState(tracks[0]);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [availability, setAvailability] = useState<Record<string, boolean> | null>(null);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    // Vercel may return index.html for a missing asset, so HTTP 200 alone is not enough.
    Promise.all(allFiles.map(async file => {
      try {
        const response = await fetch(asset(file), { method: 'HEAD', signal: controller.signal });
        const type = response.headers.get('content-type')?.toLowerCase() || '';
        return [file, response.ok && !type.includes('text/html')] as const;
      } catch {
        return [file, false] as const;
      }
    })).then(entries => {
      if (!controller.signal.aborted) setAvailability(Object.fromEntries(entries));
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [selected, speed, availability]);

  const has = (file: string) => availability?.[file] ?? false;
  const published = availability ? Object.values(availability).filter(Boolean).length : 0;

  return <div className="min-h-screen bg-[#f6f9fc] px-4 pb-16 text-[#2B4C6F] sm:px-6">
    <Seo title="All For Us | Vocal U Alumni Practice" path="/alumni/all-for-us" description="Listen to All For Us rehearsal tracks and view the scores for Vocal U alumni." noindex />
    <div className="mx-auto max-w-[1160px]">
      <nav aria-label="Breadcrumb" className="flex items-center gap-3 py-7 text-xs font-semibold text-[#6984a2]">
        <Link to="/" className="hover:underline">Vocal U</Link><span>/</span><Link to="/media" className="hover:underline">Media</Link><span>/</span><span>Alumni practice</span>
      </nav>
      <header className="relative overflow-hidden rounded-[22px] bg-[#2B4C6F] px-7 py-12 text-white sm:px-12 md:px-16 md:py-16" style={{ background: 'linear-gradient(115deg,#213c59 0%,#3d6387 65%,#8fa8c8 100%)' }}>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 text-[11px] font-bold tracking-[.2em] text-[#d1e3f4]"><span className="size-2 rounded-full bg-[#d1e3f4]" />THE ALUMNI REHEARSAL ROOM</div>
          <h1 className="mt-6 font-yearbook text-[clamp(66px,9vw,112px)] leading-[.86] tracking-[.025em]">ALL<br /><span className="text-[#bed4ec]">FOR US.</span></h1>
          <p className="mt-7 max-w-lg text-sm leading-7 text-[#e9f1f9] sm:text-base">One song. A lot of familiar voices. Find your part, run it back, and come ready to sing together.</p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-[.13em] text-[#d4e4f3]"><span>2 mixes</span><span>7 part tracks</span><span>2 scores</span></div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-1/2 hidden size-[330px] -translate-y-1/2 rounded-full border-[24px] border-[#b3cee8]/20 shadow-[0_0_0_34px_#15304a35,0_0_0_70px_#c9d9ed15] md:block">
          <div className="absolute inset-[27%] grid place-items-center rounded-full border-8 border-[#274565] bg-[#adc9e6] text-[#254765]"><Music2 size={48}/></div>
        </div>
      </header>

      {availability && published < allFiles.length && <div role="status" className="mt-4 rounded-xl border border-[#cfdeeb] bg-[#e9f1f8] px-5 py-4 text-sm leading-6 text-[#3e607d]">
        {published === 0 ? 'The rehearsal room is ready, but its audio files and scores are still awaiting upload.' : `${published} of ${allFiles.length} files are available. The remaining files are awaiting upload.`}
      </div>}

      <section aria-labelledby="practice-tracks" className="pt-14">
        <div className="mb-7 flex items-start justify-between">
          <div><span className="text-[11px] font-extrabold tracking-[.2em] text-[#7794b3]">01 / LISTEN & LEARN</span><h2 id="practice-tracks" className="mt-2 font-yearbook text-4xl md:text-5xl">Find your part.</h2><p className="mt-2 text-sm text-[#6f8398]">Start with the full mix or focus on your line.</p></div>
          <Headphones size={32} strokeWidth={1.4} className="hidden sm:block"/>
        </div>
        <div className="grid items-start gap-4 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-[#dbe5ee] bg-white p-4">
            {(['Mixes','Voice parts','Solos'] as const).map((group,i) => <div key={group} className={i ? 'mt-4 border-t border-[#e7edf4] pt-4' : ''}>
              <h3 className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[.17em] text-[#8da0b3]">{group}</h3>
              {tracks.filter(track => track.category === group).map(track => <button key={track.file} type="button" onClick={() => setSelected(track)} aria-pressed={track.file === selected.file} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors hover:bg-[#f0f5fa] ${track.file === selected.file ? 'bg-[#e5eef7] text-[#274866]' : 'text-[#526c85]'}`}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${track.file === selected.file ? 'bg-[#2B4C6F] text-white' : 'bg-[#eff3f8] text-[#7a95b1]'}`}><Music2 size={15}/></span>
                <span className="flex-1">{track.name}</span>{has(track.file) && <Check size={15} className="text-[#5f947b]"/>}
              </button>)}
            </div>)}
          </div>
          <div className="rounded-2xl border border-[#dbe5ee] bg-white p-6 shadow-[0_12px_35px_#214c7010] sm:p-10">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#7c9bb8]"><Volume2 size={17}/> Now rehearsing</div>
            <h3 className="mt-6 font-yearbook text-4xl sm:text-6xl">{selected.name}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#70859a]">{selected.category === 'Mixes' ? 'Hear the whole arrangement before working through the individual parts.' : 'Learn your line here, then try singing it with the full mix.'}</p>
            <div className="mt-8">
              {availability && has(selected.file)
                ? <><audio key={selected.file} ref={audio} controls loop={loop} preload="metadata" src={asset(selected.file)} className="w-full" aria-label={selected.name + ' rehearsal audio'}/>
                    <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
                      <div><div className="mb-3 text-xs font-semibold text-[#738ba2]">Playback speed</div><div className="flex flex-wrap gap-1.5">{speeds.map(value => <button type="button" key={value} onClick={() => setSpeed(value)} aria-pressed={speed === value} className={`rounded-lg border px-3 py-2 text-xs font-bold ${speed === value ? 'border-[#2B4C6F] bg-[#2B4C6F] text-white' : 'border-[#d5e0eb] text-[#55718c] hover:bg-[#edf3f9]'}`}>{value}×</button>)}</div></div>
                      <label className="flex cursor-pointer items-center gap-2 pb-2 text-xs font-semibold text-[#55718c]"><input type="checkbox" checked={loop} onChange={event => setLoop(event.target.checked)} className="accent-[#2B4C6F]"/><Repeat2 size={16}/> Loop</label>
                    </div>
                    <a href={asset(selected.file)} download className="mt-6 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4"><Download size={17}/> Download MP3</a>
                  </>
                : <div className="rounded-xl bg-[#edf3f8] p-6 text-sm text-[#637d95]">{availability ? 'This track has not been uploaded yet.' : 'Checking track availability…'}</div>}
            </div>
            <p className="mt-9 border-t border-[#e6edf4] pt-6 text-xs leading-6 text-[#7f92a5]"><strong className="mr-2 text-[#577997]">REHEARSAL TIP</strong>Try 0.9× for a slower pass, then return to 1× when you're comfortable.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="practice-scores" className="pt-16">
        <div className="mb-7"><span className="text-[11px] font-extrabold tracking-[.2em] text-[#7794b3]">02 / FOLLOW ALONG</span><h2 id="practice-scores" className="mt-2 font-yearbook text-4xl md:text-5xl">Keep the music close.</h2><p className="mt-2 text-sm text-[#6f8398]">Open a score on your device or save it to mark up.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">{scores.map((score,i) => <article key={score.file} className="flex items-center gap-5 rounded-2xl border border-[#dbe5ee] bg-white p-5">
          <div aria-hidden="true" className="flex h-36 w-24 shrink-0 rotate-[-2deg] flex-col items-center justify-between rounded border border-[#d6e3ee] bg-[#f1f6fb] px-3 py-3 text-[#7191b1] shadow-[4px_4px_0_#e4edf5]"><div className="flex w-full justify-between text-[8px] font-extrabold"><span>VOCAL U</span><span>0{i+1}</span></div><FileMusic size={31} strokeWidth={1.2}/><span className="h-7 w-full bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_5px,#bfcfe0_6px,transparent_7px)]"/></div>
          <div className="min-w-0"><h3 className="font-yearbook text-2xl leading-tight">{score.name}</h3><p className="mt-1 text-xs text-[#8297a9]">{score.description}</p>
            {has(score.file) ? <div className="mt-5 flex flex-wrap gap-2"><a href={asset(score.file)} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#2B4C6F] px-4 py-2 text-xs font-bold text-white">Open PDF</a><a href={asset(score.file)} download className="inline-flex items-center gap-1 rounded-lg border border-[#b3c9de] px-3 py-2 text-xs font-bold"> <Download size={14}/> Download</a></div>
              : <span className="mt-4 block text-xs text-[#8297a9]">{availability ? 'Awaiting upload' : 'Checking availability…'}</span>}
          </div>
        </article>)}</div>
      </section>
      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[#d8e4ee] pt-7 text-[11px] font-bold uppercase tracking-[.1em] text-[#7890a6]"><span>Vocal U · Alumni rehearsal archive</span><Link to="/media" className="text-[#2B4C6F] hover:underline">Back to media</Link></footer>
    </div>
  </div>;
}
