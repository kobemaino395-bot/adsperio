import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { caseStudies, getCaseStudyBySlug } from '@/content/case-studies';
import { services } from '@/content/services';
import { site } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

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
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50 opacity-60" />
        <div aria-hidden className="animate-orb-float absolute -top-48 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-zest-300/30 blur-3xl" />

        <div className="container-zest relative pt-40 pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <span className="inline-block rounded-full border border-ink/10 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur">
                {cs.hero.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-7xl">
                {cs.hero.title}{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">
                    {cs.hero.titleAccent}
                  </span>
                  <span aria-hidden className="absolute bottom-1 left-0 right-0 -z-0 h-[0.35em] bg-[var(--color-accent)]" />
                </span>
              </h1>
            </Reveal>
            <Reveal delay={250}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted md:text-xl">
                {cs.hero.summary}
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-ink-muted">
                <span><strong className="text-[var(--color-fg)]">Client:</strong> {cs.client}</span>
                <span><strong className="text-[var(--color-fg)]">Industry:</strong> {cs.industry}</span>
                <span><strong className="text-[var(--color-fg)]">Duration:</strong> {cs.duration}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="border-y border-[var(--color-border)] bg-ink text-white">
        <div className="container-zest py-20">
          <div className="grid gap-12 md:grid-cols-[1.5fr_2fr] md:items-center">
            <Reveal>
              <div className="text-xs uppercase tracking-widest text-neutral-500">Headline result</div>
              <div className="mt-4 text-7xl font-semibold tracking-tight md:text-[10rem] leading-none text-zest-300">
                {cs.headline.value}
              </div>
              <div className="mt-3 text-base uppercase tracking-widest text-neutral-400">
                {cs.headline.label}
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-6 border-l border-white/10 pl-10">
              {cs.metrics.map((m, i) => (
                <Reveal key={m.label} delay={i * 100}>
                  <div className="text-3xl font-semibold tracking-tight md:text-5xl">{m.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">{m.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NARRATIVE */}
      <section className="container-zest py-28">
        <div className="mx-auto grid max-w-5xl gap-16">
          {[cs.challenge, cs.approach, cs.results].map((section, i) => (
            <Reveal key={i} delay={i * 100}>
              <article className="grid gap-6 md:grid-cols-[180px_1fr]">
                <div className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                  {String(i + 1).padStart(2, '0')} / {['Challenge', 'Approach', 'Results'][i]}
                </div>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{section.heading}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-ink-muted">{section.body}</p>
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
              <div className="text-6xl leading-none text-zest-400">&ldquo;</div>
              <blockquote className="mt-4 text-2xl font-medium leading-relaxed md:text-3xl">
                {cs.testimonial.quote}
              </blockquote>
              <div className="mt-8">
                <div className="font-semibold">{cs.testimonial.author}</div>
                <div className="mt-1 text-sm text-ink-muted">{cs.testimonial.role}</div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* SERVICES USED */}
      {relatedServices.length > 0 && (
        <section className="container-zest py-24">
          <Reveal>
            <h2 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">Services in this engagement</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedServices.map((s, i) => (
              <Reveal key={s.slug} delay={i * 100} className="h-full">
                <Link
                  href={`/services/${s.slug}/`}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8 transition hover:-translate-y-1 hover:border-zest-300"
                >
                  <div className="text-xs uppercase tracking-widest text-ink-muted">{s.hero.eyebrow}</div>
                  <h3 className="mt-3 text-xl font-semibold">{s.navTitle}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{s.navDesc}</p>
                  <span className="mt-6 inline-block text-sm font-medium text-zest-400 transition group-hover:translate-x-1">
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
            <h2 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">More case studies</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {otherCases.map((c, i) => (
              <Reveal key={c.slug} delay={i * 100} className="h-full">
                <Link
                  href={`/case-studies/${c.slug}/`}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 transition hover:-translate-y-1 hover:border-zest-300"
                >
                  <div className="text-xs uppercase tracking-widest text-ink-muted">{c.industry}</div>
                  <h3 className="mt-3 text-xl font-semibold">{c.client}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{c.tagline}</p>
                  <div className="mt-6 flex items-baseline justify-between">
                    <span className="text-2xl font-semibold text-zest-400">{c.headline.value}</span>
                    <span className="text-sm font-medium text-zest-400 transition group-hover:translate-x-1">
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
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Ready to write your own case study?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-4 text-lg text-ink-muted">
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