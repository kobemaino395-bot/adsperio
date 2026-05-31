import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { services } from '@/content/services';
import { testimonials } from '@/content/testimonials';
import {
  DashboardComposite,
  ConsolePanel,
  ChannelBars,
} from '@/components/mockups/ProductMockups';

export const metadata: Metadata = {
  title: 'We make growth contagious.',
  description:
    'GrowthVireX is a growth studio that engineers paid media, creative, and conversion systems for ambitious brands — turning every win into the next one across Meta, Google, TikTok, and the open web.',
  alternates: { canonical: '/' },
};

const stats = [
  { value: '772%',  label: 'Avg. gross profit lift' },
  { value: '$20M+', label: 'Revenue generated' },
  { value: '450+',  label: 'Qualified leads / 30d' },
  { value: '94%',   label: 'Client retention' },
];

const system = [
  { n: '01', title: 'Find the signal', body: 'We dig through your data, audience, and market until we isolate the one lever that actually moves revenue.' },
  { n: '02', title: 'Engineer the system', body: 'Paid media, creative, and conversion built as one machine — every part instrumented, every result attributable.' },
  { n: '03', title: 'Make it spread', body: 'We pour budget into what works and kill what doesn\'t — compounding winners into a loop that runs on its own.' },
];

const clients = ['NOVA', 'Lumen', 'Vellum', 'Cobalt', 'Æther', 'Northwind', 'Parallel'];

const platformPoints = [
  'Every channel — Meta, Google, TikTok, YouTube — in one revenue view.',
  'Server-side conversion tracking that survives iOS and cookie loss.',
  'Spend auto-rebalanced toward the campaigns actually printing ROAS.',
];

const systemPoints = [
  'A conversion API that reconciles ad spend to real revenue in milliseconds.',
  'Creative testing instrumented so every hook, angle, and edit is attributable.',
];

const faqs = [
  {
    q: 'How fast do we see results?',
    a: 'Most partners see measurable lift within the first 30 days — usually a CAC drop as we cut waste, followed by a revenue ramp as winners compound. The full system is in place by day 90.',
  },
  {
    q: 'What size budgets do you work with?',
    a: 'We take on brands spending roughly $30K–$1M+ per month across paid channels. Below that, the engineering overhead rarely pays for itself — we’ll tell you honestly if you’re not ready.',
  },
  {
    q: 'Do you replace our in-house team?',
    a: 'No — we plug into it. We run the paid-media and measurement engine while your team owns brand, product, and lifecycle. Live dashboards mean everyone sees the same numbers.',
  },
  {
    q: 'Which channels do you run?',
    a: 'Meta, Google, TikTok, and YouTube as the core, with email and the open web layered in where the math works. We follow the revenue, not the platform du jour.',
  },
];

const featured = testimonials[0];

