# AdsPerio — design system

Implemented from **`design-md/stripe/DESIGN.md`** in
[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — an
inspired interpretation of Stripe's design language.

Three things carry the identity. Everything else stays out of the way.

1. **The gradient mesh** over the fold of every marketing page.
2. **Deep navy ink** (`#0d253d`) — never black, never grey.
3. **One indigo filled pill per band.** Indigo is a CTA colour, not a type colour.

---

## 0. Where this deviates from the source spec

Two deliberate departures, both recorded so they do not get "fixed" later:

- **Body copy is weight 400, not 300.** The spec sets body at 300, but that
  assumes Söhne Leicht. Inter 300 is optically much lighter than Söhne 300, and
  at 15px it turns grey. The display tier and the lede keep 300 — that is where
  the signature actually lives, and the spec's own "don't" is about display.
- **Dark mode exists.** The spec's marketing surface is light-only, but it also
  describes a dashboard track that "flips polarity to a familiar dark-app
  shell." That shell is the dark theme here: navy canvas, same indigo, mesh
  re-grounded on navy at 70% blob opacity.

---

## 1. Non-negotiables

Stripe's language is the most-copied look on the web, so the difference between
"Stripe" and template slop is entirely execution. These are the specific ways it
goes wrong:

**Never:**

- A blurred purple radial as "the gradient." The mesh is six overlapping organic
  fields in a fixed left-to-right hue order, and it ends on a **hard diagonal**,
  not a fade. See `mesh-layer`'s clip-path.
- New accent colours. The only chromatic values in the system are the six mesh
  stops plus indigo. A new hue is a bug.
- Indigo as body text, or more than one filled indigo pill inside a band.
- Rounded-rectangle buttons. Buttons are pills — `9999px`, no exceptions.
- Decorative drop shadows. Level 1 lifts a card; level 2 is for product mockups.
  Nothing else casts.
- Stock photography. The visual system is product panels (§7).
- Numbers without `tnum`.
- Display type above weight 300.
- Emoji in UI or copy.

**Copy — never use:** unlock, elevate, supercharge, seamless, journey, transform,
empower, delve, landscape, leverage (as a verb), cutting-edge, game-changing,
robust, holistic, synergy, best-in-class, "in today's fast-paced…", "It's not just
X — it's Y", "We don't just X, we Y".

**Copy — do:** state numbers. Short declaratives. Name the thing. Admit limits.
Vary sentence length. Em-dashes sparingly — more than one per paragraph is a tell.

---

## 2. Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `canvas` | `#ffffff` | `#0a1a2f` | Page |
| `canvas-soft` | `#f6f9fc` | `#0f2439` | Feature bands under the hero |
| `canvas-deep` | `#eef3f9` | `#071324` | Zebra, sunken wells |
| `cream` | `#f5e9d4` | `#f5e9d4` | The warm interlude band |
| `surface-inv` / `ink-inv` | navy / white | near-white / navy | Polarity-flipped plate |
| `navy-900` | `#1c1e54` | `#1c1e54` | Dashboard chrome, closing CTA tier |
| `ink` | `#0d253d` | `#eef4fb` | Body + display |
| `ink-2` | `#273951` | `#bfcfe2` | Secondary |
| `ink-mute` | `#64748d` | `#8298b3` | Helper, captions, table labels |
| `hairline` | `#e3e8ee` | `rgba(227,232,238,.14)` | Card and table borders |
| `hairline-strong` | `#a8c3de` | `rgba(168,195,222,.38)` | Form inputs |
| `indigo` | `#533afd` | `#533afd` | **The CTA.** |
| `indigo-text` | `#533afd` | `#a49bff` | Indigo as *type* — links, eyebrows |
| `ruby` / `magenta` / `lemon` | — | — | Mesh stops; ruby also marks loss in charts |

`indigo` and `indigo-text` are separate on purpose: the fill works on both
themes, the type does not.

Tailwind utilities are generated from these (`bg-canvas`, `text-ink-mute`,
`border-hairline`, `bg-indigo`…) and follow `.dark` automatically. **Do not**
hand-write `dark:` colour overrides, and do not put raw hex in components.

---

## 3. Type

**Inter** (`var(--font-inter)`, exposed as `font-sans`) at 300 / 400 / 500 — the
substitute the source spec names for Söhne. `font-feature-settings: "ss01"` is on
globally at `body`.

**IBM Plex Mono** (`font-mono`) is scoped to the faux-console panel and to
technical strings in the admin (slugs, URLs, filenames). It never appears in page
chrome — no mono nav, no mono eyebrows.

| Utility | Size | Weight | Tracking |
| --- | --- | --- | --- |
| `display-1` | 36 → 56px | 300 | −0.025em |
| `display-2` | 30 → 48px | 300 | −0.02em |
| `display-3` | 24 → 32px | 300 | −0.02em |
| `figure-xl` | 32 → 48px | 300 | −0.025em, `tnum` |
| `lede` | 17 → 20px | 300 | −0.005em |
| body (default) | 15px | 400 | 0 |
| `caption` | 13px | 400 | −0.01em, `tnum` |
| `eyebrow` | 11px | 500 | 0.09em, caps, indigo |

Negative tracking on the display tier is the signature. So is `tnum`: every
money, count, date and table cell is tabular. `.tnum`, `table td` and `table th`
get it automatically.

---

## 4. Components

Defined as Tailwind v4 `@utility` in `src/app/globals.css`:

| Utility | Notes |
| --- | --- |
| `wrap` / `wrap-tight` | 75rem (~1200px) / 46rem for prose |
| `btn` + `btn-solid` \| `btn-line` \| `btn-ghost` \| `btn-invert` \| `btn-invert-line` | Pills, `8px 16px`, label 500. `btn-sm` for nav |
| `link-arrow` | Indigo, no underline, arrow steps forward on hover |
| `link-inline` | Indigo prose link, underline on hover only |
| `card` / `card-lift` | 12px radius, hairline. `card-lift` adds level-1 → level-2 on hover |
| `card-navy` / `card-cream` | The two polarity/interlude tiers |
| `panel` | Product-mockup chrome: 16px radius, level-2 shadow, no border |
| `pill-tag` | Subdued indigo tag, 10px caps |
| `field` / `field-label` | 6px radius, `hairline-strong` border, indigo focus ring |
| `mesh-host` / `mesh-layer` | Mounting hardware for the mesh (§5) |

Elevation: level 1 `rgba(0,55,112,.08) 0 1px 3px`, level 2
`… 0 8px 24px, … 0 2px 6px` — as `shadow-lift-1` / `shadow-lift-2`. Both are
tinted with the brand's shadow blue, not black.

Radii: 4 / 6 / 8 / 12 / 16 / pill. Nothing else.

Shared page furniture lives in `src/components/layout/`: `PageHero` (mesh +
eyebrow + display + lede, optional product panel) and `CtaPanel` (navy closing
band). Use them rather than re-rolling a hero.

---

## 5. The gradient mesh

`src/components/mesh/GradientMesh.tsx`. Non-negotiable on marketing heroes — a
bare-canvas hero reads as off-brand.

It is SVG, not a CSS gradient, because the real thing has organic blob shapes CSS
cannot make. Six radial fields in fixed order — cream, sherbet, lavender, indigo,
ruby, magenta — over a three-stop base wash, then a settle gradient that lands the
band on the page colour. Stop colours come from `--mesh-*` variables so one copy
of the markup serves both themes.

The **hard diagonal** at the bottom edge (`mesh-layer`'s clip-path) is what makes
it read as a designed band rather than an unfinished backdrop. Do not replace it
with a fade.

Deterministic: no `Math.random`, so server and client draw the same picture.

---

## 6. Logo

`src/components/layout/Logo.tsx`. The mark is an **A with its apex split open**
and the crossbar in indigo — *aperio*, laid open. Three round-capped strokes at
4.6 units on a 32 grid, no fills, no gradients.

- **In page chrome the mark is bare — never on a tile.** A rounded tile behind a
  glyph reads as an app-icon placeholder. The tile version exists only as the
  favicon, apple-touch and PWA icons, where platforms expect a filled shape:
  navy tile, white legs, indigo crossbar, glyph at 0.72 scale.
- The crossbar is the only indigo in the mark, and it is the only colour.
- Round caps are deliberate — they are the same terminals as the pill buttons.
- Minimum size 16px. Below that the apex gap closes up; use the wordmark alone.
- Raster icons are generated from `src/app/icon.svg` with `sharp`; regenerate
  them whenever the SVG changes, or the favicon and the header will disagree.

---

## 7. Imagery

No photography. `src/components/product/ProductPanels.tsx` is the visual system —
the charts and tables an account review actually produces, drawn as product UI:
reconciliation, account ledger, creative grid, geo holdout, waterfall, console,
case-study cover, monogram.

Rules for anything added there: deterministic, `tnum` on every figure, indigo
marks the answer and ruby marks the loss, one indigo mark per panel, colours from
tokens only.

People are typographic monograms, not portraits.

---

## 8. Layout

- Fixed header, 4rem, translucent (`bg-canvas/70` + blur) so it floats over the
  mesh rather than plating over it.
- Section rhythm: `py-20 md:py-28`, alternating `canvas` / `canvas-soft` bands
  separated by a single hairline.
- One cream band per page, maximum, as a warm interlude.
- Every page closes with `CtaPanel`.
- Content 75rem; long-form prose 46rem.

---

## 9. Motion

`Reveal` (fade + 10px rise, 500ms) on section entry, hover colour transitions at
150ms, and the account ticker. That is the whole vocabulary.
`prefers-reduced-motion` is honoured globally in `globals.css`.
