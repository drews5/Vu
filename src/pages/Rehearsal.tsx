import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ChevronRight, CircleHelp, LibraryBig, LockKeyhole, Music2, Plus, Search, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { alumniSong, fetchSongs, readSetting, rehearsalCode, saveSetting, type Song } from '../rehearsal/catalog';
import { Player } from '../rehearsal/Player';
import '../styles/rehearsal.css';

const Upload = lazy(() => import('../rehearsal/Upload').then(module => ({ default: module.Upload })));
const rememberedKey = 'vu-rehearsal-access';

function hasAccess() {
  try { return sessionStorage.getItem(rememberedKey) === 'yes'; }
  catch { return false; }
}

function Password({ enter }: { enter: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (password.trim() !== rehearsalCode) { setError(true); return; }
    try { sessionStorage.setItem(rememberedKey, 'yes'); } catch { /* Allow this session to continue. */ }
    enter();
  }

  return <div className="vu-rehearsal-gate">
    <div className="vu-gate-card">
      <div className="vu-gate-icon"><LockKeyhole size={24} /></div>
      <h1>Rehearsal</h1>
      <form onSubmit={submit}>
        <label htmlFor="vu-rehearsal-code">Rehearsal password</label>
        <input id="vu-rehearsal-code" type="password" autoComplete="current-password" required
          value={password} onChange={event => { setPassword(event.target.value); setError(false); }}
          aria-invalid={error} aria-describedby={error ? 'vu-code-error' : undefined} />
        {error && <p className="vu-form-error" id="vu-code-error" role="alert">That password didn’t match.</p>}
        <button className="vu-primary">Open rehearsal room <ChevronRight size={18} /></button>
      </form>
      <Link to="/alumni/all-for-us" className="vu-text-button">Practicing All For Us? <ChevronRight size={16} /></Link>
    </div>
  </div>;
}

function SongList({ songs, selected, openSong, openUpload, close, loading, error, reload }: {
  songs: Song[];
  selected?: string;
  openSong: (id: string) => void;
  openUpload: () => void;
  close: () => void;
  loading: boolean;
  error: string;
  reload: () => void;
}) {
  const [search, setSearch] = useState('');
  const groups = Array.from(new Set(songs.map(song => song.collection))).sort((a, b) =>
    Number(b === 'Fall 2026') - Number(a === 'Fall 2026') || a.localeCompare(b));
  const normalized = search.trim().toLocaleLowerCase();
  const matches = songs.filter(song => song.title.toLocaleLowerCase().includes(normalized) ||
    song.collection.toLocaleLowerCase().includes(normalized));

  return <aside className="vu-song-list" aria-label="Song library">
    <div className="vu-list-heading"><h2>Songs</h2><button className="vu-icon vu-close-list" aria-label="Close song library" onClick={close}><X size={21} /></button></div>
    <label className="vu-song-search"><Search size={17} /><input aria-label="Find a song" placeholder="Find a song" value={search} onChange={event => setSearch(event.target.value)} /></label>
    <nav className="vu-song-groups" aria-label="Songs">
      {groups.map(collection => {
        const collectionSongs = matches.filter(song => song.collection === collection);
        return collectionSongs.length > 0 && <div className="vu-song-group" key={collection}>
          <h3>{collection}</h3>
          {collectionSongs.map(song => <button type="button" key={song.id} aria-current={selected === song.id ? 'true' : undefined} onClick={() => openSong(song.id)}>
            <Music2 size={17} /><span>{song.title}</span><ChevronRight size={16} />
          </button>)}
        </div>;
      })}
      {loading && <p role="status">Loading songs…</p>}
      {error && <div className="vu-list-error" role="alert"><p>{error}</p><button type="button" onClick={reload}>Try again</button></div>}
      {!matches.length && !loading && !error && <p>{normalized ? 'No songs match your search.' : 'No songs yet.'}</p>}
    </nav>
    <button className="vu-add-song" onClick={openUpload}><Plus size={19} /> Add song</button>
  </aside>;
}

