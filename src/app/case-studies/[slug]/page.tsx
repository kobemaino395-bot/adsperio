import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { caseStudies, getCaseStudyBySlug } from '@/content/case-studies';
import { services } from '@/content/services';
import { site } from '@/content/site';
import Reveal from '@/components/ui/Reveal';
import { BrowserFrame, AreaChart, ChannelBars } from '@/components/mockups/ProductMockups';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};

  const canonical = `/case-studies/${cs.slug}/`;
  return {
    title: cs.metaTitle,
    description: cs.metaDescription,
    keywords: cs.keywords,
    alternates: { canonical },
    openGraph: {
      title: cs.metaTitle,
      description: cs.metaDescription,
      url: `${site.url}${canonical}`,
      type: 'article',
      publishedTime: cs.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: cs.metaTitle,
      description: cs.metaDescription,
    },
  };
}

export default async function CaseStudyPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const relatedServices = services.filter((s) => cs.services.includes(s.slug));
  const otherCases = caseStudies.filter((c) => c.slug !== cs.slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cs.metaTitle,
    description: cs.metaDescription,
    datePublished: cs.publishedAt,
    author: { '@type': 'Organization', name: site.name, url: site.url },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: `${site.url}/favicon.svg` },
    },
    mainEntityOfPage: `${site.url}/case-studies/${cs.slug}/`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Case studies', item: `${site.url}/case-studies/` },
      { '@type': 'ListItem', position: 3, name: cs.client, item: `${site.url}/case-studies/${cs.slug}/` },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[540px]" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />

        <div className="container-zest relative pt-40 pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <h1 className="text-5xl font-light tracking-[-0.04em] md:text-7xl">
                {cs.hero.title}{' '}
                <span className="hl">{cs.hero.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal delay={250}>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-[var(--color-fg-muted)] md:text-xl">
                {cs.hero.summary}
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
                <span><strong className="font-medium text-[var(--color-fg)]">Client:</strong> {cs.client}</span>
                <span><strong className="font-medium text-[var(--color-fg)]">Industry:</strong> {cs.industry}</span>
                <span><strong className="font-medium text-[var(--color-fg)]">Duration:</strong> {cs.duration}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="container-zest py-20">
          <div className="grid gap-12 md:grid-cols-[1.5fr_2fr] md:items-center">
            <Reveal>
              <div className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">Headline result</div>
              <div className="tnum mt-4 text-7xl font-light tracking-tight md:text-[10rem] leading-none text-[var(--color-accent)]">
                {cs.headline.value}
              </div>
              <div className="mt-3 text-base uppercase tracking-widest text-[var(--color-fg-muted)]">
                {cs.headline.label}
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-6 border-l border-[var(--color-border)] pl-10">
              {cs.metrics.map((m, i) => (
                <Reveal key={m.label} delay={i * 100}>
                  <div className="tnum text-3xl font-light tracking-tight md:text-5xl">{m.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">{m.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS VISUAL */}
      <section className="container-zest py-24">
        <Reveal>
          <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="text-2xl font-light tracking-[-0.02em] md:text-3xl">The trajectory</h2>
            <span className="text-sm font-light text-[var(--color-fg-muted)]">Tracked revenue over the {cs.duration} engagement</span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <BrowserFrame url={`app.growthvirex.com/${cs.slug}`}>
            <div className="grid gap-5 p-5 sm:grid-cols-[1.7fr_1fr] sm:p-6">
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">Tracked revenue</div>
                    <div className="tnum mt-1 text-2xl font-light tracking-tight">{cs.headline.value}</div>
                  </div>
                  <span className="tnum rounded-full bg-[var(--color-zest-50)] px-2 py-1 text-[0.65rem] font-medium text-[var(--color-accent-deep)]">{cs.headline.label}</span>
                </div>
                <AreaChart className="mt-3" />
              </div>
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">Channel mix · ROAS</div>
                <ChannelBars className="mt-5" />
              </div>
            </div>
          </BrowserFrame>
        </Reveal>
      </section>

      {/* NARRATIVE */}
      <section className="container-zest py-28">
        <div className="mx-auto grid max-w-5xl gap-16">
          {[cs.challenge, cs.approach, cs.results].map((section, i) => (
            <Reveal key={i} delay={i * 100}>
              <article className="grid gap-6 md:grid-cols-[180px_1fr]">
                <div className="tnum text-xs font-medium uppercase tracking-widest text-[var(--color-accent-deep)]">
                  {String(i + 1).padStart(2, '0')} / {['Challenge', 'Approach', 'Results'][i]}
                </div>
                <div>
                  <h2 className="text-3xl font-light tracking-[-0.02em] md:text-4xl">{section.heading}</h2>
                  <p className="mt-4 text-lg font-light leading-relaxed text-[var(--color-fg-muted)]">{section.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      {cs.testimonial && (
        <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)] py-24">
          <Reveal>
            <div className="container-zest max-w-4xl text-center">
              <div className="text-6xl leading-none text-[var(--color-accent)]">&ldquo;</div>
              <blockquote className="mt-4 text-2xl font-light leading-relaxed tracking-[-0.01em] md:text-3xl">
                {cs.testimonial.quote}
              </blockquote>
              <div className="mt-8">
                <div className="font-medium">{cs.testimonial.author}</div>
                <div className="mt-1 text-sm font-light text-[var(--color-fg-muted)]">{cs.testimonial.role}</div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* SERVICES USED */}
      {relatedServices.length > 0 && (
        <section className="container-zest py-24">
          <Reveal>
            <h2 className="mb-10 text-3xl font-light tracking-[-0.02em] md:text-4xl">Services in this engagement</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedServices.map((s, i) => (
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
        </section>
      )}

      {/* OTHER CASE STUDIES */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-24">
        <div className="container-zest">
          <Reveal>
            <h2 className="mb-10 text-3xl font-light tracking-[-0.02em] md:text-4xl">More case studies</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {otherCases.map((c, i) => (
              <Reveal key={c.slug} delay={i * 100} className="h-full">
                <Link
                  href={`/case-studies/${c.slug}/`}
                  className="group card flex h-full flex-col p-8 transition hover:-translate-y-1 hover:border-[var(--color-accent)]"
                >
                  <div className="text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">{c.industry}</div>
                  <h3 className="mt-3 text-xl font-normal">{c.client}</h3>
                  <p className="mt-2 text-sm font-light text-[var(--color-fg-muted)]">{c.tagline}</p>
                  <div className="mt-6 flex items-baseline justify-between">
                    <span className="tnum text-2xl font-light text-[var(--color-accent)]">{c.headline.value}</span>
                    <span className="text-sm font-medium text-[var(--color-accent)] transition group-hover:translate-x-1">
                      Read →
                    </span>
                  </div>
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
            <h2 className="text-4xl font-light tracking-[-0.03em] md:text-5xl">
              Ready to write your own case study?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-4 text-lg font-light text-[var(--color-fg-muted)]">
              Tell us where you want to be in 90 days. We&apos;ll show you how to get there.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <Link href="/contact/" className="btn-primary mt-10">
              Start your project →
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}