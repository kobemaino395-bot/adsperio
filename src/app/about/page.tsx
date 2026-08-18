import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/layout/PageHero';
import CtaPanel from '@/components/layout/CtaPanel';
import { team } from '@/content/team';
import { site, houseNumbers } from '@/content/site';
import { MonogramPlate, HoldoutPlate } from '@/components/product/ProductPanels';

const DESCRIPTION =
  'A performance advertising firm in New York, working since 2019 on the principle that an agency should be able to prove its own work was worth paying for.';

export const metadata: Metadata = {
  title: 'Studio',
  description: DESCRIPTION,
  alternates: { canonical: '/about/' },
  openGraph: {
    type: 'website',
    url: `${site.url}/about/`,
    siteName: site.name,
    title: `Studio · ${site.name}`,
    description: DESCRIPTION,
  },
};

const PRINCIPLES = [
  {
    n: '01',
    title: 'The client’s books are the scoreboard',
    body: 'Not the platform dashboard, and not ours. If our number and your finance team’s number disagree, theirs is right and our job is to explain the gap.',
  },
  {
    n: '02',
    title: 'Write the kill criteria down first',
    body: 'Every campaign ships with the conditions under which it gets switched off, agreed before anyone is attached to it. Deciding afterwards is how bad spend survives for years.',
  },
  {
    n: '03',
    title: 'A flat fee, so we can tell you to spend less',
    body: 'We charge a fixed monthly amount rather than a share of your budget. We moved to it after an engagement where cutting a client’s spend cut our own revenue, and the conflict was too obvious to leave in place.',
  },
  {
    n: '04',
    title: 'You own everything',
    body: 'Accounts, data, creative source files, and the tracking we build. Thirty days’ notice either way. Nothing about leaving should be difficult, and making it difficult is not a business model we want.',
  },
  {
    n: '05',
    title: 'The person who runs it writes the report',
    body: 'No account manager relaying notes from a buyer you never meet. Small firm, senior people, and a hard ceiling on how many accounts each person carries.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow={`Studio · New York · Since ${site.founded}`}
        title="An agency that can prove its own work."
        titleMax="max-w-[15ch]"
        lede="Twelve people. Thirty-one accounts. We started because the reporting we were being sent in-house was, on inspection, mostly the ad platform congratulating itself — and nobody seemed willing to say so out loud."
      />

      {/* ── The name ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap grid gap-10 py-16 md:py-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="eyebrow">The name</span>
              <div className="card mt-5 p-6">
                <p className="text-[1.75rem] font-light tracking-[-0.025em]">
                  {site.brand.etymology}
                </p>
                <p className="caption mt-2">
                  {site.brand.etymologyLanguage}, verb · {site.brand.pronunciation}
                </p>
                <p className="text-ink-mute mt-3 leading-relaxed italic">
                  {site.brand.etymologyGloss}
                </p>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={110}>
              <div className="text-ink-mute space-y-4 text-[1.0625rem] leading-relaxed">
                <p>
                  <span className="text-ink font-medium">AdsPerio</span> is ads plus{' '}
                  <span className="italic">aperio</span> — the Latin for uncovering something,
                  laying it open, bringing it to light. It was chosen before the positioning
                  was, which is the wrong order to do things in, but it turned out to describe
                  the work accurately enough that we kept it.
                </p>
                <p>
                  What we actually sell is the removal of a specific kind of uncertainty. Most
                  companies spending seriously on advertising cannot answer a simple question:
                  if we turned this off, what would happen? The dashboard will not tell them,
                  because the dashboard is maintained by the party being paid.
                </p>
                <p>
                  So the work is unglamorous. Reconcile the spend against the bank. Run the
                  holdout. Write down what the result was, including when the result is that
                  something we recommended did not work.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section>
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow">How we work</span>
                <h2 className="display-2 mt-4 max-w-[16ch]">Five things we hold to.</h2>
              </div>
              <p className="text-ink-mute max-w-sm leading-relaxed">
                Each of these exists because something went wrong once. They are not values;
                they are corrections.
              </p>
            </div>
          </Reveal>

          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 55} as="li">
                <div className="card h-full p-7">
                  <span className="pill-tag tabular-nums">{p.n}</span>
                  <h3 className="mt-4 text-[1.25rem] leading-tight font-light tracking-[-0.02em]">
                    {p.title}
                  </h3>
                  <p className="text-ink-mute mt-3 leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Numbers ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-4 md:py-16">
            {houseNumbers.map((n, i) => (
              <Reveal key={n.label} delay={i * 55} as="div">
                <dt className="figure-xl text-[2rem] md:text-[2.5rem]">{n.value}</dt>
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

      {/* ── Team ── */}
      <section>
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <span className="eyebrow">People</span>
            <h2 className="display-2 mt-4 max-w-[18ch]">
              The people who would actually run your account.
            </h2>
            <p className="text-ink-mute mt-5 max-w-lg leading-relaxed">
              We do not photograph the team, because a page of stock-lit headshots tells you
              nothing you could not guess. What is worth knowing is who owns what.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.slug} delay={i * 60} as="li">
                <div className="card h-full p-6">
                  <MonogramPlate name={m.name} className="max-w-[6rem]" />
                  <h3 className="mt-4 text-[1.0625rem] font-medium tracking-[-0.015em]">
                    {m.name}
                  </h3>
                  <p className="caption mt-1">
                    {m.role} · Since {m.since}
                  </p>
                  <p className="text-ink-mute mt-3 leading-relaxed">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Evidence ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap grid items-center gap-12 py-20 md:py-24 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <HoldoutPlate />
          </Reveal>
          <div className="lg:col-span-5">
            <Reveal delay={110}>
              <span className="eyebrow">What good evidence looks like</span>
              <h2 className="display-3 mt-4 max-w-[18ch]">
                One in four tests says the channel was not incremental.
              </h2>
              <p className="text-ink-mute mt-5 leading-relaxed">
                We have run 116 of these since 2019. When the answer is that spend we
                recommended is not doing anything, that goes in the monthly report in the same
                typeface as everything else. It is a difficult meeting and it is the reason
                the median client has been with us six and a half years.
              </p>
              <Link href="/services/measurement/" className="link-arrow mt-7">
                How the testing works
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
                  <path
                    d="M7 1L11 5L7 9M11 5H1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaPanel
        eyebrow="Next step"
        title="Come and disagree with us about a number."
        body="We are also hiring, occasionally. Both conversations start the same way."
      >
        <Link href="/contact/" className="btn btn-invert">
          Request an audit
        </Link>
        <Link href="/careers/" className="btn btn-invert-line">
          Open roles
        </Link>
      </CtaPanel>
    </main>
  );
}
