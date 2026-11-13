import { useEffect, useRef, useState } from 'react';
import { BookOpenText, ChevronRight, Music2, Repeat2, Search } from 'lucide-react';
import { chartPart, getLoopRange, sectionAt, type Chart } from './chart';
import { formatTime } from './catalog';

export function PracticeGuide({ chart, measure, selectedPart, seek, setLoop, showLyrics = true, focusMeasure = false }: {
  chart: Chart;
  measure: number;
  selectedPart: string;
  seek: (time: number) => void;
  setLoop: (start: number, end: number) => void;
  showLyrics?: boolean;
  focusMeasure?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [openSection, setOpenSection] = useState<number>();
  const [partOverride, setPartOverride] = useState('');
  const [auto, setAuto] = useState(true);
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const activeRow = useRef<HTMLButtonElement>(null);
  const measureEntry = useRef<HTMLInputElement>(null);
  useEffect(() => { if (focusMeasure) measureEntry.current?.focus(); }, [focusMeasure]);
  const scrollArea = useRef<HTMLDivElement>(null);
  const partNames = chart.parts.filter(name => Object.keys(chart.lyrics[name] ?? {}).length);
  const part = partOverride || chartPart(selectedPart, partNames) || partNames.find(name => /solo/i.test(name)) || partNames[0];
  const lyrics = chart.lyrics[part] ?? {};
  const count = chart.times.length - 1;
  const currentSection = sectionAt(chart, measure)?.[0] ?? 1;
  const selectedSection = openSection ?? currentSection;
  const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/[’‘]/g, "'").replace(/[–-]/g, '').replace(/\s+/g, ' ');
  const search = normalize(query.trim());
  const lyricAt = (number: number) => normalize(lyrics[number] ?? '');
  const matches = (number: number) => String(number) === search ||
    lyricAt(number).includes(search) ||
    (lyricAt(number) + ' ' + lyricAt(number + 1)).includes(search) && !lyricAt(number + 1).includes(search);
  const rangeStart = Number(first);
  const rangeEnd = last ? Number(last) : rangeStart;
  const validRange = rangeStart >= 1 && rangeEnd >= rangeStart && rangeEnd <= count &&
    Number.isInteger(rangeStart) && Number.isInteger(rangeEnd);

  useEffect(() => {
    if (!auto || !activeRow.current || !scrollArea.current || search) return;
    const row = activeRow.current.getBoundingClientRect();
    const parent = scrollArea.current.getBoundingClientRect();
    if (row.top < parent.top + 12 || row.bottom > parent.bottom - 15) {
      scrollArea.current.scrollBy({
        top: row.top - parent.top - parent.height * .33,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  }, [measure, selectedSection, auto, search]);

  function jump(number: number) {
    if (!Number.isInteger(number) || number < 1 || number > count) return;
    seek(chart.times[number - 1]);
    if (!auto) setOpenSection(sectionAt(chart, number)?.[0]);
  }

  return <div className="vu-guide">
    <div className="vu-guide-tools">
      <div className="vu-guide-filters">
        {showLyrics && partNames.length > 0 && <label className="vu-lyric-part">
          <Music2 size={16} />
          <select aria-label="Lyrics part" value={part} onChange={event => setPartOverride(event.target.value)}>
            {partNames.map(name => <option key={name}>{name}</option>)}
          </select>
        </label>}
        {showLyrics && <label className="vu-lyric-search">
          <Search size={16} />
          <input type="search" aria-label="Search lyrics" placeholder="Find a lyric" value={query} onChange={event => setQuery(event.target.value)} />
        </label>}
        <button type="button" className="vu-outline" aria-pressed={auto && openSection === undefined} onClick={() => {
          setOpenSection(undefined);
          setAuto(true);
          setQuery('');
        }}>Follow</button>
      </div>
      <form className="vu-measure-entry" onSubmit={event => { event.preventDefault(); jump(rangeStart); }}>
        <label>Measure <input ref={measureEntry} type="number" inputMode="numeric" aria-label="Start measure" min={1} max={count} placeholder={String(measure)} value={first} onChange={event => setFirst(event.target.value)} /></label>
        <label><span className="vu-range-label">to</span><input type="number" inputMode="numeric" aria-label="End measure" min={1} max={count} placeholder="End" value={last} onChange={event => setLast(event.target.value)} /></label>
        <button className="vu-outline" disabled={rangeStart < 1 || rangeStart > count}>Go</button>
        <button className="vu-outline" type="button" disabled={!validRange} onClick={() => setLoop(...getLoopRange(chart, rangeStart, rangeEnd))}><Repeat2 size={15} /> Loop measures</button>
      </form>
    </div>
    <div className="vu-guide-list" ref={scrollArea} onWheel={() => setAuto(false)} onTouchMove={() => setAuto(false)}>
      {chart.sections.map(([start, name], sectionIndex) => {
        const end = (chart.sections[sectionIndex + 1]?.[0] ?? count + 1) - 1;
        const numbers = Array.from({ length: end - start + 1 }, (_, index) => index + start);
        const result = search ? numbers.filter(matches) : numbers;
        if (!result.length) return null;
        const open = search || selectedSection === start;
        return <section className="vu-lyric-section" key={start}>
          <header>
            <button type="button" className="vu-section-toggle" aria-expanded={Boolean(open)} onClick={() => {
              setOpenSection(open ? 0 : start);
              setAuto(false);
            }}><ChevronRight size={16} /><strong>{name}</strong><span>m. {start}{end > start ? '–' + end : ''}</span></button>
            <button className="vu-section-time" type="button" onClick={() => jump(start)} aria-label={'Jump to ' + name + ', measure ' + start}>{formatTime(chart.times[start - 1])}</button>
            <button className="vu-section-loop" type="button" title="Loop section" aria-label={'Loop ' + name + ', measures ' + start + ' to ' + end} onClick={() => setLoop(...getLoopRange(chart, start, end))}><Repeat2 size={17} /></button>
          </header>
          {open && <div className="vu-lyric-rows">
            {result.map(number => <button key={number} type="button" aria-current={number === measure ? 'true' : undefined}
              ref={number === measure ? activeRow : undefined} onClick={() => jump(number)} className="vu-lyric-row"
              aria-label={'Go to measure ' + number + (lyrics[number] && showLyrics ? ': ' + lyrics[number] : '')}>
              <span>m. {number}</span><span>{showLyrics ? lyrics[number] || '—' : 'Measure ' + number}</span><time>{formatTime(chart.times[number - 1])}</time>
            </button>)}
          </div>}
        </section>;
      })}
      {search && !chart.times.slice(1).some((_, index) => matches(index + 1)) &&
        <p className="vu-guide-empty"><BookOpenText size={18} /> No matching lyrics.</p>}
    </div>
  </div>;
}
