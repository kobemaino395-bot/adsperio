/**
 * The gradient mesh.
 *
 * This is the one non-negotiable in the design system: every marketing page
 * opens with it, and a bare-canvas hero reads as off-brand. Two details do all
 * the work of keeping it from looking like a stock "AI glow":
 *
 *  1. It is a *mesh*, not a radial blob — six overlapping organic fields with
 *     different hues, sized and placed so no single one dominates.
 *  2. It ends on a hard diagonal (`mesh-layer`'s clip-path), not a soft fade.
 *     The cut edge is what makes it read as a designed band rather than a
 *     backdrop someone forgot to finish.
 *
 * Stop colours come from CSS variables, so the whole thing follows `.dark`
 * without a second copy of the markup. No randomness — server and client draw
 * the identical picture.
 */

type Blob = {
  id: string;
  color: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate: number;
  opacity: number;
};

/* Left-to-right: cream, sherbet, lavender, indigo, ruby, magenta — the only
   six stops the system allows. Anything else is a new accent colour. */
const BLOBS: Blob[] = [
  { id: 'cream',    color: 'var(--mesh-cream)',    cx: 120,  cy: 110, rx: 460, ry: 300, rotate: -18, opacity: 0.95 },
  { id: 'sherbet',  color: 'var(--mesh-sherbet)',  cx: 400,  cy: 300, rx: 380, ry: 250, rotate: 12,  opacity: 0.7 },
  { id: 'lavender', color: 'var(--mesh-lavender)', cx: 720,  cy: 60,  rx: 440, ry: 280, rotate: -8,  opacity: 0.8 },
  { id: 'indigo',   color: 'var(--mesh-indigo)',   cx: 1010, cy: 285, rx: 400, ry: 260, rotate: 16,  opacity: 0.62 },
  { id: 'ruby',     color: 'var(--mesh-ruby)',     cx: 1300, cy: 95,  rx: 330, ry: 240, rotate: -14, opacity: 0.55 },
  { id: 'magenta',  color: 'var(--mesh-magenta)',  cx: 1180, cy: 400, rx: 300, ry: 190, rotate: 6,   opacity: 0.45 },
];

export default function GradientMesh({
  className = '',
  height = 'h-[30rem] md:h-[34rem]',
}: {
  /** Extra classes on the clipped layer — usually nothing. */
  className?: string;
  /** How far down the page the band reaches. */
  height?: string;
}) {
  return (
    <div className={`mesh-layer ${height} ${className}`} aria-hidden>
      <svg
        viewBox="0 0 1440 520"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="mesh-base" x1="0" y1="0" x2="1" y2="0.55">
            <stop offset="0%" stopColor="var(--mesh-base-1)" />
            <stop offset="48%" stopColor="var(--mesh-base-2)" />
            <stop offset="100%" stopColor="var(--mesh-base-3)" />
          </linearGradient>

          {BLOBS.map((b) => (
            <radialGradient key={b.id} id={`mesh-${b.id}`}>
              <stop offset="0%" stopColor={b.color} stopOpacity={b.opacity} />
              <stop offset="55%" stopColor={b.color} stopOpacity={b.opacity * 0.45} />
              <stop offset="100%" stopColor={b.color} stopOpacity="0" />
            </radialGradient>
          ))}

          {/* The band has to land on the page colour at its lower edge or the
              diagonal cut looks like a mistake rather than a join. */}
          <linearGradient id="mesh-settle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="55%" stopColor="var(--canvas)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--canvas)" stopOpacity="1" />
          </linearGradient>
        </defs>

        <rect width="1440" height="520" fill="url(#mesh-base)" />

        <g className="dark:opacity-70">
          {BLOBS.map((b) => (
            <ellipse
              key={b.id}
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill={`url(#mesh-${b.id})`}
              transform={`rotate(${b.rotate} ${b.cx} ${b.cy})`}
            />
          ))}
        </g>

        <rect width="1440" height="520" fill="url(#mesh-settle)" />
      </svg>
    </div>
  );
}
