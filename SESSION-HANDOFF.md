# Session Handoff — The Engineer's Field Guide to LLMs

> Working/dev-context doc for picking this project back up in a fresh session on any day.
> **This repo is public** — keep private details (employer names, personal data beyond the
> already-public LinkedIn) out of this file and out of the site.

---

## 1. What this is

A storytelling, hands-on web book: **"The Engineer's Field Guide to Large Language Models."**
Audience: senior software engineers crossing into ML. Static HTML site, no build step.

- **Repo:** https://github.com/sudhanshushekhar10/llm-handbook  (branch: `main`)
- **Live (GitHub Pages):** https://sudhanshushekhar10.github.io/llm-handbook/
- **Live (Vercel):** https://llm-field-guide.vercel.app/
- Canonical URL used for share links / OG tags: the GitHub Pages URL above.

**Book size:** ~37,400 reading-prose words (~44k incl. code samples), ~3 hrs at 200 wpm,
20 chapters + home. (Glossary/References text is JS-generated, not counted.)

---

## 2. Deploy model (read before pushing)

- **Both hosts auto-deploy from `main` on every push.** `git push origin main` == publish live.
  There is no separate build/publish step. GitHub Pages build takes ~30–60s.
- `.nojekyll` at repo root disables Jekyll (so `chapters/_template.html` and all files serve verbatim).
- **Outward-facing:** pushing updates the public site. Confirm intent before pushing.

### Two gotchas that repeatedly cause confusion
1. **Browser cache on `styles.css`.** The HTML links `styles.css` with no version query, so browsers
   hard-cache it. After a CSS change you'll see the OLD styles until a **hard refresh** (⌘⇧R) or a
   fresh origin. GitHub Pages also puts a ~10-min CDN cache on assets. When testing CSS locally,
   **serve on a new port** (e.g. `python3 -m http.server 8001`) to bypass the cache.
2. **Per-origin browser zoom.** `github.io`, `vercel.app`, and `localhost` are different origins;
   browsers remember zoom **per origin**. If one site "looks bigger," it's almost always zoom —
   reset each with **⌘0**. Typography is also fluid (`clamp(..., vw, ...)`), so size changes with
   window width too. The deployed hosts serve byte-identical files.

---

## 3. Architecture / how to work in it

Plain HTML + CSS + vanilla JS. External deps loaded via CDN: Tailwind Play CDN (with
`preflight` disabled), Google Fonts. All custom styling in `assets/css/styles.css`.

### Single source of truth: `assets/js/nav.js`
`HANDBOOK.chapters` is an array of `{ num, slug, part, title, blurb, tags }`. **To add, remove,
or reorder chapters, edit this array** — it drives the sidebar, the prev/next pager, the home
contents grid, and the search index. Part labels (`"I · Foundations"` etc.) live here too.

