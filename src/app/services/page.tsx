import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/content/services';
import Reveal from '@/components/ui/Reveal';
import Highlight from '@/components/ui/Highlight';

export const metadata: Metadata = {
  title: 'Services — SEO, PPC, Paid Social & Web',
  description:
    'Full-stack performance marketing services: SEO, PPC, paid social advertising, and conversion-optimized web development. Measurable growth, guaranteed.',
  keywords: ['digital marketing services', 'SEO', 'PPC', 'paid social', 'web development'],
  alternates: { canonical: '/services/' },
};

export default function ServicesIndex() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-spark-gradient opacity-90" />
        <div aria-hidden className="bg-grid absolute inset-0 opacity-30" />
        <div className="container-zest relative pt-40 pb-20 text-center">
          <Reveal>
            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
              Four levers. <Highlight>One growth engine.</Highlight>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted md:text-xl">
              Each service works on its own. Combined, they compound. Pick a channel or let us build the full stack.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-zest pb-28">
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 100}>
              <Link href={`/services/${s.slug}/`} className="group relative flex flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-10 transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)]">
                <div>
                  <div className="text-xs uppercase tracking-widest text-ink-muted">
                    {String(i + 1).padStart(2, '0')} — {s.hero.eyebrow}
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">{s.navTitle}</h2>
                  <p className="mt-4 max-w-md text-ink-muted dark:text-neutral-400">{s.metaDescription}</p>
                </div>
                <span className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-zest-400 transition group-hover:gap-4">
                  Explore {s.navTitle} →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}