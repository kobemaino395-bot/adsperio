/**
 * Composited product-UI mockups — the brand's signature "look at the actual
 * product" device. Pure CSS/SVG, no images, server-rendered. Built on the
 * design tokens: white surfaces, hairline borders, navy ink, indigo accent,
 * ruby chart highlight, tabular figures.
 */
import type { ReactNode } from 'react';

/* ── Browser / app chrome frame ───────────────────────────────── */
export function BrowserFrame({
  url = 'app.growthvirex.com',
  children,
  className = '',
}: { url?: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] ${className}`}
      style={{ boxShadow: 'var(--shadow-lg)' }}
    >
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e3e8ee]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e3e8ee]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e3e8ee]" />
        </span>
        <span className="mx-auto flex w-full max-w-[260px] items-center justify-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 text-[0.7rem] text-[var(--color-fg-muted)]">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[var(--color-accent)]">
            <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" opacity="0.9" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" />
          </svg>
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ── Area chart (revenue trend) ───────────────────────────────── */
export function AreaChart({ className = '' }: { className?: string }) {
  // Rising trend; lower y = higher value.
  const pts = [185, 172, 178, 150, 158, 128, 134, 104, 96, 70, 78, 44];
  const w = 600;
  const h = 210;
  const step = w / (pts.length - 1);
  const line = pts.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${y}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const lastX = (pts.length - 1) * step;
  const lastY = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`w-full ${className}`} role="img" aria-label="Revenue trend, last 30 days">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#533afd" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#533afd" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2={w} y1={20 + i * 50} y2={20 + i * 50} stroke="var(--color-border)" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke="#533afd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="6" fill="var(--color-bg)" stroke="#533afd" strokeWidth="2.5" />
    </svg>
  );
}

/* ── Channel performance bars ─────────────────────────────────── */
export function ChannelBars({ className = '' }: { className?: string }) {
  const MAX = 120; // px — tallest bar
  const data = [
    { label: 'Meta', roas: '6.4×', v: 0.92, accent: '#533afd' },
    { label: 'Google', roas: '5.1×', v: 0.74, accent: '#665efd' },
    { label: 'TikTok', roas: '4.2×', v: 0.61, accent: '#ea2261' },
    { label: 'YouTube', roas: '3.3×', v: 0.48, accent: '#f96bee' },
    { label: 'Email', roas: '2.5×', v: 0.36, accent: '#8f86fd' },
  ];
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-2">
          <span className="tnum text-[0.65rem] font-medium text-[var(--color-fg-soft)]">{d.roas}</span>
          <div
            className="w-full rounded-t-md"
            style={{ height: Math.round(d.v * MAX), background: `linear-gradient(to top, ${d.accent}, ${d.accent}cc)` }}
          />
          <span className="text-[0.65rem] text-[var(--color-fg-muted)]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Campaign table with tabular figures ──────────────────────── */
export function CampaignTable({ className = '' }: { className?: string }) {
  const rows = [
    { name: 'Prospecting — Broad', spend: '$48,210', roas: '4.8×', up: true },
    { name: 'Retargeting — 14d', spend: '$22,640', roas: '7.1×', up: true },
    { name: 'Lookalike 1% — IG', spend: '$18,905', roas: '3.9×', up: true },
    { name: 'Search — Brand', spend: '$9,120', roas: '11.2×', up: true },
  ];
  return (
    <div className={`overflow-hidden rounded-xl border border-[var(--color-border)] ${className}`}>
      <div className="grid grid-cols-[1.6fr_1fr_0.8fr] gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] px-4 py-2.5 text-[0.62rem] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
        <span>Campaign</span>
        <span className="text-right">Spend</span>
        <span className="text-right">ROAS</span>
      </div>
      {rows.map((r) => (
        <div key={r.name} className="grid grid-cols-[1.6fr_1fr_0.8fr] items-center gap-2 border-b border-[var(--color-border)] px-4 py-3 last:border-0">
          <span className="flex items-center gap-2 truncate text-[0.8rem] text-[var(--color-fg)]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
            {r.name}
          </span>
          <span className="tnum text-right text-[0.8rem] text-[var(--color-fg-soft)]">{r.spend}</span>
          <span className="tnum text-right text-[0.8rem] font-medium text-[var(--color-accent-deep)]">{r.roas}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Stat tiles ───────────────────────────────────────────────── */
export function StatTiles({ className = '' }: { className?: string }) {
  const tiles = [
    { label: 'Revenue', value: '$2.41M', delta: '+772%' },
    { label: 'ROAS', value: '5.6×', delta: '+1.9×' },
    { label: 'CAC', value: '$31.40', delta: '−38%' },
  ];
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-2">
          <div className="text-[0.55rem] uppercase tracking-[0.08em] text-[var(--color-fg-muted)]">{t.label}</div>
          <div className="tnum mt-1 text-[0.82rem] font-light tracking-tight text-[var(--color-fg)]">{t.value}</div>
          <div className="tnum mt-0.5 text-[0.6rem] font-medium text-[var(--color-accent-deep)]">{t.delta}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Navy console / IDE panel ─────────────────────────────────── */
export function ConsolePanel({ className = '' }: { className?: string }) {
  const C = {
    mut: '#8b8fb5',
    key: '#a99bff',
    str: '#7fd0c0',
    fn: '#f6a8e0',
    num: '#ffd28a',
  };
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#2a2c66] ${className}`}
      style={{ background: '#1c1e54', boxShadow: 'var(--shadow-lg)' }}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </span>
        <span className="text-[0.7rem] text-white/40">track.ts — conversion API</span>
      </div>
      <pre className="tnum overflow-x-auto px-5 py-4 text-[0.72rem] leading-[1.7]" style={{ fontFamily: 'var(--font-mono)' }}>
