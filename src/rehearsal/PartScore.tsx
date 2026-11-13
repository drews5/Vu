import { useEffect, useMemo, useRef } from 'react';
import { Accidental, Barline, Dot, Formatter, Renderer, Stave, StaveNote, Voice } from 'vexflow/bravura';
import type { Chart, ScoreNote } from './chart';

const names = ['c', 'c#', 'd', 'eb', 'e', 'f', 'f#', 'g', 'ab', 'a', 'bb', 'b'];
const values = [[4, 'w', 0], [3, 'h', 1], [2, 'h', 0], [1.5, 'q', 1], [1, 'q', 0],
  [.75, '8', 1], [.5, '8', 0], [.375, '16', 1], [.25, '16', 0], [.125, '32', 0], [.0625, '64', 0]] as const;

function Measure({ number, notes, beats, clef, lyric, active, seek }: {
  number: number; notes: ScoreNote[]; beats: number; clef: string; lyric?: string; active: boolean; seek: () => void;
}) {
  const notation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = notation.current;
    if (!element) return;
    element.replaceChildren();
    const renderer = new Renderer(element, Renderer.Backends.SVG);
    const width = Math.max(170, Math.min(570, 110 + notes.length * 32));
    renderer.resize(width, 117);
    const context = renderer.getContext();
    const stave = new Stave(5, 15, width - 15).addClef(clef).setEndBarType(Barline.type.SINGLE);
    stave.setContext(context).draw();
    const groups = new Map<number, { length: number; pitches: number[] }>();
    for (const [, beat, length, pitch] of notes) {
      const group = groups.get(beat) ?? { length, pitches: [] };
      if (!group.pitches.includes(pitch)) group.pitches.push(pitch);
      groups.set(beat, group);
    }
    const notesToDraw: StaveNote[] = [];
    function add(length: number, pitches: number[]) {
      const [, duration, dots] = values.reduce((best, item) => Math.abs(item[0] - length) < Math.abs(best[0] - length) ? item : best);
      const keys = pitches.map(pitch => names[pitch % 12] + '/' + (Math.floor(pitch / 12) - 1));
      const note = new StaveNote({ clef, keys: keys.length ? keys : [clef === 'bass' ? 'd/3' : 'b/4'], duration: duration + (keys.length ? '' : 'r') });
      pitches.forEach((pitch, i) => {
        const accidental = names[pitch % 12].slice(1);
        if (accidental) note.addModifier(new Accidental(accidental), i);
      });
      if (dots) Dot.buildAndAttach([note], { all: true });
      notesToDraw.push(note);
    }
    function rest(length: number) {
      for (const [value] of values) {
        if (length < value - .002) continue;
        add(value, []);
        length -= value;
      }
    }
    let position = 0;
    for (const [beat, group] of [...groups].sort(([a], [b]) => a - b)) {
      if (beat > position) rest(beat - position);
      add(group.length, group.pitches);
      position = Math.max(position, beat + group.length);
    }
    if (position < beats) rest(beats - position);
    if (!notesToDraw.length) add(4, []);
    try {
      const voice = new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT).addTickables(notesToDraw);
      new Formatter().joinVoices([voice]).formatToStave([voice], stave);
      voice.draw(context, stave);
    } catch {
      element.replaceChildren();
      element.textContent = 'See original score';
    }
    return () => element.replaceChildren();
  }, [notes, beats, clef]);
  return <button type="button" className="vu-notation-measure" aria-current={active ? 'true' : undefined}
    aria-label={'Play measure ' + number} onClick={seek}>
    <span>m. {number}</span><div className="vu-notation-svg" ref={notation} aria-hidden="true" />
    {lyric && <span className="vu-notation-lyric">{lyric}</span>}
  </button>;
}

export function PartScore({ chart, part, measure, seek }: { chart: Chart; part: string; measure: number; seek: (time: number) => void }) {
  const view = useRef<HTMLDivElement>(null);
  const measures = useMemo(() => {
    const indexed = new Map<number, ScoreNote[]>();
    for (const note of chart.notes[part] ?? []) {
      const group = indexed.get(note[0]) ?? [];
      group.push(note);
      indexed.set(note[0], group);
    }
    return indexed;
  }, [chart, part]);
  const count = chart.times.length - 1;
  const start = Math.floor((measure - 1) / 8) * 8 + 1;
  const last = Math.min(start + 7, count);
  const bars = useMemo(() => Array.from({ length: last - start + 1 }, (_, i) => {
    const number = start + i;
    return { number, notes: measures.get(number) ?? [], lyric: chart.lyrics[part]?.[number] };
  }), [last, start, measures, chart, part]);

  useEffect(() => {
    const node = view.current;
    const item = node?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!node || !item) return;
    const top = item.getBoundingClientRect().top - node.getBoundingClientRect().top + node.scrollTop;
    if (top < node.scrollTop || top + item.offsetHeight > node.scrollTop + node.clientHeight) {
      node.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }, [measure]);

  return <div className="vu-notation" ref={view}>
    <div className="vu-notation-paper">
      <div className="vu-notation-heading"><strong>{part}</strong><span>Measures {start}–{last}</span></div>
      <div className="vu-notation-grid">
        {bars.map(({ number, notes, lyric }) => <Measure key={number} number={number} notes={notes} lyric={lyric}
          beats={Math.round((chart.times[number] - chart.times[number - 1]) * (chart.tempos.findLast(([bar]) => bar <= number)?.[1] ?? 120) / 60 * 2) / 2}
          clef={/bass|baritone|tenor/i.test(part) ? 'bass' : 'treble'}
          active={number === measure} seek={() => seek(chart.times[number - 1])} />)}
      </div>
      <div className="vu-notation-nav">
        <button type="button" className="vu-outline" disabled={start === 1} onClick={() => seek(chart.times[start - 9])}>Previous measures</button>
        <button type="button" className="vu-outline" disabled={last === count} onClick={() => seek(chart.times[last])}>Next measures</button>
      </div>
    </div>
  </div>;
}
