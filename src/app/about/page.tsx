import type { Metadata } from 'next';
import Link from 'next/link';
import { team } from '@/content/team';
import Reveal from '@/components/ui/Reveal';
import { DashboardComposite } from '@/components/mockups/ProductMockups';

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
      <section className="relative">
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[480px]" />
        <div className="container-zest relative grid items-center gap-12 pt-40 pb-20 md:pt-48 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <h1 className="text-5xl font-light leading-[1.04] tracking-[-0.04em] md:text-7xl">
                Growth that <span className="hl">catches on.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-md text-lg font-light text-[var(--color-fg-muted)]">
                A growth studio based in Singapore. The approach is simple: find the signal, engineer the system, and make the wins spread.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="photo-tinted aspect-[5/4] w-full overflow-hidden rounded-2xl border border-[var(--color-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about-hero.jpg" alt="" className="photo-tinted-img" loading="eager" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="container-zest py-24">
        <Reveal>
          <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1fr_2fr]">
            <div className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent-deep)]">Our mission</div>
            <div>
              <p className="text-2xl font-light leading-relaxed tracking-[-0.01em] md:text-3xl">
                To make growth contagious for brands of all sizes — engineering paid media, creative ad production, and conversion optimization into one system across Meta, Google, TikTok, and YouTube.
              </p>
              <p className="mt-8 text-lg font-light text-[var(--color-fg-muted)]">
                Simple name, serious results. We&apos;ve partnered with over 250 brands across Asia-Pacific and Europe and generated over $300M in tracked revenue for our clients.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="container-zest py-20">
          <Reveal>
            <h2 className="mb-12 text-2xl font-light tracking-[-0.01em] md:text-3xl">Our track record.</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-8 border-t border-[var(--color-border)] pt-10 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="tnum text-4xl font-light tracking-tight md:text-6xl">{s.value}</div>
                <div className="mt-2 text-sm font-light text-[var(--color-fg-muted)]">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="container-zest pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal delay={140} className="order-2 lg:order-1">
            <DashboardComposite />
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div>
              <span className="label-tech">Transparent by default</span>
              <h2 className="mt-3 max-w-md text-3xl font-light tracking-[-0.02em] md:text-5xl">
                You see what we see.
              </h2>
              <p className="mt-5 max-w-md font-light leading-relaxed text-[var(--color-fg-muted)]">
                No black boxes, no curated screenshots. Every partner gets a live dashboard wired to real spend and revenue — the same numbers we optimize against, updated daily and walked through every week.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PILLARS */}
      <section className="container-zest py-28">
        <Reveal>
          <h2 className="mb-14 text-4xl font-light tracking-[-0.03em] md:text-5xl">How we work</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 100}>
              <article className="card p-10 transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-md)]">
                <div className="tnum text-sm font-medium text-[var(--color-accent)]">{p.n}</div>
                <h3 className="mt-4 text-2xl font-light tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-3 font-light text-[var(--color-fg-muted)]">{p.desc}</p>
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
              <div className="label-tech">
                The team
              </div>
              <h2 className="max-w-2xl text-4xl font-light tracking-[-0.03em] md:text-5xl">
                The operators behind the work.
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.slug} delay={i * 100} className="h-full">
                <article
                  className="flex h-full flex-col overflow-hidden rounded-xl bg-[var(--color-bg)]"
                  style={{ border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
                >
                  <div className="photo-tinted relative aspect-[4/5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image} alt={`${m.name} portrait`} className="photo-tinted-img" loading="lazy" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-xl font-normal tracking-[-0.01em]">{m.name}</h3>
                    <div className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
                      {m.role}
                    </div>
                    <p className="mt-4 text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">{m.bio}</p>
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
            <h2 className="text-4xl font-light tracking-[-0.03em] md:text-5xl">Want to work with us?</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-4 text-lg font-light text-[var(--color-fg-muted)]">
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