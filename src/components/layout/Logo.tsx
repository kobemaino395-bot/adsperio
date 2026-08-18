import Link from 'next/link';
import { site } from '@/content/site';

/**
 * The AdsPerio mark: an **A** whose apex is split open, with the crossbar in
 * indigo.
 *
 * The name is Ads + *aperio* — to uncover, to lay open — so the letter is
 * literally opened at the top. The crossbar is the line we draw through an
 * account, and it is the only indigo in the mark.
 *
 * Three strokes, no fills, no gradients. Round caps, because the whole system's
 * terminals are round (the buttons are pills). It survives 16px: at that size
 * the legs are ~2.3px and the apex gap is still legible.
 *
 * Deliberately *not* set on a rounded tile — a tile reads as an app-icon
 * placeholder in page chrome. The tile version exists only as the favicon and
 * PWA icon, where a filled shape is what the platform expects.
 */
export function LogoMark({
  size = 26,
  className = '',
  tone = 'auto',
}: {
  size?: number;
  className?: string;
  /** `auto` follows the theme; `invert` is for navy surfaces. */
  tone?: 'auto' | 'invert';
}) {
  const ink = tone === 'invert' ? 'var(--ink-inv)' : 'var(--ink)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {/* the two legs, apex left open */}
      <path
        d="M5.2 28 14.3 5"
        stroke={ink}
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      <path
        d="M17.7 5 26.8 28"
        stroke={ink}
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      {/* the crossbar — the line drawn through the account */}
      <path
        d="M9.6 19.8H22.4"
        stroke="var(--indigo)"
        strokeWidth="4.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({
  className = '',
  asLink = true,
  tone = 'auto',
  showMark = true,
}: {
  className?: string;
  asLink?: boolean;
  tone?: 'auto' | 'invert';
  showMark?: boolean;
}) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {showMark && <LogoMark tone={tone} />}
      <span
        className="text-[1.0625rem] leading-none font-semibold tracking-[-0.022em]"
        style={{ color: tone === 'invert' ? 'var(--ink-inv)' : 'var(--ink)' }}
      >
        AdsPerio
      </span>
    </span>
  );

  if (!asLink) return inner;

  return (
    <Link href="/" aria-label={`${site.name} — home`} className="inline-flex">
      {inner}
    </Link>
  );
}
