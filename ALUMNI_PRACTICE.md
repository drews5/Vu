# All For Us — alumni practice archive

The page is available at `/alumni/all-for-us`, and the main Media page links to it.

**Contents:** nine playable MP3s (full and faster mixes, five voice parts, and two solo tracks), plus both PDF scores. All files preserve the exact bytes of the supplied ZIP.

**Storage:** the two PDF scores live in `public/practice/all-for-us`. The audio files are stored as numbered, binary chunks under `rehearsal-source/all-for-us`. Running `npm run build` first executes `scripts/restore-practice-media.mjs` to assemble the original MP3 files into the public directory, checking the expected sizes and SHA-256 hashes. Do not rename, reorder, or delete source chunks.

The page has a part selector, speed adjustment and looping. It checks file availability before displaying download links.

The route is marked noindex but **not password protected**. Anyone with the URL can access the practice materials.
