import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { services, getServiceBySlug } from '@/content/services';
import { site } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

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
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50 opacity-60" />
        <div
          aria-hidden
          className="animate-orb-float absolute -top-48 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-zest-300/30 blur-3xl"
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-40" />

        <div className="container-zest relative pt-40 pb-24 text-center">
          <Reveal>
            <span className="inline-block rounded-full border border-ink/10 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur dark:border-white/10 dark:bg-white/5">
              {service.hero.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-7xl">
              {service.hero.title}{' '}
              <span className="relative inline-block">
                <span className="relative z-10">
                  {service.hero.titleAccent}
                </span>
                <span aria-hidden className="absolute bottom-1 left-0 right-0 -z-0 h-[0.35em] bg-[var(--color-accent)]" />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted dark:text-neutral-400 md:text-xl">
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
      <section className="border-y border-[var(--color-border)] bg-ink text-white">
        <div className="container-zest py-20">
          <Reveal>
            <h2 className="mb-12 text-2xl font-medium md:text-3xl">{service.stats.sectionTitle}</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
            {service.stats.items.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="text-4xl font-semibold tracking-tight md:text-6xl">{s.value}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-neutral-500">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="container-zest py-28">
        <Reveal>
          <h2 className="mb-14 text-4xl font-semibold tracking-tight md:text-5xl">
            {service.methodology.sectionTitle}
          </h2>
        </Reveal>
        <div className="grid gap-5">
          {service.methodology.items.map((item, i) => (
            <Reveal key={item.n} delay={i * 80}>
              <article className="group relative flex flex-col gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-10 transition hover:-translate-y-1 hover:border-zest-300 hover:shadow-2xl hover:shadow-zest-300/10 md:flex-row md:gap-16">
                <div className="text-base font-medium text-ink-muted md:min-w-[60px]">{item.n}</div>
                <div>
                  <h3 className="text-2xl font-semibold md:text-3xl">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-ink-muted dark:text-neutral-400">{item.desc}</p>
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
            <h2 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">Other services</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {services
              .filter((s) => s.slug !== service.slug)
              .map((s, i) => (
                <Reveal key={s.slug} delay={i * 100} className="h-full">
                  <Link
                    href={`/services/${s.slug}/`}
                    className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 transition hover:-translate-y-1 hover:border-zest-300"
                  >
                    <div className="text-xs uppercase tracking-widest text-ink-muted">{s.hero.eyebrow}</div>
                    <h3 className="mt-3 text-xl font-semibold">{s.navTitle}</h3>
                    <p className="mt-2 text-sm text-ink-muted dark:text-neutral-400">{s.navDesc}</p>
                    <span className="mt-6 inline-block text-sm font-medium text-zest-400 transition group-hover:translate-x-1">
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
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">{service.finalCta.title}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-4 text-lg text-ink-muted dark:text-neutral-400">{service.finalCta.subtitle}</p>
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