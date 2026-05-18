import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Newsletter — The Growth Engine',
  description:
    'Marketing strategies that actually scale. Join 15,000+ founders, CMOs, and performance marketers getting our best tactics every Tuesday.',
  keywords: ['growth marketing newsletter', 'performance marketing insights', 'marketing Tuesday newsletter'],
  alternates: { canonical: '/newsletter/' },
};

import { issues } from '@/content/newsletter';

export default function NewsletterPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50 opacity-60" />
        <div aria-hidden className="animate-orb-float absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-zest-300/25 blur-3xl" />

        <div className="container-zest relative pt-40 pb-20 text-center">
          <Reveal>
            <span className="inline-block rounded-full bg-zest-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink">
              The Growth Engine
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-7xl">
              Marketing strategies that{' '}
              <span className="relative inline-block">
                <span className="relative z-10">actually scale.</span>
                <span aria-hidden className="absolute bottom-1 left-0 right-0 -z-0 h-[0.35em] bg-[var(--color-accent)]" />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted md:text-xl">
              Join 15,000+ founders, CMOs, and performance marketers getting our best tactics, teardowns, and data-driven insights — every Tuesday morning.
            </p>
          </Reveal>

          {/* Subscription form — replace action when you pick a provider */}
          <Reveal delay={400}>
            <form
              action="#"
              method="POST"
              className="mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl border-2 border-ink bg-[var(--color-bg)] p-2 sm:flex-row sm:rounded-full"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Your work email..."
                className="flex-1 bg-transparent px-6 py-4 text-base focus:outline-none"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe →
              </button>
            </form>

            <p className="mt-4 text-xs text-ink-muted">
              Free forever. Unsubscribe in one click. Never shared.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ARCHIVE */}
      <section className="container-zest pb-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="mb-10 flex items-baseline justify-between border-b-2 border-ink pb-4">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Recent issues</h2>
              <span className="text-sm text-ink-muted">Showing {issues.length}</span>
            </div>
          </Reveal>

          <div>
            {issues.map((i, idx) => (
            <Reveal key={i.issueNo} delay={idx * 80}>
            <Link
                href={`/newsletter/${i.slug}/`}
                className="group grid grid-cols-[80px_1fr_auto] items-center gap-6 border-b border-[var(--color-border)] py-8 transition hover:pl-4"
            >
                <div className="text-xs uppercase tracking-widest text-ink-muted">#{i.issueNo}</div>
                <div>
                <h3 className="text-lg font-medium md:text-xl">{i.title}</h3>
                <div className="mt-1 text-xs text-ink-muted">
                    {new Date(i.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · {i.readTime}
                </div>
                </div>
                <span className="hidden text-sm font-medium text-zest-400 transition group-hover:translate-x-1 md:inline">
                Read →
                </span>
            </Link>
            </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}