function Workspace({ alumni }: { alumni: boolean }) {
  const [params, setParams] = useSearchParams();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(!alumni);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [upload, setUpload] = useState(false);
  const [mobileList, setMobileList] = useState(false);
  const [focus, setFocus] = useState(false);
  const [help, setHelp] = useState(false);
  const [preferredPart, setPreferredPart] = useState(() => readSetting('part', 'Full mix'));
  const helpDialog = useRef<HTMLDialogElement>(null);
  const listButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (alumni) return;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetchSongs(controller.signal).then(result => {
      if (!controller.signal.aborted) setSongs(result);
    }).catch(() => {
      if (!controller.signal.aborted) setError('Couldn’t load the song library.');
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [alumni, reload]);

  useEffect(() => { if (help) helpDialog.current?.showModal(); }, [help]);

  useEffect(() => {
    if (!focus && !mobileList) return;
    function exit(event: KeyboardEvent) {
      if (event.key !== 'Escape' || document.querySelector('dialog[open]')) return;
      setFocus(false);
      setMobileList(false);
    }
    window.addEventListener('keydown', exit);
    return () => window.removeEventListener('keydown', exit);
  }, [focus, mobileList]);

  const requested = params.get('song') ?? readSetting('last-song', '');
  const song = alumni ? alumniSong : songs.find(item => item.id === requested) ?? songs[0];
  const collections = ['Fall 2026', ...new Set(songs.map(item => item.collection).filter(name => name !== 'Fall 2026'))];

  function openSong(id: string) {
    saveSetting('last-song', id);
    setParams({ song: id }, { replace: false });
    if (mobileList) listButton.current?.focus();
    setMobileList(false);
  }

  function closeLibrary() {
    setMobileList(false);
    listButton.current?.focus();
  }

  return <>
    <header className="vu-rehearsal-bar">
      <Link to="/media" aria-label="Back to Vocal U Media" className="vu-rehearsal-brand">
        <img src="/favicon.png" alt="Vocal U" width={32} height={32} /><span>Rehearsal</span>
      </Link>
      <div>
        {!alumni && <button ref={listButton} className="vu-outline vu-show-list" aria-expanded={mobileList} onClick={() => setMobileList(!mobileList)}><LibraryBig size={17} /> Songs</button>}
        {alumni && <Link to="/rehearsal" className="vu-outline"><LockKeyhole size={16} /> <span>Song library</span></Link>}
        <button className="vu-icon" aria-label="Rehearsal help" title="Rehearsal help" onClick={() => setHelp(true)}><CircleHelp size={20} /></button>
      </div>
    </header>
    <div className="vu-rehearsal-workspace" data-alumni={alumni} data-focus={focus} data-list={mobileList}>
      {!alumni && <>
        {mobileList && <button type="button" className="vu-list-backdrop" onClick={closeLibrary} aria-label="Close songs" />}
        <SongList songs={songs} selected={song?.id} openSong={openSong} openUpload={() => { setMobileList(false); setUpload(true); }}
          close={closeLibrary} loading={loading} error={error} reload={() => setReload(value => value + 1)} />
      </>}
      {song ? <Player key={song.id} song={song} preferredPart={preferredPart} rememberPart={part => {
        setPreferredPart(part);
        saveSetting('part', part);
      }} focus={focus} toggleFocus={() => setFocus(!focus)} /> :
        <div className="vu-empty-song">
          <Music2 size={28} />
          <h1>Rehearsal</h1>
          {error ? <><p>{error}</p><button className="vu-outline" onClick={() => setReload(value => value + 1)}>Try again</button></> :
            loading ? <p role="status">Loading songs…</p> : <button className="vu-primary" onClick={() => setUpload(true)}><Plus size={17} /> Add a song</button>}
        </div>}
    </div>
    {upload && <Suspense fallback={<p className="vu-upload-loading" role="status">Opening upload…</p>}>
      <Upload collections={collections} close={() => setUpload(false)} published={newSong => {
        setSongs(previous => [...previous.filter(item => item.id !== newSong.id), newSong].sort((a, b) => a.title.localeCompare(b.title)));
        setUpload(false);
        openSong(newSong.id);
      }} />
    </Suspense>}
    {help && <dialog className="vu-help" ref={helpDialog} onCancel={event => { event.preventDefault(); setHelp(false); }} aria-labelledby="vu-help-title">
      <header><h2 id="vu-help-title">Practice controls</h2><button className="vu-icon" aria-label="Close help" onClick={() => setHelp(false)}><X size={21} /></button></header>
      <dl>
        <dt>Loop a section</dt><dd>Use the repeat button next to a section, enter a measure range, or set the loop points on the player.</dd>
        <dt>Follow the score</dt><dd>Pick your track to highlight your staff. Tap a measure or lyric to jump there. Scroll on your own, then tap Follow to return to the music.</dd>
        <dt>Practice options</dt><dd>Turn on a count-in, keep your staff highlighted while playing the full mix, or adjust timing if the score runs ahead.</dd>
        <dt>Bookmarks</dt><dd>Save an entrance and come back to it later on this device.</dd>
        <dt>Keyboard</dt><dd><kbd>Space</kbd> plays or pauses. <kbd>←</kbd> and <kbd>→</kbd> skip five seconds.</dd>
      </dl>
    </dialog>}
  </>;
}

export function Rehearsal({ alumni = false }: { alumni?: boolean }) {
  const [allowed, setAllowed] = useState(hasAccess);
  return <div className="vu-rehearsal">
    <Seo title={alumni ? 'All For Us | Vocal U' : 'Rehearsal | Vocal U'} path={alumni ? '/alumni/all-for-us' : '/rehearsal'}
      description={alumni ? 'All For Us tracks and sheet music for Vocal U alumni.' : 'Vocal U rehearsal tracks and sheet music.'} noindex />
    {allowed || alumni ? <Workspace alumni={alumni} /> : <>
      <header className="vu-rehearsal-bar">
        <Link to="/media" aria-label="Back to Vocal U Media" className="vu-rehearsal-brand"><img src="/favicon.png" alt="Vocal U" width={32} height={32} /><span>Rehearsal</span></Link>
        <Link className="vu-text-button" to="/media"><ArrowLeft size={16} /> Media</Link>
      </header>
      <Password enter={() => setAllowed(true)} />
    </>}
  </div>;
}
