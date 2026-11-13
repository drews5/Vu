import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Check, FileAudio, FileMusic, FileText, Plus, Upload as UploadIcon, X } from 'lucide-react';
import { unzip } from 'fflate';
import { inferLabel, publishSong, uploadFile, type MusicFile, type Song } from './catalog';

type DraftFile = { file: File; item: MusicFile; saved: boolean };
const extensions = ['mp3', 'm4a', 'wav', 'ogg', 'webm', 'flac', 'pdf', 'mscz', 'mscx'];
const fileLimit = 25 * 1024 * 1024;
const zipLimit = 150 * 1024 * 1024;
const inputAccept = [...extensions, 'zip'].map(ext => '.' + ext).join(',');

function extension(name: string) { return name.match(/\.([^.]+)$/)?.[1].toLowerCase() ?? ''; }
function cleanName(path: string) { return path.split(/[\\/]/).pop() ?? path; }
function visible(path: string) { return !path.split(/[\\/]/).some(part => part.startsWith('.') || part === '__MACOSX'); }
function collectZip(file: File): Promise<File[]> {
  return file.arrayBuffer().then(buffer => new Promise((resolve, reject) => {
    let total = 0;
    let count = 0;
    let limitError = '';
    unzip(new Uint8Array(buffer), {
      filter: entry => {
        if (!visible(entry.name) || !extensions.includes(extension(entry.name))) return false;
        total += entry.originalSize;
        count++;
        if (count > 48 || total > zipLimit || entry.originalSize > fileLimit) {
          limitError = 'Use a ZIP with up to 48 files, 25 MB per file, and 150 MB total.';
          return false;
        }
        return true;
      },
    }, (error, entries) => {
      if (error || limitError) reject(new Error(limitError || 'That ZIP could not be opened.'));
      else resolve(Object.entries(entries).map(([name, bytes]) => new File([new Uint8Array(bytes)], cleanName(name))));
    });
  }));
}

function Preview({ draft }: { draft: DraftFile }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const object = URL.createObjectURL(new Blob([draft.file], { type: draft.item.kind === 'score' ? 'application/pdf' : draft.file.type }));
    setUrl(object);
    return () => URL.revokeObjectURL(object);
  }, [draft]);
  if (!url) return null;
  return draft.item.kind === 'score' ?
    <a className="vu-text-button" href={url} target="_blank" rel="noreferrer">Open PDF preview</a> :
    <audio controls preload="metadata" src={url} aria-label={'Preview ' + draft.item.label} />;
}

