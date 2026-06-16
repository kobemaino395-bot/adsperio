import Link from 'next/link';
import { site } from '@/content/site';

type Props = {
  className?: string;
  asLink?: boolean;
  light?: boolean; // kept for API compatibility
};

/** GrowthVireX mark: bold G lettermark in a rounded accent tile. */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="shrink-0 inline-grid place-items-center bg-[var(--color-accent)] font-bold text-white"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        fontSize: Math.round(size * 0.6),
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}
    >
      G
    </span>
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
