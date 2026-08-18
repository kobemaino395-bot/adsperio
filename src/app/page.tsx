import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import GradientMesh from '@/components/mesh/GradientMesh';
import CtaPanel from '@/components/layout/CtaPanel';
import { services } from '@/content/services';
import { caseStudies } from '@/content/case-studies';
import { testimonials } from '@/content/testimonials';
import { site, houseNumbers } from '@/content/site';
import {
  ReconciliationPlate,
  AccountLedgerPlate,
  CreativeGridPlate,
  ConsolePanel,
  CoverPlate,
} from '@/components/product/ProductPanels';

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

/* Anonymised, because the alternative is a row of client logos we would have
   to ask permission for and nobody reads anyway. */
const ACCOUNTS = [
  'Home goods · DTC · $153K/mo',
  'Logistics software · B2B · $71K/mo',
  'Supplements · DTC · $214K/mo',
  'Legal services · 19 offices · $118K/mo',
  'Consumer audio · Retail · $96K/mo',
  'Insurance · B2C · $184K/mo',
  'Industrial parts · B2B · $47K/mo',
];

const FAQS = [
  {
    q: 'What does this cost?',
    a: 'A flat monthly fee, between $9K and $28K depending on channel count and spend. Not a percentage of your budget — that pays us more for spending more, which is the wrong incentive and it has bitten us before.',
  },
  {
    q: 'What size accounts do you take?',
    a: 'Roughly $40K to $900K a month in media. Below $40K the measurement work costs more than it returns, and we will tell you that instead of taking the retainer.',
  },
  {
    q: 'Do you take over our accounts?',
    a: 'No. Accounts stay in your billing and your name, and we work inside them. If you leave, nothing needs migrating and you keep the entire history.',
  },
  {
    q: 'How long before anything changes?',
    a: 'The audit lands in two weeks. Structural changes usually start in week three and get worse before they get better, because bidding algorithms need about three weeks to re-learn. Most accounts look genuinely different by month three.',
  },
  {
    q: 'Will our reported numbers go up?',
    a: 'Often they go down, at least at first. We fix tracking and stop counting conversions that were never incremental, and the honest number is frequently smaller than the flattering one that came before it.',
  },
  {
    q: 'Do you do SEO, email, or brand work?',
    a: 'No. We buy paid media, make the creative that feeds it, and measure both. We will happily recommend people for the rest, and we do not take a referral fee for it.',
  },
];

const featuredCases = caseStudies.slice(0, 3);
const featured = testimonials[0];

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

