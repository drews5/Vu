export type MusicFile = {
  key: string;
  name: string;
  label: string;
  kind: 'audio' | 'score' | 'source';
  tempo: number;
  variant?: 'guide';
  cues?: (number | null)[];
};

export type Song = {
  id: string;
  title: string;
  collection: string;
  files: MusicFile[];
};

export const rehearsalCode = 'vu26';
const api = 'https://vocal-u-rehearsal-media.drew5.chatgpt.site';

export const alumniSong: Song = {
  id: 'all-for-us-alumni',
  title: 'All For Us',
  collection: 'Alumni',
  files: [
    ['Full mix', 'All For Us FINAL.mp3'],
    ['Soprano', 'Soprano Part (All For Us).mp3'],
    ['Mezzo', 'Mezzo Part (All For Us).mp3'],
    ['Alto', 'Alto Part (All For Us).mp3'],
    ['Tenor', 'Tenor Part (All For Us).mp3'],
    ['Bass', 'Bass Part (All For Us).mp3'],
    ['Labrinth solo', 'Labrinth Solo (All For Us).mp3'],
    ['Zendaya solo', 'Zendaya Solo (All For Us).mp3'],
    ['Faster reference', 'All For Us (faster).mp3'],
    ['Full score', 'All For Us FINAL SCORE.pdf'],
    ['Alternate score', 'All_For_Us.pdf'],
  ].map(([label, name]): MusicFile => ({
    key: '/practice/all-for-us/' + encodeURIComponent(name),
    name, label, kind: name.endsWith('.pdf') ? 'score' : 'audio', tempo: 1,
    variant: label === 'Faster reference' ? 'guide' : undefined,
    cues: label === 'Full score' ? [0, 34, 58, 78, 98, 128, 144, 166, 190, 218] : undefined,
  })),
};

export const partNames = ['Full mix', 'Soprano', 'Mezzo', 'Alto', 'Tenor', 'Baritone', 'Bass', 'Vocal percussion'];
const parts = /\b(soprano|sop|mezzo|mez|alto|tenor|ten|baritone|bari|bass|vocal percussion|vp|beatbox|percussion)\b/i;

export function inferLabel(name: string) {
  const stem = name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
  const solo = stem.match(/\bsolo\s*(\d+)?\b/i);
  if (solo) return solo[1] ? 'Solo ' + solo[1] : 'Solo';
  const match = stem.match(parts)?.[1].toLowerCase();
  const labels: Record<string, string> = {
    soprano: 'Soprano', sop: 'Soprano', mezzo: 'Mezzo', mez: 'Mezzo', alto: 'Alto',
    tenor: 'Tenor', ten: 'Tenor', baritone: 'Baritone', bari: 'Baritone', bass: 'Bass',
    'vocal percussion': 'Vocal percussion', vp: 'Vocal percussion', beatbox: 'Vocal percussion', percussion: 'Vocal percussion',
  };
  if (match) return labels[match];
  if (/\b(all|full|mix|ensemble)\b/i.test(stem)) return 'Full mix';
  return stem.trim();
}

export function sortTracks(a: MusicFile, b: MusicFile) {
  const rank = (file: MusicFile) => {
    const index = partNames.indexOf(file.label);
    return index === -1 ? partNames.length : index;
  };
  return rank(a) - rank(b) || a.label.localeCompare(b.label) || b.tempo - a.tempo;
}

export function fileUrl(key: string) {
  return key.startsWith('/') || key.startsWith('blob:') ? key : api + '/files/' + key;
}

export function readSetting<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem('vu-rehearsal:' + key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

export function saveSetting<T>(key: string, value: T) {
  try { localStorage.setItem('vu-rehearsal:' + key, JSON.stringify(value)); }
  catch { /* Practice still works with storage disabled. */ }
}

export function formatTime(value: number) {
  const seconds = Math.max(0, Math.floor(value || 0));
  return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('X-Rehearsal-Code', rehearsalCode);
  const response = await fetch(api + path, { ...options, headers, cache: 'no-store' });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || 'Could not reach rehearsal storage.');
  return body;
}

export async function fetchSongs(signal?: AbortSignal) {
  const result = await request<{ songs: Song[] }>('/songs', { signal });
  return result.songs.sort((a, b) => a.title.localeCompare(b.title));
}

export function uploadFile(key: string, file: File) {
  return request('/files/' + key, {
    method: 'PUT', body: file, headers: { 'Content-Type': 'application/octet-stream' },
  });
}

export async function publishSong(song: Song) {
  const result = await request<{ song: Song }>('/songs/' + song.id, {
    method: 'PUT', body: JSON.stringify(song), headers: { 'Content-Type': 'application/json' },
  });
  return result.song;
}
