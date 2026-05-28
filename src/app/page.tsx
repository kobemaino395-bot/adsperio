import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { site } from '@/content/site';
import { services } from '@/content/services';
import { testimonials } from '@/content/testimonials';

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

const clients = ['Aura Wellness', 'EduTech Academy', 'Finova', 'Lumière Tech', 'Nexus Health', 'Halcyon', 'Northwind'];

const process = [
  { n: '01', title: 'Find the signal', body: 'We dig through your data, audience, and market until we find the one lever that actually moves revenue — not vanity metrics.' },
  { n: '02', title: 'Engineer the system', body: 'Paid media, creative, and conversion built as one machine. Every part instrumented, every result attributable to a dollar.' },
  { n: '03', title: 'Make it spread', body: 'We pour budget into what works and kill what doesn\'t — compounding winners into a growth loop that runs on its own.' },
];

export default function HomePage() {
  return (
    <main className="overflow-clip">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-[0.45]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-bg)]" />

        {/* editorial spine */}
        <div aria-hidden className="spine-label absolute left-5 top-44 hidden lg:block">
          GROWTHVIREX — GROWTH STUDIO — EST. APAC / EU
        </div>

        <div className="container-zest relative pb-24 pt-40 md:pt-44">
          <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_0.9fr]">
            <div>
              <Reveal>
                <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ink-muted">
                  <span className="h-2 w-2 animate-blink rounded-full bg-[var(--color-accent)]" />
                  Now booking Q3 partnerships
                </div>
              </Reveal>

              <Reveal delay={90}>
                <h1 className="mt-7 font-serif text-[3.4rem] font-extrabold leading-[0.92] tracking-[-0.035em] sm:text-[4.5rem] md:text-[5.6rem]">
                  We make
                  <br />
                  growth{' '}
                  <span className="relative inline-block text-[var(--color-accent)]">
                    contagious
                    <svg aria-hidden viewBox="0 0 320 24" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none">
                      <path d="M2 17 C 80 6, 150 22, 230 9 S 312 6, 318 12" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                  .
                </h1>
              </Reveal>

              <Reveal delay={220}>
                <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-muted">
                  A growth studio that engineers paid media, creative, and conversion into one system — then turns every win into the next one.
                </p>
              </Reveal>

              <Reveal delay={340}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link href="/contact/" className="btn-primary group text-sm">
                    Start a growth audit
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                  <Link href="/case-studies/" className="btn-ghost text-sm">
                    See the work
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={460}>
                <div className="mt-12 flex items-center gap-4 border-t border-[var(--color-border)] pt-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">
                  <span className="text-[var(--color-fg)]">40+ brands</span>
                  <span className="opacity-40">/</span>
                  <span className="text-[var(--color-fg)]">$20M+ generated</span>
                  <span className="opacity-40">/</span>
                  <span className="text-[var(--color-fg)]">4.9★ partner rating</span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={260} className="hidden lg:block">
              <SignalPanel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── CLIENT MARQUEE ─────────────────── */}
      <section className="overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-alt)] py-7">
        <div className="flex animate-marquee gap-12 whitespace-nowrap will-change-transform">
          {clients.concat(clients).map((logo, i) => (
            <span key={i} className="flex items-center gap-12 font-serif text-2xl font-semibold text-ink-muted">
              {logo}
              <span aria-hidden className="text-[var(--color-accent)]">✳</span>
            </span>
          ))}
        </div>
      </section>

      {/* ─────────────────────── STATS ─────────────────────── */}
      <section className="relative bg-[var(--color-ink-warm)] py-28 text-[var(--color-bg)]">
        <div aria-hidden className="bg-dots absolute inset-0 opacity-[0.06]" />
        <div className="container-zest relative">
          <Reveal>
            <div className="mb-16 grid gap-8 md:grid-cols-[1fr_2fr] md:items-end">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-accent)]">
                ① Results
              </div>
              <h2 className="max-w-2xl font-serif text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                Numbers the board signs off on.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="bg-[var(--color-ink-warm)] p-8 md:p-10">
                <div className="font-serif text-5xl font-extrabold tracking-[-0.03em] md:text-7xl">
                  {s.value}
                </div>
                <div className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/55">
                  {s.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── SERVICES LEDGER ──────────────────── */}
      <section id="solutions" className="relative py-28">
        <div className="container-zest">
          <Reveal>
            <div className="mb-12 grid gap-8 md:grid-cols-[1fr_2fr] md:items-end">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ink-muted">
                ② Capabilities
              </div>
              <h2 className="max-w-2xl font-serif text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                Four disciplines. <span className="text-ink-muted">One growth engine.</span>
              </h2>
            </div>
          </Reveal>

          <div className="border-t border-[var(--color-fg)]/15">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 70}>
                <Link
                  href={`/services/${s.slug}/`}
                  className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-[var(--color-fg)]/15 py-8 transition-colors md:gap-10 md:py-10"
                >
                  <span aria-hidden className="absolute inset-0 -z-0 origin-left scale-x-0 bg-[var(--color-accent)]/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  <span className="relative font-mono text-sm text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative">
                    <h3 className="font-serif text-2xl font-bold tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                      {s.navTitle}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-sm text-ink-muted md:text-base">{s.navDesc}</p>
                  </div>
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-fg)]/20 text-lg transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-fg)] md:h-14 md:w-14">
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── HOW IT SPREADS ──────────────────── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)] py-28">
        <div className="container-zest">
          <Reveal>
            <div className="mb-16 grid gap-8 md:grid-cols-[1fr_2fr] md:items-end">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ink-muted">
                ③ The method
              </div>
              <h2 className="max-w-2xl font-serif text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                How growth spreads.
              </h2>
            </div>
          </Reveal>

          <div className="relative grid gap-10 md:grid-cols-3">
            {/* connecting line */}
            <div aria-hidden className="absolute left-0 top-7 hidden h-px w-full origin-left animate-grow-line bg-[var(--color-fg)]/15 md:block" />
            {process.map((p, i) => (
              <Reveal key={p.n} delay={i * 120} className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-fg)]/20 bg-[var(--color-bg)] font-mono text-sm text-[var(--color-accent)]">
                  {p.n}
                </div>
                <h3 className="mt-6 font-serif text-2xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── TESTIMONIALS ──────────────────── */}
      <section className="py-28">
        <div className="container-zest">
          <Reveal>
            <div className="mb-16 grid gap-8 md:grid-cols-[1fr_2fr] md:items-end">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ink-muted">
                ④ In their words
              </div>
              <h2 className="max-w-2xl font-serif text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                What partners <span className="text-ink-muted">actually say.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.slug} delay={i * 100} className="h-full">
                <figure
                  className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 transition-shadow hover:shadow-[var(--shadow-md)] md:p-9"
                >
                  <div>
                    <div aria-hidden className="font-serif text-5xl leading-none text-[var(--color-accent)]">&ldquo;</div>
                    <blockquote className="mt-3 text-lg leading-relaxed text-[var(--color-fg)]">
                      {t.quote}
                    </blockquote>
                  </div>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-[var(--color-border)] pt-6">
                    <div className="photo-tinted relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.image} alt={`${t.author} portrait`} className="photo-tinted-img" loading="lazy" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-fg)]">{t.author}</div>
                      <div className="text-xs text-ink-muted">{t.role} · {t.company}</div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FINAL CTA ──────────────────── */}
      <section className="relative overflow-hidden bg-[var(--color-accent)] py-28 text-[var(--color-accent-fg)]">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-[0.12]" />
        <div className="container-zest relative">
          <div className="grid items-end gap-10 md:grid-cols-[2fr_1fr]">
            <div>
              <Reveal>
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-accent-fg)]/70">
                  ⑤ Start here
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="mt-5 max-w-3xl font-serif text-5xl font-extrabold leading-[0.98] tracking-[-0.03em] md:text-8xl">
                  Let&apos;s make it spread.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={220}>
              <Link
                href="/contact/"
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-ink-warm)] px-9 py-5 text-base font-semibold text-[var(--color-bg)] transition-transform hover:-translate-y-1"
              >
                Book a consultation
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── bespoke "signal" panel: a live-growth graphic, no stock photo ── */
function SignalPanel() {
  const bars = [34, 41, 38, 52, 60, 57, 72, 88];
  return (
    <div className="relative">
      <div aria-hidden className="absolute -right-5 -top-5 h-20 w-20 animate-spin-slow rounded-full border border-dashed border-[var(--color-accent)]/50" />
      <div className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-muted">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-[var(--color-grow)]" /> live index
          </span>
          <span>§ growth / 90d</span>
        </div>

        {/* sparkline + bars */}
        <div className="mt-6 flex h-40 items-end gap-2.5">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col justify-end">
              <div
                className="rounded-t-sm"
                style={{
                  height: `${h}%`,
                  background: i === bars.length - 1 ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-grow) 65%, transparent)',
                }}
              />
            </div>
          ))}
        </div>

        <svg aria-hidden viewBox="0 0 300 80" className="mt-3 h-14 w-full">
          <path d="M2 70 C 60 64, 90 40, 140 44 S 220 18, 298 8" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="298" cy="8" r="5" fill="var(--color-accent)" />
          <circle cx="140" cy="44" r="3.5" fill="var(--color-grow)" />
        </svg>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[var(--color-bg-alt)] p-4">
            <div className="font-serif text-2xl font-extrabold text-[var(--color-grow)]">+772%</div>
            <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ink-muted">profit lift</div>
          </div>
          <div className="rounded-xl bg-[var(--color-bg-alt)] p-4">
            <div className="font-serif text-2xl font-extrabold">3.8×</div>
            <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ink-muted">blended ROAS</div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute -bottom-4 -left-4 -z-10 h-24 w-24 rounded-2xl bg-[var(--color-accent)]/15" />
    </div>
  );
}
