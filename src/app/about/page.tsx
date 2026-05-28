import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/content/site';
import { team } from '@/content/team';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'About — The Team Behind the Growth',
  description:
    'GrowthVireX is a growth studio built around one mission: making growth contagious through engineered paid media, creative production, and conversion optimization.',
  keywords: ['about GrowthVireX', 'growth marketing studio team', 'paid media agency philosophy'],
  alternates: { canonical: '/about/' },
};

const pillars = [
  { n: '01', title: 'Data over opinions',       desc: 'Every decision is tied to a measurable outcome. If we can\'t prove it moved a number, we don\'t ship it.' },
  { n: '02', title: 'Revenue, not vanity',      desc: 'Impressions, reach, and likes are indicators. We optimize for pipeline, revenue, and LTV — the numbers that matter.' },
  { n: '03', title: 'Transparent by default',   desc: 'Live dashboards. Weekly recorded walkthroughs. You see what we see, when we see it. No reporting theater.' },
  { n: '04', title: 'Compounding over quick wins', desc: 'We build growth systems that get more efficient over time — not campaigns that spike once and die.' },
];

const stats = [
  { value: '2020', label: 'Founded in Singapore' },
  { value: '45',   label: 'Growth experts' },
  { value: '$300M+', label: 'Client revenue generated' },
  { value: '250+', label: 'Brands partnered' },
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50 opacity-60" />

        <div className="container-zest relative pt-40 pb-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Reveal>
                <span className="inline-block rounded-full border border-ink/10 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur">
                  About {site.shortName}
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="mt-8 text-5xl font-extrabold tracking-tight md:text-7xl">
                  Growth that{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10">catches on.</span>
                    <span aria-hidden className="absolute bottom-1 left-0 right-0 -z-0 h-[0.35em] bg-[var(--color-accent)]" />
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={250}>
                <p className="mt-6 max-w-xl text-lg text-ink-muted md:text-xl">
                  We&apos;re a growth studio based in Singapore. The approach is simple: find the signal, engineer the system, and make the wins spread.
                </p>
              </Reveal>
            </div>
            <Reveal delay={300}>
              <div className="relative">
                <div aria-hidden className="absolute -right-4 -top-4 h-20 w-20 bg-[var(--color-accent)]" />
                <div className="photo-tinted relative aspect-[5/6] w-full" style={{ boxShadow: 'var(--shadow-brutal)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/about-hero.jpg" alt="" className="photo-tinted-img" loading="eager" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="container-zest py-24">
        <Reveal>
          <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1fr_2fr]">
            <div className="text-xs font-medium uppercase tracking-widest text-ink-muted">Our mission</div>
            <div>
              <p className="text-2xl font-medium leading-relaxed md:text-3xl">
                To make growth contagious for brands of all sizes — engineering paid media, creative ad production, and conversion optimization into one system across Meta, Google, TikTok, and YouTube.
              </p>
              <p className="mt-8 text-lg text-ink-muted">
                Simple name, serious results. We&apos;ve partnered with over 250 brands across Asia-Pacific and Europe and generated over $300M in tracked revenue for our clients.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="border-y border-[var(--color-border)] bg-ink text-white">
        <div className="container-zest py-20">
          <Reveal>
            <h2 className="mb-12 text-2xl font-medium md:text-3xl">Our track record.</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="text-4xl font-semibold tracking-tight md:text-6xl">{s.value}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-neutral-500">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="container-zest py-28">
        <Reveal>
          <h2 className="mb-14 text-4xl font-semibold tracking-tight md:text-5xl">How we work</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 100}>
              <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-10 transition hover:-translate-y-1 hover:border-zest-300">
                <div className="text-sm font-medium text-ink-muted">{p.n}</div>
                <h3 className="mt-4 text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-ink-muted">{p.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-28">
        <div className="container-zest">
          <Reveal>
            <div className="mb-16 grid gap-8 md:grid-cols-[1fr_2fr] md:items-end">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
                The team
              </div>
              <h2 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
                The operators behind the work.
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.slug} delay={i * 100} className="h-full">
                <article
                  className="flex h-full flex-col overflow-hidden bg-[var(--color-bg)]"
                  style={{ border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
                >
                  <div className="photo-tinted relative aspect-[4/5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image} alt={`${m.name} portrait`} className="photo-tinted-img" loading="lazy" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-xl font-semibold tracking-tight">{m.name}</h3>
                    <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
                      {m.role}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted">{m.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-28 text-center">
        <div className="container-zest max-w-3xl">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Want to work with us?</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-4 text-lg text-ink-muted">
              We take on a limited number of partnerships each quarter. Tell us what you&apos;re building.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact/" className="btn-primary">Start a conversation</Link>
              <Link href="/careers/" className="btn-ghost">Join the team</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}