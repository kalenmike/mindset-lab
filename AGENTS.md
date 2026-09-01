# Mindset Lab — Landing Page

Personal landing page for Kalen Michael (https://kalenmichael.substack.com). A stark,
terminal-style, monospace site: "a public log of experiments in mindset, physical
endurance, and operational discipline. Real frameworks, zero wishy-washy fluff."

## Stack

- **React 19** + **TypeScript** + **Vite 8** (react-ts template)
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (no `tailwind.config`, no PostCSS)
- **pnpm** (v11) as package manager — use `pnpm`, never npm/yarn
- **lucide-react** for icons (currently `MoveLeft` in list-row hover states)
- Linting via **oxlint** (`pnpm lint`), type check via `tsc -b`

## Commands

| Command          | What it does                                                        |
| ---------------- | ------------------------------------------------------------------- |
| `pnpm dev`       | Vite dev server with HMR                                            |
| `pnpm build`     | `tsc -b` → `vite build` → `node scripts/prerender.mjs` (SSR prerender) |
| `pnpm lint`      | oxlint                                                              |
| `pnpm preview`   | Serve the built `dist/` locally                                     |
| `pnpm deploy`    | `pnpm build` then `gh-pages -d dist -t` → publishes to `gh-pages` branch |

## Architecture: statically rendered SPA

The site is **prerendered to static HTML at build time**, then **hydrated** on the client
(for the theme toggle). This is intentional — the deployed `gh-pages` site is static, not
an empty shell waiting on JS.

- `scripts/prerender.mjs` boots Vite in middleware mode, server-renders `<App/>` with
  `react-dom/server` (`renderToString`), and injects the HTML into `dist/index.html`
  inside `<div id="root">`.
- It also renders each experiment (from `src/experiments.json`) into
  `dist/experiment/{slug}/index.html`, rebasing asset URLs from `./assets/` to
  `../../assets/` so nested pages load correctly on gh-pages.
- `src/main.tsx` uses **`hydrateRoot`** (not `createRoot`) and picks which page to hydrate
  from `window.location.pathname`: `/experiments` → the index page (`src/Experiments.tsx`),
  `/vault` → `VaultPage` (`src/Vault.tsx`), `/experiment/{slug}` → `ExperimentPage`,
  anything else → the landing page.
- `vite.config.ts` uses `base: './'` so all asset URLs are relative and work under the
  GitHub Pages project subpath.

### SSR-safe theme (important!)

The theme toggle must not cause hydration mismatches. `src/App.tsx` therefore starts
`useState<Theme>('dark')` — identical to what the server renders — and resolves the real
preference inside effects:

- `getInitialTheme()` reads `localStorage['mindset-lab-theme']`, falling back to
  `prefers-color-scheme`. It is only ever called inside `useEffect` (browser-only).
- Before the effect runs, the inline script in `index.html` already applies the correct
  `html.light` class pre-paint, so there is no flash.
- Once the user manually toggles (`manualChoice`), the choice is persisted to
  `localStorage`; otherwise the site keeps following system theme changes.

Rule for agents: never read `window`/`localStorage` during the component's render body or
in `useState` initializers — keep it SSR-safe. Verify hydration with
`pnpm build && pnpm preview` and check the console for hydration warnings.

## Styling system: CSS-variable theme tokens

All color usage flows through **semantic CSS variables** defined in `src/index.css`, so the
entire palette flips instantly between dark and light with a single class — no heavy theme
libs, no re-compilation.

- `:root` holds the **dark** palette (default, matches the original design); `html.light`
  overrides the same variables for **light** mode.
- Tokens: `--surface` (page bg), `--surface-raise` (raised panels, e.g. calendar day cells),
  `--ink-strong` (headings, `text-white`),
  `--ink`/`--sub`/`--muted`/`--faint`/`--ghost` (text hierarchy), `--line`/`--line-soft`/
  `--line-bright` (borders), `--hover-surface` (CTA hover fill), `--sel-bg`/`--sel-text`
  (selection), `--accent-sky|violet|amber` (category colors), `--status-live`/`--status-complete`
  (experiment status colors, mapped to `text-red-400`/`text-green-400`).
- `--animate-blink` (step-end opacity blink) is defined in the `@theme` block for the LIVE
  status indicator.
- `@theme inline` in `index.css` remaps Tailwind classes to those tokens, e.g.
  `--color-slate-950: var(--surface)`, `--color-slate-800: var(--line)`,
  `--color-slate-900: var(--surface-raise)`, `--color-white: var(--ink-strong)`,
  `--color-sky-400: var(--accent-sky)`. This is why
  utilities like `bg-slate-950` work in both themes — **do not hardcode hex colors in
  component classes**; use the token-mapped slate classes.

### Design language

- **Monospace everywhere** — JetBrains Mono loaded via Google Fonts and set as
  `--font-mono` (`@theme` block in `index.css`).
- Deep charcoal/slate background (dark) or near-white (light), stark white/muted gray text.
  No imagery, no glossy cards — text and 1px `border-dashed border-slate-800` dividers.
- Section headings: `text-xs font-bold uppercase tracking-[0.2em] text-slate-500` with a
  `##` marker in `text-slate-700` (e.g. `## Core Pillars`).
- Buttons/CTAs: bordered `border-slate-700`, hover inverts to `bg-slate-100 text-slate-950`.
- List rows (notes/resources): bottom dashed divider, title in white, `[TAG]` colored,
  and on hover a `MoveLeft` icon slides in from the right next to the title
  (`group-hover:translate-x-0 group-hover:opacity-100`).
- Experiment status via the shared `Status` component (`src/Status.tsx`): `LIVE` renders
  red + blinking (`text-red-400 animate-blink`), `COMPLETE` renders green
  (`text-green-400`), any other value keeps the default muted style.
- `html { scroll-behavior: smooth }` supports the anchor nav (`#featured`, `#vault`,
  `#elsewhere`).

## Content: `src/content.json`

Featured notes and Vault resources live in **`src/content.json`** (imported directly in
`App.tsx`). Add/remove objects there — no code changes needed. Both lists fall back to a
neutral `text-slate-400` tag when a tag key is unknown, so new tags won't crash rendering.

### Note (`notes[]`) fields

```
no, date (YYYY-MM-DD), tag, title, desc?, href
```

### Resource (`resources[]`) fields

```
no, tag, title, desc, href
```

### Experiment (`src/experiments.json`) fields

Each experiment gets its own prerendered static page at `/experiment/{slug}`, a row on the
homepage `## Featured Experiments` section (only when `featured: true`), and a row on the
`/experiments` index page. Fields:

```
slug, title, subtitle, tagline, status, start (YYYY-MM-DD), duration,
tag (CategoryId), description, protocol[] (ordered steps), href, featured?
```

Optional **calendar** field renders a tracking calendar on the page:

```
calendar: { start: "YYYY-MM-DD", end: "YYYY-MM-DD", days: { "YYYY-MM-DD": { label, title, note } } }
```

- `calendar.days` is optional — each keyed date can carry a short `label` (shown in the day
  cell slot), a `title`, a `note` (shown in the day modal), an `href` + `linkLabel` for
  published related content (renders a link in the modal and a `↗` cell marker), and a
  `releaseDate` for content that is still in the pipeline (renders "not released yet —
  expected <date>" in the modal and a `~` cell marker). Days without an entry still render
  with a `d{n}` slot and a "no log yet" modal. Release dates are independent of challenge
  dates — the calendar is always for the challenge period.
- The calendar is a shared component, `src/Calendar.tsx`, driven by `start`/`end` dates and
  two render props: `renderDay(date)` (day slot) and `renderModal(date)` (day modal).
  Clicking a day opens the modal; Escape/backdrop/[close] dismiss it.
- The `## Calendar` section only renders when an experiment has a `calendar` field.

Add an object there and it appears on the `/experiments` index page (and the homepage
featured section if `featured: true`), and gets its own page on the next `pnpm build`.
Pages are rendered by `src/Experiment.tsx` (`ExperimentPage`); `slug` must be unique and
URL-safe.

### Tag system (single source of truth in `App.tsx`)

Pillar names/labels/colors and note-tag labels/colors share one `CATEGORIES` record, so a
note tagged `LAB` uses the same label/color as the LAB pillar. Change once, applies
everywhere.

- **Note/pillar tags** (`CATEGORIES`): `RAW` (sky), `LAB` (violet), `TOOLKIT` (amber)
- **Resource tags** (`RESOURCE_TAGS`): `DOWNLOAD` (sky), `TOOLKIT` (amber), `READING` (violet)

Colors are Tailwind class strings stored in the records — keep them as full static classes
so Tailwind can detect them (no dynamic string-building of class names).

### Page sections (top → bottom)

1. **Nav menu** — `FEATURED / EXPERIMENTS / VAULT / ELSEWHERE` anchor links (EXPERIMENTS and VAULT link to their index pages)
2. **Hero header** — `welcome to the experiment` kicker, `MINDSET LAB // KALEN MICHAEL` title, mission statement
3. **Substack CTA** — bordered button → `https://kalenmichael.substack.com`
4. **Core Pillars** — `## Core Pillars`, three numbered rows (`01 // RAW`, `02 // LAB`, `03 // TOOLKIT`); info-only (not links)
5. **Featured Experiments** — `#experiments`, rows for featured `src/experiments.json` entries (linking to `/experiment/{slug}`) + a "view all" link to `/experiments`
6. **Featured Notes** — `#featured`, from `content.json` `notes`

Vault resources live on their own `/vault` page (`src/Vault.tsx`, from `content.json`
`resources`); the `## Elsewhere` social links and closing line live in the shared `Footer`
(`src/Layout.tsx`) so they appear on every page using `PageTemplate`.

## Deployment

Two paths exist; both produce the static `dist/` and deploy to GitHub Pages:

1. **Manual:** `pnpm deploy` — builds, prerenders, then `gh-pages -d dist -t` pushes the
   static site to the `gh-pages` branch. Requires the repo to be pushed to GitHub first.
2. **CI:** `.github/workflows/deploy.yml` — on push to `main`, installs, `pnpm build`,
   and deploys via `actions/deploy-pages` (needs repo Settings → Pages → Source: GitHub
   Actions).

`.nojekyll` (in `public/`, copied to `dist/`) prevents Jekyll processing; `gh-pages` is
invoked with `-t` so the dotfile is included.

## Notes for agents

- Indentation in `src/App.tsx` is currently **4 spaces** (reformatted by the owner) —
  match the surrounding file style rather than 2-space.
- Don't reintroduce `createRoot`; the app hydrates.
- Shared modules: `src/categories.ts` (tag/pillar config), `src/theme.tsx` (SSR-safe
  `useTheme` + `ThemeToggle`), `src/Logo.tsx` (`Logo`, the "welcome to the experiment /
  MINDSET LAB // KALEN MICHAEL" wordmark), and `src/Layout.tsx` (`PageTemplate`, `Header`,
  `Footer`) are used by the landing, experiments-index, vault, and experiment pages —
  edit them there, not per-page.
  - `PageTemplate` renders the app shell (theme toggle, container, `Header` + `Footer`)
    around page content. `Header` takes the `nav` content plus `logo`/`logoHeading` props
    (pass `logoHeading` on the homepage so the wordmark is the page `h1`; on subpages omit
    it so the wordmark is a `<p>` and the page title stays the `h1`). `Footer` renders the
    `## Elsewhere` social links plus the closing line, so those live on every template page.
  - `Logo` takes a `heading` prop: `h1` when passed, otherwise a styled `<p>`.
- Keep `content.json` and `experiments.json` valid JSON — no comments allowed there;
  document new tag keys in the `CATEGORIES`/`RESOURCE_TAGS` records instead.
- Before editing theme code, re-read the "SSR-safe theme" section above.