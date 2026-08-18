/* Shared presentational primitives for the admin panel.
 *
 * The admin is a control panel rather than a marketing page, so it runs
 * denser than the public site — but it uses the same tokens, the same 6/8/12px
 * radii and the same indigo. These two pieces (a status notice and a status
 * tag) were duplicated on every screen, so they live here instead. */

import type { ReactNode } from 'react';

/* Compact button — row actions, sign-out, anything that would be too heavy as
 * a full `btn`. Pill geometry, like every other button in the system. */
export const ACTION_BTN =
  'border-hairline-strong text-ink-2 hover:border-indigo hover:text-indigo-text inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium leading-none transition-colors';

/* Same, but reads as destructive. Ruby is already in the palette as the
 * loss/negative colour, so the admin does not need a red from outside it. */
export const DANGER_BTN =
  'border-[color-mix(in_oklab,var(--ruby)_45%,transparent)] text-[var(--ruby)] hover:bg-[var(--ruby)] hover:border-[var(--ruby)] hover:text-white inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium leading-none transition-colors';

type NoticeTone = 'ok' | 'warn' | 'error';

const NOTICE: Record<NoticeTone, { edge: string; label: string }> = {
  ok: { edge: 'border-l-[var(--indigo)]', label: 'text-indigo-text' },
  warn: { edge: 'border-l-[var(--lemon)]', label: 'text-ink-2' },
  error: { edge: 'border-l-[var(--ruby)]', label: 'text-[var(--ruby)]' },
};

export function Notice({
  tone = 'ok',
  label,
  children,
}: {
  tone?: NoticeTone;
  label: string;
  children: ReactNode;
}) {
  const t = NOTICE[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={`border-hairline bg-canvas-soft flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-l-2 px-4 py-3 text-[0.875rem] ${t.edge}`}
    >
      <span className={`shrink-0 text-[0.8125rem] font-medium ${t.label}`}>{label}</span>
      <span className="text-ink-2 min-w-0">{children}</span>
    </div>
  );
}

type TagTone = 'solid' | 'line' | 'ghost' | 'dashed';

const TAG: Record<TagTone, string> = {
  solid: 'bg-indigo text-indigo-ink border-indigo',
  line: 'border-hairline-strong text-ink-2',
  ghost: 'border-hairline text-ink-mute',
  dashed: 'border-hairline border-dashed text-ink-mute',
};

/* Status pill. */
export function Tag({ tone = 'ghost', children }: { tone?: TagTone; children: ReactNode }) {
  return (
    <span
      className={`inline-block rounded-full border px-2 py-[0.2rem] text-[0.625rem] font-medium tracking-[0.06em] uppercase ${TAG[tone]}`}
    >
      {children}
    </span>
  );
}
