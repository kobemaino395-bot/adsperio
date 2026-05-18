import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Careers — Join Adnovara',
  description:
    'We\'re hiring growth marketers, performance creatives, and engineers. Remote-first, outcome-driven, and obsessed with helping brands bloom.',
  keywords: ['marketing careers', 'growth marketing jobs', 'remote marketing jobs', 'Adnovara careers'],
  alternates: { canonical: '/careers/' },
};

const openings = [
  { title: 'Senior Performance Marketing Manager', team: 'Paid Media', location: 'Remote (US/EU)',  type: 'Full-time' },
  { title: 'Technical SEO Lead',                    team: 'SEO',        location: 'Singapore / Remote', type: 'Full-time' },
  { title: 'Senior Frontend Engineer',              team: 'Web',        location: 'Remote (Global)',  type: 'Full-time' },
  { title: 'Creative Strategist — Paid Social',     team: 'Creative',   location: 'Remote (US/EU)',   type: 'Full-time' },
  { title: 'Growth Analyst',                        team: 'Analytics',  location: 'Remote (Global)',  type: 'Full-time' },
];

const benefits = [
  { title: 'Remote-first',        desc: 'Work from anywhere. Quarterly team offsites for the parts that are better in person.' },
  { title: 'Ownership over hours', desc: 'We measure output, not hours logged. Async-friendly by design.' },
  { title: 'Learning budget',      desc: '$2,500/year for courses, conferences, books — whatever sharpens your craft.' },
  { title: 'Real equity',          desc: 'Meaningful stake in the agency for all full-time team members after year one.' },
];

export default function CareersPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50 opacity-60" />
        <div className="container-zest relative pt-40 pb-20 text-center">
          <Reveal>
            <span className="inline-block rounded-full border border-ink/10 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur">
              Careers
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-7xl">
              Build the team that{' '}
              <span className="relative inline-block">
                <span className="relative z-10">
                  builds the growth.
                </span>
                <span aria-hidden className="absolute bottom-1 left-0 right-0 -z-0 h-[0.35em] bg-[var(--color-accent)]" />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted md:text-xl">
              We hire specialists who love the craft and generalists who love shipping. No politics, no reporting theater — just good work with good people.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-zest py-20">
        <Reveal>
          <div className="mb-10 flex items-baseline justify-between border-b-2 border-ink pb-4">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Open roles</h2>
            <span className="text-sm text-ink-muted">{openings.length} positions</span>
          </div>
        </Reveal>

        <div>
          {openings.map((r, i) => (
            <Reveal key={r.title} delay={i * 80}>
            <a
              href={`mailto:hiring@adnovara.com?subject=Application: ${encodeURIComponent(r.title)}`}
              className="group grid grid-cols-1 items-center gap-4 border-b border-[var(--color-border)] py-8 transition hover:pl-4 md:grid-cols-[2fr_1fr_1fr_auto]"
            >
              <div>
                <h3 className="text-xl font-semibold md:text-2xl">{r.title}</h3>
                <div className="mt-1 text-sm text-ink-muted md:hidden">
                  {r.team} · {r.location} · {r.type}
                </div>
              </div>
              <div className="hidden text-sm text-ink-muted md:block">{r.team}</div>
              <div className="hidden text-sm text-ink-muted md:block">{r.location}</div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zest-400 transition group-hover:gap-3">
                Apply <ArrowUpRight size={14} />
              </span>
            </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-24">
        <div className="container-zest">
          <Reveal>
            <h2 className="mb-12 text-3xl font-semibold tracking-tight md:text-4xl">Why work here</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 100} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8">
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-zest py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Don&apos;t see your role?</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-4 text-lg text-ink-muted">
              We&apos;re always open to exceptional people. Send us what you&apos;ve built.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <Link href="mailto:hiring@adnovara.com?subject=Introducing%20myself"
              className="btn-primary mt-8"
            >
              Introduce yourself
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}