<span style={{ color: C.mut }}>{'// server-side conversion event'}</span>{'\n'}
<span style={{ color: C.key }}>await</span> gvx.<span style={{ color: C.fn }}>track</span>({'{'}{'\n'}
{'  '}event<span style={{ color: C.mut }}>:</span> <span style={{ color: C.str }}>{"'purchase'"}</span>,{'\n'}
{'  '}value<span style={{ color: C.mut }}>:</span> <span style={{ color: C.num }}>248.00</span>,{'\n'}
{'  '}currency<span style={{ color: C.mut }}>:</span> <span style={{ color: C.str }}>{"'USD'"}</span>,{'\n'}
{'  '}attribution<span style={{ color: C.mut }}>:</span> <span style={{ color: C.str }}>{"'meta/cbo-broad'"}</span>,{'\n'}
{'}'});{'\n'}
<span style={{ color: C.mut }}>{'// → matched in 41ms · ROAS recalculated'}</span>
      </pre>
    </div>
  );
}

/* ── Full composite: chart + tiles + table + floating toast ───── */
export function DashboardComposite({ className = '' }: { className?: string }) {
  return (
    <div className={`relative pb-8 ${className}`}>
      <BrowserFrame>
        <div className="grid grid-cols-[1.4fr_1fr] gap-5 p-5 sm:p-6">
          {/* main chart card */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">Revenue · last 30 days</div>
                <div className="tnum mt-1 text-2xl font-light tracking-tight text-[var(--color-fg)]">$2,413,980</div>
              </div>
              <span className="tnum rounded-full bg-[var(--color-zest-50)] px-2 py-1 text-[0.65rem] font-medium text-[var(--color-accent-deep)]">▲ 772%</span>
            </div>
            <AreaChart className="mt-3" />
          </div>

          {/* right column: tiles + table */}
          <div className="flex flex-col gap-4">
            <StatTiles />
            <CampaignTable />
          </div>
        </div>
      </BrowserFrame>

      {/* floating conversion toast */}
      <div
        className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 sm:flex"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-zest-50)] text-[var(--color-accent)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <div>
          <div className="text-[0.72rem] font-medium text-[var(--color-fg)]">New conversion</div>
          <div className="tnum text-[0.66rem] text-[var(--color-fg-muted)]">+$248.00 · meta/cbo-broad</div>
        </div>
      </div>
    </div>
  );
}
