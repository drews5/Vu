import { strFromU8, unzip } from 'fflate';
import type { Chart, ScoreNote } from './chart';

const beatsByType: Record<string, number> = { whole: 4, half: 2, quarter: 1, eighth: .5, '16th': .25, '32nd': .125, '64th': .0625, breve: 8 };
const text = (node: Element, selector: string) => node.querySelector(selector)?.textContent?.trim() ?? '';
function fraction(value: string) {
  const [a, b] = value.split('/').map(Number);
  return Number.isFinite(a) && b ? a / b : 0;
}

async function sourceXml(name: string, content: ArrayBuffer) {
  const bytes = new Uint8Array(content);
  if (/\.mscx$/i.test(name)) return strFromU8(bytes);
  const entries = await new Promise<Record<string, Uint8Array>>((resolve, reject) => unzip(bytes, {
    filter: item => !item.name.includes('/') && /\.mscx$/i.test(item.name) && item.originalSize < 25 * 1024 * 1024,
  }, (error, files) => error ? reject(error) : resolve(files)));
  const score = Object.values(entries)[0];
  if (!score) throw new Error('No MuseScore score found');
  return strFromU8(score);
}

function normalizePart(name: string) {
  if (/mezzo/i.test(name)) return 'Mezzo';
  if (/percussion|beatbox/i.test(name)) return 'Vocal percussion';
  return name;
}

async function measureAudioOffset(url?: string) {
  if (!url || !window.AudioContext) return 0;
  const context = new AudioContext();
  try {
    const response = await fetch(url, { headers: { Range: 'bytes=0-524287' } });
    if (!response.ok) return 0;
    const buffer = await context.decodeAudioData(await response.arrayBuffer());
    const channel = buffer.getChannelData(0);
    const windowSize = Math.max(1, Math.floor(buffer.sampleRate / 100));
    const sampleLimit = Math.min(channel.length, buffer.sampleRate * 8);
    let peak = 0;
    const levels: number[] = [];
    for (let start = 0; start + windowSize < sampleLimit; start += windowSize) {
      let sum = 0;
      for (let i = start; i < start + windowSize; i++) sum += channel[i] ** 2;
      const level = Math.sqrt(sum / windowSize);
      levels.push(level);
      peak = Math.max(peak, level);
    }
    const onset = levels.findIndex((level, i) => level > peak * .08 && levels[i + 1] > peak * .05);
    return onset > 4 ? onset / 100 : 0;
  } catch { return 0; }
  finally { void context.close(); }
}

export async function analyzeMuseScore(name: string, bytes: Promise<ArrayBuffer>, audioUrl: string | undefined, filename: string): Promise<Chart | undefined> {
  const xml = new DOMParser().parseFromString(await sourceXml(name, await bytes), 'application/xml');
  const score = xml.querySelector('museScore > Score');
  if (!score || xml.querySelector('parsererror')) return;
  const staves = [...score.querySelectorAll(':scope > Staff')];
  const groups = [...score.querySelectorAll(':scope > Part')].flatMap((part, index) => {
    const label = normalizePart(text(part, 'Instrument > longName') || text(part, 'trackName') || 'Part ' + (index + 1));
    return [...part.querySelectorAll(':scope > Staff')].map(() => label);
  });
  const measures = staves.map(staff => [...staff.querySelectorAll(':scope > Measure')]);
  if (!measures[0]?.length || measures[0].length > 500 || staves.length > 32) return;
  if (score.querySelector('startRepeat, endRepeat, Jump')) return;
  const beats: number[] = [];
  const times = [0];
  const tempos: Chart['tempos'] = [];
  const sections: Chart['sections'] = [[1, 'Opening']];
  let meter = 4;
  let bpm = 120;
  for (let i = 0; i < measures[0].length; i++) {
    const measure = measures[0][i];
    const sig = measure.querySelector('TimeSig');
    if (sig) meter = 4 * (Number(text(sig, 'sigN')) / Number(text(sig, 'sigD'))) || meter;
    const tempo = measures.map(staff => staff[i] && Number(text(staff[i], 'Tempo > tempo'))).find(value => value && value > 0);
    if (tempo) bpm = Math.round(tempo * 60);
    if (tempos.at(-1)?.[1] !== bpm) tempos.push([i + 1, bpm]);
    const mark = text(measure, 'RehearsalMark > text');
    if (mark && i) sections.push([i + 1, mark]);
    else if (mark) sections[0][1] = mark;
    const length = 4 * fraction(measure.getAttribute('len') || '') || meter;
    beats.push(length);
    times.push(times[i] + 60 / bpm * length);
  }

  const lyrics: Chart['lyrics'] = {};
  const notes: Chart['notes'] = {};
  measures.forEach((staff, staffIndex) => {
    const part = groups[staffIndex] || 'Part ' + (staffIndex + 1);
    const partLyrics = lyrics[part] ??= {};
    const partNotes = notes[part] ??= [];
    staff.forEach((measure, index) => {
      const lines = new Map<string, string>();
      for (const voice of measure.querySelectorAll(':scope > voice')) {
        let beat = 0;
        let tuplet = 1;
        for (const item of voice.children) {
          if (item.tagName === 'Tuplet') tuplet = Number(text(item, 'normalNotes')) / Number(text(item, 'actualNotes')) || 1;
          if (item.tagName === 'endTuplet') tuplet = 1;
          if (item.tagName !== 'Chord' && item.tagName !== 'Rest') continue;
          if (item.querySelector('grace8, grace16, grace32, acciaccatura, appoggiatura')) continue;
          const explicit = 4 * fraction(text(item, ':scope > duration'));
          const base = beatsByType[text(item, ':scope > durationType')] ?? beats[index] ?? 4;
          const dots = Math.min(3, Number(text(item, ':scope > dots')));
          const length = (explicit || base * (2 - .5 ** dots)) * tuplet;
          for (const note of item.querySelectorAll(':scope > Note')) {
            const pitch = Number(text(note, 'pitch'));
            if (pitch && beat < beats[index]) partNotes.push([index + 1, beat, length, pitch] satisfies ScoreNote);
          }
          for (const lyric of item.querySelectorAll(':scope > Lyrics')) {
            const value = text(lyric, ':scope > text');
            if (!value) continue;
            const line = text(lyric, 'no') || '0';
            const prior = lines.get(line) || '';
            const syllable = text(lyric, 'syllabic');
            const join = syllable === 'middle' || syllable === 'end';
            lines.set(line, prior + (join ? (prior ? '' : '–') : prior ? ' ' : '') + value);
          }
          beat += length;
        }
      }
      if (lines.size) partLyrics[index + 1] = [...lines.values()].join(' / ');
    });
  });
  const firstNote = Math.min(...Object.values(notes).flat().map(([bar, beat]) => times[bar - 1] + beat * 60 / (tempos.findLast(([m]) => m <= bar)?.[1] || 120)));
  const firstSound = await measureAudioOffset(audioUrl);
  const offset = firstSound > 0 && Number.isFinite(firstNote) ? Math.max(0, firstSound - firstNote) : 0;
  return {
    file: filename, parts: [...new Set(Object.keys(notes))], times: times.map(value => value + offset),
    tempos, sections, systems: [], lyrics, notes, tracks: {}, quality: 'estimated',
  };
}