export function Upload({ collections, close, published }: {
  collections: string[];
  close: () => void;
  published: (song: Song) => void;
}) {
  const [id] = useState(() => crypto.randomUUID());
  const [title, setTitle] = useState('');
  const [collection, setCollection] = useState(collections[0] || 'Fall 2026');
  const [files, setFiles] = useState<DraftFile[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState<string>();
  const [busy, setBusy] = useState<'reading' | 'publishing'>();
  const [uploaded, setUploaded] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => { dialog.current?.showModal(); }, []);

  async function addFiles(selected: File[]) {
    if (busy || !selected.length) return;
    setError('');
    setNotice('');
    setBusy('reading');
    try {
      const expanded: File[] = [];
      let skipped = 0;
      let guessedTitle = '';
      for (const file of selected) {
        if (!visible(file.webkitRelativePath || file.name)) continue;
        const ext = extension(file.name);
        if (ext === 'zip') {
          if (file.size > zipLimit) throw new Error('ZIP files must be 150 MB or smaller.');
          expanded.push(...await collectZip(file));
          guessedTitle ||= file.name.replace(/\.zip$/i, '');
        } else if (extensions.includes(ext)) {
          expanded.push(file);
          guessedTitle ||= file.webkitRelativePath.split('/').slice(0, -1)[0] || '';
        } else skipped++;
      }
      const added: DraftFile[] = [];
      let foundTitle = guessedTitle;
      let scores = files.filter(draft => draft.item.kind === 'score').length;
      for (const file of expanded) {
        if (!file.size || file.size > fileLimit) { skipped++; continue; }
        const ext = extension(file.name);
        const kind = ext === 'pdf' ? 'score' : ext.startsWith('msc') ? 'source' : 'audio';
        const name = file.name.slice(0, 180);
        const key = id + '/' + crypto.randomUUID() + '.' + ext;
        const label = kind === 'audio' ? inferLabel(name) : kind === 'score' ? scores++ ? 'Alternate score' : 'Full score' : 'MuseScore file';
        const tempo = 1;
        if (kind === 'score' && !foundTitle) foundTitle = name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');
        added.push({ file, saved: false, item: { key, name, kind, label: label.slice(0, 75), tempo } });
      }
      if (files.length + added.length > 48 || [...files, ...added].reduce((total, draft) => total + draft.file.size, 0) > zipLimit) {
        throw new Error('A song can have up to 48 files and 150 MB total.');
      }
      if (!added.length && !skipped) setError('No supported files found.');
      if (skipped) setNotice(skipped + ' file' + (skipped === 1 ? ' was' : 's were') + ' skipped. Check file types and the 25 MB limit.');
      if (!title && foundTitle) setTitle(foundTitle.slice(0, 100));
      setFiles([...files, ...added]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not read these files.');
    } finally {
      setBusy(undefined);
    }
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';
    void addFiles(selected);
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void addFiles(Array.from(event.dataTransfer.files));
  }

  function change(key: string, update: Partial<MusicFile>) {
    setFiles(rows => rows.map(draft => draft.item.key === key ? { ...draft, item: { ...draft.item, ...update } } : draft));
  }

  const valid = title.trim() && collection.trim() && files.every(draft => draft.item.label.trim()) &&
    files.some(draft => draft.item.kind === 'audio');

  async function publish() {
    if (!valid || busy) return;
    setBusy('publishing');
    setError('');
    const done = new Set(files.filter(draft => draft.saved).map(draft => draft.item.key));
    setUploaded(done.size);
    try {
      const pending = files.filter(draft => !draft.saved);
      for (let index = 0; index < pending.length; index += 3) {
        const batch = await Promise.allSettled(pending.slice(index, index + 3).map(async draft => {
          await uploadFile(draft.item.key, draft.file);
          done.add(draft.item.key);
          setUploaded(done.size);
        }));
        const failure = batch.find(result => result.status === 'rejected');
        if (failure?.status === 'rejected') throw failure.reason;
      }
      const song = await publishSong({ id, title: title.trim(), collection: collection.trim(), files: files.map(draft => draft.item) });
      published(song);
    } catch (reason) {
      setFiles(rows => rows.map(draft => ({ ...draft, saved: done.has(draft.item.key) })));
      setError(reason instanceof Error ? reason.message : 'Could not publish the song. Try again.');
    } finally {
      setBusy(undefined);
    }
  }

  return (
    <dialog className="vu-upload" ref={dialog} aria-labelledby="vu-upload-title" onCancel={event => {
      event.preventDefault();
      if (!busy) close();
    }}>
      <form onSubmit={event => { event.preventDefault(); void publish(); }}>
        <header>
          <h2 id="vu-upload-title">Add a song</h2>
          <button type="button" className="vu-icon" aria-label="Close upload" onClick={close} disabled={Boolean(busy)}><X size={22} /></button>
        </header>
        <div className="vu-upload-body">
          <div className="vu-upload-meta">
            <label>Song title<input placeholder="Song title" required value={title} maxLength={100} disabled={Boolean(busy)} onChange={event => setTitle(event.target.value)} /></label>
            <label>Collection<input list="vu-collections" required value={collection} maxLength={60} disabled={Boolean(busy)} onChange={event => setCollection(event.target.value)} />
              <datalist id="vu-collections">{collections.map(name => <option key={name} value={name} />)}</datalist>
            </label>
          </div>
          <div className="vu-drop" data-active={dragging} onDrop={drop}
            onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}>
            <div className="vu-drop-icon"><UploadIcon size={23} /></div>
            <div><strong>Drop tracks, scores, or a ZIP</strong><p>Audio, PDF, or MuseScore · 25 MB per file</p></div>
            <div className="vu-drop-actions">
              <button type="button" className="vu-outline" onClick={() => fileInput.current?.click()} disabled={Boolean(busy)}><Plus size={16} /> Files</button>
              <button type="button" className="vu-outline" onClick={() => folderInput.current?.click()} disabled={Boolean(busy)}>Folder</button>
            </div>
            <input hidden type="file" accept={inputAccept} multiple ref={fileInput} onChange={onInput} />
            <input hidden type="file" multiple ref={node => { folderInput.current = node; node?.setAttribute('webkitdirectory', ''); }} onChange={onInput} />
          </div>
          {busy === 'reading' && <p role="status">Reading files…</p>}
          {notice && <p className="vu-form-note" role="status">{notice}</p>}
          {files.length > 0 && <div className="vu-upload-files">
            <div className="vu-upload-list-head"><strong>Files</strong><span>{files.length}</span></div>
            {files.map(draft => {
              const { item } = draft;
              const Icon = item.kind === 'audio' ? FileAudio : item.kind === 'score' ? FileText : FileMusic;
              return <div className="vu-upload-entry" key={item.key}>
                <div className="vu-upload-file">
                  <Icon size={18} />
                  <div className="vu-upload-filename"><span title={item.name}>{item.name}</span><small>{draft.saved ? 'Uploaded' : (draft.file.size / 1024 / 1024).toFixed(1) + ' MB'}</small></div>
                  <input value={item.label} onChange={event => change(item.key, { label: event.target.value })} required
                    maxLength={75} aria-label={'Label for ' + item.name} disabled={Boolean(busy)} />
                  {item.kind !== 'source' && <button type="button" className="vu-text-button" aria-expanded={preview === item.key}
                    aria-label={'Preview ' + item.name} onClick={() => setPreview(preview === item.key ? undefined : item.key)}>Preview</button>}
                  <button type="button" className="vu-icon" aria-label={'Remove ' + item.name} disabled={Boolean(busy)}
                    onClick={() => setFiles(rows => rows.filter(row => row.item.key !== item.key))}><X size={17} /></button>
                </div>
                {preview === item.key && <div className="vu-upload-preview"><Preview draft={draft} /></div>}
              </div>;
            })}
          </div>}
          {error && <p className="vu-form-error" role="alert">{error}</p>}
        </div>
        <footer>
          {busy === 'publishing' ? <div className="vu-upload-progress" role="status">
            <progress max={files.length} value={uploaded} /> <span>{uploaded === files.length ? 'Publishing…' : uploaded + ' of ' + files.length + ' uploaded'}</span>
          </div> : <button type="button" className="vu-outline" onClick={close} disabled={Boolean(busy)}>Cancel</button>}
          <button type="submit" className="vu-primary" disabled={!valid || Boolean(busy)}><Check size={17} /> Publish song</button>
        </footer>
      </form>
    </dialog>
  );
}
