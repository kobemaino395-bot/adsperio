/**
 * The product-mockup system.
 *
 * The design spec's argument for this brand is "look at the actual product",
 * so every feature on the site is paired with a composited panel rather than a
 * photograph or an icon. These are the panels: the charts and tables an account
 * review actually produces, drawn as product UI.
 *
 * House rules for anything added here:
 *  - Deterministic. No Math.random, no Date at render time — server and client
 *    must draw the identical picture.
 *  - Every figure is tabular (`tnum`). This is a business about money.
 *  - Indigo marks the answer, ruby marks the loss, everything else is ink.
 *    One indigo mark per panel; if there are two, one of them is decoration.
 *  - Colours come from theme tokens, never hex, so both themes work.
 */

/* ── shared chrome ──────────────────────────────────────────────────── */

/**
 * A product panel: 16px radius, level-2 shadow, no hairline border. The
 * shadow is what separates a product surface from a content card.
 */
function Panel({
  title,
  meta,
  children,
  className = '',
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={`panel ${className}`}>
      <figcaption className="border-hairline flex items-center justify-between gap-4 border-b px-4 py-3">
        <span className="text-ink text-[0.8125rem] font-medium">{title}</span>
        {meta && <span className="caption shrink-0">{meta}</span>}
      </figcaption>
      {children}
    </figure>
  );
}

/** Axis and series labels. Sans, small, muted, tabular. */
function tick(anchor: 'start' | 'middle' | 'end' = 'middle') {
  return {
    textAnchor: anchor,
    className: 'fill-[var(--ink-mute)] text-[9px] [font-variant-numeric:tabular-nums]',
  };
}

function Key({
  children,
  color,
  dash,
}: {
  children: React.ReactNode;
  color: string;
  dash?: boolean;
}) {
  return (
    <span className="caption flex items-center gap-2">
      <svg width="16" height="8" aria-hidden>
        <line
          x1="0"
          y1="4"
          x2="16"
          y2="4"
          stroke={color}
          strokeWidth={dash ? 1.5 : 2.5}
          strokeLinecap="round"
          strokeDasharray={dash ? '4 3' : undefined}
        />
      </svg>
      {children}
    </span>
  );
}

/* ── 01 · Reconciliation ────────────────────────────────────────────── */

const RECON = [
  { m: 'Sep', reported: 412, actual: 168 },
  { m: 'Oct', reported: 438, actual: 191 },
  { m: 'Nov', reported: 502, actual: 226 },
  { m: 'Dec', reported: 611, actual: 344 },
  { m: 'Jan', reported: 396, actual: 249 },
  { m: 'Feb', reported: 374, actual: 262 },
  { m: 'Mar', reported: 401, actual: 311 },
  { m: 'Apr', reported: 418, actual: 342 },
  { m: 'May', reported: 430, actual: 371 },
  { m: 'Jun', reported: 442, actual: 396 },
  { m: 'Jul', reported: 451, actual: 419 },
  { m: 'Aug', reported: 463, actual: 441 },
];

/**
 * The flagship panel: platform-reported revenue against revenue reconciled to
 * the client's books. The band between the two lines is the entire argument
 * for the company, so it is drawn literally — in ruby, because it is a loss.
 */