export default function HomePage() {
  return (
    <main>
      {/* ─────────────────────── HERO ─────────────────────── */}
      <section className="mesh-host overflow-hidden pt-16">
        <GradientMesh height="h-[38rem] md:h-[42rem]" />

        <div className="wrap grid gap-14 pt-16 pb-16 md:pt-24 md:pb-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow">
                Performance advertising · New York · Since {site.founded}
              </p>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="display-1 mt-5 max-w-[13ch]">
                We buy media, and we tell you what it actually did.
              </h1>
            </Reveal>

            <Reveal delay={170}>
              <p className="lede mt-6 max-w-[52ch]">
                Every ad platform grades its own homework. Across the accounts we have taken
                over, the platform&rsquo;s reported return overstated reality by a median of
                2.7x. We run paid search, paid social and the creative that feeds them — then
                reconcile the spend against revenue you can find in your own books.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/contact/" className="btn btn-solid">
                  Request an audit
                </Link>
                <Link href="/case-studies/" className="link-arrow px-2">
                  See the work <Arrow />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <p className="caption mt-6">
                Read-only account access is enough to start. No deck, no discovery call.
              </p>
            </Reveal>
          </div>

          {/* The composited product mockup. The console hangs off the corner so
              it reads as a second layer, but it is deliberately short — it may
              overlap the panel's footer strip, never its plot area. It only
              renders at desktop; at phone widths there is nothing to hang off. */}
          <Reveal delay={180} className="lg:col-span-6 lg:pt-2">
            <div className="relative pb-4 lg:pb-16">
              <ReconciliationPlate />
              <ConsolePanel className="absolute -bottom-2 -left-10 hidden w-52 lg:block" />
            </div>
            <p className="caption leading-relaxed lg:pl-48">
              An account we took over in 2024. The shaded band is the difference between what
              the platform claimed and what the client&rsquo;s books showed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── HOUSE NUMBERS ─────────────────── */}
      <section className="border-hairline border-t">
        <div className="wrap">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-4 md:py-16">
            {houseNumbers.map((n, i) => (
              <Reveal key={n.label} delay={i * 60} as="div">
                <dt className="figure-xl">{n.value}</dt>
                <dd className="mt-3">
                  <span className="block text-[0.9375rem] leading-snug font-medium">
                    {n.label}
                  </span>
                  <span className="caption mt-1 block">{n.note}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────────── ACCOUNT TICKER ───────────────── */}
      <section
        className="border-hairline bg-canvas-soft overflow-hidden border-y py-4"
        aria-label="Accounts under management"
      >
        <div className="animate-ticker flex w-max gap-8 whitespace-nowrap">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex gap-8" aria-hidden={dup === 1}>
              {ACCOUNTS.map((a) => (
                <span key={a} className="caption flex items-center gap-8">
                  {a}
                  <span className="bg-hairline h-3 w-px" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── WHAT WE DO ─────────────────── */}
      <section>
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow">What we do</span>
                <h2 className="display-2 mt-4 max-w-[18ch]">Four things, done properly.</h2>
              </div>
              <p className="text-ink-mute max-w-sm leading-relaxed">
                Not a full-service agency. This is the whole list, and we would rather turn
                down work than pad it out.
              </p>
            </div>
          </Reveal>

          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60} as="li">
                <Link
                  href={`/services/${s.slug}/`}
                  className="card-lift group flex h-full flex-col p-7"
                >
                  <h3 className="text-[1.375rem] leading-tight font-light tracking-[-0.02em]">
                    {s.navTitle}
                  </h3>
                  <p className="text-ink-mute mt-3 flex-1 leading-relaxed">
                    {s.navDesc}. {s.scope[0]}
                  </p>
                  <span className="link-arrow mt-6 text-[0.875rem]">
                    Read more <Arrow />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────────────── THE GAP ───────────────────── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="eyebrow">The argument</span>
                <h2 className="display-2 mt-4 max-w-[16ch]">
                  Most agencies report the number that flatters them.
                </h2>
                <div className="text-ink-mute mt-6 space-y-4 leading-relaxed">
                  <p>
                    Branded search and short-window retargeting are exceptionally good at
                    claiming credit for purchases that were always going to happen. They make
                    a dashboard look excellent and a bank balance look unchanged.
                  </p>
                  <p>
                    We test it the only way that settles the question: turn the campaign off in
                    matched markets and watch whether revenue moves. One time in four it does
                    not, and then we say so — including when the campaign was ours.
                  </p>
                </div>
                <Link href="/services/measurement/" className="link-arrow mt-7">
                  How measurement works <Arrow />
                </Link>
              </Reveal>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
              <Reveal delay={110}>
                <AccountLedgerPlate />
              </Reveal>
              <Reveal delay={180}>
                <CreativeGridPlate />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── SELECTED WORK ─────────────────── */}
      <section>
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow">Work</span>
                <h2 className="display-2 mt-4 max-w-[16ch]">
                  Five accounts, written up honestly.
                </h2>
              </div>
              <Link href="/case-studies/" className="link-arrow shrink-0">
                All work <Arrow />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredCases.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <Link href={`/case-studies/${c.slug}/`} className="group block">
                  <CoverPlate
                    slug={c.slug}
                    figure={c.headline.value}
                    label={c.headline.label}
                    className="aspect-[4/3] transition-shadow group-hover:shadow-lift-2"
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
        </div>
      </section>

      {/* ───── TESTIMONIAL — the cream interlude ───── */}
      <section className="wrap pb-20 md:pb-28">
        <Reveal>
          <figure className="card-cream grid gap-8 px-7 py-12 md:grid-cols-12 md:items-end md:px-14 md:py-16">
            <blockquote className="text-[1.5rem] leading-[1.3] font-light tracking-[-0.02em] md:col-span-9 md:text-[2rem]">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <figcaption className="md:col-span-3">
              <div className="text-[0.9375rem] font-medium">{featured.author}</div>
              <div className="mt-1 text-[0.8125rem] opacity-70">
                {featured.role}, {featured.company}
              </div>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ────────────────────── FAQ ────────────────────── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="eyebrow">Questions</span>
              <h2 className="display-2 mt-4 max-w-[14ch]">The ones that come up first.</h2>
              <p className="text-ink-mute mt-5 max-w-xs leading-relaxed">
                If yours is not here, email{' '}
                <a href={`mailto:${site.contact.email}`} className="link-inline">
                  {site.contact.email}
                </a>
                . A person answers.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <dl className="divide-hairline border-hairline bg-canvas divide-y overflow-hidden rounded-xl border">
              {FAQS.map((f, i) => (
                <Reveal key={f.q} delay={i * 45} as="div">
                  <details className="group">
                    <summary className="hover:bg-canvas-soft flex cursor-pointer list-none items-baseline gap-4 px-6 py-5 transition-colors [&::-webkit-details-marker]:hidden">
                      <span className="flex-1 text-[1rem] font-medium tracking-[-0.01em]">
                        {f.q}
                      </span>
                      <span
                        aria-hidden
                        className="text-ink-mute shrink-0 transition-transform duration-200 group-open:rotate-45"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M6 1v10M1 6h10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </summary>
                    <dd className="text-ink-mute max-w-[62ch] px-6 pb-6 leading-relaxed">
                      {f.a}
                    </dd>
                  </details>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ────────────────────── CTA ────────────────────── */}
      <CtaPanel
        title={
          <>Give us read-only access. We&rsquo;ll tell you what&rsquo;s wrong with the account.</>
        }
        body="Two weeks, no fee, no obligation to continue. You get a written list of what is costing you money, ranked, with the exports attached. About a third of the companies we audit do not become clients, which is fine."
      >
        <Link href="/contact/" className="btn btn-invert">
          Request an audit
        </Link>
        <Link href="/about/" className="btn btn-invert-line">
          How we work
        </Link>
      </CtaPanel>
    </main>
  );
}
