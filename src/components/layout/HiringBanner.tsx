'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HiringBanner() {
  const pathname = usePathname();

  if (pathname?.startsWith('/careers')) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-9 border-b border-[var(--color-border)] bg-[var(--color-ink-warm)] text-[var(--color-bg)]">
      <Link
        href="/careers/ads-manager/"
        className="group container-zest flex h-full items-center justify-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em]"
      >
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-[var(--color-accent)]" />
        <span className="text-white/80">We&apos;re hiring</span>
        <span className="text-white/40">·</span>
        <span className="font-semibold">Ads Manager</span>
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  );
}
