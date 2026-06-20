# MOT Bible Study

The website for the **MOT Bible Study** — a weekly verse-by-verse walk through the Bible.

- **Live site:** https://mot-bible-study.pages.dev
- **Source:** https://github.com/larryrose77-byte/MOT-Bible-study
- **R2 bucket:** `mot-bible-study-audio` (public base URL: `https://pub-8b4873e4638c435e9e97e2f4e20637ca.r2.dev`)
- **Stack:** Astro 5 static site · Cloudflare Pages (hosting) · Cloudflare R2 (video/audio/transcripts) · OpenAI Whisper (local transcription)

---

## Quick reference

```sh
npm install                                         # first time, or after pulling new changes
npm run dev                                         # local preview at http://localhost:4321
npm run build                                       # production build into dist/
npm run deploy                                      # build AND publish to Cloudflare Pages
npm run transcribe         -- path\to\audio.m4a     # local Whisper -> Word document
npm run audio:upload       -- path\to\audio.m4a     # upload to R2, print URL
npm run video:upload       -- path\to\video.mp4     # upload to R2, print URL
npm run transcript:upload  -- path\to\audio.docx    # upload to R2, print URL
```

---

## Posting a weekly study

1. **Record** Monday's discussion via Zoom (local recording). You'll end up with `videoXXXX.mp4` and `audioXXXX.m4a` in `Documents\Zoom\<date> <topic>\`.

2. **Transcribe** the audio to a Word document. From the project folder:
   ```sh
   npm run transcribe -- "C:\Users\larry\Documents\Zoom\2026-06-23 ...\audioXXXX.m4a"
   ```
   Produces `audioXXXX.docx` next to the audio file. Default model is `base.en`; use `--model=small.en` or `--model=medium.en` for better quality at the cost of longer processing time.

3. **Upload** the three assets to R2 (each command prints the public URL):
   ```sh
   npm run audio:upload      -- "C:\...\audioXXXX.m4a"
   npm run video:upload      -- "C:\...\videoXXXX.mp4"
   npm run transcript:upload -- "C:\...\audioXXXX.docx"
   ```

4. **Create the Markdown post** in `src/content/studies/` — name it `YYYY-MM-DD-passage.md` (e.g. `2026-06-23-genesis-1-6-13.md`). Copy `2026-06-16-sample-study.md` as a starting point. Paste the three URLs into the frontmatter:
   ```markdown
   ---
   title: "Genesis 1:6-13 — Sky, Sea, and Land"
   date: 2026-06-23
   passage: "Genesis 1:6-13"
   audioUrl: "https://pub-XXX.r2.dev/audioXXXX.m4a"
   audioType: "audio/mp4"
   videoUrl: "https://pub-XXX.r2.dev/videoXXXX.mp4"
   transcriptUrl: "https://pub-XXX.r2.dev/audioXXXX.docx"
   duration: "62 min"
   summary: "Day Two and Day Three of creation, and what 'separation' meant to the original audience."
   ---

   Discussion notes here, in Markdown...
   ```

5. **Publish:**
   ```sh
   npm run deploy
   ```
   Live in ~30 seconds.

6. **(Optional) back up source to GitHub:**
   ```sh
   git add . && git commit -m "Genesis 1:6-13" && git push
   ```
   Audio/video/docx files are git-ignored — only Markdown + code go to GitHub.

### Frontmatter reference

| Field           | Required | Notes                                                                       |
| --------------- | -------- | --------------------------------------------------------------------------- |
| `title`         | yes      | Shown at the top of the page and on the home-page card.                     |
| `date`          | yes      | `YYYY-MM-DD`. Used for sorting (newest first) and shown on the page.        |
| `passage`       | yes      | Free-form (e.g. `"John 3:1-21"`). Auto-linked to Bible Gateway in the NIV.  |
| `audioUrl`      | no       | Public URL to the audio. Shows audio player if no `videoUrl`.               |
| `audioType`     | no       | `audio/mpeg` (default), `audio/mp4`, `audio/wav`, `audio/ogg`.              |
| `videoUrl`      | no       | Public URL to the video. Shows video player when present (preferred).       |
| `videoType`     | no       | `video/mp4` (default), `video/webm`, `video/quicktime`.                     |
| `transcriptUrl` | no       | Public URL to the `.docx`. Shows as a download link.                        |
| `duration`      | no       | Human-readable, e.g. `"62 min"`. Shown next to the player heading.          |
| `summary`       | no       | One- or two-sentence summary, shown on the card and at the top of the page. |
| `draft`         | no       | `true` to hide a post from the site.                                        |

---

## What's installed

This machine is set up with everything needed:

| Tool                | Purpose                                            | Installed via               |
| ------------------- | -------------------------------------------------- | --------------------------- |
| Node.js 24 LTS      | Runs Astro and the scripts                         | `winget install OpenJS.NodeJS.LTS` |
| Git for Windows     | Version control                                    | `winget install Git.Git`           |
| GitHub CLI (`gh`)   | Repo creation, authentication                      | `winget install GitHub.cli`        |
| Wrangler            | Cloudflare Pages deploys + R2 uploads              | `npm install -g wrangler`          |
| Python 3.12         | Required by Whisper                                | `winget install Python.Python.3.12`|
| FFmpeg              | Audio/video decoding for Whisper                   | `winget install Gyan.FFmpeg`       |
| OpenAI Whisper      | Local transcription (no API, no per-minute cost)   | `py -m pip install openai-whisper` |

`gh` and Wrangler are already authenticated — credentials persist across reboots.

---

## Project structure

```
mot-bible-study/
├── public/                     # static files served as-is
├── scripts/
│   ├── transcribe.mjs          # audio/video -> Word document via Whisper
│   └── upload-asset.mjs        # generic R2 uploader (audio, video, docx, etc.)
├── src/
│   ├── components/             # site header, footer, study card
│   ├── content/
│   │   └── studies/            # weekly studies go here as .md files
│   ├── content.config.ts       # validates the frontmatter schema
│   ├── layouts/                # the page shell (header, footer, <head>)
│   ├── lib/bibleGateway.ts     # builds NIV-on-Bible-Gateway URLs
│   ├── pages/
│   │   ├── index.astro         # home page (list of studies)
│   │   └── studies/
│   │       └── [...slug].astro # individual study page
│   └── styles/global.css       # all of the site's styling
├── astro.config.mjs
└── package.json
```

Media files (`*.mp4`, `*.m4a`, `*.mp3`, `*.docx`, etc.) are git-ignored — they live in R2.

---

## Translation note

NIV verse text is copyrighted (Biblica / Zondervan). To keep things license-free, this site **links each passage out to Bible Gateway in the NIV** rather than embedding the verse text. To embed text directly, apply for an NIV license at [thenivbible.com](https://www.thenivbible.com/).
