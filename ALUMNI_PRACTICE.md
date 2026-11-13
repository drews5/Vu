# Rehearsal

The Media page links to the password-gated song library at `/rehearsal` and the public alumni player at `/alumni/all-for-us`. Both use the same player. The rehearsal code is shared by the website and the media service. Change both if the code changes.

The catalog and newly published music live in the Vocal U Rehearsal Media service at `https://vocal-u-rehearsal-media.drew5.chatgpt.site`. The catalog and uploads require the shared code. Media URLs are directly playable. Anyone who enters the rehearsal code can add a song, with no account. New songs appear in the catalog after all of their files are uploaded.

The alumni PDFs are in `public/practice/all-for-us`. The alumni audio is assembled from `rehearsal-source/all-for-us` before the production build. For local development on the alumni route, run `node scripts/restore-practice-media.mjs` first.

The Fall 2026 scores have measure maps in `src/rehearsal/data`. The maps store score coordinates, lyric syllables, section starts, tempo changes, and timing adjustments for recordings where needed. Full scores with a measure map scroll to the selected staff. The Situations PDF contains malformed notation, so its practice view uses the supplied MuseScore notes to show one voice at a time. The original PDF is available under Files.

For newly uploaded material, rehearsal opens the PDF and attempts to read vector staff lines, barlines, tempo markings, and lyrics. MuseScore files supply musical timing and notes. If the printed bars cannot be matched or a score only has images, the reader uses PDF page follow or the available MuseScore part view. Members can adjust alignment on their device under Practice options.
