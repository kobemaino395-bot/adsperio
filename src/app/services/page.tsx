import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/layout/PageHero';
import CtaPanel from '@/components/layout/CtaPanel';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { WaterfallPlate } from '@/components/product/ProductPanels';

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

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Paid search, paid social, measurement and creative. Four services, a flat monthly fee, and accounts that stay in your own name.',
  alternates: { canonical: '/services/' },
  openGraph: {
    type: 'website',
    url: `${site.url}/services/`,
    siteName: site.name,
    title: `Services · ${site.name}`,
    description:
      'Paid search, paid social, measurement and creative. Four services, a flat monthly fee, and accounts that stay in your own name.',
  },
};

/* Stated once, here, rather than repeated on every service page. */
const TERMS = [
  {
    k: 'Fee',
    v: 'Flat monthly, $9K–$28K',
    note: 'Not a percentage of spend. Percentage fees pay us more for spending more, and we would rather not have that argument with ourselves.',
  },
  {
    k: 'Account size',
    v: '$40K–$900K / month',
    note: 'Below $40K the measurement work costs more than it returns. We will say so rather than take the retainer.',
  },
  {
    k: 'Ownership',
    v: 'Your accounts, your billing',
    note: 'We work inside accounts you own. Leaving costs you nothing but the notice period, and you keep every bit of history.',
  },
  {
    k: 'Notice',
    v: '30 days, either side',
    note: 'No twelve-month lock-in. If the work is good, the contract length is irrelevant; if it is not, a long contract only delays the inevitable.',
  },
];

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Four services. No full-service anything."
        lede="We buy paid media, make the creative that feeds it, and measure whether either worked. That is the entire list. Everything a broader agency would add — SEO, email, brand, PR — we would do at about the level you could hire for directly, so we do not sell it."
      />

      {/* ── The four ── */}
      <section>
        <div className="wrap grid gap-6 pb-20 md:grid-cols-2 md:pb-28">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 50}>
              <Link
                href={`/services/${s.slug}/`}
                className="card-lift group flex h-full flex-col p-7 md:p-9"
              >
                <h2 className="text-[1.625rem] leading-tight font-light tracking-[-0.02em]">
                  {s.navTitle}
                </h2>
                <p className="caption mt-2">{s.navDesc}</p>
                <p className="text-ink-mute mt-5 flex-1 leading-relaxed">{s.hero.lede}</p>

                <dl className="border-hairline mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6">
                  {s.figures.slice(0, 2).map((f) => (
                    <div key={f.label}>
                      <dt className="text-[1.75rem] leading-none font-light tracking-[-0.025em] tabular-nums">
                        {f.value}
                      </dt>
                      <dd className="caption mt-2 leading-snug">{f.label}</dd>
                    </div>
                  ))}
                </dl>

                <span className="link-arrow mt-7 text-[0.875rem]">
                  Read the detail <Arrow />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Terms ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="eyebrow">Terms</span>
              <h2 className="display-2 mt-4 max-w-[14ch]">How the commercial side works.</h2>
              <p className="text-ink-mute mt-5 max-w-xs leading-relaxed">
                Published because being asked to sign an NDA before hearing a price is a bad
                way to start.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <dl className="divide-hairline border-hairline bg-canvas divide-y overflow-hidden rounded-xl border">
              {TERMS.map((t, i) => (
                <Reveal key={t.k} delay={i * 55} as="div">
                  <div className="grid gap-2 px-6 py-6 md:grid-cols-12 md:gap-6">
                    <dt className="caption md:col-span-3 md:pt-1">{t.k}</dt>
                    <dd className="md:col-span-9">
                      <span className="block text-[1.0625rem] font-medium tracking-[-0.015em]">
                        {t.v}
                      </span>
                      <span className="text-ink-mute mt-2 block leading-relaxed">{t.note}</span>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Where the money goes ── */}
      <section>
        <div className="wrap grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <WaterfallPlate />
          </Reveal>
          <div className="lg:col-span-5">
            <Reveal delay={110}>
              <span className="eyebrow">Why measurement is in the list</span>
              <h2 className="display-3 mt-4 max-w-[18ch]">
                A media budget is mostly not media.
              </h2>
              <div className="text-ink-mute mt-6 space-y-4 leading-relaxed">
                <p>
                  On the typical account we inherit, a fifth of spend is buying conversions
                  that would have happened anyway and another tenth is invisible because the
                  tracking is broken. Neither shows up in a platform dashboard, because the
                  platform has no reason to look.
                </p>
                <p>
                  Which is why measurement is a service here rather than a slide in the
                  monthly report. It is the part that tells you whether the other three are
                  worth paying for.
                </p>
              </div>
              <Link href="/services/measurement/" className="link-arrow mt-7">
                Measurement in detail <Arrow />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaPanel
        title="Not sure which of these you need? Neither are we, yet."
        body="Send read-only access to whichever ad account worries you most. The audit comes back in two weeks and usually answers the question for us both."
      >
        <Link href="/contact/" className="btn btn-invert">
          Request an audit
        </Link>
        <a href={`mailto:${site.contact.email}`} className="btn btn-invert-line">
          {site.contact.email}
        </a>
      </CtaPanel>
    </main>
  );
}
