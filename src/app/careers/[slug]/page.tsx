import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import GradientMesh from '@/components/mesh/GradientMesh';
import CtaPanel from '@/components/layout/CtaPanel';
import ApplicationForm from '@/components/ApplicationForm';
import DownloadButton from '@/components/DownloadButton';
import { getPosition, listPositions, type Position } from '@/server/content/positions';
import { getSlot, isRemoteKind } from '@/server/slot-registry';
import { readSlotStatus } from '@/server/files';
import { downloadPathFor } from '@/server/app-settings';
import { site } from '@/content/site';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const list = await listPositions({ visibleOnly: true });
  return list.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPosition(slug);
  if (!p || p.hidden) return { robots: { index: false, follow: false } };
  return {
    title: p.seoTitle || `${p.title} — Open Role at ${site.name}`,
    description: p.seoDescription || p.tagline.slice(0, 200),
    alternates: { canonical: `/careers/${p.slug}/` },
  };
}

function buildJsonLd(p: Position): Record<string, unknown> {
  const location = p.statCards.find((c) => /location/i.test(c.key))?.value ?? '';
  const employmentType =
    (p.statCards.find((c) => /type/i.test(c.key))?.value ?? '').toUpperCase().replace(/[\s-]+/g, '_') ||
    'FULL_TIME';

  const jl: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: p.title,
    description:
      p.jobPostingDescription || p.aboutParagraphs.join(' ') || p.tagline,
    datePosted: p.datePosted || p.createdAt.slice(0, 10),
    employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: site.name,
      sameAs: site.url,
    },
  };
  if (p.validThrough) jl.validThrough = p.validThrough;
  if (location) {
    jl.jobLocationType = /remote/i.test(location) ? 'TELECOMMUTE' : undefined;
    jl.applicantLocationRequirements = { '@type': 'Country', name: 'Worldwide' };
  }
  if (p.salaryMin > 0 || p.salaryMax > 0) {
    jl.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: p.salaryMin || undefined,
        maxValue: p.salaryMax || undefined,
        unitText: 'YEAR',
      },
    };
  }
  jl.directApply = true;
  return jl;
}

/* The tint is editorial metadata on the position, so it has to keep working —
   but it is remapped onto the mesh stops. No colour outside that set. */
const TINTS: Record<Position['heroTint'], string> = {
  accent: 'var(--indigo)',
  ink: 'var(--navy-900)',
  sky: 'var(--lavender)',
  rose: 'var(--ruby)',
  lime: 'var(--sherbet)',
};

