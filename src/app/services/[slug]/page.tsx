import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/layout/PageHero';
import CtaPanel from '@/components/layout/CtaPanel';
import { services, getServiceBySlug } from '@/content/services';
import { caseStudies } from '@/content/case-studies';
import { site } from '@/content/site';
import {
  ReconciliationPlate,
  AccountLedgerPlate,
  CreativeGridPlate,
  HoldoutPlate,
  WaterfallPlate,
  CoverPlate,
} from '@/components/product/ProductPanels';

function Arrow() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
      <path
        d="M7 1L11 5L7 9M11 5H1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  if (!s) return { robots: { index: false, follow: false } };

  const url = `${site.url}/services/${s.slug}/`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    keywords: [...s.keywords],
    alternates: { canonical: `/services/${s.slug}/` },
    openGraph: {
      type: 'article',
      url,
      siteName: site.name,
      title: `${s.metaTitle} · ${site.name}`,
      description: s.metaDescription,
    },
  };
}

/** Each service gets a different card, so no two pages look alike. */
function PlateFor({ slug }: { slug: string }) {
  switch (slug) {
    case 'paid-search':
      return <AccountLedgerPlate />;
    case 'paid-social':
      return <CreativeGridPlate />;
    case 'measurement':
      return <ReconciliationPlate />;
    default:
      return <CreativeGridPlate />;
  }
}

