import { getDocument, GlobalWorkerOptions, OPS, Util, type PDFPageProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { fileUrl, type MusicFile } from './catalog';
import type { Chart, ScoreSystem } from './chart';

GlobalWorkerOptions.workerSrc = workerUrl;

type Line = [x: number, y: number, endX: number, endY: number];
type Staff = { top: number; bottom: number; left: number; right: number; bars: number[] };
type TextItem = { text: string; x: number; y: number; width: number; size: number };
type Matrix = number[];

async function scoreLines(page: PDFPageProxy) {
  const view = page.getViewport({ scale: 1 });
  const { fnArray, argsArray } = await page.getOperatorList();
  const lines: Line[] = [];
  const stack: Matrix[] = [];
  let matrix = [...view.transform];
  let pending: Line[] = [];
  for (let i = 0; i < fnArray.length; i++) {
    const operation = fnArray[i];
    const args = argsArray[i];
    if (operation === OPS.save || operation === OPS.paintFormXObjectBegin) {
      stack.push(matrix);
      if (operation === OPS.paintFormXObjectBegin && args?.[0]?.length === 6) matrix = Util.transform(matrix, args[0]);
    } else if (operation === OPS.restore || operation === OPS.paintFormXObjectEnd) {
      matrix = stack.pop() ?? view.transform;
    } else if (operation === OPS.transform) {
      matrix = Util.transform(matrix, args);
    } else if (operation === OPS.constructPath) {
      let offset = 0;
      let x = 0;
      let y = 0;
      for (const command of args[0] as number[]) {
        const values = args[1];
        if (command === OPS.moveTo || command === OPS.lineTo) {
          const endX = values[offset++];
          const endY = values[offset++];
          if (command === OPS.lineTo) {
            const a = Util.applyTransform([x, y], matrix);
            const b = Util.applyTransform([endX, endY], matrix);
            if (Math.abs(a[0] - b[0]) < .25 || Math.abs(a[1] - b[1]) < .25) pending.push([a[0], a[1], b[0], b[1]]);
          }
          x = endX;
          y = endY;
        } else if (command === OPS.curveTo) { offset += 6; x = values[offset - 2]; y = values[offset - 1]; }
        else if (command === OPS.curveTo2 || command === OPS.curveTo3) { offset += 4; x = values[offset - 2]; y = values[offset - 1]; }
        else if (command === OPS.rectangle) offset += 4;
      }
    } else if ([OPS.stroke, OPS.closeStroke, OPS.fillStroke, OPS.eoFillStroke, OPS.closeFillStroke, OPS.closeEOFillStroke].includes(operation)) {
      for (const line of pending) lines.push(line);
      pending = [];
    } else if ([OPS.fill, OPS.eoFill, OPS.endPath].includes(operation)) {
      pending = [];
    }
    if (lines.length > 30000) break;
  }
  return { lines, view };
}

function systemsFromLines(lines: Line[], width: number, height: number) {
  const horizontal = new Map<number, [number, number][]>();
  const vertical: Line[] = [];
  for (const [x, y, endX, endY] of lines) {
    if (Math.abs(y - endY) < .2 && Math.abs(x - endX) > 9 && y > 35 && y < height - 30) {
      const level = Math.round(y * 10) / 10;
      const row = horizontal.get(level) ?? [];
      row.push([Math.min(x, endX), Math.max(x, endX)]);
      horizontal.set(level, row);
    }
    if (Math.abs(x - endX) < .2 && Math.abs(y - endY) > 9) vertical.push([x, Math.min(y, endY), x, Math.max(y, endY)]);
  }
  const rows: { y: number; left: number; right: number }[] = [];
  for (const [y, runs] of [...horizontal].sort(([a], [b]) => a - b)) {
    const merged: [number, number][] = [];
    for (const [a, b] of runs.sort(([x], [z]) => x - z)) {
      const previous = merged.at(-1);
      if (previous && a < previous[1] + 1.5) previous[1] = Math.max(previous[1], b);
      else merged.push([a, b]);
    }
    for (const [left, right] of merged) if (right - left > width * .63) rows.push({ y, left, right });
  }
  const staves: Staff[] = [];
  for (let i = 0; i + 4 < rows.length; i++) {
    const { y: top, left, right } = rows[i];
    const bottom = rows[i + 4].y;
    const space = (bottom - top) / 4;
    if (space < 2.2 || space > 7 || rows.slice(i, i + 5).some((row, n) => Math.abs(row.y - top - n * space) > .45)) continue;
    const bars = vertical.filter(([x, y, , endY]) => x > left + 11 && x < right + 3 && Math.abs(y - top) < 1.2 && endY > bottom - 1)
      .map(([x]) => x).sort((a, b) => a - b).filter((x, n, xs) => !n || x - xs[n - 1] > 6);
    if (!bars.length || right - bars.at(-1)! > 5) bars.push(right);
    else bars[bars.length - 1] = right;
    staves.push({ top, bottom, left, right, bars });
    i += 4;
  }
  const groups: Staff[][] = [];
  for (const staff of staves) {
    const previous = groups.at(-1)?.at(-1);
    const group = groups.at(-1);
    if (previous && group && Math.abs(previous.left - staff.left) < 2 && staff.top - previous.bottom < 105 &&
      (vertical.some(([x, top, , bottom]) => Math.abs(x - staff.left) < 4 &&
        (Math.abs(top - previous.top) < 1.5 && Math.abs(bottom - staff.top) < 1.5 ||
         Math.abs(top - group[0].top) < 1.5 && bottom >= staff.bottom - .5)) ||
       previous.bars.length === staff.bars.length && staff.top - previous.bottom < 80 &&
        previous.bars.every((x, i) => Math.abs(x - staff.bars[i]) < 2))) group.push(staff);
    else groups.push([staff]);
  }
  return groups;
}

const staffNames = new Map([
  ['solo', 'Solo'], ['lead', 'Solo'], ['soprano', 'Soprano'], ['sop', 'Soprano'], ['s', 'Soprano'],
  ['mezzo-soprano', 'Mezzo'], ['mezzo', 'Mezzo'], ['mzs', 'Mezzo'], ['mez', 'Mezzo'], ['m', 'Mezzo'],
  ['alto', 'Alto'], ['a', 'Alto'], ['tenor', 'Tenor'], ['t', 'Tenor'], ['bass', 'Bass'], ['b', 'Bass'],
  ['baritone', 'Baritone'], ['bar', 'Baritone'], ['br', 'Baritone'], ['bari', 'Baritone'],
  ['vp', 'Vocal percussion'], ['percussion', 'Vocal percussion'], ['perc', 'Vocal percussion'],
]);

function locate(items: TextItem[], staff: Staff, bounds: [number, number]) {
  return items.filter(item => item.x >= bounds[0] && item.x < bounds[1] &&
    item.y > staff.bottom + 2 && item.y < staff.bottom + (staff.bottom - staff.top) * 2.4 &&
    item.size > 4 && item.size < 15 && /\p{L}/u.test(item.text) && !/[\uE000-\uF8FF]/.test(item.text))
    .sort((a, b) => a.x - b.x);
}

export async function analyzePdf(file: MusicFile, audioDuration: number, source?: Chart): Promise<Chart | undefined> {
  const task = getDocument({ url: fileUrl(file.key), isEvalSupported: false });
  try {
    const document = await task.promise;
    if (document.numPages > 80) return;
    const systems: ScoreSystem[] = [];
    const lyrics: Chart['lyrics'] = {};
    const sections: Chart['sections'] = [[1, 'Opening']];
    const tempos: Chart['tempos'] = [];
    const meters = new Map<number, number>();
    let first = 1;
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const { lines, view } = await scoreLines(page);
      const content = await page.getTextContent();
      const items = content.items.flatMap(item => {
        if (!('str' in item) || !item.str.trim()) return [];
        const [x, y] = view.convertToViewportPoint(item.transform[4], item.transform[5]);
        return [{ text: item.str.trim(), x, y, width: item.width, size: item.height }];
      });
      const groups = systemsFromLines(lines, view.width, view.height);
      if (!groups.length) return;
      for (const group of groups) {
        const top = group[0].top;
        const left = group[0].left;
        const candidates = [...new Set(group.flatMap(staff => staff.bars.map(x => Math.round(x * 10) / 10)))].sort((a, b) => a - b);
        const bars: number[] = [];
        for (const x of candidates) {
          if (bars.length && x - bars.at(-1)! < 6) continue;
          if (group.filter(staff => staff.bars.some(bar => Math.abs(bar - x) < 1.5)).length >= Math.ceil(group.length * .55)) bars.push(x);
        }
        if (!bars.length) return;
        const x = [left, ...bars];
        const staffs: ScoreSystem['staffs'] = {};
        for (const [index, staff] of group.entries()) {
          const labels = items.filter(item => item.x < left && item.x + item.width < left + 5 && item.y >= staff.top - 3 && item.y < staff.bottom + 4)
            .map(item => staffNames.get(item.text.toLowerCase().replace(/\.$/, ''))).filter(Boolean);
          const part = labels[0] || (source?.parts.length === group.length ? source.parts[index] : undefined);
          if (!part) continue;
          staffs[part] = [(staff.top - 8) / view.height, (staff.bottom + 12) / view.height];
          for (let bar = 0; bar < bars.length; bar++) {
            const words = locate(items, staff, [x[bar] + 1, x[bar + 1] - 1]);
            const value = words.map(item => item.text).join(' ');
            if (value) (lyrics[part] ??= {})[first + bar] = value;
          }
        }
        const timeSignatures = items.filter(item => item.y >= top - 1 && item.y <= group[0].bottom + 3 &&
          item.x >= left && /^[-]{1,2}$/.test(item.text));
        for (const item of timeSignatures) {
          const digits = [...item.text].map(letter => letter.charCodeAt(0) - 0xe080);
          const denominator = digits[1] ?? timeSignatures.find(other =>
            other !== item && Math.abs(other.x - item.x) < 1 && other.y > item.y)?.text.charCodeAt(0);
          const base = denominator === undefined ? 0 : denominator > 9 ? denominator - 0xe080 : denominator;
          if (!digits[0] || ![2, 4, 8].includes(base)) continue;
          const bar = Math.max(0, x.findLastIndex(bound => bound <= item.x - 2));
          meters.set(first + bar, digits[0] * 4 / base);
        }
        for (const item of items) {
          if (item.y > top || item.y < top - 38 || item.x < left || item.x > x.at(-1)!) continue;
          const index = x.findLastIndex(bound => bound <= item.x - 2);
          const number = first + Math.min(Math.max(0, index), bars.length - 1);
          const bpm = item.text.match(/([\uECA0-\uECAF])?\s*=\s*(\d{2,3})/);
          if (bpm && Number(bpm[2]) >= 35 && Number(bpm[2]) <= 240) {
            const unit = bpm[1] === '\uECA3' ? 2 : bpm[1] === '\uECA7' ? .5 : 1;
            tempos.push([tempos.length ? number : 1, Number(bpm[2]) * unit]);
          }
          if (/^(Verse|Chorus|Bridge|Intro|Outro|Refrain|Pre-chorus)\b/i.test(item.text)) sections.push([number, item.text]);
        }
        systems.push({ page: pageNumber, first, x: x.map(value => value / view.width),
          y: [(top - 13) / view.height, Math.min(1, (group.at(-1)!.bottom + 24) / view.height)], staffs });
        first += bars.length;
        if (first > 500) return;
      }
    }
    if (source) return source.times.length === first ? { ...source, systems } : source;
    if (!tempos.length || first < 3 || !audioDuration) return;
    tempos.sort(([a], [b]) => a - b);
    const times = [0];
    let meter = 4;
    for (let measure = 1; measure < first; measure++) {
      meter = meters.get(measure) ?? meter;
      times.push(times.at(-1)! + 60 * meter / (tempos.findLast(([bar]) => bar <= measure)?.[1] || tempos[0][1]));
    }
    if (Math.abs(times.at(-1)! - audioDuration) > Math.max(7, audioDuration * .085)) return;
    const parts = [...new Set(systems.flatMap(system => Object.keys(system.staffs)))];
    return { file: file.name, parts, times, tempos, sections: [...new Map(sections.sort(([a], [b]) => a - b)).entries()],
      systems, lyrics, notes: {}, tracks: {}, quality: 'estimated' };
  } finally { await task.destroy(); }
}
