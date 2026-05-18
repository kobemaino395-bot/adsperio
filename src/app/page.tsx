import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import Highlight from '@/components/ui/Highlight';
import TiltCard from '@/components/effects/TiltCard';
import { site } from '@/content/site';
import { services } from '@/content/services';
import { testimonials } from '@/content/testimonials';

export const metadata: Metadata = {
  title: 'Where Brands Bloom.',
  description:
    'Adnovara partners with ambitious brands to deliver measurable growth through smart paid media, creative ad production, and conversion optimization on Meta, Google, TikTok, and YouTube.',
  alternates: { canonical: '/' },
};

const stats = [
  { value: '772%',  label: 'Avg. gross profit lift' },
  { value: '$20M+', label: 'Revenue generated' },
  { value: '450+',  label: 'Qualified leads / 30d' },
  { value: '94%',   label: 'Client retention' },
];


const marqueeLogos = ['Aura Wellness', 'EduTech Academy', 'Finova', 'Lumière Tech', 'Nexus Health', 'Aura Wellness', 'EduTech Academy', 'Finova', 'Lumière Tech', 'Nexus Health'];

export default function HomePage() {
  return (
    <main>
      {/* HERO — blueprint grid background, no gradients */}
      <section className="relative overflow-hidden bg-[var(--color-bg)]">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
        {/* Solid accent bar as design element */}
        <div aria-hidden className="absolute left-0 right-0 top-24 h-8 bg-[var(--color-accent)]" />

        <div className="container-zest relative pt-48 pb-28">
          <div className="grid items-start gap-16 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <Reveal>
                <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
                  <span className="h-2 w-2 animate-blink rounded-full bg-[var(--color-accent)]" />
                  Now booking Q3 partnerships
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="mt-8 max-w-5xl text-[3rem] font-medium leading-[0.95] tracking-[-0.03em] md:text-[6rem]">
                  Grow revenue
                  <br />
                  faster.{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10">Predictably.</span>
                    <span
                      aria-hidden
                      className="absolute bottom-1 left-0 right-0 -z-0 h-[0.4em] bg-[var(--color-accent)]"
                    />
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={250}>
                <p className="mt-10 max-w-xl text-xl leading-relaxed text-ink-muted">
                  Partner with an award-winning team to deliver guaranteed results in 90 days. Proven strategies. Measurable outcomes. Zero fluff.
                </p>
              </Reveal>

              <Reveal delay={400}>
                <div className="mt-12 flex flex-wrap items-center gap-4">
                  <Link href="/contact/" className="group relative inline-flex items-center gap-3 bg-[var(--color-ink-warm)] px-8 py-4 text-sm font-medium text-[var(--color-bg)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5" style={{ boxShadow: 'var(--shadow-brutal)' }}>
                    Book a consultation
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                  <Link href="#solutions" className="text-sm font-medium underline decoration-2 underline-offset-8 hover:decoration-[var(--color-accent)]">
                    Explore solutions
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={300} className="hidden lg:block">
              <div className="relative">
                <div aria-hidden className="absolute -left-4 -top-4 h-16 w-16 bg-[var(--color-accent)]" />
                <div className="photo-tinted relative aspect-[4/5] w-full" style={{ boxShadow: 'var(--shadow-brutal)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/hero.jpg" alt="" className="photo-tinted-img" loading="eager" />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/60">§ 00 / In motion</div>
                    <div className="mt-2 font-serif text-2xl leading-tight">Where ambitious brands compound their growth.</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* LOGO MARQUEE — clean, no gradients, client proof */}
      <section className="overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-alt)] py-8">
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {marqueeLogos.concat(marqueeLogos).map((logo, i) => (
            <span key={i} className="font-serif text-2xl font-medium text-ink-muted">
              {logo}
              <span className="mx-8 text-[var(--color-accent)]">✕</span>
            </span>
          ))}
        </div>
      </section>

      {/* STATS — on solid warm-black, big typography */}
      <section className="bg-[var(--color-ink-warm)] py-32 text-[var(--color-bg)]">
        <div className="container-zest">
          <Reveal>
            <div className="mb-20 grid gap-8 md:grid-cols-[1fr_2fr] md:items-end">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                § 01 / Results
              </div>
              <h2 className="max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
                Numbers the sales team can take to the board.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-4 md:divide-x md:divide-y-0">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100} className="p-8 md:py-0 md:px-10 md:first:pl-0">
                <div className="font-serif text-6xl font-medium tracking-[-0.03em] md:text-8xl">
                  {s.value}
                </div>
                <div className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/50">
                  {s.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS — 3D tilt cards on dotted background */}
      <section id="solutions" className="relative bg-[var(--color-bg)] py-32">
        <div aria-hidden className="bg-dots absolute inset-0 opacity-40" />

        <div className="container-zest relative">
          <Reveal>
            <div className="mb-20 grid gap-8 md:grid-cols-[1fr_2fr] md:items-end">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
                § 02 / Solutions
              </div>
              <h2 className="max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
                Four services. <span className="italic text-ink-muted">One system.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 80} className="h-full">
                <TiltCard className="h-full">
                  <Link href={`/services/${s.slug}/`} className="group block h-full">
                    <article
                      className="relative flex h-full flex-col bg-[var(--color-bg)]"
                      style={{ boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}
                    >
                      <div className="photo-tinted relative aspect-[16/9] w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/images/service-${s.slug}.jpg`} alt="" className="photo-tinted-img transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
                          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-[var(--color-accent)]" />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-10 md:p-12">
                        <div>
                          <h3 className="font-serif text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                            {s.navTitle}
                          </h3>
                          <p className="mt-4 text-base leading-relaxed text-ink-muted">{s.metaDescription}</p>
                        </div>
                        <div className="mt-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-fg)] transition-[gap] group-hover:gap-4">
                          Learn more <span aria-hidden>→</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)] py-32">
        <div className="container-zest">
          <Reveal>
            <div className="mb-20 grid gap-8 md:grid-cols-[1fr_2fr] md:items-end">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
                § 03 / Voices
              </div>
              <h2 className="max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
                What clients <span className="italic text-ink-muted">actually say.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.slug} delay={i * 100} className="h-full">
                <figure
                  className="flex h-full flex-col justify-between bg-[var(--color-bg)] p-8 md:p-10"
                  style={{ boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}
                >
                  <blockquote className="font-serif text-lg leading-relaxed text-[var(--color-fg)]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
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

      {/* FINAL CTA — oversized, brutalist */}
      <section className="relative overflow-hidden bg-[var(--color-accent)] py-32">
        <div className="container-zest relative text-center">
          <Reveal>
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-ink-warm)]/70">
              § 04 / Start here
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mx-auto mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1] tracking-[-0.02em] text-[var(--color-ink-warm)] md:text-8xl">
              Let&apos;s get to work.
            </h2>
          </Reveal>
          <Reveal delay={250}>
            <Link
              href="/contact/"
              className="mt-12 inline-flex items-center gap-3 bg-[var(--color-ink-warm)] px-10 py-5 text-base font-medium text-[var(--color-bg)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: '6px 6px 0 var(--color-bg)' }}
            >
              Start your project
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}