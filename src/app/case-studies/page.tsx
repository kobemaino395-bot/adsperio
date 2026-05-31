import type { Metadata } from 'next';
import Link from 'next/link';
import { caseStudies } from '@/content/case-studies';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Case Studies — Real Growth, Real Numbers',
  description:
    'Browse GrowthVireX case studies across EdTech, FinTech, healthcare, DTC, and consumer electronics. Measurable results from real engagements.',
  keywords: ['marketing case studies', 'growth marketing results', 'GrowthVireX portfolio'],
  alternates: { canonical: '/case-studies/' },
};

export default function CaseStudiesIndex() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[520px]" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />
        <div className="container-zest relative pt-40 pb-20 text-center">
          <Reveal>
            <h1 className="text-5xl font-light tracking-[-0.04em] md:text-7xl">
              Real growth. <span className="hl">Real numbers.</span>
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-[var(--color-fg-muted)] md:text-xl">
              Every engagement is measured in revenue, pipeline, or acquisition cost. Here&apos;s what that looks like.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-zest pb-28 space-y-5">
        {/* First card — full-width hero with image */}
        <Reveal>
          <Link
            href={`/case-studies/${caseStudies[0].slug}/`}
            className="group card relative grid overflow-hidden transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] md:grid-cols-2"
          >
            <div className="photo-tinted relative aspect-[4/3] md:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/case-${caseStudies[0].slug}.jpg`} alt="" className="photo-tinted-img transition-transform duration-700 group-hover:scale-105" loading="eager" />
              <div className="absolute inset-x-0 top-0 p-6">
                <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[0.6rem] font-mono uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                  Featured
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-8 p-10 md:p-16">
              <div>
                <div className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">{caseStudies[0].industry}</div>
                <h2 className="mt-5 text-4xl font-light tracking-[-0.03em] md:text-6xl">{caseStudies[0].client}</h2>
                <p className="mt-4 max-w-xl text-lg font-light text-[var(--color-fg-muted)]">{caseStudies[0].tagline}</p>
              </div>
              <div className="shrink-0 border-t border-[var(--color-border)] pt-6">
                <div className="tnum text-6xl font-light tracking-tight text-[var(--color-accent)] md:text-7xl">{caseStudies[0].headline.value}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">{caseStudies[0].headline.label}</div>
                <span className="mt-6 inline-block text-sm font-medium text-[var(--color-accent)] transition group-hover:translate-x-1">Read case →</span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Remaining 4 in 2-col grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {caseStudies.slice(1).map((c, i) => (
            <Reveal key={c.slug} delay={(i + 1) * 80} className="h-full">
              <Link
                href={`/case-studies/${c.slug}/`}
                className="group card relative flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)]"
              >
                <div className="photo-tinted relative aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/case-${c.slug}.jpg`} alt="" className="photo-tinted-img transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-10">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">{c.industry}</div>
                    <h2 className="mt-5 text-3xl font-light tracking-[-0.02em] md:text-4xl">{c.client}</h2>
                    <p className="mt-3 max-w-md font-light text-[var(--color-fg-muted)]">{c.tagline}</p>
                  </div>
                  <div className="mt-10 flex items-end justify-between gap-4 border-t border-[var(--color-border)] pt-6">
                    <div>
                      <div className="tnum text-4xl font-light tracking-tight text-[var(--color-accent)] md:text-5xl">{c.headline.value}</div>
                      <div className="mt-1 text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">{c.headline.label}</div>
                    </div>
                    <span className="text-sm font-medium text-[var(--color-accent)] transition group-hover:translate-x-1">Read case →</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}