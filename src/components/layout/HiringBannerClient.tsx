'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { BannerConfig } from '@/server/content/banner';

const DISMISS_KEY = 'adn_banner_dismissed_v1';

function isInternal(url: string): boolean {
  return url.startsWith('/');
}

function pathsMatch(a: string, b: string): boolean {
  const norm = (s: string) => s.replace(/\/+$/, '') || '/';
  return norm(a) === norm(b);
}

export default function HiringBannerClient({ config }: { config: BannerConfig }) {
  const pathname = usePathname() ?? '';
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(DISMISS_KEY);
      if (stored && stored === bannerSignature(config)) setDismissed(true);
    } catch {
      // ignore storage errors
    }
  }, [config]);

  if (dismissed) return null;

  if (
    config.ctaUrl &&
    isInternal(config.ctaUrl) &&
    pathsMatch(pathname, config.ctaUrl)
  ) {
    return null;
  }

  const hasCta = config.ctaUrl && config.ctaText;
  const inner = (
    <span className="container-zest flex h-full items-center justify-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em]">
      <span className="h-1.5 w-1.5 animate-blink rounded-full bg-[var(--color-accent)]" />
      {config.badge && <span className="text-white/80">{config.badge}</span>}
      {config.badge && config.message && <span className="text-white/40">·</span>}
      {config.message && <span className="font-semibold">{config.message}</span>}
      {hasCta && (
        <span className="ml-1 transition-transform group-hover:translate-x-0.5">{config.ctaText}</span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            localStorage.setItem(DISMISS_KEY, bannerSignature(config));
          } catch {
            // ignore
          }
          setDismissed(true);
        }}
        aria-label="Dismiss"
        className="ml-3 inline-flex h-5 w-5 items-center justify-center rounded text-white/60 hover:bg-white/10 hover:text-white"
      >
        ×
      </button>
    </span>
  );

  const className =
    'fixed inset-x-0 top-0 z-[60] h-9 border-b border-[var(--color-border)] bg-[var(--color-ink-warm)] text-[var(--color-bg)]';

  if (!mounted) {
    // SSR-safe render: no link, just inert markup until hydration decides
    return <div className={className}>{inner}</div>;
  }

  if (hasCta) {
    if (isInternal(config.ctaUrl)) {
      return (
        <div className={className}>
          <Link href={config.ctaUrl} className="group block h-full">
            {inner}
          </Link>
        </div>
      );
    }
    return (
      <div className={className}>
        <a
          href={config.ctaUrl}
          className="group block h-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      </div>
    );
  }
  return <div className={className}>{inner}</div>;
}

function bannerSignature(c: BannerConfig): string {
  return `${c.badge}|${c.message}|${c.ctaText}|${c.ctaUrl}`;
}
