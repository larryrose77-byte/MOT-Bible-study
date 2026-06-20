#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { basename } from 'node:path';
import { existsSync } from 'node:fs';
import { platform } from 'node:os';

const BUCKET = 'mot-bible-study-audio';
const PUBLIC_BASE = 'https://pub-8b4873e4638c435e9e97e2f4e20637ca.r2.dev';

const file = process.argv[2];
if (!file) {
  console.error('Usage: npm run audio:upload -- <path-to-audio-file>');
  console.error('Example: npm run audio:upload -- recordings/2026-06-23.mp3');
  process.exit(1);
}
if (!existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const key = basename(file);
console.log(`Uploading ${file} -> r2://${BUCKET}/${key} ...`);

const wranglerBin = platform() === 'win32' ? 'wrangler.cmd' : 'wrangler';
const result = spawnSync(
  wranglerBin,
  ['r2', 'object', 'put', `${BUCKET}/${key}`, `--file=${file}`, '--remote'],
  { stdio: 'inherit' },
);

if (result.status !== 0) {
  console.error('Upload failed.');
  process.exit(result.status ?? 1);
}

const url = `${PUBLIC_BASE}/${key}`;
console.log('');
console.log('Upload complete.');
console.log(`Public URL: ${url}`);
console.log('');
console.log('Paste this into your study Markdown frontmatter:');
console.log(`  audioUrl: "${url}"`);
