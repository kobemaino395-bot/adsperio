import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { services, getServiceBySlug } from '@/content/services';
import { site } from '@/content/site';
import Reveal from '@/components/ui/Reveal';
import { BrowserFrame, AreaChart, CampaignTable, StatTiles } from '@/components/mockups/ProductMockups';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const canonical = `/services/${service.slug}/`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${site.url}${canonical}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  // JSON-LD for the specific service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.navTitle,
    description: service.metaDescription,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    areaServed: 'Global',
    url: `${site.url}/services/${service.slug}/`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/services/` },
      { '@type': 'ListItem', position: 3, name: service.navTitle, item: `${site.url}/services/${service.slug}/` },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[560px]" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />

        <div className="container-zest relative pt-40 pb-24 text-center">
          <Reveal>
            <span className="pill-tag mx-auto">{service.hero.eyebrow}</span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-light tracking-[-0.04em] md:text-7xl">
              {service.hero.title}{' '}
              <span className="hl">{service.hero.titleAccent}</span>
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-[var(--color-fg-muted)] md:text-xl">
              {service.hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-10">
              <Link href="/contact/" className="btn-primary">
                {service.hero.ctaLabel} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="container-zest py-20">
          <Reveal>
            <h2 className="mb-12 text-2xl font-light tracking-[-0.01em] md:text-3xl">{service.stats.sectionTitle}</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-8 border-t border-[var(--color-border)] pt-10 md:grid-cols-4">
            {service.stats.items.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="tnum text-4xl font-light tracking-tight md:text-6xl">{s.value}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD / DELIVERABLES */}
      <section className="container-zest py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div>
              <span className="label-tech">What you get</span>
              <h2 className="mt-3 max-w-md text-3xl font-light tracking-[-0.02em] md:text-4xl">
                A live system, not a slide deck.
              </h2>
              <p className="mt-5 max-w-md font-light leading-relaxed text-[var(--color-fg-muted)]">
                You get a working {service.navTitle.toLowerCase()} engine wired into a single revenue dashboard — refreshed daily, attributable to the dollar, and reviewed with you every week.
              </p>
              <ul className="mt-8 space-y-3.5">
                {[
                  'A dedicated strategist plus a pod of channel specialists.',
                  'Real-time dashboard with spend, ROAS, and CAC by campaign.',
                  'Weekly recorded walkthroughs — no reporting theater.',
                  'Creative testing pipeline with attributable winners.',
                ].map((p) => (
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
            <BrowserFrame url={`app.growthvirex.com/${service.slug}`}>
              <div className="space-y-4 p-5 sm:p-6">
                <div className="rounded-xl border border-[var(--color-border)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">Performance · {service.navTitle}</span>
                    <span className="tnum rounded-full bg-[var(--color-zest-50)] px-2 py-1 text-[0.65rem] font-medium text-[var(--color-accent-deep)]">▲ live</span>
                  </div>
                  <AreaChart className="mt-3" />
                </div>
                <StatTiles />
                <CampaignTable />
              </div>
            </BrowserFrame>
          </Reveal>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="container-zest py-28">
        <Reveal>
          <h2 className="mb-14 text-4xl font-light tracking-[-0.03em] md:text-5xl">
            {service.methodology.sectionTitle}
          </h2>
        </Reveal>
        <div className="grid gap-5">
          {service.methodology.items.map((item, i) => (
            <Reveal key={item.n} delay={i * 80}>
              <article className="group card relative flex flex-col gap-6 p-10 transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-md)] md:flex-row md:gap-16">
                <div className="tnum text-base font-medium text-[var(--color-accent)] md:min-w-[60px]">{item.n}</div>
                <div>
                  <h3 className="text-2xl font-light tracking-[-0.01em] md:text-3xl">{item.title}</h3>
                  <p className="mt-3 max-w-2xl font-light text-[var(--color-fg-muted)]">{item.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CROSS-SELL: other services */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-24">
        <div className="container-zest">
          <Reveal>
            <h2 className="mb-10 text-3xl font-light tracking-[-0.02em] md:text-4xl">Other services</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {services
              .filter((s) => s.slug !== service.slug)
              .map((s, i) => (
                <Reveal key={s.slug} delay={i * 100} className="h-full">
                  <Link
                    href={`/services/${s.slug}/`}
                    className="group card flex h-full flex-col p-8 transition hover:-translate-y-1 hover:border-[var(--color-accent)]"
                  >
                    <div className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">{s.hero.eyebrow}</div>
                    <h3 className="mt-3 text-xl font-normal">{s.navTitle}</h3>
                    <p className="mt-2 text-sm font-light text-[var(--color-fg-muted)]">{s.navDesc}</p>
                    <span className="mt-6 inline-block text-sm font-medium text-[var(--color-accent)] transition group-hover:translate-x-1">
                      Learn more →
                    </span>
                  </Link>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 text-center">
        <div className="container-zest max-w-3xl">
          <Reveal>
            <h2 className="text-4xl font-light tracking-[-0.03em] md:text-5xl">{service.finalCta.title}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-4 text-lg font-light text-[var(--color-fg-muted)]">{service.finalCta.subtitle}</p>
          </Reveal>
          <Reveal delay={250}>
            <Link href="/contact/" className="btn-primary mt-10">
              {service.finalCta.ctaLabel}
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}