import { fileUrl, inferLabel, type MusicFile, type Song } from './catalog';

export type StaffBand = [top: number, bottom: number];
export type ScoreSystem = {
  page: number;
  first: number;
  x: number[];
  y: StaffBand;
  staffs: Record<string, StaffBand>;
};
export type ScoreNote = [measure: number, beat: number, duration: number, pitch: number];
export type Chart = {
  file: string;
  parts: string[];
  times: number[];
  tempos: [measure: number, bpm: number][];
  sections: [measure: number, name: string][];
  systems: ScoreSystem[];
  lyrics: Record<string, Record<number, string>>;
  notes: Record<string, ScoreNote[]>;
  tracks: Record<string, [ratio: number, offset: number]>;
  quality: 'estimated' | 'score';
};

const files = import.meta.glob<{ default: Chart }>('./data/*.json');
const catalogCharts: Record<string, string> = {
  '1e324a01-c90e-542e-848d-a79816b056f4': 'back-to-black',
  '2acf9ac9-23b6-4bad-86fe-fb1f70c96a1e': 'body',
  '4295b11a-3097-54ea-a430-5d9f7e59c790': 'ego-death',
  '444b12d9-cc30-5a18-b9a8-8cf5eff20b07': 'crazy',
  '6fc706af-5ad4-5541-802c-d63326c24f4e': 'shut-up-and-teeth',
  '85f25bb7-0f3f-5686-9a16-883cf1ffddce': 'hypotheticals',
  'a694f85b-b286-54e8-831a-2e3e1928ac42': 'dive',
  'd7f3ba6f-9a13-5161-9c2d-6b3461a3c4f8': 'underneath-the-tree',
  'dbd358ea-a9cd-5d10-926b-2406f44a7bce': 'situations',
  'f875776b-0f0a-5bdd-9170-1cf7a0cc029b': 'all-for-us'
};


export async function loadChart(song: Song, score: MusicFile | undefined, audioDuration: number): Promise<Chart | undefined> {
  const name = song.id === 'all-for-us-alumni' ? 'all-for-us' : catalogCharts[song.id];
  const builtin = name ? await files['./data/' + name + '.json']?.() : undefined;
  if (builtin && score?.name === builtin.default.file) return builtin.default;
  const source = song.files.find(file => file.kind === 'source');
  const audio = song.files.find(file => file.kind === 'audio' && file.label === 'Full mix') ??
    song.files.find(file => file.kind === 'audio' && file.tempo === 1 && !file.variant);
  let sourceChart: Chart | undefined;
  if (source && score?.label !== 'Alternate score') {
    const { analyzeMuseScore } = await import('./museScore');
    sourceChart = await analyzeMuseScore(
      source.name,
      fetch(fileUrl(source.key)).then(response => {
        if (!response.ok) throw new Error('Score source could not load');
        return response.arrayBuffer();
      }),
      audio && fileUrl(audio.key),
      score?.name ?? source.name,
    ).catch(() => undefined);
  }
  if (!score || (!audioDuration && !sourceChart)) return sourceChart;
  const { analyzePdf } = await import('./pdfChart');
  return analyzePdf(score, audioDuration, sourceChart).catch(() => sourceChart);
}

export function measureAt(times: number[], seconds: number) {
  let left = 0;
  let right = times.length - 1;
  while (left + 1 < right) {
    const middle = (left + right) >> 1;
    if (times[middle] <= seconds) left = middle;
    else right = middle;
  }
  return left + 1;
}

export function tempoAt(chart: Chart, measure: number) {
  return chart.tempos.findLast(([start]) => start <= measure)?.[1] ?? 120;
}

export function sectionAt(chart: Chart, measure: number) {
  return chart.sections.findLast(([start]) => start <= measure);
}

export function chartPart(label: string, parts: string[]) {
  return parts.find(name => name.toLowerCase() === label.toLowerCase()) ??
    parts.find(name => name === inferLabel(label)) ?? parts.find(name => label.toLowerCase().startsWith(name.toLowerCase()));
}

export function staffAt(system: ScoreSystem, part?: string) {
  return part ? system.staffs[part] : undefined;
}

export function getLoopRange(chart: Chart, start: number, end = start): [number, number] {
  return [chart.times[start - 1], chart.times[end]];
}
