# MOT Bible Study

The website for the **MOT Bible Study** — a weekly verse-by-verse walk through the Bible.

Built with [Astro](https://astro.build/), hosted on [Cloudflare Pages](https://pages.cloudflare.com/) (free tier), with audio recordings hosted on [Cloudflare R2](https://developers.cloudflare.com/r2/) (also free tier).

---

## Quick start

```sh
npm install        # only the first time, or after pulling new changes
npm run dev        # preview at http://localhost:4321
npm run build      # produce a production build in dist/
npm run deploy     # build AND publish to Cloudflare Pages (live in ~30 sec)
```

**Live site:** https://mot-bible-study.pages.dev

---

## Posting a new weekly study

1. **Record the discussion** (Zoom cloud recording, your phone, etc.) and export it as an MP3.
2. **Upload the MP3 to your Cloudflare R2 bucket** (via the Cloudflare dashboard, drag-and-drop). Copy the public URL.
3. **Create a new Markdown file** in `src/content/studies/` named after the date and passage, e.g. `2026-06-23-genesis-1-6-13.md`. Copy any existing file as a template.
4. **Fill in the frontmatter and notes**:

   ```markdown
   ---
   title: "Genesis 1:6-13 — Sky, Sea, and Land"
   date: 2026-06-23
   passage: "Genesis 1:6-13"
   audioUrl: "https://your-r2-bucket.example.com/2026-06-23.mp3"
   duration: "62 min"
   summary: "Day Two and Day Three of creation, and what 'separation' meant to the original audience."
   ---

   Discussion notes here...
   ```

5. **Publish:** run `npm run deploy` from the project folder. This builds the site and pushes it to Cloudflare Pages in one step. Live in ~30 seconds.
6. **(Optional) Back up to GitHub:** `git add . && git commit -m "Genesis 1:6-13" && git push`. The GitHub repo is for version history only — Cloudflare deploys from your local `dist/` directory, not from GitHub.

### Frontmatter reference

| Field       | Required | Notes                                                                                            |
| ----------- | -------- | ------------------------------------------------------------------------------------------------ |
| `title`     | yes      | Shown at the top of the page and on the home-page card.                                          |
| `date`      | yes      | `YYYY-MM-DD`. Used for sorting (newest first) and shown on the page.                             |
| `passage`   | yes      | Free-form (e.g. `"John 3:1-21"`). Automatically linked to Bible Gateway in the NIV.              |
| `audioUrl`  | no       | Public URL to the recording (R2, S3, etc.). If omitted, no audio player shows.                   |
| `audioType` | no       | Defaults to `audio/mpeg` (MP3). Other options: `audio/mp4`, `audio/wav`, `audio/ogg`.            |
| `duration`  | no       | Human-readable, e.g. `"58 min"`.                                                                 |
| `summary`   | no       | One- or two-sentence summary, shown on the card and at the top of the study page.                |
| `draft`     | no       | Set to `true` to hide a post from the site (useful for in-progress notes).                       |

---

## One-time setup

### 1. Cloudflare R2 (for audio recordings)

1. Sign in to Cloudflare and go to **R2 Object Storage**.
2. Create a bucket (e.g. `mot-bible-study-audio`).
3. Under **Settings → Public access**, either:
   - Enable the bucket's public `r2.dev` URL (quickest), or
   - Attach a custom subdomain like `audio.motbiblestudy.com` (cleaner).
4. When posting each week, drag the MP3 into the bucket via the dashboard and copy the resulting public URL into the post's `audioUrl` field.

**R2 free tier:** 10 GB storage, 1M Class-A operations/month, 10M Class-B operations/month, **zero egress fees**. Plenty of headroom for weekly recordings.

### 2. Cloudflare Pages (for the website)

1. Push this folder to a new GitHub repository.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo. Cloudflare auto-detects Astro:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. You get a `*.pages.dev` URL immediately; attach a custom domain later in the Pages project settings if desired.

Every `git push` to the main branch triggers a fresh build and deploy.

---

## Project structure

```
mot-bible-study/
├── public/                       # static files served as-is
│   └── favicon.svg
├── src/
│   ├── components/               # site header, footer, study card
│   ├── content/
│   │   └── studies/              # weekly studies go here as .md files
│   ├── content.config.ts         # validates the frontmatter schema
│   ├── layouts/                  # the page shell (header, footer, <head>)
│   ├── lib/
│   │   └── bibleGateway.ts       # builds NIV-on-Bible-Gateway URLs
│   ├── pages/
│   │   ├── index.astro           # home page (list of studies)
│   │   └── studies/
│   │       └── [...slug].astro   # individual study page
│   └── styles/
│       └── global.css            # all of the site's styling
└── astro.config.mjs
```

---

## Translation note

NIV verse text is copyrighted (Biblica / Zondervan). To keep things simple — and license-free — this site **links each passage out to Bible Gateway in the NIV** rather than embedding the verse text. If you ever want to embed the text directly on the page, apply for an NIV license at [thenivbible.com](https://www.thenivbible.com/).
