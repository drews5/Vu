import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AudioLines, Bookmark, ChevronDown, Download, FileText, Pause, Play, Repeat2, RotateCcw, RotateCw, X } from 'lucide-react';
import { scoreTiming } from './scoreTiming';
import { fileUrl, formatTime, partNames, readSetting, saveSetting, sortTracks, type MusicFile, type Song } from './catalog';

const Score = lazy(() => import('./Score').then(module => ({ default: module.Score })));
const rates = [1, 0.9, 0.8, 0.75, 0.65, 0.5];
const emptyLoop = { a: null, b: null, enabled: false };
const cap = (value: number, duration: number) => Math.min(Math.max(0, value), duration || Infinity);

export function Player({ song, preferredPart, rememberPart, focus, toggleFocus }: {
  song: Song;
  preferredPart: string;
  rememberPart: (part: string) => void;
  focus: boolean;
  toggleFocus: () => void;
}) {
  const regular = song.files.filter(file => file.kind === 'audio' && !file.variant && file.tempo === 1).sort(sortTracks);
  const slowed = song.files.filter(file => file.kind === 'audio' && !file.variant && file.tempo < 1).sort(sortTracks);
  const guides = song.files.filter(file => file.kind === 'audio' && file.variant && file.label !== 'Faster reference');
  const scores = song.files.filter(file => file.kind === 'score');
  const tracks = [...regular, ...slowed, ...guides];
  const initialTrack = regular.find(file => file.label === preferredPart) ?? regular[0] ?? slowed[0] ?? guides[0];
  const [track, setTrack] = useState(initialTrack);
  const [score, setScore] = useState(scores[0]);
  const [rate, setRate] = useState(() => readSetting('speed', 1));
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(() => Math.max(0, readSetting('time:' + song.id, 0)));
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [loop, setLoop] = useState<{ a: number | null; b: number | null; enabled: boolean }>(emptyLoop);
  const [loopOpen, setLoopOpen] = useState(false);
  const [marksOpen, setMarksOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<{ time: number; label: string }[]>(() => readSetting('bookmarks:' + song.id, []));
  const [extras, setExtras] = useState(false);
  const filesMenu = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const resume = useRef(time);
  const lastPosition = useRef(time);
  const resumePlaying = useRef(false);
  const currentTrack = useRef(track);

  const trackTempo = track.tempo;
  const scoreTime = time * trackTempo;
  const scoreDuration = duration * trackTempo;

  useEffect(() => {
    if (!extras) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !filesMenu.current?.contains(event.target)) setExtras(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') setExtras(false);
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [extras]);

  useEffect(() => {
    if (audio.current) {
      audio.current.playbackRate = rate;
      audio.current.preservesPitch = true;
    }
  }, [rate, track]);

  useEffect(() => {
    const persist = () => saveSetting('time:' + song.id, lastPosition.current);
    const timer = window.setInterval(persist, 1500);
    window.addEventListener('pagehide', persist);
    return () => { clearInterval(timer); window.removeEventListener('pagehide', persist); persist(); };
  }, [song.id]);

  function updateTime(value: number, tempo = trackTempo) {
    setTime(value);
    lastPosition.current = value * tempo;
  }

  function seek(value: number) {
    const player = audio.current;
    if (!player || !Number.isFinite(player.duration)) return;
    const next = cap(value, player.duration);
    player.currentTime = next;
    updateTime(next);
  }

  function play() {
    setError('');
    audio.current?.play().catch((reason: unknown) => {
      if (reason instanceof Error && reason.name === 'AbortError') return;
      setError('Playback didn’t start. Tap play to retry.');
      setPlaying(false);
    });
  }

  function togglePlay() {
    if (audio.current?.paused) {
      if (audio.current.ended) seek(0);
      if (loop.enabled && loop.a !== null && loop.b !== null &&
          (scoreTime < loop.a || scoreTime >= loop.b)) seek(loop.a / trackTempo);
      play();
    } else audio.current?.pause();
  }

  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (event.altKey || event.metaKey || event.ctrlKey || event.defaultPrevented ||
          target?.closest('input, textarea, select, button, a, [contenteditable], .vu-score-viewport, dialog')) return;
      if (event.code === 'Space') { event.preventDefault(); togglePlay(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); seek((audio.current?.currentTime ?? 0) - 5); }
      if (event.key === 'ArrowRight') { event.preventDefault(); seek((audio.current?.currentTime ?? 0) + 5); }
    }
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  });

  function chooseTrack(next: MusicFile) {
    if (next.key === track.key) return;
    const player = audio.current;
    const previous = currentTrack.current;
    resume.current = player && player.readyState >= 1 ? player.currentTime * previous.tempo : lastPosition.current;
    if (previous.variant || next.variant) {
      const fraction = player?.duration ? player.currentTime / player.duration : 0;
      resume.current = -fraction;
      setLoop(emptyLoop);
    }
    resumePlaying.current = Boolean(player && !player.paused) || resumePlaying.current;
    currentTrack.current = next;
    setTrack(next);
    setError('');
    setLoading(false);
    if (partNames.includes(next.label)) rememberPart(next.label);
  }

  function loaded() {
    const player = audio.current;
    if (!player || !Number.isFinite(player.duration)) return;
    setDuration(player.duration);
    player.playbackRate = rate;
    const next = resume.current < 0 ? -resume.current * player.duration : resume.current / trackTempo;
    const position = next >= player.duration - 0.3 ? 0 : cap(next, player.duration);
    if (position) player.currentTime = position;
    updateTime(position);
    if (resumePlaying.current) {
      resumePlaying.current = false;
      play();
    }
  }

  function tick() {
    const player = audio.current;
    if (!player || player.readyState < 1 || currentTrack.current.key !== track.key) return;
    checkLoop();
    updateTime(player.currentTime);
  }

  function checkLoop() {
    const player = audio.current;
    if (player && loop.enabled && loop.a !== null && loop.b !== null && player.currentTime * trackTempo >= loop.b) {
      player.currentTime = loop.a / trackTempo;
    }
  }

  useEffect(() => {
    if (!playing || !loop.enabled) return;
    let frame: number;
    const watch = () => { checkLoop(); frame = requestAnimationFrame(watch); };
    frame = requestAnimationFrame(watch);
    return () => cancelAnimationFrame(frame);
  }, [playing, loop, trackTempo]);

  function markLoopPoint() {
    if (loop.a === null || loop.b !== null) setLoop({ a: scoreTime, b: null, enabled: false });
    else if (Math.abs(scoreTime - loop.a) >= 0.4) {
      const a = Math.min(loop.a, scoreTime);
      const b = Math.max(loop.a, scoreTime);
      setLoop({ a, b, enabled: true });
      seek(a / trackTempo);
    }
  }

  function addBookmark() {
    if (bookmarks.some(mark => Math.abs(mark.time - scoreTime) < 0.4)) return;
    const next = [...bookmarks, { time: scoreTime, label: formatTime(scoreTime) }].sort((a, b) => a.time - b.time);
    setBookmarks(next);
    saveSetting('bookmarks:' + song.id, next);
  }

  function deleteBookmark(target: number) {
    const next = bookmarks.filter(mark => mark.time !== target);
    setBookmarks(next);
    saveSetting('bookmarks:' + song.id, next);
  }

  const timeline = duration ? Math.min(100, time / duration * 100) : 0;
  const loopStart = loop.a !== null && scoreDuration ? loop.a / scoreDuration * 100 : 0;
  const loopEnd = loop.b !== null && scoreDuration ? loop.b / scoreDuration * 100 : 0;

  return (
    <div className="vu-song">
      <header className="vu-song-heading">
        <div>
          <p>{song.collection}</p>
          <h1>{song.title}</h1>
        </div>
        <div className="vu-files-menu" ref={filesMenu}>
          <button className="vu-text-button" aria-expanded={extras} onClick={() => setExtras(!extras)}><Download size={16} /> <span>Files</span> <ChevronDown size={14} /></button>
          {extras && <div className="vu-files">
            {song.files.map(file => <a key={file.key} href={fileUrl(file.key)} target="_blank" rel="noreferrer" download={file.name}>
              {file.kind === 'audio' ? <AudioLines size={15} /> : <FileText size={15} />}
              {file.label}{file.tempo < 1 ? ' · slow take' : ''}
            </a>)}
          </div>}
        </div>
      </header>
      <div className="vu-part-row">
        <label className="vu-select-track"><AudioLines size={17} /><span>Track</span>
          <select aria-label="Practice track" value={track.key} onChange={event => {
            const next = tracks.find(file => file.key === event.target.value);
            if (next) chooseTrack(next);
          }}>
            {regular.length > 0 && <optgroup label="Parts and mixes">{regular.map(file => <option key={file.key} value={file.key}>{file.label}</option>)}</optgroup>}
            {slowed.length > 0 && <optgroup label="Recorded slow takes">{slowed.map(file => <option key={file.key} value={file.key}>{file.label} · slow take</option>)}</optgroup>}
            {guides.length > 0 && <optgroup label="Other recordings">{guides.map(file => <option key={file.key} value={file.key}>{file.label}</option>)}</optgroup>}
          </select>
        </label>
        <div className="vu-quick-parts" aria-label="Switch parts">
          {regular.map(file => <button key={file.key} type="button" aria-pressed={file.key === track.key} onClick={() => chooseTrack(file)}>{file.label}</button>)}
        </div>
      </div>
      <audio ref={audio} src={fileUrl(track.key)} preload="metadata"
        onLoadedMetadata={loaded} onTimeUpdate={tick}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)} onPlaying={() => setLoading(false)}
        onEnded={() => {
          if (loop.enabled && loop.a !== null && loop.b !== null) { seek(loop.a / trackTempo); play(); }
          else { setPlaying(false); lastPosition.current = 0; }
        }}
        onError={() => { setError('This track couldn’t load. Try another track or reload it.'); setLoading(false); setPlaying(false); }}
      />
      {score ? <Suspense fallback={<div className="vu-empty-score" role="status">Loading score…</div>}>
        <Score key={score.key} file={score} scores={scores} selectScore={key => {
          const next = scores.find(file => file.key === key);
          if (next) setScore(next);
        }} timing={!track.variant && score.label === 'Full score' ? scoreTiming(song.title, score.name) : undefined} currentTime={scoreTime} duration={scoreDuration} seek={seconds => seek(seconds / trackTempo)} focus={focus} toggleFocus={toggleFocus} />
      </Suspense> : <div className="vu-empty-score"><FileText size={24} /><p>No score for this song.</p></div>}
      <div className="vu-transport" aria-label="Audio playback">
        {error && <div className="vu-player-error" role="alert">{error} <button onClick={() => audio.current?.load()}>Reload</button></div>}
        {loopOpen && <div className="vu-transport-panel">
          <button onClick={markLoopPoint} disabled={!duration || loop.a !== null && loop.b === null && Math.abs(scoreTime - loop.a) < 0.4}>
            {loop.a === null ? 'Set start' : loop.b === null ? 'Set end' : 'Set new start'}
          </button>
          <span>{loop.a === null ? 'Scrub to your start point' : 'A ' + formatTime(loop.a) + ' · B ' + (loop.b === null ? '—' : formatTime(loop.b))}</span>
          {loop.b !== null && <button aria-pressed={loop.enabled} onClick={() => setLoop({ ...loop, enabled: !loop.enabled })}>{loop.enabled ? 'On' : 'Off'}</button>}
          {loop.a !== null && <button onClick={() => setLoop(emptyLoop)}>Clear</button>}
        </div>}
        {marksOpen && <div className="vu-transport-panel vu-bookmarks">
          <button onClick={addBookmark} disabled={!duration}>Save {formatTime(scoreTime)}</button>
          {bookmarks.map(mark => <div key={mark.time}>
            <button onClick={() => seek(mark.time / trackTempo)}>{mark.label}</button>
            <button aria-label={'Remove bookmark at ' + mark.label} onClick={() => deleteBookmark(mark.time)}><X size={14} /></button>
          </div>)}
        </div>}
        <div className="vu-timeline">
          <span>{formatTime(time)}</span>
          <div className="vu-timeline-track">
            {loop.b !== null && <div className="vu-loop-range" style={{ left: loopStart + '%', width: (loopEnd - loopStart) + '%' }} />}
            <input aria-label="Playback position" aria-valuetext={formatTime(time)} type="range" min="0" max={duration || 1} step="0.05"
              disabled={!duration} value={Math.min(time, duration || 1)} onChange={event => seek(Number(event.target.value))}
              style={{ '--progress': timeline + '%' } as React.CSSProperties} />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="vu-transport-controls">
          <div className="vu-tempo">
            <select aria-label="Playback speed" value={rate} onChange={event => {
              const next = Number(event.target.value);
              setRate(next);
              saveSetting('speed', next);
            }}>
              {rates.map(value => <option key={value} value={value}>{value === 1 ? '1×' : value + '×'}</option>)}
            </select>
          </div>
          <div className="vu-play-group">
            <button className="vu-skip" aria-label="Back five seconds" title="Back five seconds" onClick={() => seek(time - 5)}><RotateCcw /><span>5</span></button>
            <button className="vu-play" aria-label={playing ? 'Pause' : 'Play'} title={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
              {loading && playing ? <span className="vu-spinner" aria-label="Buffering" /> : playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>
            <button className="vu-skip" aria-label="Forward five seconds" title="Forward five seconds" onClick={() => seek(time + 5)}><RotateCw /><span>5</span></button>
          </div>
          <div className="vu-play-tools">
            <button aria-label="Loop a section" title="Loop a section" aria-expanded={loopOpen} aria-pressed={loop.enabled} onClick={() => { setLoopOpen(!loopOpen); setMarksOpen(false); }}><Repeat2 size={19} /><span>Loop</span></button>
            <button aria-label="Bookmarks" title="Bookmarks" aria-expanded={marksOpen} onClick={() => { setMarksOpen(!marksOpen); setLoopOpen(false); }}><Bookmark size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
