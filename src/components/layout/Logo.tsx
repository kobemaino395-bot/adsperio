import Link from 'next/link';
import { site } from '@/content/site';

type Props = {
  className?: string;
  /** size of the glyph in px */
  size?: number;
  /** render as plain markup (no link) */
  asLink?: boolean;
};

/**
 * GrowthVireX mark: an "X" of network strokes whose nodes spread outward —
 * the top-right node ignites in the vermilion spark (growth going contagious).
 */
export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M6.5 6.5 L21.5 21.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M21.5 6.5 L6.5 21.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" opacity="0.45" />
      <circle cx="6.5" cy="21.5" r="2.4" fill="currentColor" opacity="0.55" />
      <circle cx="6.5" cy="6.5" r="2.4" fill="currentColor" opacity="0.55" />
      <circle cx="21.5" cy="21.5" r="2.4" fill="currentColor" opacity="0.55" />
      <circle cx="21.5" cy="6.5" r="4" fill="var(--color-accent)" />
    </svg>
  );
}

export default function Logo({ className = '', size = 26, asLink = true }: Props) {
  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className="font-serif text-[1.15rem] font-extrabold leading-none tracking-[-0.02em]">
        Growth<span className="text-[var(--color-accent)]">Vire</span>X
      </span>
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link href="/" aria-label={`${site.name} — home`}>
      {inner}
    </Link>
  );
}
