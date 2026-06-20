---
title: "Sample Study — Replace Me"
date: 2026-06-16
passage: "Genesis 1:1-5"
duration: "58 min"
summary: "Replace this sample post with your first real Monday study. See README.md for the full workflow."
draft: false
---

> This is a placeholder post so you can see how the layout works. **Delete this file** (or set `draft: true` in the frontmatter) and create your own post for your first real Monday study.

## How to publish your first real study

1. **Record** Monday's Zoom discussion (local recording).
2. **Transcribe** the audio: `npm run transcribe -- "C:\Users\larry\Documents\Zoom\...\audioXXXX.m4a"` — produces a `.docx` next to it.
3. **Upload** the assets to R2 — each command prints the public URL:
   ```sh
   npm run audio:upload      -- "...\audioXXXX.m4a"
   npm run video:upload      -- "...\videoXXXX.mp4"
   npm run transcript:upload -- "...\audioXXXX.docx"
   ```
4. **Create the Markdown post** in `src/content/studies/` (copy this file as a template) and add the URLs to the frontmatter:
   ```yaml
   audioUrl: "https://pub-XXX.r2.dev/audioXXXX.m4a"
   audioType: "audio/mp4"
   videoUrl: "https://pub-XXX.r2.dev/videoXXXX.mp4"
   transcriptUrl: "https://pub-XXX.r2.dev/audioXXXX.docx"
   ```
5. **Publish:** `npm run deploy`

That's it. The full reference is in `README.md`.
