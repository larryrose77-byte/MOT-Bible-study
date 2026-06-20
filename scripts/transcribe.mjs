#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const inputFile = process.argv[2];
const modelArg = process.argv.find((a) => a.startsWith('--model='));
const model = modelArg ? modelArg.split('=')[1] : 'base.en';

if (!inputFile) {
  console.error('Usage: npm run transcribe -- <path-to-audio-or-video> [--model=base.en]');
  console.error('Models: tiny.en, base.en (default), small.en, medium.en, large');
  process.exit(1);
}
if (!existsSync(inputFile)) {
  console.error(`File not found: ${inputFile}`);
  process.exit(1);
}

const absInput = resolve(inputFile);
const baseName = basename(inputFile, extname(inputFile));
const outDir = dirname(absInput);
const docxPath = join(outDir, `${baseName}.docx`);

const workDir = mkdtempSync(join(tmpdir(), 'mot-transcribe-'));
console.log(`Transcribing ${inputFile} with Whisper model "${model}" ...`);
console.log(`(work dir: ${workDir})`);

const pyBin = platform() === 'win32' ? 'py' : 'python3';
const whisperArgs = [
  '-m', 'whisper',
  absInput,
  '--model', model,
  '--language', 'English',
  '--output_format', 'txt',
  '--output_dir', workDir,
  '--verbose', 'False',
];

const result = spawnSync(pyBin, whisperArgs, { stdio: 'inherit' });
if (result.status !== 0) {
  console.error('Whisper transcription failed.');
  rmSync(workDir, { recursive: true, force: true });
  process.exit(result.status ?? 1);
}

const txtPath = join(workDir, `${baseName}.txt`);
if (!existsSync(txtPath)) {
  console.error(`Expected transcript at ${txtPath} but it was not produced.`);
  rmSync(workDir, { recursive: true, force: true });
  process.exit(1);
}

const text = readFileSync(txtPath, 'utf-8').trim();
rmSync(workDir, { recursive: true, force: true });

const paragraphs = text
  .split(/\n{2,}|\.\s+(?=[A-Z])/)
  .map((p) => p.trim())
  .filter(Boolean);

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const doc = new Document({
  creator: 'MOT Bible Study',
  title: `Transcript — ${baseName}`,
  sections: [
    {
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: `Discussion Transcript`, bold: true })],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: baseName, italics: true }),
            new TextRun({ text: ` · Transcribed ${today}`, italics: true }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: '' })] }),
        ...paragraphs.map(
          (p) =>
            new Paragraph({
              children: [new TextRun({ text: p })],
              spacing: { after: 200 },
            }),
        ),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync(docxPath, buffer);

console.log('');
console.log('Transcription complete.');
console.log(`Word document: ${docxPath}`);
console.log('');
console.log('Next: upload it with');
console.log(`  npm run transcript:upload -- "${docxPath}"`);
