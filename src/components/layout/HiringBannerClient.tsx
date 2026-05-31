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
    <span className="flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-alt)]/90 py-1.5 pl-3.5 pr-1.5 shadow-[var(--shadow-md)] backdrop-blur transition-transform duration-200 group-hover:-translate-y-0.5">
      <span className="h-1.5 w-1.5 shrink-0 animate-blink rounded-full bg-[var(--color-accent)]" />
      <span className="min-w-0 truncate text-xs">
        {config.badge && <span className="font-semibold text-[var(--color-accent)]">{config.badge}</span>}
        {config.badge && config.message && <span className="text-[var(--color-fg-muted)]"> · </span>}
        {config.message && <span className="text-[var(--color-fg-muted)]">{config.message}</span>}
        {hasCta && (
          <span className="ml-1.5 font-semibold text-[var(--color-fg)] transition-transform group-hover:translate-x-0.5">
            {config.ctaText}
          </span>
        )}
      </span>
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
        className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-sunken)] hover:text-[var(--color-fg)]"
      >
        ×
      </button>
    </span>
  );

  const className =
    'fixed bottom-5 right-5 z-[60] max-w-[calc(100vw-2.5rem)]';

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
