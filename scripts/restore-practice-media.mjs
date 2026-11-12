import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

// Build-time restore keeps each uploaded file byte-for-byte identical to
// the original, while allowing the GitHub connector to store small blobs.
const { audio, pdfs } = JSON.parse(await readFile(resolve('scripts/practice-media.json'), 'utf8'));
const outputDir = resolve('public/practice/all-for-us');
const sourceDir = resolve('rehearsal-source/all-for-us');
await mkdir(outputDir, { recursive: true });

function verify(buffer, record) {
  const actual = createHash('sha256').update(buffer).digest('hex');
  if (buffer.length !== record.bytes || actual !== record.sha256) {
    throw new Error('All For Us media did not pass integrity check: ' + record.name);
  }
}

for (const record of audio) {
  const folder = join(sourceDir, record.folder);
  const files = (await readdir(folder)).filter(name => /^\d{3}\.bin$/.test(name)).sort();
  if (files.length !== record.parts) {
    throw new Error('Missing audio pieces for ' + record.name);
  }
  const pieces = await Promise.all(files.map(name => readFile(join(folder, name))));
  const result = Buffer.concat(pieces);
  verify(result, record);
  await writeFile(join(outputDir, record.name), result);
  console.log('Restored practice audio: ' + record.name);
}

for (const record of pdfs) {
  verify(await readFile(join(outputDir, record.name)), record);
}
console.log('All For Us library verified: ' + audio.length + ' audio files, ' + pdfs.length + ' PDF scores.');
