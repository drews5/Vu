import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Crosshair, Expand, LocateFixed, Minus, Plus, Shrink } from 'lucide-react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { ScoreTiming } from './scoreTiming';
import { fileUrl, formatTime, readSetting, saveSetting, type MusicFile } from './catalog';

GlobalWorkerOptions.workerSrc = workerUrl;

type PageProps = {
  pdf: PDFDocumentProxy;
  page: number;
  viewport: HTMLDivElement | null;
  register: (page: number, node: HTMLElement | null) => void;
};

function ScorePage({ pdf, page, viewport, register }: PageProps) {
  const [visible, setVisible] = useState(page === 1);
  const [aspect, setAspect] = useState(612 / 792);
  const [failed, setFailed] = useState(false);
  const node = useRef<HTMLElement | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const bind = useCallback((element: HTMLElement | null) => {
    node.current = element;
    register(page, element);
  }, [page, register]);

  useEffect(() => {
    if (!viewport || !node.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      root: viewport, rootMargin: '1000px 0px',
    });
    observer.observe(node.current);
    return () => observer.disconnect();
  }, [viewport]);

  useEffect(() => {
    if (!visible || !canvas.current || !node.current) return;
    let cancel: (() => void) | undefined;
    let alive = true;
    let width = 0;
    const element = node.current;
    const output = canvas.current;

    async function draw() {
      const nextWidth = element.clientWidth;
      if (nextWidth < 1 || nextWidth === width) return;
      width = nextWidth;
      cancel?.();
      const pageData = await pdf.getPage(page);
      if (!alive || width !== nextWidth) return;
      const natural = pageData.getViewport({ scale: 1 });
      setAspect(natural.width / natural.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const view = pageData.getViewport({ scale: width * pixelRatio / natural.width });
      const context = output.getContext('2d');
      if (!context) return;
      output.width = Math.ceil(view.width);
      output.height = Math.ceil(view.height);
      const render = pageData.render({ canvasContext: context, viewport: view });
      cancel = () => render.cancel();
      try { await render.promise; }
      catch (error) {
        if (alive && (!(error instanceof Error) || error.name !== 'RenderingCancelledException')) setFailed(true);
      }
    }

    const update = () => { draw().catch(() => { if (alive) setFailed(true); }); };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => {
      alive = false;
      cancel?.();
      observer.disconnect();
    };
  }, [pdf, page, visible]);

  return (
    <figure className="vu-score-page" ref={bind} style={{ aspectRatio: aspect }} aria-label={'Score page ' + page}>
      {failed ? <p className="vu-score-message">Page {page} could not load.</p> :
        visible && <canvas ref={canvas} aria-label={'Sheet music, page ' + page} role="img" />}
    </figure>
  );
}

type ScoreProps = {
  file: MusicFile;
  scores: MusicFile[];
  timing?: ScoreTiming;
  selectScore: (key: string) => void;
  currentTime: number;
  duration: number;
  seek: (seconds: number) => void;
  focus: boolean;
  toggleFocus: () => void;
};

