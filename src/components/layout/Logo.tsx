import Link from 'next/link';
import { site } from '@/content/site';

type Props = {
  className?: string;
  asLink?: boolean;
  light?: boolean; // kept for API compatibility
};

/** GrowthVireX mark: a node branching upward into two — growth that spreads. */
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
      <path
        d="M12 21V13M12 13L6 7.5M12 13L18 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="21" r="2" fill="currentColor" />
      <circle cx="6" cy="6.5" r="2.6" fill="currentColor" />
      <circle cx="18" cy="6.5" r="2.6" fill="currentColor" />
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
