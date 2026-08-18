import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/layout/PageHero';
import CtaPanel from '@/components/layout/CtaPanel';
import { caseStudies, getCaseStudyBySlug } from '@/content/case-studies';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { CoverPlate } from '@/components/product/ProductPanels';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudyBySlug(slug);
  if (!c) return { robots: { index: false, follow: false } };

  return {
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: [...c.keywords],
    alternates: { canonical: `/case-studies/${c.slug}/` },
    openGraph: {
      type: 'article',
      url: `${site.url}/case-studies/${c.slug}/`,
      siteName: site.name,
      title: `${c.metaTitle} · ${site.name}`,
      description: c.metaDescription,
      publishedTime: c.publishedAt,
    },
  };
}

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const c = getCaseStudyBySlug(slug);
  if (!c) notFound();

  const idx = caseStudies.findIndex((x) => x.slug === c.slug);
  const prev = idx > 0 ? caseStudies[idx - 1] : null;
  const next = idx < caseStudies.length - 1 ? caseStudies[idx + 1] : null;
  const used = services.filter((s) => c.services.includes(s.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.hero.title,
    description: c.metaDescription,
    datePublished: c.publishedAt,
    url: `${site.url}/case-studies/${c.slug}/`,
    author: { '@type': 'Organization', name: site.name, url: site.url },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    about: c.industry,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link href="/case-studies/" className="hover:text-indigo-deep transition-colors">
              Work
            </Link>
            <span aria-hidden className="opacity-50">
              /
            </span>
            <span className="text-ink-mute">{c.client}</span>
          </nav>
        }
        title={c.hero.title}
        lede={c.hero.summary}
        aside={
          <>
            <CoverPlate
              slug={c.slug}
              figure={c.headline.value}
              label={c.headline.label}
              className="aspect-[4/3]"
            />
            <p className="caption mt-3">
              {c.industry} · Published {fmtDate(c.publishedAt)}
            </p>
          </>
        }
      >
        <ul className="flex flex-wrap gap-2">
          {used.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}/`}
                className="border-hairline hover:border-hairline-strong text-ink-2 inline-flex rounded-full border px-3 py-1.5 text-[0.8125rem] transition-colors"
              >
                {s.navTitle}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* ── Metrics ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-4 md:py-16">
            {c.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 55} as="div">
                <dt className="figure-xl text-[1.75rem] md:text-[2.25rem]">{m.value}</dt>
                <dd className="caption mt-3 leading-snug">{m.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Body + facts ── */}
      <section>
        <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {c.sections.map((sec, i) => (
              <Reveal key={sec.heading} delay={i * 60}>
                <div className={i > 0 ? 'mt-12' : ''}>
                  <h2 className="display-3 max-w-[20ch]">{sec.heading}</h2>
                  <div className="text-ink-mute mt-5 space-y-4 text-[1.0625rem] leading-relaxed">
                    {sec.body.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <aside className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="lg:sticky lg:top-24">
                <div className="card overflow-hidden">
                  <div className="border-hairline bg-canvas-soft border-b px-5 py-3">
                    <span className="text-ink text-[0.8125rem] font-medium">Engagement</span>
                  </div>
                  <dl className="divide-hairline divide-y">
                    {c.facts.map((f) => (
                      <div key={f.k} className="flex gap-4 px-5 py-3.5">
                        <dt className="caption w-[9rem] shrink-0">{f.k}</dt>
                        <dd className="text-[0.875rem] leading-snug">{f.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {c.testimonial && (
                  <figure className="card-cream mt-6 p-6">
                    <blockquote className="text-[1.0625rem] leading-relaxed font-light">
                      “{c.testimonial.quote}”
                    </blockquote>
                    <figcaption className="mt-3 text-[0.8125rem] opacity-70">
                      {c.testimonial.author} — {c.testimonial.role}
                    </figcaption>
                  </figure>
                )}
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* ── The candid bit. Every study has one. ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap py-16 md:py-20">
          <Reveal>
            <div className="grid gap-6 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-4">
                <span className="eyebrow">What this cost us</span>
                <p className="caption mt-3 max-w-[24ch] leading-relaxed">
                  Published on every study. An engagement without one of these is a brochure.
                </p>
              </div>
              <p className="text-[1.0625rem] leading-relaxed md:col-span-8">{c.costUs}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Prev / next ── */}
      <section>
        <div className="wrap grid gap-5 py-16 md:grid-cols-2">
          {prev ? (
            <Link href={`/case-studies/${prev.slug}/`} className="card-lift group p-6">
              <span className="caption">← Previous</span>
              <h3 className="group-hover:text-indigo-text mt-2 text-[1.25rem] font-light tracking-[-0.02em] transition-colors">
                {prev.client}
              </h3>
              <p className="text-ink-mute mt-2">{prev.tagline}</p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/case-studies/${next.slug}/`} className="card-lift group p-6 md:text-right">
              <span className="caption">Next →</span>
              <h3 className="group-hover:text-indigo-text mt-2 text-[1.25rem] font-light tracking-[-0.02em] transition-colors">
                {next.client}
              </h3>
              <p className="text-ink-mute mt-2">{next.tagline}</p>
            </Link>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaPanel
        eyebrow="Next step"
        title="Your account, read the same way."
        body="Two weeks, no fee. A written list of what is costing you money, ranked, with the exports attached."
      >
        <Link href="/contact/" className="btn btn-invert">
          Request an audit
        </Link>
        <Link href="/case-studies/" className="btn btn-invert-line">
          All work
        </Link>
      </CtaPanel>
    </main>
  );
}