export default async function PositionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getPosition(slug);
  if (!p || p.hidden) notFound();

  // The filename comes back on the response's content-disposition header, so
  // DownloadButton resolves it client-side; nothing to thread through here.
  let downloadUrl = '';
  // Redirect slots forward the browser cross-origin, so they need a plain
  // navigation rather than the fetch-into-a-blob download flow.
  let downloadDirect = false;
  if (p.downloadSlotSlug) {
    const slot = await getSlot(p.downloadSlotSlug);
    if (slot) {
      if (isRemoteKind(slot.kind) && slot.remoteUrl) {
        downloadUrl = await downloadPathFor(slot.slug);
        downloadDirect = slot.kind === 'redirect';
      } else if (slot.kind === 'local') {
        const status = await readSlotStatus(slot.slug);
        if (status.hasFile) {
          downloadUrl = await downloadPathFor(slot.slug);
        }
      }
    }
  }

  // Backward compat: showDownload may be absent in data written before this field was added.
  // Positions that already had a slot configured default to showing it.
  const showDownload = typeof p.showDownload === 'boolean' ? p.showDownload : !!p.downloadSlotSlug;

  const visibleProcessSteps = showDownload ? p.processSteps : (p.processStepsNoDownload ?? []);

  const tint = TINTS[p.heroTint] ?? TINTS.accent;
  const jsonLd = buildJsonLd(p);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="mesh-host overflow-hidden pt-16">
        <GradientMesh height="h-[30rem] md:h-[34rem]" />

        <div className="wrap py-16 md:py-20">
          <Reveal>
            <Link
              href="/careers/"
              className="eyebrow hover:text-indigo-deep inline-flex items-center gap-2 transition-colors"
            >
              ← Careers
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-5 flex items-center gap-2.5">
              <span
                className="animate-caret h-2 w-2 shrink-0 rounded-full"
                style={{ background: tint }}
              />
              <span className="caption">{p.eyebrow || 'Now hiring'}</span>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="display-1 mt-4 max-w-[16ch]">
              {p.title}
              {p.subtitle && (
                <span className="text-ink-mute ml-3 align-baseline text-[0.55em]">
                  {p.subtitle}
                </span>
              )}
            </h1>
          </Reveal>
          {p.tagline && (
            <Reveal delay={300}>
              <p className="lede mt-6 max-w-[54ch]">{p.tagline}</p>
            </Reveal>
          )}
          <Reveal delay={400}>
            <div className="mt-8">
              <a href="#apply" className="btn btn-solid">
                Apply now
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STAT CARDS */}
      {p.statCards.some((s) => s.key || s.value) && (
        <section className="border-hairline bg-canvas-soft border-y">
          <div className="wrap py-10">
            <Reveal>
              <dl className="flex flex-wrap gap-x-16 gap-y-6">
                {p.statCards
                  .filter((s) => s.key || s.value)
                  .map((s, i) => (
                    <div key={i}>
                      <dt className="caption">{s.key}</dt>
                      <dd className="text-ink mt-1 text-base font-medium">{s.value}</dd>
                    </div>
                  ))}
              </dl>
            </Reveal>
          </div>
        </section>
      )}

      {/* APPLY */}
      <section id="apply" className="border-hairline bg-canvas border-b py-20 md:py-24">
        <div className="wrap">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <div className="card shadow-lift-1 p-7 md:p-10">
                <SectionLabel>{p.applySubtitle}</SectionLabel>
                <h2 className="display-3 mt-3">Tell us about yourself.</h2>
                {p.applyBlurb && (
                  <p className="text-ink-mute mt-3 max-w-xl leading-relaxed">{p.applyBlurb}</p>
                )}
                <div className="mt-8">
                  <ApplicationForm showTestUpload={showDownload} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                {downloadUrl && showDownload && (
                  <div className="card bg-canvas-soft p-6">
                    <div className="text-ink text-[0.9375rem] font-medium">
                      {p.downloadTitle || 'Download'}
                    </div>
                    {p.downloadBlurb && (
                      <p className="text-ink-mute mt-2 leading-relaxed">{p.downloadBlurb}</p>
                    )}
                    <DownloadButton
                      href={downloadUrl}
                      direct={downloadDirect}
                      className="btn btn-line mt-5 w-full"
                      messageClassName="caption mt-2"
                    >
                      <span>{p.downloadTitle || 'Download'}</span>
                      <span aria-hidden>↓</span>
                    </DownloadButton>
                  </div>
                )}

                {visibleProcessSteps.length > 0 && (
                  <div className="card bg-canvas-soft p-6">
                    <div className="text-ink text-[0.9375rem] font-medium">
                      {p.processHeading || 'Process'}
                    </div>
                    <ol className="text-ink-mute mt-4 space-y-3 leading-relaxed">
                      {visibleProcessSteps.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-indigo-text shrink-0 text-[0.8125rem] font-medium tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="card p-6">
                  <div className="text-ink text-[0.9375rem] font-medium">Questions?</div>
                  <a
                    href={`mailto:hiring@adsperio.com?subject=Question about ${encodeURIComponent(p.title)} role`}
                    className="link-inline mt-3 inline-block"
                  >
                    hiring@adsperio.com
                  </a>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="wrap py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-14 md:grid-cols-[2fr_1fr]">
          <div className="space-y-14">
            {p.aboutParagraphs.length > 0 && (
              <Reveal>
                <div>
                  <SectionLabel>{p.aboutHeading || 'About the role'}</SectionLabel>
                  {p.aboutParagraphs.map((para, i) => (
                    <p key={i} className="text-ink-mute mt-4 text-[1.0625rem] leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}

            {p.responsibilities.length > 0 && (
              <Reveal>
                <div>
                  <SectionLabel>{p.responsibilitiesHeading || "What you'll do"}</SectionLabel>
                  <ul className="mt-5 space-y-3">
                    {p.responsibilities.map((r, i) => (
                      <li key={i} className="text-ink-mute flex gap-3.5">
                        <span
                          className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: tint }}
                        />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {p.mustHave.length > 0 && (
              <Reveal>
                <div>
                  <SectionLabel>{p.mustHaveHeading || "What we're looking for"}</SectionLabel>
                  <ul className="mt-5 space-y-3">
                    {p.mustHave.map((r, i) => (
                      <li key={i} className="text-ink-mute flex gap-3.5">
                        <span
                          className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: tint }}
                        />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {p.niceToHave.length > 0 && (
              <Reveal>
                <div>
                  <SectionLabel>{p.niceToHaveHeading || 'Nice to have'}</SectionLabel>
                  <ul className="mt-5 space-y-3">
                    {p.niceToHave.map((r, i) => (
                      <li key={i} className="text-ink-mute flex gap-3.5">
                        <span className="border-hairline-strong mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full border" />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {p.equalOpportunity && (
              <Reveal>
                <p className="caption leading-relaxed">{p.equalOpportunity}</p>
              </Reveal>
            )}
          </div>

          <aside className="space-y-5">
            {p.benefits.length > 0 && (
              <Reveal delay={80}>
                <div className="card bg-canvas-soft p-6">
                  <div className="text-ink text-[0.9375rem] font-medium">
                    {p.benefitsHeading || 'What you get'}
                  </div>
                  {p.benefitsBlurb && (
                    <p className="text-ink-mute mt-2 leading-relaxed">{p.benefitsBlurb}</p>
                  )}
                  <ul className="divide-hairline mt-4 divide-y">
                    {p.benefits.map((b, i) => (
                      <li key={i} className="py-3 first:pt-0 last:pb-0">
                        <div className="text-ink text-[0.875rem] font-medium">{b.key}</div>
                        {b.value && (
                          <div className="text-ink-mute mt-0.5 text-[0.8125rem] leading-relaxed">
                            {b.value}
                          </div>
                        )}
                        {b.sub && <div className="caption mt-0.5">{b.sub}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal delay={160}>
              <div className="card p-6">
                <div className="text-ink text-[0.9375rem] font-medium">Questions?</div>
                <p className="text-ink-mute mt-2 leading-relaxed">
                  Reach out before applying — we&apos;re happy to answer any questions about the
                  role.
                </p>
                <a
                  href={`mailto:hiring@adsperio.com?subject=Question about ${encodeURIComponent(p.title)} role`}
                  className="link-inline mt-3 inline-block"
                >
                  hiring@adsperio.com
                </a>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <CtaPanel
        eyebrow="Last step"
        title="Think you're the one?"
        body="The form takes about ten minutes and a person reads every submission. We reply either way."
      >
        <a href="#apply" className="btn btn-invert">
          Apply for {p.title}
        </a>
        <Link href="/careers/" className="btn btn-invert-line">
          Other roles
        </Link>
      </CtaPanel>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