### Shared UI is JS-injected (write once, appears on all ~23 pages)
Rendered from `nav.js`, wired up in `assets/js/main.js`'s boot block. No per-file HTML edits needed:
- `renderSidebar` / `renderPager` — left nav + prev/next.
- `renderByline` — centered author byline in the top bar; it links to the About section.
- `renderShare` — top-bar "Share this book" popover (always shares the **book** home URL).
- `renderChapterShare` — end-of-chapter "Share this chapter" block (chapter pages only; shares
  that chapter's canonical URL).
- `renderFooter` — site-wide `© · book · CC BY-NC · About` footer.
- Share helpers: `shareMeta(slug)`, `shareItems(m)`, `SHARE_GLYPH` (monochrome brand SVGs),
  `canonical` base in `HANDBOOK.meta`.

Each page sets `window.PAGE = { slug: "..." }` before the scripts.

### Theme
- Driven **only** by the `data-theme` attribute on `<html>` (no CSS `prefers-color-scheme`).
- **Default is light for everyone** (`initTheme` in `main.js`: `saved || "light"`).
- Dark is an opt-in toggle, persisted in `localStorage["fg-theme"]`.

### CSS notes
- Design tokens in `:root` (colors, fonts, spacing). `--topbar-h` controls header height (and the
  things anchored to it: sidebar, rail, mobile drawer). Dark overrides under `html[data-theme="dark"]`.
- Fluid type via `clamp()`. Responsive breakpoints at 1180px, 860px, and 480px (phone masthead).

---

## 4. Local preview

```bash
cd /path/to/llm-handbook
python3 -m http.server 8000       # then open http://localhost:8000/
# For CSS work, bump the port each time (8001, 8002, ...) to dodge the styles.css cache.
```
Do **not** open via `file://` — relative asset/link resolution and some features assume http.

---

## 5. Content conventions (important)

- **No em dashes in prose.** The whole book's reading prose was converted from `—` to
  context-appropriate punctuation (colons / commas / semicolons / parentheses). **Keep it that way:
  do not introduce `—` into prose.** Em dashes are fine (and intentionally left) in code blocks,
  `<head>`/`<meta>`, and the masthead part-label `Part X — Name`.
- **`·` (middot)** is the site's design separator (nav labels, meta chips, footer). Leave it.
- Arrows `→ ←` and en dashes `–` (ranges like `04–09`) are used intentionally.
- Chapter anatomy: `.masthead` (plate-no · Part label, `h1`, `.standfirst`, meta chips) →
  `h2`/`h3` sections (each needs an `id` — the right rail TOC + anchors depend on it) → callouts
  (`callout--analogy/swe/gotcha/win/paper`) → codeblocks (Local/Cloud tabs) → ends with a `Recap`.
- **Part VII (Plates 19–20)** are bonus deep-dives. Chapter 18 bridges into them via a
  "Going deeper: Part VII" section; Plate 19 has a "bonus Part VII" note linking back. (Plate 20
  does not yet have that note — optional to add for symmetry.)

---

## 6. Authorship / bio (decisions to preserve)

- Author: **Sudhanshu Shekhar.** Credited via: top-bar byline (links to `#about`), hero byline,
  the "About the Author" section on the home page, and the site-wide footer.
- Bio voice: **understated, concrete, present tense.** Deliberately **omits the employer** (do not
  add any company names). **No "patents" line** (was there, then removed — do not re-add).
  Mentoring is framed as the book's give-back genesis. Includes "views are his own."
- Only personal link published: the author's **LinkedIn** (already in the About section).
- **License:** Creative Commons **BY-NC 4.0** (`LICENSE` file + footer link).
- (A local Claude Code memory note, `llm-handbook-authorship.md`, holds these too — but that's
  machine-local, not in the repo. This section is the portable record.)

---

## 7. Done this session (newest first)

```
116f481  Bridge chapter 18 into Part VII (plates 19-20)
36bd310  Remove "two patents" line from About the Author
6748157  Fix top-bar brand distortion on narrow/phone widths
dd49bfc  Add .nojekyll to disable Jekyll on GitHub Pages
24ec730  De-em-dash home page and references prose (incl. About section)
7b8631a  Default to light theme for all visitors
579da54  Add share feature + OG preview cards, refine bio, and de-em-dash chapter prose
324f9f0  Add author credits (byline, About section, site-wide footer) and CC BY-NC 4.0 license
```
Highlights: author credits + CC BY-NC license; share feature (book + per-chapter, monochrome brand
icons w/ hover tint + tooltips); Open Graph / Twitter preview cards on all pages + a branded
1200×630 image at `assets/og/og-default.png`; bio finalized; **em dashes removed from all prose
site-wide** (20 chapters + home + references; glossary had none); light default theme;
mobile masthead fix; Part VII bridge.

---

## 8. Open / optional follow-ups

- [ ] Mirror the "bonus Part VII" intro note onto **Plate 20** (only Plate 19 has it).
- [ ] Optionally scale base typography up globally if the larger look is preferred as default.
- [ ] Glossary/References word count (their content is JS-generated in `assets/js/glossary.js` /
      `references.js`, so not in the ~37.4k prose total).
- [ ] Consider versioning `styles.css` (e.g. `styles.css?v=N`) to defeat the browser cache on updates.

---

## 9. File map

```
index.html / glossary.html / references.html   home + reference pages
chapters/*.html                                 20 chapters (+ _template.html)
assets/css/styles.css                           all styling + design tokens
assets/js/nav.js                                chapter registry + shared-UI renderers (edit here)
assets/js/main.js                               boot: theme, wiring, calls the renderers
assets/js/glossary.js / references.js           data for the glossary & references pages
assets/og/og-default.png                        1200×630 social share image
LICENSE                                          CC BY-NC 4.0
.nojekyll                                        disable Jekyll on GitHub Pages
docs/superpowers/specs/                          design spec(s), e.g. the share feature
```

---

## 10. To resume next session

1. Read this file.
2. `python3 -m http.server 8000` and open the site locally (fresh port for CSS changes).
3. Make edits (remember: `nav.js` for structure, no em dashes in prose, light theme default).
4. Verify in the browser at desktop + phone widths.
5. Commit, and `git push origin main` to publish (this deploys live to both hosts — confirm intent).
6. Hard-refresh (⌘⇧R) or wait ~10 min for the CDN to serve updated CSS/assets.