export function ReconciliationPlate({ className = '' }: { className?: string }) {
  const W = 640;
  const H = 268;
  const pad = { t: 22, r: 20, b: 30, l: 44 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = 640;

  const x = (i: number) => pad.l + (i * iw) / (RECON.length - 1);
  const y = (v: number) => pad.t + ih - (v / max) * ih;

  const line = (key: 'reported' | 'actual') =>
    RECON.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ');

  const gap =
    RECON.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.reported).toFixed(1)}`).join(' ') +
    ' ' +
    RECON.slice()
      .reverse()
      .map((d, i) => `L${x(RECON.length - 1 - i).toFixed(1)},${y(d.actual).toFixed(1)}`)
      .join(' ') +
    ' Z';

  return (
    <Panel title="Spend reconciliation" meta="12 mo · indexed" className={className}>
      <div className="px-3 pt-4 pb-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Platform-reported revenue converging on reconciled revenue over twelve months."
        >
          <defs>
            <linearGradient id="pp-recon-gap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ruby)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--ruby)" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {[0, 160, 320, 480, 640].map((v) => (
            <g key={v}>
              <line
                x1={pad.l}
                x2={W - pad.r}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--hairline)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text x={pad.l - 8} y={y(v) + 3.5} {...tick('end')}>
                {v}
              </text>
            </g>
          ))}

          {/* the overstatement */}
          <path d={gap} fill="url(#pp-recon-gap)" />

          {/* claimed */}
          <path
            d={line('reported')}
            fill="none"
            stroke="var(--ruby)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* real */}
          <path
            d={line('actual')}
            fill="none"
            stroke="var(--indigo)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* where they meet */}
          <circle
            cx={x(RECON.length - 1)}
            cy={y(RECON[RECON.length - 1].actual)}
            r="5"
            fill="var(--indigo)"
            stroke="var(--canvas)"
            strokeWidth="2.5"
          />

          {RECON.map((d, i) => (
            <text key={d.m} x={x(i)} y={H - 10} {...tick()}>
              {d.m}
            </text>
          ))}
        </svg>
      </div>

      <div className="border-hairline bg-canvas-soft flex flex-wrap items-center gap-x-5 gap-y-2 border-t px-4 py-3">
        <Key color="var(--ruby)" dash>
          Platform reported
        </Key>
        <Key color="var(--indigo)">Reconciled to books</Key>
        <span className="caption ml-auto">
          Variance <span className="text-ink font-medium">2.7x → 1.05x</span>
        </span>
      </div>
    </Panel>
  );
}

/* ── 02 · Account ledger ────────────────────────────────────────────── */

const LEDGER = [
  { campaign: 'Brand — exact', spend: '18,400', claimed: '9.8x', real: '1.2x', flag: 'cut' },
  { campaign: 'Shopping — core', spend: '61,250', claimed: '4.1x', real: '3.8x', flag: 'hold' },
  { campaign: 'PMax — catalogue', spend: '44,900', claimed: '5.6x', real: '2.4x', flag: 'watch' },
  { campaign: 'Prospecting — broad', spend: '52,700', claimed: '2.2x', real: '2.1x', flag: 'scale' },
  { campaign: 'Retargeting — 7d', spend: '12,050', claimed: '11.4x', real: '0.9x', flag: 'cut' },
];

/** An account read as it actually gets delivered: a table, with a verdict. */
export function AccountLedgerPlate({ className = '' }: { className?: string }) {
  return (
    <Panel title="Account read" meta="Sample · anonymised" className={className}>
      {/* Five columns of tabular figures bottom out around 350px, which is wider
          than the panel gets on a phone. Without this the table breaks out
          through the panel's rounded edge, so it scrolls inside instead. */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-hairline bg-canvas-soft border-b">
              <th className="caption px-4 py-2.5 font-medium">Campaign</th>
              <th className="caption px-2 py-2.5 text-right font-medium">Spend</th>
              <th className="caption px-2 py-2.5 text-right font-medium">Claimed</th>
              <th className="caption px-2 py-2.5 text-right font-medium">Real</th>
              <th className="caption px-4 py-2.5 text-right font-medium">Call</th>
            </tr>
          </thead>
          <tbody className="divide-hairline divide-y">
            {LEDGER.map((r) => (
              <tr key={r.campaign}>
                <td className="px-4 py-2.5 text-[0.8125rem]">{r.campaign}</td>
                <td className="px-2 py-2.5 text-right text-[0.8125rem] tabular-nums">{r.spend}</td>
                <td className="text-ink-mute px-2 py-2.5 text-right text-[0.8125rem] tabular-nums line-through decoration-[var(--ruby)]/50">
                  {r.claimed}
                </td>
                <td className="px-2 py-2.5 text-right text-[0.8125rem] font-medium tabular-nums">
                  {r.real}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {r.flag === 'cut' ? (
                    <span className="bg-indigo text-indigo-ink inline-flex rounded-full px-2 py-0.5 text-[0.625rem] font-medium tracking-[0.06em] uppercase">
                      {r.flag}
                    </span>
                  ) : (
                    <span className="text-ink-mute text-[0.625rem] tracking-[0.06em] uppercase">
                      {r.flag}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── 03 · Creative test grid ────────────────────────────────────────── */

/* 63 cells, 7 winners — the one-in-nine rate, drawn. Fixed indices, not
   random, so the panel is identical on every render. */
const WINNERS = new Set([4, 11, 19, 28, 37, 49, 58]);

export function CreativeGridPlate({ className = '' }: { className?: string }) {
  return (
    <Panel title="Creative tests" meta="63 concepts · 1 quarter" className={className}>
      <div className="p-4">
        <div className="grid grid-cols-9 gap-1.5">
          {Array.from({ length: 63 }, (_, i) => (
            <span
              key={i}
              className={`block aspect-[4/5] rounded-[3px] ${
                WINNERS.has(i) ? 'bg-indigo' : 'bg-canvas-deep'
              }`}
            />
          ))}
        </div>
        <p className="caption mt-3.5 flex items-center justify-between">
          <span>Beat control</span>
          <span className="text-ink font-medium">7 / 63</span>
        </p>
      </div>
    </Panel>
  );
}

/* ── 04 · Geo holdout ───────────────────────────────────────────────── */

const HOLDOUT_ON = [42, 44, 47, 46, 51, 55, 58, 61, 60, 64, 67, 71];
const HOLDOUT_OFF = [41, 43, 45, 46, 44, 43, 41, 40, 38, 37, 35, 34];

/** A geo holdout that actually separated. */
export function HoldoutPlate({ className = '' }: { className?: string }) {
  const W = 560;
  const H = 210;
  const pad = { t: 22, r: 18, b: 26, l: 34 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = 80;

  const x = (i: number) => pad.l + (i * iw) / (HOLDOUT_ON.length - 1);
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const path = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  const splitX = x(4);

  return (
    <Panel title="Geo holdout" meta="12 wks · 22 markets" className={className}>
      <div className="px-3 pt-4 pb-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Treated markets rising while held-out markets decline after spend is switched off."
        >
          <defs>
            <linearGradient id="pp-holdout-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--indigo)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--indigo)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 20, 40, 60, 80].map((v) => (
            <line
              key={v}
              x1={pad.l}
              x2={W - pad.r}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--hairline)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path
            d={`${path(HOLDOUT_ON)} L${x(HOLDOUT_ON.length - 1).toFixed(1)},${(pad.t + ih).toFixed(1)} L${pad.l},${(pad.t + ih).toFixed(1)} Z`}
            fill="url(#pp-holdout-fill)"
          />

          {/* the moment spend stopped in the holdout markets */}
          <line
            x1={splitX}
            x2={splitX}
            y1={pad.t - 8}
            y2={pad.t + ih}
            stroke="var(--hairline-strong)"
            strokeWidth="1"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
          <text x={splitX + 6} y={pad.t - 3} {...tick('start')}>
            SPEND OFF
          </text>

          <path
            d={path(HOLDOUT_ON)}
            fill="none"
            stroke="var(--indigo)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={path(HOLDOUT_OFF)}
            fill="none"
            stroke="var(--ink-mute)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          <circle
            cx={x(HOLDOUT_ON.length - 1)}
            cy={y(HOLDOUT_ON[HOLDOUT_ON.length - 1])}
            r="5"
            fill="var(--indigo)"
            stroke="var(--canvas)"
            strokeWidth="2.5"
          />
        </svg>
      </div>
      <div className="border-hairline bg-canvas-soft flex flex-wrap items-center gap-x-5 gap-y-2 border-t px-4 py-3">
        <Key color="var(--indigo)">Treated</Key>
        <Key color="var(--ink-mute)" dash>
          Held out
        </Key>
        <span className="caption ml-auto">
          Lift <span className="text-ink font-medium">+31%</span> · p=0.03
        </span>
      </div>
    </Panel>
  );
}

/* ── 05 · Waterfall ─────────────────────────────────────────────────── */

const WATERFALL = [
  { label: 'Gross spend', v: 100, kind: 'base' as const },
  { label: 'Non-incremental', v: -22, kind: 'down' as const },
  { label: 'Tracking loss', v: -9, kind: 'down' as const },
  { label: 'Recovered', v: 14, kind: 'up' as const },
  { label: 'Working media', v: 83, kind: 'total' as const },
];

/** Where the money actually went. Reads left to right like a P&L bridge. */
export function WaterfallPlate({ className = '' }: { className?: string }) {
  const W = 560;
  const H = 220;
  const pad = { t: 16, r: 16, b: 40, l: 16 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const colW = iw / WATERFALL.length;
  const barW = colW * 0.56;
  const scale = (v: number) => (v / 110) * ih;

  const isAnchorKind = (k: (typeof WATERFALL)[number]['kind']) => k === 'base' || k === 'total';

  // Running total entering each column. Anchors reset the line to their own
  // value; deltas accumulate. Scanned per-column so nothing is reassigned
  // across the render.
  const carriedIn = WATERFALL.map((_, i) =>
    WATERFALL.slice(0, i).reduce((run, d) => (isAnchorKind(d.kind) ? d.v : run + d.v), 0)
  );

  const bars = WATERFALL.map((d, i) => {
    const isAnchor = isAnchorKind(d.kind);
    const running = carriedIn[i]!;
    const top = isAnchor ? scale(d.v) : scale(running + Math.max(d.v, 0));
    const h = isAnchor ? scale(d.v) : scale(Math.abs(d.v));
    return {
      ...d,
      x: pad.l + i * colW + (colW - barW) / 2,
      y: pad.t + ih - top,
      h: Math.max(h, 2),
    };
  });

  const fill = (kind: (typeof WATERFALL)[number]['kind']) =>
    kind === 'total' ? 'var(--indigo)' : kind === 'down' ? 'var(--ruby)' : 'var(--ink-2)';

  return (
    <Panel title="Where the budget went" meta="Indexed to 100" className={className}>
      <div className="px-3 pt-4 pb-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="A bridge from gross spend to working media after removing non-incremental spend and tracking loss."
        >
          <line
            x1={pad.l}
            x2={W - pad.r}
            y1={pad.t + ih}
            y2={pad.t + ih}
            stroke="var(--hairline)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {bars.map((b) => (
            <g key={b.label}>
              <rect
                x={b.x}
                y={b.y}
                width={barW}
                height={b.h}
                rx="3"
                fill={fill(b.kind)}
                opacity={b.kind === 'down' ? 0.85 : 1}
              />
              <text x={b.x + barW / 2} y={pad.t + ih + 15} {...tick()}>
                {b.v > 0 && b.kind !== 'base' && b.kind !== 'total' ? '+' : ''}
                {b.v}
              </text>
              <text x={b.x + barW / 2} y={pad.t + ih + 28} {...tick()}>
                {b.label.length > 14 ? b.label.slice(0, 13) + '…' : b.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Panel>
  );
}

/* ── 06 · Console ───────────────────────────────────────────────────── */

/* Kept short and narrow on purpose: the console overlaps the chart panel it
   annotates, so every extra line steals plot area. Nothing here may be wide
   enough to need a scrollbar. */
const CONSOLE_LINES: { text: string; tone?: 'cmd' | 'key' | 'val' }[] = [
  { text: 'reconcile --acct acme', tone: 'cmd' },
  { text: 'reported   463,180.00' },
  { text: 'settled    441,905.42' },
  { text: 'variance         1.05x', tone: 'key' },
  { text: '3 flagged · 1 paused', tone: 'val' },
];

/**
 * The faux-console panel. This is the one place mono type is allowed — it is
 * product UI, not page chrome.
 */
export function ConsolePanel({ className = '' }: { className?: string }) {
  return (
    <div className={`panel bg-navy-900 ${className}`} aria-hidden>
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-1.5 font-mono text-[0.625rem] text-white/40">reconcile.log</span>
      </div>
      <pre className="overflow-hidden px-3.5 py-3 font-mono text-[0.625rem] leading-[1.7] text-white/60">
        {CONSOLE_LINES.map((l, i) => (
          <div key={i} className={l.tone === 'cmd' ? 'mb-2 text-white/40' : undefined}>
            {l.tone === 'key' ? (
              <span className="text-[var(--indigo-soft)]">{l.text}</span>
            ) : l.tone === 'val' ? (
              <span className="mt-1 inline-block text-white">{l.text}</span>
            ) : (
              l.text
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ── 07 · Case study cover ──────────────────────────────────────────── */

/** Deterministic 32-bit hash — turns a slug into a stable shape. */
function seedFrom(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seriesFor(slug: string, n = 26): number[] {
  let s = seedFrom(slug) || 1;
  const out: number[] = [];
  let v = 26;
  for (let i = 0; i < n; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const noise = ((s >>> 16) % 100) / 100;
    v = v + (noise - 0.34) * 7 + i * 0.9;
    out.push(Math.max(6, Math.min(96, v)));
  }
  return out;
}

/**
 * Cover art for a case study. Same slug always yields the same chart, so no
 * two studies look alike and nothing shifts between server and client.
 */
export function CoverPlate({
  slug,
  figure,
  label,
  className = '',
}: {
  slug: string;
  figure: string;
  label: string;
  className?: string;
}) {
  const data = seriesFor(slug);
  const W = 520;
  const H = 260;
  const pad = 24;
  const x = (i: number) => pad + (i * (W - pad * 2)) / (data.length - 1);
  const y = (v: number) => H - pad - (v / 100) * (H - pad * 2);

  const line = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(1)},${H - pad} L${pad},${H - pad} Z`;

  return (
    <div
      className={`bg-canvas-soft border-hairline relative overflow-hidden rounded-xl border ${className}`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-full w-full"
        aria-hidden
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`cover-${slug}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--indigo)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--indigo)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#cover-${slug})`} />
        <path
          d={line}
          fill="none"
          stroke="var(--indigo)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <span className="figure-xl text-[2.25rem] leading-none md:text-[2.75rem]">{figure}</span>
        <span className="caption max-w-[9rem] text-right leading-tight">{label}</span>
      </div>
    </div>
  );
}

/* ── 08 · Monogram ──────────────────────────────────────────────────── */

/**
 * People are set in type, not photographed. Initials on a tinted tile — the
 * tint is picked from the mesh stops by hashing the name, so a person keeps
 * the same colour everywhere on the site.
 */
const MONOGRAM_TINTS = [
  'var(--indigo)',
  'var(--lavender)',
  'var(--ruby)',
  'var(--sherbet)',
] as const;

export function MonogramPlate({ name, className = '' }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const tint = MONOGRAM_TINTS[seedFrom(name) % MONOGRAM_TINTS.length];

  return (
    <div
      className={`bg-canvas-soft border-hairline relative grid aspect-[4/5] place-items-center overflow-hidden rounded-xl border ${className}`}
      aria-hidden
    >
      <span
        className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-[0.18] blur-2xl"
        style={{ background: tint }}
      />
      <span className="text-[2.75rem] leading-none font-light tracking-[-0.03em]">{initials}</span>
    </div>
  );
}