const estimate = (page: number, pages: number, duration: number) => duration * (page - 1) / pages;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function Score({ file, scores, selectScore, currentTime, duration, seek, focus, toggleFocus, timing }: ScoreProps) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [failure, setFailure] = useState(false);
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [follow, setFollow] = useState(() => readSetting('follow-score', true));
  const [syncOpen, setSyncOpen] = useState(false);
  const [manual, setManual] = useState<Record<number, number>>(() => readSetting('cues:' + file.key, {}));
  const nodes = useRef(new Map<number, HTMLElement>());
  const jumping = useRef(false);
  const scrollTimer = useRef<number | undefined>();
  const previousFollow = useRef(1);
  const [offset, setOffset] = useState(() => readSetting('offset:' + file.key, 0));

  useEffect(() => {
    const task = getDocument({ url: fileUrl(file.key), isEvalSupported: false });
    let alive = true;
    task.promise.then(result => { if (alive) setPdf(result); }).catch(() => { if (alive) setFailure(true); });
    return () => { alive = false; void task.destroy(); };
  }, [file.key]);

  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);

  const count = pdf?.numPages ?? 0;
  const baseCue = (number: number) => {
    const measure = timing?.pages[number - 1];
    const source = measure ? timing?.measures[measure - 1] : file.cues?.[number - 1];
    const base = typeof source === 'number' && (duration <= 0 || source < duration) ? source : estimate(number, count, duration);
    return clamp(base + offset, 0, duration || Infinity);
  };
  const cue = (number: number) => {
    if (manual[number] !== undefined) return manual[number];
    const entries = Object.entries(manual).map(([index, seconds]) => [Number(index), seconds]);
    const before = entries.filter(([index]) => index < number).at(-1);
    const after = entries.find(([index]) => index > number);
    const [left, leftTime] = before ?? [1, baseCue(1)];
    const [right, rightTime] = after ?? [count + 1, duration];
    const leftBase = baseCue(left);
    const span = (right === count + 1 ? duration : baseCue(right)) - leftBase;
    const fraction = span > 0 ? (baseCue(number) - leftBase) / span : (number - left) / (right - left);
    return leftTime + clamp(fraction, 0, 1) * (rightTime - leftTime);
  };
  let active = 1;
  for (let candidate = 2; candidate <= count && currentTime >= cue(candidate); candidate++) active = candidate;

  const register = useCallback((number: number, element: HTMLElement | null) => {
    if (element) nodes.current.set(number, element);
    else nodes.current.delete(number);
  }, []);

  const goTo = useCallback((target: number) => {
    const node = nodes.current.get(target);
    if (!node || !viewport) return;
    jumping.current = true;
    const top = node.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop;
    viewport.scrollTo({ top, behavior: 'instant' });
    setPage(target);
    window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => { jumping.current = false; }, 100);
  }, [viewport]);

  const activeStart = count ? cue(active) : 0;
  const activeEnd = active < count ? cue(active + 1) : duration;
  const withinPage = clamp((currentTime - activeStart) / Math.max(0.1, activeEnd - activeStart), 0, 1);
  let measure = timing?.pages[active - 1];
  if (measure !== undefined && timing) {
    const first = measure - 1;
    const next = (timing.pages[active] ?? timing.measures.length + 1) - 1;
    const from = timing.measures[first];
    const to = timing.measures[next] ?? activeEnd;
    const time = from + withinPage * Math.max(0, to - from);
    for (let i = first + 1; i < next && timing.measures[i] <= time; i++) measure = i + 1;
  }

  useEffect(() => {
    if (!follow || !duration || !viewport || !count) return;
    const element = nodes.current.get(active);
    if (!element) return;
    const top = element.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop;
    const scrollable = Math.max(0, element.offsetHeight - viewport.clientHeight + 24);
    const progress = Math.max(0, (withinPage - 0.14) / 0.86);
    const target = top + progress * scrollable;
    if (Math.abs(target - viewport.scrollTop) > 1) {
      jumping.current = true;
      const pageChanged = previousFollow.current !== active;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      viewport.scrollTo({ top: target, behavior: pageChanged && !reducedMotion ? 'smooth' : 'instant' });
      window.clearTimeout(scrollTimer.current);
      scrollTimer.current = window.setTimeout(() => { jumping.current = false; }, pageChanged ? 320 : 70);
    }
    previousFollow.current = active;
    setPage(active);
  }, [follow, duration, active, count, withinPage, viewport, zoom]);

  function changeFollow(next: boolean) {
    setFollow(next);
    saveSetting('follow-score', next);
  }

  function browse(target: number) {
    changeFollow(false);
    goTo(clamp(target, 1, count));
  }

  function onScroll() {
    if (!viewport || jumping.current) return;
    const top = viewport.scrollTop + Math.min(140, viewport.clientHeight * 0.3);
    let closest = 1;
    for (const [number, element] of nodes.current) {
      if (element.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop > top) break;
      closest = number;
    }
    setPage(closest);
  }

  const sortedCues = Object.entries(manual).map(([number, time]) => [Number(number), time]);
  const canMark = duration > 0 && (page === 1 || currentTime > 0) &&
    sortedCues.every(([number, time]) => number === page || (number < page ? time < currentTime : time > currentTime));
  function setMark() {
    const next = { ...manual, [page]: Math.round(currentTime * 100) / 100 };
    setManual(next);
    saveSetting('cues:' + file.key, next);
  }
  function adjustOffset(delta: number) {
    const next = offset + delta;
    setOffset(next);
    saveSetting('offset:' + file.key, next);
  }
  function resetSync() {
    setManual({});
    setOffset(0);
    saveSetting('cues:' + file.key, {});
    saveSetting('offset:' + file.key, 0);
  }

  return (
    <section className="vu-score" aria-label="Sheet music">
      <div className="vu-score-toolbar">
        {scores.length > 1 ?
          <select aria-label="Score version" value={file.key} onChange={event => selectScore(event.target.value)}>
            {scores.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select> : <span className="vu-score-label">Score</span>}
        <div className="vu-score-actions">
          <div className="vu-page-controls" aria-label="Score pages">
            <button title="Previous page" aria-label="Previous page" onClick={() => browse(page - 1)} disabled={page <= 1}><ChevronLeft /></button>
            {count ? <select aria-label="Score page" value={page} onChange={event => browse(Number(event.target.value))}>
              {Array.from({ length: count }, (_, index) => <option key={index} value={index + 1}>{index + 1} / {count}</option>)}
            </select> : <span>—</span>}
            <button title="Next page" aria-label="Next page" onClick={() => browse(page + 1)} disabled={!count || page >= count}><ChevronRight /></button>
          </div>
          <div className="vu-zoom" aria-label="Score zoom">
            <button aria-label="Zoom out" title="Zoom out" onClick={() => setZoom(value => value - 20)} disabled={zoom <= 60}><Minus /></button>
            <button aria-label="Fit score to width" title="Fit to width" onClick={() => setZoom(100)}>{zoom}%</button>
            <button aria-label="Zoom in" title="Zoom in" onClick={() => setZoom(value => value + 20)} disabled={zoom >= 200}><Plus /></button>
          </div>
          {measure !== undefined && follow && <span className="vu-measure" title="Current measure">m. {measure}</span>}
          <button className="vu-follow" aria-pressed={follow} onClick={() => changeFollow(!follow)} title="Follow audio" aria-label="Follow audio"><LocateFixed /><span>Follow</span></button>
          <button aria-label="Adjust score timing" title="Adjust score timing" aria-expanded={syncOpen} onClick={() => setSyncOpen(!syncOpen)}><Crosshair /></button>
          <button aria-label={focus ? 'Exit focus mode' : 'Focus on score'} title={focus ? 'Exit focus mode' : 'Focus on score'} onClick={toggleFocus}>
            {focus ? <Shrink /> : <Expand />}
          </button>
        </div>
      </div>
      {syncOpen && <div className="vu-sync">
        <p>{timing ? "Page turns use the score’s tempo." : "Page turns are estimated."} To adjust one, go to that page and pause at its first note.</p>
        <div>
          <button onClick={setMark} disabled={!canMark}>Set page {page} at {formatTime(currentTime)}</button>
          <button onClick={() => seek(cue(page))} disabled={!duration}>Playhead to page {page}</button>
          <button aria-label="Move turns one second earlier" onClick={() => adjustOffset(-1)}>−1s</button>
          <span>{offset > 0 ? '+' : ''}{offset}s offset</span>
          <button aria-label="Move turns one second later" onClick={() => adjustOffset(1)}>+1s</button>
          <button onClick={resetSync} disabled={!offset && !sortedCues.length}>Reset timing</button>
        </div>
      </div>}
      <div className="vu-score-viewport" ref={setViewport} onScroll={onScroll}
        onWheel={event => { if (!event.ctrlKey && event.deltaY && follow) changeFollow(false); }}
        onTouchMove={() => { if (follow) changeFollow(false); }}
        onKeyDown={event => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key) && follow) changeFollow(false); }}
        tabIndex={0} aria-label="Scroll through score">
        {!count && <p className="vu-score-message" role="status">{failure ? <>Couldn’t load the score. <a href={fileUrl(file.key)} target="_blank" rel="noreferrer">Open PDF</a></> : 'Loading score…'}</p>}
        {pdf && <div className="vu-score-paper" style={{ '--score-zoom': zoom / 100 } as React.CSSProperties}>
          {Array.from({ length: count }, (_, index) => <ScorePage key={index} page={index + 1} pdf={pdf} viewport={viewport} register={register} />)}
        </div>}
      </div>
    </section>
  );
}
