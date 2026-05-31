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
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[520px]" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />

        <div className="container-zest relative pt-40 pb-20 text-center">
          <Reveal>
            <h1 className="text-5xl font-light tracking-[-0.04em] md:text-7xl">
              Marketing strategies that <span className="hl">actually scale.</span>
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-[var(--color-fg-muted)] md:text-xl">
              Join 15,000+ founders, CMOs, and performance marketers getting our best tactics, teardowns, and data-driven insights — every Tuesday morning.
            </p>
          </Reveal>

          {/* Subscription form — replace action when you pick a provider */}
          <Reveal delay={400}>
            <form
              action="#"
              method="POST"
              className="mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl border border-[var(--color-border-input)] bg-[var(--color-bg)] p-2 shadow-[var(--shadow-sm)] sm:flex-row sm:rounded-full"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Your work email..."
                className="flex-1 bg-transparent px-6 py-4 text-base font-light focus:outline-none"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe →
              </button>
            </form>

            <p className="mt-4 text-xs font-light text-[var(--color-fg-muted)]">
              Free forever. Unsubscribe in one click. Never shared.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ARCHIVE */}
      <section className="container-zest pb-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="mb-10 flex items-baseline justify-between border-b border-[var(--color-fg)] pb-4">
              <h2 className="text-3xl font-light tracking-[-0.02em] md:text-4xl">Recent issues</h2>
              <span className="tnum text-sm text-[var(--color-fg-muted)]">Showing {issues.length}</span>
            </div>
          </Reveal>

          <div>
            {issues.map((i, idx) => (
            <Reveal key={i.issueNo} delay={idx * 80}>
            <Link
                href={`/newsletter/${i.slug}/`}
                className="group grid grid-cols-[80px_1fr_auto] items-center gap-6 border-b border-[var(--color-border)] py-8 transition hover:pl-4"
            >
                <div className="tnum text-xs uppercase tracking-widest text-[var(--color-accent-deep)]">#{i.issueNo}</div>
                <div>
                <h3 className="text-lg font-normal md:text-xl">{i.title}</h3>
                <div className="mt-1 text-xs font-light text-[var(--color-fg-muted)]">
                    {new Date(i.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · {i.readTime}
                </div>
                </div>
                <span className="hidden text-sm font-medium text-[var(--color-accent)] transition group-hover:translate-x-1 md:inline">
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