import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { listPositions } from '@/server/content/positions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Careers — Join GrowthVireX',
  description:
    "We're hiring growth marketers, performance creatives, and engineers. Remote-first, outcome-driven, and obsessed with making growth contagious.",
  keywords: ['marketing careers', 'growth marketing jobs', 'remote marketing jobs', 'GrowthVireX careers'],
  alternates: { canonical: '/careers/' },
};

const benefits = [
  { title: 'Remote-first',        desc: 'Work from anywhere. Quarterly team offsites for the parts that are better in person.' },
  { title: 'Ownership over hours', desc: 'We measure output, not hours logged. Async-friendly by design.' },
  { title: 'Learning budget',      desc: '$2,500/year for courses, conferences, books — whatever sharpens your craft.' },
  { title: 'Real equity',          desc: 'Meaningful stake in the agency for all full-time team members after year one.' },
];

export default async function CareersPage() {
  const openings = await listPositions({ visibleOnly: true });

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
            <span className="text-sm text-ink-muted">
              {openings.length} position{openings.length === 1 ? '' : 's'}
            </span>
          </div>
        </Reveal>

        {openings.length === 0 ? (
          <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-10 text-center text-sm text-ink-muted">
            No open roles right now. Want to introduce yourself anyway?{' '}
            <a href="mailto:hiring@growthvirex.com" className="text-zest-400 hover:underline">hiring@growthvirex.com</a>
          </p>
        ) : (
          <div>
            {openings.map((r, i) => {
              const team = r.statCards.find((c) => /team/i.test(c.key))?.value ?? '';
              const location = r.statCards.find((c) => /location/i.test(c.key))?.value ?? '';
              const type = r.statCards.find((c) => /type/i.test(c.key))?.value ?? '';
              return (
                <Reveal key={r.slug} delay={i * 80}>
                  <Link
                    href={`/careers/${r.slug}/`}
                    className="group grid grid-cols-1 items-center gap-4 border-b border-[var(--color-border)] py-8 transition hover:pl-4 md:grid-cols-[2fr_1fr_1fr_auto]"
                  >
                    <div>
                      <h3 className="text-xl font-semibold md:text-2xl">
                        {r.title}
                        {r.subtitle && (
                          <span className="ml-2 italic text-ink-muted">{r.subtitle}</span>
                        )}
                      </h3>
                      <div className="mt-1 text-sm text-ink-muted md:hidden">
                        {[team, location, type].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <div className="hidden text-sm text-ink-muted md:block">{team}</div>
                    <div className="hidden text-sm text-ink-muted md:block">{location}</div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zest-400 transition group-hover:gap-3">
                      Apply <ArrowUpRight size={14} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
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
            <Link href="mailto:hiring@growthvirex.com?subject=Introducing%20myself"
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
