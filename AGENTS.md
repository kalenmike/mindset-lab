# Mindset Lab — Landing Page

Personal landing page for Kalen Michael (https://kalenmichael.substack.com). A stark,
terminal-style, monospace site: "a public log of experiments in mindset, physical
endurance, and operational discipline. Real frameworks, zero wishy-washy fluff."

## Stack

- **Astro 7** (static output) + **TypeScript** — no React, no client framework
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin wired into `astro.config.mjs`
- **pnpm** (v11) as package manager — use `pnpm`, never npm/yarn
- **lucide-react-style SVGs inlined** — the sole icon is a hand-rolled `MoveLeft` in
  `src/components/MoveLeftIcon.astro`
- Linting via **oxlint** (`pnpm lint`), type check via `astro check`
- **@astrojs/sitemap** integration (enabled; generates `dist/sitemap.xml`)

## Commands

| Command          | What it does                                                        |
| ---------------- | ------------------------------------------------------------------- |
| `pnpm dev`       | `astro dev` — dev server with HMR                                   |
| `pnpm build`     | `astro check` → `astro build` (static pages in `dist/`)             |
| `pnpm lint`      | oxlint                                                              |
| `pnpm preview`   | Serve the built `dist/` locally                                     |
| `pnpm deploy`    | `pnpm build` then `gh-pages -d dist -t` → publishes to `gh-pages` branch |

## Architecture: statically rendered Astro site

Every page is prerendered to static HTML at build time. There is no client-side routing
and no hydration — `output: 'static'`. The only client JS is two small bundled module
scripts:

- `src/components/ThemeToggle.astro` — theme toggle (reads/writes `localStorage`).
- `src/components/Calendar.astro` — calendar day modals (open/nav/close/Escape).

Pages (`src/pages/`):

- `index.astro` — landing page (hero, pillars, featured experiments, notes)
- `experiments/index.astro` — `/experiments` index
- `vault/index.astro` — `/vault` resources
- `experiment/[slug].astro` — `/experiment/{slug}` pages via `getStaticPaths`
  (filters out `status: HIDDEN` experiments)
- `blog/index.astro` — `/blog` (unlisted) blog index; grouped by blog folder
- `blog/[name]/index.astro` — `/blog/{name}` (unlisted) single-blog meta + articles
- `blog/[name]/[slug].astro` — `/blog/{name}/{slug}` (unlisted) rendered article page. Below
  the article body it renders a `## Related Articles` nav: adjacent articles in **chronological**
  order (ascending `order` then `date`, regardless of how the blog list is sorted), so
  PREVIOUS is always the older article and NEXT the newer one. When a direction doesn't exist
  (oldest/newest article), the cell suggests another blog instead — the next blog in
  `/blog` order (by latest post date, wrapping). Each card shows an always-visible arrow that
  slides on hover (`alwaysVisible` variant of the shared `MoveLeftIcon`/`MoveRightIcon`) and a
  date pinned to the card bottom (an em-dash `—` when absent, so the two cards stay uniform).

The blog section is **standalone-only**: `/blog` is not linked from the nav `MENU` or
anywhere on the main site — pages are reachable only by direct URL (they stay in
`sitemap.xml` and are indexable).

`astro.config.mjs` sets `site: 'https://kalenmichael.com'` (the CNAME custom domain),
`output: 'static'`, and `base` is unset — **all internal links are absolute root paths**
(`/experiments`, `/experiment/{slug}/`). Do not reintroduce relative `./` navigation.

Note: Astro 7 auto-generates `dist/robots.txt` and `dist/llms.txt` from the `site` config
and page content. `@astrojs/sitemap` makes the referenced `sitemap.xml` real.

### Theme (no-flash, no hydration)

- The FOUC-prevention script is an inline `<script is:inline>` in
  `src/layouts/Layout.astro` head: it reads `localStorage['mindset-lab-theme']` (falling
  back to `prefers-color-scheme`) and adds `html.light` **pre-paint** — never rendered
  conditionally by a component.
- `ThemeToggle.astro` renders both a moon (dark) and sun (light) SVG; `src/styles/
  global.css` toggles their visibility with `html.light`. Its module script flips the
  `html.light` class and persists the choice to `localStorage`.
- There is no component that reads `window`/`localStorage` during render — Astro renders
  the HTML statically, so hydration mismatches are impossible.

## Styling system: CSS-variable theme tokens

All color usage flows through **semantic CSS variables** defined in
`src/styles/global.css`, so the entire palette flips instantly between dark and light
with a single class — no heavy theme libs, no re-compilation.

- `:root` holds the **dark** palette (default); `html.light` overrides the same variables
  for **light** mode.
- Tokens: `--surface` (page bg), `--surface-raise` (raised panels, e.g. calendar day cells),
  `--ink-strong` (headings, `text-white`),
  `--ink`/`--sub`/`--muted`/`--faint`/`--ghost` (text hierarchy), `--line`/`--line-soft`/
  `--line-bright` (borders), `--hover-surface` (CTA hover fill), `--sel-bg`/`--sel-text`
  (selection), `--accent-sky|violet|amber` (category colors), `--status-live`/`--status-complete`
  (experiment status colors, mapped to `text-red-400`/`text-green-400`).
- `--animate-blink` (step-end opacity blink) is defined in the `@theme` block for the LIVE
  status indicator.
- `@theme inline` in `global.css` remaps Tailwind classes to those tokens, e.g.
  `--color-slate-950: var(--surface)`, `--color-slate-800: var(--line)`,
  `--color-slate-900: var(--surface-raise)`, `--color-white: var(--ink-strong)`,
  `--color-sky-400: var(--accent-sky)`. This is why
  utilities like `bg-slate-950` work in both themes — **do not hardcode hex colors in
  component classes**; use the token-mapped slate classes.

### Design language

- **Monospace everywhere** — JetBrains Mono loaded via Google Fonts (`@import` at the top
  of `global.css`) and set as `--font-mono` (`@theme` block).
- Deep charcoal/slate background (dark) or near-white (light), stark white/muted gray text.
  No imagery, no glossy cards — text and 1px `border-dashed border-slate-800` dividers.
- Section headings: `text-xs font-bold uppercase tracking-[0.2em] text-slate-500` with a
  `##` marker in `text-slate-700` (e.g. `## Core Pillars`).
- Buttons/CTAs: bordered `border-slate-700`, hover inverts to `bg-slate-100 text-slate-950`.
- List rows (notes/resources/experiments): bottom dashed divider, title in white, `[TAG]`
  colored, and on hover a `MoveLeft` icon slides in from the right next to the title
  (`group-hover:translate-x-0 group-hover:opacity-100`). See `src/components/ExperimentRow.astro`.
- Experiment status via the shared `Status` component (`src/components/Status.astro`):
  `LIVE` renders red + blinking (`text-red-400 animate-blink`), `COMPLETE` renders green
  (`text-green-400`), any other value keeps the default muted style.
- `html { scroll-behavior: smooth }` supports the anchor nav (`#experiments`, `#featured`,
  `#elsewhere`).

## Content: content collections (markdown)

Astro content collections, configured in `src/content.config.ts` (zod schemas, `glob`
loaders from `astro/loaders`, `z` imported from `astro/zod`). Add a `.md` file under
`src/content/{collection}/` and it appears on the next `pnpm build` — no code changes
needed (publication of images/external links still requires a rebuild).

Three collections:

- **`experiments`** — `src/content/experiments/{slug}.md`; the filename is the slug.
- **`notes`** — `src/content/notes/*.md`, ordered by `no`.
- **`resources`** — `src/content/resources/*.md`, ordered by `no`.
- **`blogs`** — `src/content/blog/{name}/*.md`; folder-nested blogs (see below).

### Experiment frontmatter fields

The `slug` is the markdown **filename** (do not duplicate it in frontmatter):

```
title, subtitle (default ""), tagline, status (LIVE|COMPLETE|HIDDEN),
start (YYYY-MM-DD), duration, tag (RAW|LAB|TOOLKIT), description,
protocol[] (ordered steps), href? (external write-up link — only rendered when present and
the experiment is COMPLETE), featured? (bool), order (number)
```

- `order` controls the display sequence on the homepage `/experiments` index (listings are
  sorted ascending by `order`). Keep it explicit — sorted months/`start` are not reliable.
- `status: HIDDEN` removes the experiment from listings **and** from
  `getStaticPaths` — its page is never generated. HIDDEN entries stay in the collection.
- `featured: true` shows the row in the homepage `## Featured Experiments` section.

Optional **calendar** field renders a tracking calendar on the page:

```
calendar: { start: "YYYY-MM-DD", end: "YYYY-MM-DD", days: { "YYYY-MM-DD": { label, title, note } } }
```

- `calendar.days` is optional — each keyed date can carry a short `label` (shown in the day
  cell slot), a `title`, a `note` (shown in the day modal), an `href` + `linkLabel` for
  published related content (renders a link in the modal and a `↗` cell marker), and a
  `releaseDate` for content that is still in the pipeline (renders "not released yet —
  expected <date>" in the modal and a `~` cell marker). Days without an entry render
  non-interactively (a plain `<span>`, no hover, no click, no modal) with a `d{n}` slot.
  Release dates are independent of challenge dates — the calendar is always for the
  challenge period.
- The calendar is the shared component `src/components/Calendar.astro`: the month grid is
  rendered statically at build time; only the day modal is driven by its bundled module
  script (click opens, Prev/Next navigate, Escape/backdrop/[close] dismiss). Markup is
  looked up with `data-cal-day` / `data-cal-panel` (`<template>`) / `data-cal-*` selectors.
- The `## Calendar` section only renders when an experiment has a `calendar` field.

### YAML gotchas (frontmatter is YAML, not JSON)

- **Quote every ISO date string** (`start`, `calendar.start/end`, `releaseDate`, note
  `date`, calendar day keys/`label`). Unquoted `2026-09-01` parses as a `Date` object and
  the schema rejects it; `label: 1` parses as a number.
- **Quote strings containing `: `** (colon + space) or `#` — e.g. descriptions with
  "The goal: ...". It breaks the plain scalar and Astro fails with a YAML parse error.
- `duration: ~` must be `duration: "~"` — bare `~` is YAML `null`.

### Note (`notes[]`) fields

```
no (e.g. "001"), date (YYYY-MM-DD), tag (RAW|LAB|TOOLKIT), title, desc?, href
```

### Resource (`resources[]`) fields

```
no (e.g. "R-01"), tag (DOWNLOAD|TOOLKIT|READING), title, desc, href
```

### Blog (`blogs`) collection — folder-nested blogs

Each blog is a **folder** under `src/content/blog/{name}/`. A blog folder contains one
`index.md` (the blog's metadata) plus any number of article `.md` or `.mdx` files. The page
URLs are folder-derived: `/blog`, `/blog/{name}/`, `/blog/{name}/{article-slug}/`. The
folder is the blog slug — never duplicate it in frontmatter.

- `index.md` — **blog meta** (folder frontmatter): `title`, `description?`, `tag?`
  (RAW|LAB|TOOLKIT), `order?`, `finished?` (YYYY-MM-DD; present = blog closed, absent =
  open), `experiment?` (slug of a linked experiment — the blog then appears in that
  experiment page's `## Field Notes` section). Its markdown body, if present, renders as
  the intro on `/blog/{name}/`, wrapped in
  `.blog-content` so it gets the same article typography and spacing.
- `{article-slug}.md` / `{article-slug}.mdx` — **article**: `title`, `date?`
  (YYYY-MM-DD or `YYYY-MM-DD HH:MM` for precision — both accepted and parsed by
  `toLocalDate`/`relativeTime`), `description?`, `tag?`, `order?`. The body renders on
  `/blog/{name}/{article-slug}/` via `render(entry)` from `astro:content`, styled by the
  `.blog-content` block in `src/styles/global.css`. Use **MDX** (`.mdx`) only when the
  article needs an inline component (see Comments below).

Shared schema (`src/content.config.ts` `blogs` collection): `title`, `description?`, `tag?`,
`order?`, `date?`, `finished?`, `thumbnail?` (image) — role (blog vs article) is inferred
from the entry id: Astro's glob loader normalizes a folder's `index.md` to the bare folder
name (id has **no slash**, e.g. `the-pursuit` = blog meta), so an id **with** a slash is an
article (`name/slug`, slug = id's last segment). The loader pattern is `**/*.{md,mdx}`
(requires the `@astrojs/mdx` integration in `astro.config.mjs` — pinned to `7.0.x`, not 8,
to match Astro 7's `markdown-satteri`).

Blog ordering: `/blog` sorts blogs by **latest post date** (max article `date`, descending —
the blog with the most recent post sits on top) and shows that date on each row. On
`/blog/{name}/`, articles sort by `date` **descending** (newest first) when the blog has no
`finished` field (open), and **ascending** (existing `order` then `date` — chronological
reading order) when `finished` is set (closed). The blog header shows its latest post date.

- `thumbnail` uses the content-schema `image()` helper: set it to a **relative path** from
  the content file (e.g. `thumbnail: ./images/d1-kalen-and-davin.jpg`). It validates the
  path, resolves it to `ImageMetadata`, and Astro optimizes it at build (WebP crop). On
  `/blog` the thumbnail renders as a captionless `Polaroid` print — the shared
  `src/components/Polaroid.astro` component with `width`/`height`/`fit="cover"` (640×360,
  16:9 crop, same `polaroid-print` frame as in articles). It is optional; omit it and the
  row renders without an image.

Note: rendered blog article/intro markdown is the first inline-rendered content on the site
(the other collections link out via `href`). Style it with the `.blog-content` rules — keep
color tokens, don't hardcode hex.

### Blog images (local, auto-optimized)

Blog articles can embed **local images** that Astro optimizes at build time (WebP output,
sized + `width`/`height` inferred, emitted to `dist/_astro/`). No config or schema change is
needed — the markdown processor resolves relative image paths in article bodies automatically.
Requires the **`sharp`** image service (a devDependency — `pnpm add -D sharp`) to run the
`pnpm build` optimization step; `pnpm dev` renders unoptimized images without it.

- Drop images in a per-blog `images/` subfolder:
  `src/content/blog/{name}/images/{file}.{jpg|png|webp|gif|avif|svg}`.
- Reference them in the article body with a **relative path** (no leading slash, no
  `/blog/...` prefix): `![alt](./images/d1-kalen-and-davin.jpg)`. Resolved relative to the
  article `.md` file.
- Images must live under `src/` (inside the collection folder tree), **not** `public/` —
  `public/` images are served verbatim, never optimized.
- Remote URLs (`![alt](https://...)`) stay as plain unoptimized `<img>` tags.
- The `blogs` glob only matches `**/*.{md,mdx}`, so image files in the folder are never treated
  as content entries.
- Layout: `.blog-content img` in `src/styles/global.css` (max-width 100%, height auto,
  1px `--line` border). Any image change still requires a rebuild.

### Polaroid photos (MDX, annotated)

A **Polaroid** (photo print + annotation caption) is available via the shared
`src/components/Polaroid.astro` component. It wraps an imported image in a white print frame
with a mono-font caption, rendered server-side (no JS). It uses `astro:assets` `<Image>`, so
the photo stays fully optimized (WebP, `/_astro/` output) just like markdown images.

- Requires an **`.mdx`** article (`.md` cannot embed components) and one import per photo:
  ```mdx
  import Polaroid from '../../../components/Polaroid.astro'
  import d1 from './images/d1-kalen-and-davin.jpg'

  <Polaroid image={d1} caption="Kalen and Davin getting some lunch." />
  ```
- Props: `image` (the imported `ImageMetadata`), `alt?` (falls back to `caption`),
  `caption?` (the annotation text), `emptyCaption?` (reserves the caption space with an
  empty `figcaption` — used for captionless prints so the frame doesn't cut off), plus
  optional `width`/`height`/`fit` to pass to `astro:assets` `<Image>` (used for cropped
  thumbnails). Caption is optional — the print still renders.
- Styling: print via the theme-flipping `--polaroid-bg`/`--polaroid-ink`/`--polaroid-border`
  tokens in `src/styles/global.css` (black print + light ink in dark mode, white print + dark
  ink in light mode), a soft drop shadow, and no tilt. Frame styles are scoped in
  `Polaroid.astro` — keep them token-based, no hardcoded hex.
- Note: raw HTML `<img src="./images/...">` in an article body is **not** supported — it
  bypasses the markdown image pipeline, so it is neither optimized nor path-resolved. Use
  `![]()` syntax or the `Polaroid` component instead.

### RSS feeds (global + per-blog, full content)

Two feeds are statically generated from the `blogs` collection at build time:

- **Global:** `/blog/rss.xml` (`src/pages/blog/rss.xml.ts`) — every article across all blogs,
  newest first, titled `"The Kalen Michael Experiment | Blog"`.
- **Per-blog:** `/blog/{name}/rss.xml` (`src/pages/blog/[name]/rss.xml.ts`) — that blog's articles
  only, titled `"{blogTitle} | The Kalen Michael Experiment"`.

Both share `buildFeedItems()` in `src/lib/rss.ts`, which renders each article's full MDX body
to HTML using the **Astro Container API** (`astro/container` `experimental_AstroContainer`,
`loadRenderers` from `astro:container`, and `@astrojs/mdx`'s `getContainerRenderer()`), then
rewrites relative `a[href]`/`img[src]` to absolute `site` URLs and drops `script`/`style` tags
via `ultrahtml`'s `transform`/`walk`/`sanitize`. This preserves inline MDX components
(`Polaroid`, `Comments`) in the feed. Item `pubDate` comes from each article's `date`
  (YYYY-MM-DD or `YYYY-MM-DD HH:MM`), `description` from frontmatter.

Autodiscovery: `Layout.astro` always emits `<link rel="alternate" type="application/rss+xml"
title="The Kalen Michael Experiment | Blog RSS" href="https://kalenmichael.com/blog/rss.xml" />`
(absolute URLs — root-relative hrefs break some discovery tools) in the `<head>`, plus a per-blog
feed link when a page passes the optional `rssHref` prop (the `/blog/{name}/` index does). The root
`/rss.xml` is intentionally not used — the blog feed lives under `/blog` so the site root
stays free for a future site-wide feed. No integration is needed — `@astrojs/rss` is a plain
utility (no `peerDependencies`) and the endpoints are prerendered static `.xml` files.

### Tag system (single source of truth in `src/categories.ts`)

Pillar names/labels/colors and note-tag labels/colors share one `CATEGORIES` record, so a
note tagged `LAB` uses the same label/color as the LAB pillar. Change once, applies
everywhere.

- **Note/pillar tags** (`CATEGORIES`): `RAW` (sky), `LAB` (violet), `TOOLKIT` (amber)
- **Resource tags** (`RESOURCE_TAGS`): `DOWNLOAD` (sky), `TOOLKIT` (amber), `READING` (violet)

Colors are Tailwind class strings stored in the records — keep them as full static classes
so Tailwind can detect them (no dynamic string-building of class names). Both lookups fall
back to a neutral `text-slate-400` when a tag key is unknown.

## Layout & shared components (`src/components/`, `src/layouts/`)

- `src/layouts/Layout.astro` — the HTML shell (head, favicons, theme-color metas, the
  inline FOUC theme script, imports `src/styles/global.css`) plus the app chrome:
  `ThemeToggle`, a `<header>` with a `<slot name="nav">` above `Logo`, the default
  `<slot>` for page content, and `Footer`. Props: `title`, `description`, `logoHeading`,
  `elsewhere` (default `true`; the experiment page passes `elsewhere={false}` so it omits
  the `## Elsewhere` section, same as before the migration).
- `src/components/Logo.astro` — the "welcome to the experiment / MINDSET LAB // KALEN
  MICHAEL" wordmark; `heading` prop renders `h1` (homepage) vs styled `<p>` (subpages).
- `src/components/Footer.astro` — `## Elsewhere` social links + the closing line.
- `src/components/Status.astro`, `ExperimentRow.astro`, `MoveLeftIcon.astro`.
- `src/lib/dates.ts` — pure date helpers (`toLocalDate`, `formatDateLabel`,
  `monthWeeks`, `daysRemaining`, `experimentEndDate`, `toISO`, `CalendarDay`).
- Keep tag/pillar config in `src/categories.ts`; edit date helpers there, not per-page.

## Deployment

Two paths exist; both produce the static `dist/` and deploy to GitHub Pages:

1. **Manual:** `pnpm deploy` — builds, then `gh-pages -d dist -t` pushes the static site
   to the `gh-pages` branch. Requires the repo to be pushed to GitHub first.
2. **CI:** `.github/workflows/deploy.yml` — on push to `main`, installs, `pnpm build`,
   and deploys via `actions/deploy-pages` (needs repo Settings → Pages → Source: GitHub
   Actions).

`.nojekyll` (in `public/`, copied to `dist/`) prevents Jekyll processing; `gh-pages` is
invoked with `-t` so the dotfile is included.

## Notes for agents

- Indentation outside `.astro` frontmatter/scripts follows the existing 4-space style in
  `src/content.config.ts` and `src/lib/dates.ts`. Inside `.astro` templates keep tags at
  the file's chosen indentation.
- Don't reintroduce React, `hydrateRoot`, or client routing; the Astro pages are static.
- Don't reintroduce `src/content/.../config.ts` (legacy) — `src/content.config.ts` is the
  Astro 7 location. If you see `type: 'content'` in a collection, replace it with a
  `glob` loader (legacy `type: 'content'` is not synced in Astro 7).
- Markdown comments are allowed in `.astro` files; keep `src/content.config.ts` and all
  frontmatter valid YAML. Document new metadata fields in this file.
- Before editing theme code, re-read the "Theme" section above. Rule: never read
  `window`/`localStorage` inside a page or component render body — only in the inline FOUC
  script (pre-paint) and the `ThemeToggle`/`Calendar` module scripts (post-paint).
- After content/config changes, verify with `pnpm build && pnpm preview` and check the
  page console (no hydration matches here — but watch for YAML content errors and the
  calendar/theme scripts).