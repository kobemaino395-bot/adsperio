import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import ApplicationForm from '@/components/ApplicationForm';

export const metadata: Metadata = {
  title: 'Ads Manager — Open Role at Adnovara',
  description:
    'We are hiring a senior Ads Manager to own paid media strategy across Google, Meta, and LinkedIn. Remote-first, performance-driven, high-ownership role.',
  alternates: { canonical: '/careers/ads-manager/' },
};

const details = [
  { label: 'Team',       value: 'Paid Media' },
  { label: 'Level',      value: 'Senior / Lead' },
  { label: 'Location',   value: 'Remote' },
  { label: 'Type',       value: 'Full-time' },
  { label: 'Salary',     value: '$75,000 – $110,000 USD' },
];

const responsibilities = [
  'Own end-to-end paid media strategy and execution across Google Ads, Meta Ads, and LinkedIn Campaign Manager.',
  'Manage and optimise monthly ad budgets ranging from $30K to $300K+ per client.',
  'Build and maintain campaign structures: Search, Shopping, Performance Max, Advantage+, and Demand Gen.',
  'Lead creative briefing with the design team — define hooks, formats, and testing hypotheses.',
  'Run a rigorous A/B testing programme across audiences, creative, and landing pages.',
  'Deliver weekly performance reports with clear narrative, insight, and action plans for clients.',
  'Monitor CPAs, ROAS, LTV:CAC, and blended efficiency across the full funnel.',
  'Stay current on platform changes, beta features, and algorithm updates — and act on them first.',
  'Contribute to new business pitches with paid media strategy and audits.',
  'Collaborate with SEO and web teams to align landing pages, messaging, and attribution.',
];

const requirements = [
  '3+ years managing paid media campaigns with direct ownership of large budgets ($50K+/month).',
  'Proven track record of hitting or exceeding ROAS and CPA targets — with numbers to back it.',
  'Deep expertise in Google Ads (Search, Shopping, PMax) and Meta Ads Manager (prospecting + retargeting).',
  'Strong grasp of attribution models, incrementality testing, and multi-touch reporting.',
  'Comfortable in GA4, Google Tag Manager, and third-party analytics dashboards.',
  'Experience briefing creative and interpreting performance data to inform the next test.',
  'Excellent written communication — you can explain complex data clearly to non-technical clients.',
  'Self-directed and comfortable in a high-ownership, async-first environment.',
];

const niceToHave = [
  'Experience with LinkedIn Ads, TikTok Ads, or programmatic platforms.',
  'Familiarity with Google Merchant Centre and feed optimisation.',
  'Hands-on experience with marketing automation or CRM integrations (HubSpot, Klaviyo).',
  'Previous agency experience managing multiple client accounts simultaneously.',
];

const benefits = [
  { title: 'Competitive salary',    desc: '$75K – $110K depending on experience, reviewed annually.' },
  { title: 'Remote-first',          desc: 'Work from anywhere. We run async by default with quarterly in-person offsites.' },
  { title: 'Learning budget',       desc: '$2,500/year for courses, certifications, conferences, and books.' },
  { title: 'Real equity',           desc: 'Meaningful agency equity for all full-time team members after year one.' },
  { title: 'Ownership & trust',     desc: 'You own your accounts. No micromanagement, just clear goals and support.' },
  { title: 'High-impact clients',   desc: 'Work with ambitious brands across EdTech, FinTech, DTC, and healthcare.' },
];

