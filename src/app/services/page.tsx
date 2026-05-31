import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/content/services';
import Reveal from '@/components/ui/Reveal';

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
      <section className="relative">
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[520px]" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />
        <div className="container-zest relative pt-40 pb-16 text-center md:pt-48">
          <Reveal>
            <h1 className="mx-auto max-w-3xl text-5xl font-light leading-[1.04] tracking-[-0.04em] md:text-7xl">
              Four levers. <span className="hl">One engine.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-[var(--color-fg-muted)]">
              Each service works on its own. Combined, they compound. Pick a channel — or let us build the full stack.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-zest pb-28">
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 100}>
              <Link href={`/services/${s.slug}/`} className="group card relative flex flex-col justify-between p-10 transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)]">
                <div>
                  <div className="tnum text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                    {String(i + 1).padStart(2, '0')} — {s.hero.eyebrow}
                  </div>
                  <h2 className="mt-6 text-3xl font-light tracking-[-0.02em] md:text-4xl">{s.navTitle}</h2>
                  <p className="mt-4 max-w-md font-light text-[var(--color-fg-muted)]">{s.metaDescription}</p>
                </div>
                <span className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] transition group-hover:gap-4">
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