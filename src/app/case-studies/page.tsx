import type { Metadata } from 'next';
import Link from 'next/link';
import { caseStudies } from '@/content/case-studies';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Case Studies — Real Growth, Real Numbers',
  description:
    'Browse Adnovara case studies across EdTech, FinTech, healthcare, DTC, and consumer electronics. Measurable results from real engagements.',
  keywords: ['marketing case studies', 'growth marketing results', 'Adnovara portfolio'],
  alternates: { canonical: '/case-studies/' },
};

export default function CaseStudiesIndex() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50 opacity-60" />
        <div className="container-zest relative pt-40 pb-20 text-center">
          <Reveal>
            <span className="inline-block rounded-full border border-ink/10 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur">
              Case studies
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-7xl">
              Real growth.{' '}
              <span className="relative inline-block">
                <span className="relative z-10">
                  Real numbers.
                </span>
                <span aria-hidden className="absolute bottom-1 left-0 right-0 -z-0 h-[0.35em] bg-[var(--color-accent)]" />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted md:text-xl">
              Every engagement is measured in revenue, pipeline, or acquisition cost. Here&apos;s what that looks like.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-zest pb-28 space-y-5">
        {/* First card — full-width hero */}
        <Reveal>
          <Link
            href={`/case-studies/${caseStudies[0].slug}/`}
            className="group relative flex flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-12 transition hover:-translate-y-1 hover:border-zest-300 hover:shadow-2xl hover:shadow-zest-300/10 md:flex-row md:items-end md:gap-16 md:p-16"
          >
            <div>
              <div className="text-xs uppercase tracking-widest text-ink-muted">{caseStudies[0].industry}</div>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">{caseStudies[0].client}</h2>
              <p className="mt-4 max-w-xl text-lg text-ink-muted">{caseStudies[0].tagline}</p>
            </div>
            <div className="mt-10 shrink-0 border-t border-[var(--color-border)] pt-6 md:mt-0 md:border-l md:border-t-0 md:pl-16 md:pt-0">
              <div className="text-6xl font-semibold tracking-tight text-zest-400 md:text-8xl">{caseStudies[0].headline.value}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-ink-muted">{caseStudies[0].headline.label}</div>
              <span className="mt-6 inline-block text-sm font-medium text-zest-400 transition group-hover:translate-x-1">Read case →</span>
            </div>
          </Link>
        </Reveal>

        {/* Remaining 4 in 2-col grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {caseStudies.slice(1).map((c, i) => (
            <Reveal key={c.slug} delay={(i + 1) * 80} className="h-full">
              <Link
                href={`/case-studies/${c.slug}/`}
                className="group relative flex h-full flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-10 transition hover:-translate-y-1 hover:border-zest-300 hover:shadow-2xl hover:shadow-zest-300/10"
              >
                <div>
                  <div className="text-xs uppercase tracking-widest text-ink-muted">{c.industry}</div>
                  <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">{c.client}</h2>
                  <p className="mt-3 max-w-md text-ink-muted">{c.tagline}</p>
                </div>
                <div className="mt-10 flex items-end justify-between gap-4 border-t border-[var(--color-border)] pt-6">
                  <div>
                    <div className="text-4xl font-semibold tracking-tight text-zest-400 md:text-5xl">{c.headline.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-ink-muted">{c.headline.label}</div>
                  </div>
                  <span className="text-sm font-medium text-zest-400 transition group-hover:translate-x-1">Read case →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}