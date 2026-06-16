import Link from 'next/link';
import { site } from '@/content/site';

type Props = {
  className?: string;
  asLink?: boolean;
  light?: boolean; // kept for API compatibility
};

/** GrowthVireX mark: radial network — five arms from a hub, mirroring the favicon. */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-[var(--color-accent)]"
    >
      {/* five primary arms (pentagon) */}
      <line x1="12" y1="12" x2="12" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="18.5" y2="9.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="16" y2="17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="8" y2="17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="5.5" y2="9.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* secondary sub-branches from top node */}
      <line x1="12" y1="4.5" x2="9.2" y2="1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="4.5" x2="14.8" y2="1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      {/* hub */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      {/* primary nodes */}
      <circle cx="12" cy="4.5" r="1.3" fill="currentColor" />
      <circle cx="18.5" cy="9.6" r="1.3" fill="currentColor" />
      <circle cx="16" cy="17.5" r="1.3" fill="currentColor" />
      <circle cx="8" cy="17.5" r="1.3" fill="currentColor" />
      <circle cx="5.5" cy="9.6" r="1.3" fill="currentColor" />
      {/* terminal dots */}
      <circle cx="9.2" cy="1.5" r="0.75" fill="currentColor" opacity="0.5" />
      <circle cx="14.8" cy="1.5" r="0.75" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export default function Logo({ className = '', asLink = true }: Props) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={24} />
      <span className="text-[1.15rem] font-bold tracking-[-0.02em] text-[var(--color-fg)]">
        GrowthVireX
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
