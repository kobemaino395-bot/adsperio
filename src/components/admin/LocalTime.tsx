'use client';

import { useSyncExternalStore } from 'react';

/** Never re-fires: hydration alone flips the snapshot from server to client. */
const noSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

function localized(iso: string, fallback?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? (fallback ?? iso) : d.toLocaleString();
}

/** Renders an ISO timestamp in the viewer's locale. The formatting depends on
 *  the reader's machine, so the server can only emit `fallback`; the swap
 *  happens on hydration rather than in an effect. */
export default function LocalTime({ iso, fallback }: { iso: string; fallback?: string }) {
  const hydrated = useSyncExternalStore(noSubscribe, onClient, onServer);
  const text = hydrated ? localized(iso, fallback) : (fallback ?? iso);
  return <time dateTime={iso} suppressHydrationWarning>{text}</time>;
}
