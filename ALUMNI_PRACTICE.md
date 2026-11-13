# Rehearsal

The Media page links to the password-gated song library at `/rehearsal` and the public alumni player at `/alumni/all-for-us`. Both use the same player. The rehearsal code is shared by the website and the media service. Change both if the code changes.

The catalog and newly published music live in the Vocal U Rehearsal Media service at `https://vocal-u-rehearsal-media.drew5.chatgpt.site`. The catalog and uploads require the shared code. Media URLs are directly playable. Anyone who enters the rehearsal code can add a song, with no account. New songs appear in the catalog after all of their files are uploaded.

The alumni PDFs are in `public/practice/all-for-us`. The alumni audio is assembled from `rehearsal-source/all-for-us` before the production build. For local development on the alumni route, run `node scripts/restore-practice-media.mjs` first.

The PDF viewer follows audio using page cues when available, with an estimated fallback. Readers can calibrate the offset or mark individual page starts on their device. MuseScore source files are kept as downloadable originals. A PDF is needed for the in-page score viewer.