export default function HomePage() {
  return (
    <main className="overflow-clip">
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative">
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[680px]" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />

        <div className="container-zest relative pt-40 pb-24 text-center md:pt-48">
          <Reveal>
            <h1 className="mx-auto max-w-4xl text-5xl font-light leading-[1.03] tracking-[-0.04em] md:text-7xl">
              We make growth <span className="hl">contagious.</span>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mx-auto mt-7 max-w-xl text-lg font-light leading-relaxed text-[var(--color-fg-muted)]">
              We engineer paid media, creative, and conversion into one system — then turn every win into the next one.
            </p>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact/" className="btn-primary">Start a growth audit</Link>
              <Link href="/case-studies/" className="btn-ghost">See the work</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── STATS ───────────────── */}
      <section className="container-zest pb-24">
        <Reveal>
          <div className="card grid grid-cols-2 divide-y divide-[var(--color-border)] overflow-hidden md:grid-cols-4 md:divide-x md:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="p-7 md:p-9">
                <div className="tnum text-4xl font-light tracking-tight md:text-5xl">{s.value}</div>
                <div className="mt-2 text-sm font-light text-[var(--color-fg-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───────────────── LOGO STRIP ───────────────── */}
      <section className="container-zest pb-20">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
            Trusted by teams scaling past $10M
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 opacity-70">
            {clients.map((c) => (
              <span key={c} className="text-lg font-light tracking-[0.04em] text-[var(--color-fg-soft)]">{c}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───────────────── PLATFORM COMPOSITE ───────────────── */}
      <section className="container-zest pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="label-tech">The platform</span>
              <h2 className="mt-3 max-w-md text-3xl font-light tracking-[-0.02em] md:text-5xl">
                Every dollar, attributed in real time.
              </h2>
              <p className="mt-5 max-w-md font-light leading-relaxed text-[var(--color-fg-muted)]">
                One dashboard for the whole funnel. We instrument spend, creative, and conversion so you can see exactly which campaigns are printing revenue — and which are bleeding it.
              </p>
              <ul className="mt-8 space-y-3.5">
                {platformPoints.map((p) => (
                  <li key={p} className="flex gap-3 font-light text-[var(--color-fg-soft)]">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-zest-50)] text-[var(--color-accent)]">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span className="leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <DashboardComposite />
          </Reveal>
        </div>
      </section>

      {/* ───────────────── CAPABILITIES ───────────────── */}
      <section className="container-zest pb-24">
        <Reveal>
          <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="label-tech">What we do</span>
              <h2 className="mt-3 max-w-2xl text-3xl font-light tracking-[-0.02em] md:text-5xl">
                Four disciplines, one growth engine.
              </h2>
            </div>
            <Link href="/services/" className="text-sm font-medium text-[var(--color-accent)] hover:underline">
              All services →
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 70}>
              <Link
                href={`/services/${s.slug}/`}
                className="group card flex h-full flex-col justify-between p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-md)] md:p-10"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="tnum grid h-9 w-9 place-items-center rounded-full bg-[var(--color-zest-50)] text-sm font-medium text-[var(--color-accent)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl font-light tracking-[-0.02em] md:text-3xl">{s.navTitle}</h3>
                  </div>
                  <p className="mt-5 font-light leading-relaxed text-[var(--color-fg-muted)]">{s.metaDescription}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] transition-[gap] group-hover:gap-3">
                  Explore {s.navTitle} <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────── HOW IT WORKS ───────────────── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="container-zest py-24">
          <Reveal>
            <span className="label-tech">How growth spreads</span>
            <h2 className="mt-3 max-w-2xl text-3xl font-light tracking-[-0.02em] md:text-5xl">
              A system, not a campaign.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {system.map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div className="card h-full p-8">
                  <div className="tnum grid h-11 w-11 place-items-center rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-accent)]">
                    {p.n}
                  </div>
                  <h3 className="mt-6 text-xl font-normal tracking-[-0.01em]">{p.title}</h3>
                  <p className="mt-3 font-light leading-relaxed text-[var(--color-fg-muted)]">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── INSTRUMENTED ───────────────── */}
      <section className="container-zest py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <ConsolePanel />
          </Reveal>
          <Reveal delay={140} className="order-1 lg:order-2">
            <div>
              <span className="label-tech">Instrumented end to end</span>
              <h2 className="mt-3 max-w-md text-3xl font-light tracking-[-0.02em] md:text-5xl">
                If we can&apos;t measure it, we don&apos;t ship it.
              </h2>
              <p className="mt-5 max-w-md font-light leading-relaxed text-[var(--color-fg-muted)]">
                A server-side conversion layer ties every ad impression back to real revenue — no guesswork, no platform-reported fiction. The numbers you act on are the numbers in your bank.
              </p>
              <ul className="mt-8 space-y-3.5">
                {systemPoints.map((p) => (
                  <li key={p} className="flex gap-3 font-light text-[var(--color-fg-soft)]">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-zest-50)] text-[var(--color-accent)]">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span className="leading-snug">{p}</span>
                  </li>
                ))}
              </ul>

              <div className="card mt-8 p-5">
                <div className="flex items-center justify-between">
                  <span className="label-tech">Channel mix · ROAS</span>
                  <span className="tnum text-xs text-[var(--color-fg-muted)]">last 30d</span>
                </div>
                <ChannelBars className="mt-5" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── FEATURED QUOTE ───────────────── */}
      <section className="container-zest py-24">
        <Reveal>
          <figure className="mx-auto max-w-4xl text-center">
            <blockquote className="text-2xl font-light leading-snug tracking-[-0.02em] md:text-4xl">
              <span className="text-[var(--color-accent)]">“</span>{featured.quote}<span className="text-[var(--color-accent)]">”</span>
            </blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-3">
              <div className="photo-tinted h-11 w-11 overflow-hidden rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.image} alt={`${featured.author} portrait`} className="photo-tinted-img" loading="lazy" />
              </div>
              <div className="text-left text-sm">
                <div className="font-medium">{featured.author}</div>
                <div className="font-light text-[var(--color-fg-muted)]">{featured.role}, {featured.company}</div>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="container-zest py-24">
          <Reveal>
            <span className="label-tech">Questions</span>
            <h2 className="mt-3 max-w-xl text-3xl font-light tracking-[-0.02em] md:text-5xl">
              The things people ask first.
            </h2>
          </Reveal>
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-normal text-[var(--color-fg)] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-accent)] transition-transform group-open:rotate-45">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 font-light leading-relaxed text-[var(--color-fg-muted)]">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="container-zest pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-[var(--color-bg-navy)] px-8 py-20 text-center md:px-16">
            <div aria-hidden className="glow absolute inset-x-0 top-0 h-full opacity-60" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-4xl font-light tracking-[-0.03em] text-white md:text-6xl">
                Ready to build a growth engine?
              </h2>
              <p className="mx-auto mt-5 max-w-md text-lg font-light text-white/70">
                Tell us where you want to be. We&apos;ll show you how to get there.
              </p>
              <Link href="/contact/" className="btn-on-dark mt-9">Book a consultation</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