function SecondPlateFor({ slug }: { slug: string }) {
  switch (slug) {
    case 'paid-search':
      return <WaterfallPlate />;
    case 'paid-social':
      return <HoldoutPlate />;
    case 'measurement':
      return <HoldoutPlate />;
    default:
      return <WaterfallPlate />;
  }
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  if (!s) notFound();

  const others = services.filter((o) => o.slug !== s.slug);
  const related = caseStudies.filter((c) => c.services.includes(s.slug)).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.navTitle,
    description: s.metaDescription,
    serviceType: s.navTitle,
    url: `${site.url}/services/${s.slug}/`,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    areaServed: 'US',
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
            <Link href="/services/" className="hover:text-indigo-deep transition-colors">
              Services
            </Link>
            <span aria-hidden className="opacity-50">
              /
            </span>
            <span className="text-ink-mute">{s.navTitle}</span>
          </nav>
        }
        title={s.hero.title}
        titleMax="max-w-[14ch]"
        lede={s.hero.lede}
        aside={<PlateFor slug={s.slug} />}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact/" className="btn btn-solid">
            {s.cta.label}
          </Link>
          <Link href="/case-studies/" className="link-arrow px-2">
            See the work <Arrow />
          </Link>
        </div>
      </PageHero>

      {/* ── Figures ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-4 md:py-16">
            {s.figures.map((f, i) => (
              <Reveal key={f.label} delay={i * 55} as="div">
                <dt className="figure-xl text-[2rem] md:text-[2.5rem]">{f.value}</dt>
                <dd className="mt-3">
                  <span className="block text-[0.9375rem] leading-snug font-medium">
                    {f.label}
                  </span>
                  {f.note && <span className="caption mt-1 block">{f.note}</span>}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Scope / not-scope ── */}
      <section>
        <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">What is included</span>
              <h2 className="display-3 mt-4 max-w-[20ch]">Everything in scope, stated plainly.</h2>
            </Reveal>
            <ul className="mt-8 space-y-3">
              {s.scope.map((item, i) => (
                <Reveal key={item} delay={i * 45} as="li">
                  <div className="flex gap-3.5">
                    <span
                      aria-hidden
                      className="text-indigo-text mt-[0.4rem] shrink-0"
                    >
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path
                          d="M1 4.5L4.5 8L11 1"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <p className="text-ink-mute leading-relaxed">{item}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="card bg-canvas-soft p-7 md:p-8">
                <span className="text-ink text-[0.9375rem] font-medium">What this is not</span>
                <ul className="divide-hairline mt-4 divide-y">
                  {s.notScope.map((item) => (
                    <li key={item} className="py-3.5 first:pt-0 last:pb-0">
                      <p className="text-ink-mute leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Method ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <span className="eyebrow">How it runs</span>
            <h2 className="display-2 mt-4 max-w-[18ch]">The order we do things in.</h2>
          </Reveal>

          <ol className="mt-12 grid gap-5 md:grid-cols-2">
            {s.method.map((m, i) => (
              <Reveal key={m.n} delay={i * 60} as="li">
                <div className="card h-full p-7">
                  <span className="pill-tag tabular-nums">{m.n}</span>
                  <h3 className="mt-4 text-[1.25rem] leading-tight font-light tracking-[-0.02em]">
                    {m.title}
                  </h3>
                  <p className="text-ink-mute mt-3 leading-relaxed">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Deliverables ── */}
      <section>
        <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow">What lands, and when</span>
              <h2 className="display-3 mt-4 max-w-[18ch]">
                The deliverables, with their cadence.
              </h2>
              <p className="text-ink-mute mt-5 max-w-sm leading-relaxed">
                This is the contract, not a wish list. If something here stops arriving on
                time, it is a reason to stop paying us.
              </p>
            </Reveal>
          </div>

          <Reveal delay={110} className="lg:col-span-7">
            <div className="border-hairline overflow-hidden rounded-xl border">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-hairline bg-canvas-soft border-b">
                    <th className="caption px-5 py-3 font-medium">Deliverable</th>
                    <th className="caption px-5 py-3 text-right font-medium">Cadence</th>
                  </tr>
                </thead>
                <tbody className="divide-hairline divide-y">
                  {s.deliverables.map((d) => (
                    <tr key={d.label}>
                      <td className="px-5 py-3.5 text-[0.9375rem]">{d.label}</td>
                      <td className="text-ink-mute px-5 py-3.5 text-right text-[0.875rem] tabular-nums">
                        {d.cadence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Second card + related work ── */}
      {related.length > 0 && (
        <section className="border-hairline bg-canvas-soft border-y">
          <div className="wrap py-20 md:py-28">
            <Reveal>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="eyebrow">Where it has been used</span>
                  <h2 className="display-2 mt-4 max-w-[18ch]">
                    Accounts where this was the work.
                  </h2>
                </div>
                <Link href="/case-studies/" className="link-arrow shrink-0">
                  All work <Arrow />
                </Link>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {related.map((c, i) => (
                <Reveal key={c.slug} delay={i * 70}>
                  <Link href={`/case-studies/${c.slug}/`} className="group block">
                    <CoverPlate
                      slug={c.slug}
                      figure={c.headline.value}
                      label={c.headline.label}
                      className="group-hover:shadow-lift-2 aspect-[4/3] transition-shadow"
                    />
                    <div className="mt-4">
                      <span className="caption">{c.industry}</span>
                      <h3 className="group-hover:text-indigo-text mt-1.5 text-[1.125rem] font-medium tracking-[-0.015em] transition-colors">
                        {c.client}
                      </h3>
                      <p className="text-ink-mute mt-1.5 leading-snug">{c.tagline}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={140}>
              <div className="mt-14 grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <SecondPlateFor slug={s.slug} />
                </div>
                <p className="text-ink-mute self-end leading-relaxed lg:col-span-5">
                  Every account gets tested this way at least once a quarter. When the result
                  says a channel is not doing what it claimed, we write that down and act on
                  it — including when it means recommending you spend less with us.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Other services ── */}
      <section>
        <div className="wrap py-16">
          <span className="eyebrow">Also</span>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/services/${o.slug}/`}
                  className="card-lift group flex h-full flex-col p-6"
                >
                  <span className="text-[1.125rem] font-light tracking-[-0.015em]">
                    {o.navTitle}
                  </span>
                  <span className="caption mt-2 flex-1">{o.navDesc}</span>
                  <span className="link-arrow mt-4 text-[0.875rem]">
                    Read <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaPanel eyebrow="Next step" title={s.cta.title} body={s.cta.body}>
        <Link href="/contact/" className="btn btn-invert">
          {s.cta.label}
        </Link>
        <a href={`mailto:${site.contact.email}`} className="btn btn-invert-line">
          {site.contact.email}
        </a>
      </CtaPanel>
    </main>
  );
}
