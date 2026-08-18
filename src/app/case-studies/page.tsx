import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/layout/PageHero';
import CtaPanel from '@/components/layout/CtaPanel';
import { caseStudies } from '@/content/case-studies';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { CoverPlate } from '@/components/product/ProductPanels';

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

const DESCRIPTION =
  'Five accounts written up as records rather than adverts — including the money we cost ourselves and the calls we got wrong.';

export const metadata: Metadata = {
  title: 'Work',
  description: DESCRIPTION,
  alternates: { canonical: '/case-studies/' },
  openGraph: {
    type: 'website',
    url: `${site.url}/case-studies/`,
    siteName: site.name,
    title: `Work · ${site.name}`,
    description: DESCRIPTION,
  },
};

const nameOf = (slug: string) => services.find((s) => s.slug === slug)?.navTitle ?? slug;

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

export default function CaseStudiesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Work"
        title="Five accounts, written up honestly."
        titleMax="max-w-[15ch]"
        lede="Each of these ends with a section on what the engagement cost us — the overrun we ate, the call we got wrong, the thing we should have argued about earlier. A case study without one is an advertisement."
      />

      {/* ── Index ── */}
      <section>
        <ul className="wrap grid gap-6 pb-20 md:grid-cols-2 md:pb-28">
          {caseStudies.map((c, i) => (
            <li key={c.slug} className={i === 0 ? 'md:col-span-2' : undefined}>
              <Reveal delay={i * 50}>
                <Link href={`/case-studies/${c.slug}/`} className="card-lift group block h-full">
                  <article
                    className={
                      i === 0
                        ? 'grid gap-6 p-6 md:grid-cols-2 md:items-center md:gap-10 md:p-8'
                        : 'p-6'
                    }
                  >
                    <CoverPlate
                      slug={c.slug}
                      figure={c.headline.value}
                      label={c.headline.label}
                      className={i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}
                    />

                    <div>
                      <span className="caption">
                        {c.industry} · {fmtDate(c.publishedAt)}
                      </span>
                      <h2
                        className={`group-hover:text-indigo-text mt-2 font-light tracking-[-0.02em] transition-colors ${
                          i === 0 ? 'text-[1.75rem] md:text-[2.25rem]' : 'text-[1.375rem]'
                        }`}
                      >
                        {c.client}
                      </h2>
                      <p className="text-ink-mute mt-3 max-w-[52ch] leading-relaxed">
                        {c.tagline}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {c.services.map((s) => (
                          <span key={s} className="pill-tag">
                            {nameOf(s)}
                          </span>
                        ))}
                      </div>

                      <span className="link-arrow mt-6 text-[0.875rem]">
                        Read the study <Arrow />
                      </span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Note on numbers ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap grid gap-8 py-16 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <span className="eyebrow">On these figures</span>
          </div>
          <div className="text-ink-mute space-y-4 leading-relaxed md:col-span-8">
            <p>
              Every number on these pages is reconciled against the client’s own accounting
              system, not taken from an ad platform dashboard. Where a result came from a
              holdout test, the test design and significance are stated.
            </p>
            <p>
              Past results are not a forecast. Two of these engagements ran in categories we
              have since stopped taking on, and one of them we would price differently today.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaPanel
        eyebrow="Next step"
        title="Your account, read the same way."
        body="Read-only access is enough. Two weeks later you get the same kind of write-up, about your own numbers."
      >
        <Link href="/contact/" className="btn btn-invert">
          Request an audit
        </Link>
        <Link href="/services/" className="btn btn-invert-line">
          What we do
        </Link>
      </CtaPanel>
    </main>
  );
}
