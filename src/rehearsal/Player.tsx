import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AudioLines, Bookmark, ChevronDown, Download, FileText, Pause, Play, Repeat2, RotateCcw, RotateCw, SlidersHorizontal, X } from 'lucide-react';
import { chartPart, loadChart, measureAt, sectionAt, tempoAt, type Chart } from './chart';
import { PracticeGuide } from './PracticeGuide';
import { pitchNames, playPitch } from './pitch';
import { fileUrl, formatTime, partNames, readSetting, saveSetting, sortTracks, type MusicFile, type Song } from './catalog';

const Score = lazy(() => import('./Score').then(module => ({ default: module.Score })));
const PartScore = lazy(() => import('./PartScore').then(module => ({ default: module.PartScore })));
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
  const [referenceDuration, setReferenceDuration] = useState(0);
  const [focusMeasure, setFocusMeasure] = useState(false);
  const [error, setError] = useState('');
  const [loop, setLoop] = useState<{ a: number | null; b: number | null; enabled: boolean }>(emptyLoop);
  const [loopOpen, setLoopOpen] = useState(false);
  const [marksOpen, setMarksOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<{ time: number; label: string }[]>(() => readSetting('bookmarks:' + song.id, []));
  const [extras, setExtras] = useState(false);
  const [chart, setChart] = useState<Chart>();
  const [mode, setMode] = useState<'score' | 'part' | 'lyrics' | 'measures'>();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [highlight, setHighlight] = useState(() => readSetting('highlight-part', true));
  const [pinPart, setPinPart] = useState(() => readSetting('score-part:' + song.id, ''));
  const [syncOffset, setSyncOffset] = useState(() => readSetting('sync:' + song.id, 0));
  const [countIn, setCountIn] = useState(() => readSetting('count-in', false));
  const [countdown, setCountdown] = useState<number>();
  const timer = useRef<number>();
  const clicks = useRef<OscillatorNode[]>([]);
  const sound = useRef<AudioContext>();
  const loopRef = useRef(loop);
  loopRef.current = loop;
  const filesMenu = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const resume = useRef(time);
  const lastPosition = useRef(time);
  const resumePlaying = useRef(false);
  const currentTrack = useRef(track);

  const trackTiming = (file: MusicFile) => chart?.tracks[file.name] ?? [file.tempo, 0];
  const [trackTempo, trackOffset] = trackTiming(track);
  const toScore = (time: number, file = track) => {
    const [tempo, offset] = trackTiming(file);
    return Math.max(0, (time - offset) * tempo - syncOffset);
  };
  const toTrack = (time: number) => Math.max(0, (time + syncOffset) / trackTempo + trackOffset);
  const scoreTime = toScore(time);
  const scoreDuration = toScore(duration);
  const measure = chart ? measureAt(chart.times, scoreTime + .008) : 1;
  const tempo = chart ? tempoAt(chart, measure) : undefined;
  const section = chart && sectionAt(chart, measure)?.[1];
  const part = chart && (chartPart(pinPart, chart.parts) || chartPart(track.label, chart.parts) || chartPart(preferredPart, chart.parts));
  const hasParts = Boolean(chart && Object.values(chart.notes).some(notes => notes.length));
  const displayMode = mode ?? (hasParts && !chart?.systems.length ? 'part' : 'score');
  const notationParts = chart?.parts.filter(name => chart.notes[name]?.length) ?? [];
  const notationPart = chartPart(part ?? '', notationParts) || notationParts.find(name => /solo/i.test(name)) || notationParts[0];
  const nextNote = chart && notationPart && chart.notes[notationPart]?.find(([bar, beat]) => bar > measure ||
    bar === measure && chart.times[bar - 1] + beat * 60 / (tempo ?? 120) >= scoreTime - .04);

  useEffect(() => {
    setChart(undefined);
    setMode(undefined);
  }, [song.id, score?.key]);

  useEffect(() => {
    let active = true;
    loadChart(song, score, referenceDuration).then(value => { if (active) setChart(value); }).catch(() => {});
    return () => { active = false; };
  }, [song, score, referenceDuration]);

  useEffect(() => () => {
    window.clearInterval(timer.current);
    if (sound.current?.state !== 'closed') void sound.current?.close().catch(() => {});
  }, []);

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

  function updateTime(value: number) {
    setTime(value);
    lastPosition.current = toScore(value);
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

  function stopCount() {
    for (const click of clicks.current) {
      try { click.stop(); } catch { /* The click has already played. */ }
    }
    clicks.current = [];
    window.clearInterval(timer.current);
    timer.current = undefined;
    setCountdown(undefined);
  }

  function getSound() {
    if (!window.AudioContext) return undefined;
    try {
      if (!sound.current || sound.current.state === 'closed') sound.current = new AudioContext();
      const context = sound.current;
      if (context.state === 'suspended') void context.resume().catch(() => {});
      return context;
    } catch { return undefined; }
  }

  function startCount(from: number) {
    const context = getSound();
    const countTempo = chart ? tempoAt(chart, measureAt(chart.times, from + .008)) : 120;
    const interval = 60000 / (countTempo * rate * trackTempo);
    let beats = 4;
    setCountdown(beats);
    if (context) {
      for (let i = 0; i < 4; i++) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime + i * interval / 1000;
        oscillator.frequency.value = i === 0 ? 950 : 680;
        gain.gain.setValueAtTime(.12, start);
        gain.gain.exponentialRampToValueAtTime(.001, start + .08);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + .085);
        clicks.current.push(oscillator);
      }
    }
    timer.current = window.setInterval(() => {
      beats--;
      if (beats) setCountdown(beats);
      else { stopCount(); play(); }
    }, interval);
  }

  function togglePlay() {
    if (countdown !== undefined) { stopCount(); return; }
    if (audio.current?.paused) {
      let from = scoreTime;
      if (audio.current.ended) { from = 0; seek(0); }
      if (loop.enabled && loop.a !== null && loop.b !== null && (from < loop.a || from >= loop.b)) {
        from = loop.a;
        seek(toTrack(from));
      }
      if (countIn) startCount(from);
      else play();
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
    stopCount();
    const player = audio.current;
    const previous = currentTrack.current;
    resume.current = player && player.readyState >= 1 ? toScore(player.currentTime, previous) : lastPosition.current;
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
    if (next.label !== 'Full mix' && partNames.includes(next.label)) rememberPart(next.label);
  }

  function loaded() {
    const player = audio.current;
    if (!player || !Number.isFinite(player.duration)) return;
    setDuration(player.duration);
    setReferenceDuration(prior => prior || player.duration * track.tempo);
    player.playbackRate = rate;
    const next = resume.current < 0 ? -resume.current * player.duration : toTrack(resume.current);
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
    const { a, b, enabled } = loopRef.current;
    if (player && enabled && a !== null && b !== null && toScore(player.currentTime) >= b) {
      player.currentTime = toTrack(a);
    }
  }

  useEffect(() => {
    if (!playing || !loop.enabled) return;
    let frame: number;
    const watch = () => { checkLoop(); frame = requestAnimationFrame(watch); };
    frame = requestAnimationFrame(watch);
    return () => cancelAnimationFrame(frame);
  }, [playing, loop.enabled, trackTempo, trackOffset, syncOffset]);

  function markLoopPoint() {
    if (loop.a === null || loop.b !== null) setLoop({ a: scoreTime, b: null, enabled: false });
    else if (Math.abs(scoreTime - loop.a) >= 0.4) {
      const a = Math.min(loop.a, scoreTime);
      const b = Math.max(loop.a, scoreTime);
      setLoop({ a, b, enabled: true });
      seek(toTrack(a));
    }
  }

  function seekScore(seconds: number) {
    stopCount();
    if (loop.enabled && loop.a !== null && loop.b !== null && (seconds < loop.a || seconds >= loop.b)) {
      loopRef.current = { ...loop, enabled: false };
      setLoop(loopRef.current);
    }
    seek(toTrack(seconds));
  }

  function seekMeasure(number: number) {
    if (chart) seekScore(chart.times[number - 1]);
  }

  function practiceRange(start: number, end: number) {
    if (end <= start || !duration) return;
    stopCount();
    loopRef.current = { a: start, b: end, enabled: true };
    setLoop(loopRef.current);
    setLoopOpen(true);
    setMarksOpen(false);
    setToolsOpen(false);
    seek(toTrack(start));
  }

  function chooseScorePart(part: string) {
    setPinPart(part);
    saveSetting('score-part:' + song.id, part);
  }

  function adjustSync(amount: number) {
    setSyncOffset(amount);
    saveSetting('sync:' + song.id, amount);
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
  const loopStart = loop.a !== null && duration ? toTrack(loop.a) / duration * 100 : 0;
  const loopEnd = loop.b !== null && duration ? Math.min(100, toTrack(loop.b) / duration * 100) : 0;

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
          if (loop.enabled && loop.a !== null && loop.b !== null) { seek(toTrack(loop.a)); play(); }
          else { setPlaying(false); lastPosition.current = 0; }
        }}
        onError={() => { setError('This track couldn’t load. Try another track or reload it.'); setLoading(false); setPlaying(false); }}
      />
      {chart && <div className="vu-view-bar">
        <div className="vu-view-tabs" role="group" aria-label="Practice view">
          {(score && chart.systems.length > 0 || !hasParts) && <button aria-pressed={displayMode === 'score'} onClick={() => setMode('score')}>Score</button>}
          {hasParts && <button aria-pressed={displayMode === 'part'} onClick={() => setMode('part')}>Part score</button>}
          <button aria-pressed={displayMode === 'lyrics'} onClick={() => setMode('lyrics')}>Lyrics</button>
          <button aria-pressed={displayMode === 'measures'} onClick={() => { setMode('measures'); setFocusMeasure(false); }}>Measures</button>
        </div>
        <div className="vu-position" aria-label="Score position">
          <span className="vu-position-section">{section}</span><button type="button" className="vu-position-measure" title="Go to measure" onClick={() => { setMode('measures'); setFocusMeasure(true); }}>m. {measure}</button>
          {tempo && <span title={chart.quality === 'estimated' ? 'Estimated alignment' : 'Score tempo'}>{chart.quality === 'estimated' ? '~' : ''}{tempo} BPM</span>}
        </div>
      </div>}
      {chart && (displayMode === 'lyrics' || displayMode === 'measures') ?
        <PracticeGuide key={displayMode} chart={chart} measure={measure} selectedPart={part || track.label} showLyrics={displayMode === 'lyrics'} focusMeasure={focusMeasure}
          seek={seekScore} setLoop={practiceRange} />
        : chart && displayMode === 'part' && notationPart ?
          <Suspense fallback={<div className="vu-empty-score">Loading part…</div>}>
            <div className="vu-notation-tools">
              <label>Part <select value={notationPart} onChange={event => chooseScorePart(event.target.value)}>
                {chart.parts.filter(name => chart.notes[name]?.length).map(name => <option key={name}>{name}</option>)}
              </select></label>
              {pinPart && <button className="vu-text-button" onClick={() => chooseScorePart('')}>Match track</button>}
            </div>
            <PartScore chart={chart} part={notationPart} measure={measure} seek={seekScore} />
          </Suspense>
        : score ? <Suspense fallback={<div className="vu-empty-score" role="status">Loading score…</div>}>
          <Score key={score.key} file={score} scores={scores} selectScore={key => {
            const next = scores.find(file => file.key === key);
            if (next) setScore(next);
          }} chart={chart} part={part} measure={measure} highlight={highlight} seekMeasure={seekMeasure}
            currentTime={scoreTime} duration={scoreDuration} seek={seekScore}
            focus={focus} toggleFocus={toggleFocus} />
        </Suspense> : <div className="vu-empty-score"><FileText size={24} /><p>No score for this song.</p></div>}
      <div className="vu-transport" aria-label="Audio playback">
        {toolsOpen && <div className="vu-transport-panel vu-practice-options">
          <button aria-pressed={countIn} onClick={() => { setCountIn(!countIn); saveSetting('count-in', !countIn); }}>4-beat count-in</button>
          {chart?.systems.length ? <button aria-pressed={highlight} onClick={() => { setHighlight(!highlight); saveSetting('highlight-part', !highlight); }}>Highlight part</button> : null}
          {chart && <label>Score part <select value={pinPart} onChange={event => chooseScorePart(event.target.value)}>
            <option value="">Match track</option>{chart.parts.map(name => <option key={name}>{name}</option>)}
          </select></label>}
          {nextNote && <button onClick={() => {
            const context = getSound();
            if (context) playPitch(nextNote[3], context);
          }}>Play pitch · {pitchNames[nextNote[3] % 12]}{Math.floor(nextNote[3] / 12) - 1}</button>}
          {chart && <div className="vu-sync-adjust">
            <button aria-label="Move score cues earlier" onClick={() => adjustSync(Math.round((syncOffset - .25) * 100) / 100)}>−.25s</button>
            <span title={chart.quality === 'estimated' ? 'Estimated score alignment' : 'Score alignment'}>{syncOffset > 0 ? '+' : ''}{syncOffset}s sync</span>
            <button aria-label="Move score cues later" onClick={() => adjustSync(Math.round((syncOffset + .25) * 100) / 100)}>+.25s</button>
            {syncOffset !== 0 && <button onClick={() => adjustSync(0)}>Reset</button>}
          </div>}
        </div>}
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
            <button onClick={() => seek(toTrack(mark.time))}>{mark.label}</button>
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
            <button className="vu-play" aria-label={countdown !== undefined ? 'Cancel count-in' : playing ? 'Pause' : 'Play'} title={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
              {countdown !== undefined ? <strong>{countdown}</strong> : loading && playing ? <span className="vu-spinner" aria-label="Buffering" /> : playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>
            <button className="vu-skip" aria-label="Forward five seconds" title="Forward five seconds" onClick={() => seek(time + 5)}><RotateCw /><span>5</span></button>
          </div>
          <div className="vu-play-tools">
            <button aria-label="Loop a section" title="Loop a section" aria-expanded={loopOpen} aria-pressed={loop.enabled} onClick={() => { setLoopOpen(!loopOpen); setMarksOpen(false); setToolsOpen(false); }}><Repeat2 size={19} /><span>Loop</span></button>
            <button aria-label="Bookmarks" title="Bookmarks" aria-expanded={marksOpen} onClick={() => { setMarksOpen(!marksOpen); setLoopOpen(false); setToolsOpen(false); }}><Bookmark size={18} /></button>
            <button aria-label="Practice options" title="Practice options" aria-expanded={toolsOpen} onClick={() => { setToolsOpen(!toolsOpen); setLoopOpen(false); setMarksOpen(false); }}><SlidersHorizontal size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
