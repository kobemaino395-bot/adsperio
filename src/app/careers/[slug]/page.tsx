import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import ApplicationForm from '@/components/ApplicationForm';
import DownloadButton from '@/components/DownloadButton';
import { getPosition, listPositions, type Position } from '@/server/content/positions';
import { getSlot } from '@/server/slot-registry';
import { readSlotStatus } from '@/server/files';
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

const TINTS: Record<Position['heroTint'], string> = {
  accent: 'var(--color-accent)',
  ink: 'var(--color-ink-warm)',
  sky: '#4f9cf9',
  rose: '#e85a82',
  lime: '#a3d33b',
};

export default async function PositionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getPosition(slug);
  if (!p || p.hidden) notFound();

  let downloadUrl = '';
  let downloadFilename = '';
  if (p.downloadSlotSlug) {
    const slot = await getSlot(p.downloadSlotSlug);
    if (slot) {
      if (slot.kind === 'remote' && slot.remoteUrl) {
        downloadUrl = `/api/downloads/${slot.slug}`;
        downloadFilename = slot.publicFilename || slot.slug;
      } else {
        const status = await readSlotStatus(slot.slug);
        if (status.hasFile) {
          downloadUrl = `/api/downloads/${slot.slug}`;
          downloadFilename = slot.publicFilename || status.meta?.originalFilename || slot.slug;
        }
      }
    }
  }

  const tint = TINTS[p.heroTint] ?? TINTS.accent;
  const jsonLd = buildJsonLd(p);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[560px]" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />

        <div className="container-zest relative pt-48 pb-20">
          <Reveal>
            <Link
              href="/careers/"
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted transition hover:text-[var(--color-fg)]"
            >
              ← Careers
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
              <span className="h-2 w-2 animate-blink rounded-full" style={{ background: tint }} />
              {p.eyebrow || 'Now hiring'}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="mt-6 max-w-4xl text-[2.5rem] font-light leading-[1.02] tracking-[-0.04em] md:text-[5rem]">
              {p.title}
              {p.subtitle && (
                <span className="ml-3 align-baseline text-[1.5rem] italic font-light text-ink-muted md:text-[2.5rem]">
                  {p.subtitle}
                </span>
              )}
            </h1>
          </Reveal>
          {p.tagline && (
            <Reveal delay={300}>
              <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-ink-muted">{p.tagline}</p>
            </Reveal>
          )}
          <Reveal delay={400}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#apply"
                className="group relative inline-flex items-center gap-3 bg-[var(--color-ink-warm)] px-8 py-4 text-sm font-medium text-[var(--color-bg)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{ boxShadow: 'var(--shadow-brutal)' }}
              >
                Apply now
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STAT CARDS */}
      {p.statCards.some((s) => s.key || s.value) && (
        <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)]">
          <div className="container-zest py-10">
            <Reveal>
              <dl className="flex flex-wrap gap-x-16 gap-y-6">
                {p.statCards
                  .filter((s) => s.key || s.value)
                  .map((s, i) => (
                    <div key={i}>
                      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">{s.key}</dt>
                      <dd className="mt-1 text-base font-medium text-[var(--color-fg)]">{s.value}</dd>
                    </div>
                  ))}
              </dl>
            </Reveal>
          </div>
        </section>
      )}

      {/* APPLY */}
      <section id="apply" className="relative border-b border-[var(--color-border)] bg-[var(--color-bg)] py-24">
        <div aria-hidden className="bg-dots absolute inset-0 opacity-30" />
        <div className="container-zest relative">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 md:p-10" style={{ boxShadow: 'var(--shadow-md)' }}>
                <SectionLabel>{p.applySubtitle}</SectionLabel>
                <h2 className="mt-4 text-3xl font-light tracking-[-0.02em] md:text-4xl">
                  Tell us about yourself.
                </h2>
                {p.applyBlurb && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">{p.applyBlurb}</p>
                )}
                <div className="mt-8">
                  <ApplicationForm />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
                {downloadUrl && p.showDownload && (
                  <div className="card bg-[var(--color-bg-alt)] p-8">
                    <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                      {p.downloadTitle || 'Download'}
                    </div>
                    {p.downloadBlurb && (
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{p.downloadBlurb}</p>
                    )}
                    <DownloadButton
                      href={downloadUrl}
                      className="mt-6 flex items-center justify-between gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-medium transition hover:bg-[var(--color-bg-alt)]"
                      messageClassName="mt-2 text-xs text-[var(--color-fg-muted)]"
                    >
                      <span>{p.downloadTitle || 'Download'}</span>
                      <span aria-hidden>↓</span>
                    </DownloadButton>
                  </div>
                )}

                {p.processSteps.length > 0 && (
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8">
                    <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
                      {p.processHeading || 'Process'}
                    </div>
                    <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                      {p.processSteps.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="font-mono text-xs text-[var(--color-accent)]">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="rounded-2xl border border-[var(--color-border)] p-8">
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">Questions?</div>
                  <a
                    href={`mailto:hiring@growthvirex.com?subject=Question about ${encodeURIComponent(p.title)} role`}
                    className="mt-4 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
                  >
                    hiring@growthvirex.com
                  </a>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="container-zest py-24">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[2fr_1fr]">
          <div className="space-y-14">
            {p.aboutParagraphs.length > 0 && (
              <Reveal>
                <div>
                  <SectionLabel>{p.aboutHeading || 'About the role'}</SectionLabel>
                  {p.aboutParagraphs.map((para, i) => (
                    <p key={i} className="mt-4 text-lg leading-relaxed text-ink-muted">{para}</p>
                  ))}
                </div>
              </Reveal>
            )}

            {p.responsibilities.length > 0 && (
              <Reveal>
                <div>
                  <SectionLabel>{p.responsibilitiesHeading || "What you'll do"}</SectionLabel>
                  <ul className="mt-6 space-y-4">
                    {p.responsibilities.map((r, i) => (
                      <li key={i} className="flex gap-4 text-ink-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tint }} />
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
                  <ul className="mt-6 space-y-4">
                    {p.mustHave.map((r, i) => (
                      <li key={i} className="flex gap-4 text-ink-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tint }} />
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
                  <ul className="mt-6 space-y-4">
                    {p.niceToHave.map((r, i) => (
                      <li key={i} className="flex gap-4 text-ink-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-[var(--color-border)]" />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {p.equalOpportunity && (
              <Reveal>
                <p className="text-sm leading-relaxed text-ink-muted">{p.equalOpportunity}</p>
              </Reveal>
            )}
          </div>

          <aside className="space-y-5">
            {p.benefits.length > 0 && (
              <Reveal delay={80}>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8">
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
                    {p.benefitsHeading || 'What you get'}
                  </div>
                  {p.benefitsBlurb && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{p.benefitsBlurb}</p>
                  )}
                  <ul className="mt-5 space-y-5">
                    {p.benefits.map((b, i) => (
                      <li key={i}>
                        <div className="text-sm font-semibold text-[var(--color-fg)]">{b.key}</div>
                        {b.value && (
                          <div className="mt-0.5 text-xs leading-relaxed text-ink-muted">{b.value}</div>
                        )}
                        {b.sub && (
                          <div className="mt-0.5 text-[0.65rem] uppercase tracking-[0.15em] text-ink-muted/70">{b.sub}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal delay={160}>
              <div className="rounded-2xl border border-[var(--color-border)] p-8">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">Questions?</div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Reach out before applying — we&apos;re happy to answer any questions about the role.
                </p>
                <a
                  href={`mailto:hiring@growthvirex.com?subject=Question about ${encodeURIComponent(p.title)} role`}
                  className="mt-4 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
                >
                  hiring@growthvirex.com
                </a>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-24 text-center">
        <div className="container-zest max-w-2xl">
          <Reveal>
            <h2 className="text-4xl font-light tracking-[-0.03em] md:text-5xl">
              Think you&apos;re the one?
            </h2>
          </Reveal>
          <Reveal delay={250}>
            <a
              href="#apply"
              className="group relative mt-10 inline-flex items-center gap-3 bg-[var(--color-ink-warm)] px-10 py-5 text-base font-medium text-[var(--color-bg)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: `6px 6px 0 ${tint}` }}
            >
              Apply for {p.title}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
      {children}
    </div>
  );
}
