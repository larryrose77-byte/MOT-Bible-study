#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { basename, extname } from 'node:path';
import { existsSync } from 'node:fs';

const BUCKET = 'mot-bible-study-audio';
const PUBLIC_BASE = 'https://pub-8b4873e4638c435e9e97e2f4e20637ca.r2.dev';

const CONTENT_TYPES = {
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.vtt': 'text/vtt; charset=utf-8',
};

const file = process.argv[2];
if (!file) {
  console.error('Usage: npm run <upload-script> -- <path-to-file>');
  process.exit(1);
}
if (!existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const key = basename(file);
const ext = extname(file).toLowerCase();
const contentType = CONTENT_TYPES[ext];

console.log(`Uploading ${file} -> r2://${BUCKET}/${key}${contentType ? ` (${contentType})` : ''} ...`);

const args = ['r2', 'object', 'put', `${BUCKET}/${key}`, `--file=${file}`, '--remote'];
if (contentType) args.push(`--content-type=${contentType}`);

const result = spawnSync('wrangler', args, { stdio: 'inherit', shell: true });

if (result.status !== 0) {
  console.error('Upload failed.');
  process.exit(result.status ?? 1);
}

const url = `${PUBLIC_BASE}/${key}`;
console.log('');
console.log('Upload complete.');
console.log(`Public URL: ${url}`);