export default function AdsManagerPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50" />
        <div aria-hidden className="absolute left-0 right-0 top-24 h-6 bg-[var(--color-accent)]" />

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
              <span className="h-2 w-2 animate-blink rounded-full bg-[var(--color-accent)]" />
              Now hiring
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="mt-6 max-w-4xl text-[2.5rem] font-medium leading-[1] tracking-[-0.03em] md:text-[5rem]">
              Ads Manager
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              We&apos;re looking for a senior paid media specialist to own multi-channel ad strategy for a portfolio of high-growth clients. High ownership, competitive pay, fully remote.
            </p>
          </Reveal>
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
              <a
                href="/api/downloads/take-home"
                className="group inline-flex items-center gap-2 border-2 border-[var(--color-ink-warm)] px-7 py-[14px] text-sm font-medium text-[var(--color-ink-warm)] transition hover:bg-[var(--color-ink-warm)] hover:text-[var(--color-bg)]"
              >
                <span aria-hidden>↓</span>
                Download take-home test
              </a>
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              Strategy assignment · 2-day completion · PDF or DOCX submission via the form below.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ROLE DETAILS */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-ink-warm)] text-[var(--color-bg)]">
        <div className="container-zest py-10">
          <Reveal>
            <dl className="flex flex-wrap gap-x-16 gap-y-6">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50">{d.label}</dt>
                  <dd className="mt-1 text-base font-medium">{d.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* APPLY — prominent two-column section */}
      <section id="apply" className="relative border-b border-[var(--color-border)] bg-[var(--color-bg)] py-24">
        <div aria-hidden className="bg-dots absolute inset-0 opacity-30" />
        <div className="container-zest relative">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 md:p-10" style={{ boxShadow: 'var(--shadow-md)' }}>
                <SectionLabel>Apply for this role</SectionLabel>
                <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight md:text-4xl">
                  Tell us about yourself.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
                  Submissions go straight to the hiring team. We review every one and reply within 5 business days.
                </p>
                <div className="mt-8">
                  <ApplicationForm />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
                <div className="rounded-2xl bg-[var(--color-ink-warm)] p-8 text-[var(--color-bg)]" style={{ boxShadow: 'var(--shadow-brutal)' }}>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50">Take-home test</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Download the strategic assignment, complete it within 2 days, and upload your answer with the form. PDF or DOCX accepted.
                  </p>
                  <a
                    href="/api/downloads/take-home"
                    className="mt-6 flex items-center justify-between gap-2 border border-white/20 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
                  >
                    Download assignment
                    <span aria-hidden>↓</span>
                  </a>
                </div>

                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8">
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">Process</div>
                  <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                    <li className="flex gap-3"><span className="font-mono text-xs text-[var(--color-accent)]">01</span><span>Submit the form (CV optional + cover note).</span></li>
                    <li className="flex gap-3"><span className="font-mono text-xs text-[var(--color-accent)]">02</span><span>Complete and upload the take-home within 2 days.</span></li>
                    <li className="flex gap-3"><span className="font-mono text-xs text-[var(--color-accent)]">03</span><span>30-minute call with the team.</span></li>
                    <li className="flex gap-3"><span className="font-mono text-xs text-[var(--color-accent)]">04</span><span>Offer.</span></li>
                  </ol>
                </div>

                <div className="rounded-2xl border border-[var(--color-border)] p-8">
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">Questions?</div>
                  <a
                    href="mailto:hiring@adnovara.com?subject=Question about Ads Manager role"
                    className="mt-4 inline-block text-sm font-medium text-zest-400 hover:underline"
                  >
                    hiring@adnovara.com
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
            {/* About the role */}
            <Reveal>
              <div>
                <SectionLabel>About the role</SectionLabel>
                <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                  Adnovara manages paid media for ambitious brands across EdTech, FinTech, DTC, and healthcare. We&apos;re growing fast and need a senior Ads Manager who can take full ownership of client accounts — from strategy to reporting — and drive the kind of results that make clients stay for years.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                  This is not a coordinator role. You&apos;ll be the lead strategist on your accounts, working closely with our SEO, creative, and web teams to build compounding growth systems — not one-off campaigns.
                </p>
              </div>
            </Reveal>

            {/* Responsibilities */}
            <Reveal>
              <div>
                <SectionLabel>What you&apos;ll do</SectionLabel>
                <ul className="mt-6 space-y-4">
                  {responsibilities.map((r) => (
                    <li key={r} className="flex gap-4 text-ink-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Requirements */}
            <Reveal>
              <div>
                <SectionLabel>What we&apos;re looking for</SectionLabel>
                <ul className="mt-6 space-y-4">
                  {requirements.map((r) => (
                    <li key={r} className="flex gap-4 text-ink-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Nice to have */}
            <Reveal>
              <div>
                <SectionLabel>Nice to have</SectionLabel>
                <ul className="mt-6 space-y-4">
                  {niceToHave.map((r) => (
                    <li key={r} className="flex gap-4 text-ink-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-[var(--color-border)]" />
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            {/* Apply CTA */}
            <Reveal>
              <div
                className="rounded-2xl bg-[var(--color-ink-warm)] p-8 text-[var(--color-bg)]"
                style={{ boxShadow: 'var(--shadow-brutal)' }}
              >
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50">Ready to apply?</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Fill in our short application form. We read every submission and reply within 5 business days.
                </p>
                <a
                  href="#apply"
                  className="mt-6 flex items-center justify-between gap-2 border border-white/20 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
                >
                  Open application form
                  <span>→</span>
                </a>
              </div>
            </Reveal>

            {/* Benefits */}
            <Reveal delay={80}>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">What you get</div>
                <ul className="mt-5 space-y-5">
                  {benefits.map((b) => (
                    <li key={b.title}>
                      <div className="text-sm font-semibold text-[var(--color-fg)]">{b.title}</div>
                      <div className="mt-0.5 text-xs leading-relaxed text-ink-muted">{b.desc}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Questions */}
            <Reveal delay={160}>
              <div className="rounded-2xl border border-[var(--color-border)] p-8">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">Questions?</div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Reach out before applying — we&apos;re happy to answer any questions about the role.
                </p>
                <a
                  href={`mailto:hiring@adnovara.com?subject=Question about Ads Manager role`}
                  className="mt-4 inline-block text-sm font-medium text-zest-400 hover:underline"
                >
                  hiring@adnovara.com
                </a>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-24 text-center">
        <div className="container-zest max-w-2xl">
          <Reveal>
            <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
              Think you&apos;re the one?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-4 text-lg text-ink-muted">
              We hire for craft and ownership, not credentials. If this role excites you, apply — even if you don&apos;t tick every box.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <a
              href="#apply"
              className="group relative mt-10 inline-flex items-center gap-3 bg-[var(--color-ink-warm)] px-10 py-5 text-base font-medium text-[var(--color-bg)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: '6px 6px 0 var(--color-accent)' }}
            >
              Apply for Ads Manager
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
