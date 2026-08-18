'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import type { BannerConfig } from '@/server/content/banner';

const DISMISS_KEY = 'adn_banner_dismissed_v1';

/** The dismissal lives in localStorage, which React can't see. Exposing it as
 *  an external store keeps the server render (nothing dismissed) and the
 *  client render in sync without a setState-in-effect, and lets a dismissal in
 *  one tab close the banner in the others. */
const listeners = new Set<() => void>();

function subscribeDismissal(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readDismissal(): string | null {
  try {
    return localStorage.getItem(DISMISS_KEY);
  } catch {
    return null;
  }
}

const readDismissalOnServer = (): string | null => null;

function writeDismissal(signature: string) {
  try {
    localStorage.setItem(DISMISS_KEY, signature);
  } catch {
    // ignore storage errors
  }
  for (const notify of listeners) notify();
}

function isInternal(url: string): boolean {
  return url.startsWith('/');
}

function pathsMatch(a: string, b: string): boolean {
  const norm = (s: string) => s.replace(/\/+$/, '') || '/';
  return norm(a) === norm(b);
}

export default function HiringBannerClient({ config }: { config: BannerConfig }) {
  const pathname = usePathname() ?? '';
  const stored = useSyncExternalStore(
    subscribeDismissal,
    readDismissal,
    readDismissalOnServer
  );

  const signature = bannerSignature(config);
  if (stored && stored === signature) return null;

  if (
    config.ctaUrl &&
    isInternal(config.ctaUrl) &&
    pathsMatch(pathname, config.ctaUrl)
  ) {
    return null;
  }

  const hasCta = config.ctaUrl && config.ctaText;
  const inner = (
    <span className="border-hairline bg-canvas shadow-lift-2 flex items-center gap-2.5 rounded-full border py-2 pr-2 pl-3.5 transition-transform duration-200 group-hover:-translate-y-0.5">
      <span className="bg-indigo animate-caret block h-2 w-2 shrink-0 rounded-full" aria-hidden />
      <span className="min-w-0 truncate text-[0.8125rem]">
        {config.badge && <span className="text-ink font-medium">{config.badge}</span>}
        {config.badge && config.message && <span className="text-ink-mute"> · </span>}
        {config.message && <span className="text-ink-mute">{config.message}</span>}
        {hasCta && (
          <span className="text-indigo-text ml-2 font-medium">{config.ctaText}</span>
        )}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          writeDismissal(signature);
        }}
        aria-label="Dismiss"
        className="text-ink-mute hover:bg-canvas-soft hover:text-ink grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors"
      >
        ×
      </button>
    </span>
  );

  const className =
    'fixed bottom-5 right-5 z-[60] max-w-[calc(100vw-2.5rem)]';

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
