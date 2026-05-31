import type { Metadata } from 'next';
import { Download, Clock, FileText, AlertCircle } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import DownloadButton from '@/components/DownloadButton';

export const metadata: Metadata = {
  title: 'Remote Work Policy — GrowthVireX',
  description:
    'GrowthVireX’s remote work policy: eligibility, working hours, equipment, communication standards, data security, and performance expectations.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/remote-work-policy/' },
};

const FILE_URL = '/api/downloads/remote-policy';

const meta = [
  { icon: Clock,    label: 'Version',        value: '2.1' },
  { icon: FileText, label: 'Effective date', value: 'May 2026' },
];

const principles = [
  'Outcomes over hours: we measure results, not seat time.',
  'Default to async: detailed writing beats meetings whenever possible.',
  'Trust + transparency: live dashboards, weekly written updates, no surprise reviews.',
  'Security first: managed devices, password manager, MFA on every account.',
];

const sections = [
  { title: 'Eligibility & onboarding',            weight: 'Part 1' },
  { title: 'Working hours & availability',        weight: 'Part 2' },
  { title: 'Equipment & expense reimbursement',   weight: 'Part 3' },
  { title: 'Communication standards',             weight: 'Part 4' },
  { title: 'Data security & device management',   weight: 'Part 5' },
  { title: 'Performance, reviews & promotion',    weight: 'Part 6' },
];

export default function Page() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50" />
        <div aria-hidden className="absolute left-0 right-0 top-24 h-6 bg-[var(--color-accent)]" />

        <div className="container-zest relative pt-40 pb-16">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
              <span className="h-2 w-2 animate-blink rounded-full bg-[var(--color-accent)]" />
              Internal document · Remote Work Policy
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-6 max-w-3xl text-[2.5rem] font-light leading-[1.02] tracking-[-0.04em] md:text-[4.5rem]">
              Remote Work Policy
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-fg-muted)]">
              How GrowthVireX works remote-first. This document sets the expectations for working
              hours, communication, equipment, data security, and performance — for every member
              of the team, on every client engagement.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <DownloadButton
              href={FILE_URL}
              className="group mt-10 inline-flex items-center gap-3 bg-[var(--color-ink-warm)] px-8 py-4 text-sm font-medium text-[var(--color-bg)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              messageClassName="mt-2 text-xs text-ink-muted"
            >
              <Download size={16} />
              Download policy
            </DownloadButton>
          </Reveal>
        </div>
      </section>

      {/* META STRIP */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-navy)] text-white">
        <div className="container-zest py-8">
          <Reveal>
            <dl className="flex flex-wrap gap-x-16 gap-y-6">
              {meta.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={18} className="mt-0.5 text-[var(--color-accent)]" />
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50">{label}</dt>
                    <dd className="mt-1 text-base font-medium">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* BODY */}
      <section className="container-zest py-20">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[2fr_1fr]">

          <div className="space-y-12">
            <Reveal>
              <div>
                <SectionLabel>Guiding principles</SectionLabel>
                <ul className="mt-6 space-y-4">
                  {principles.map((r) => (
                    <li key={r} className="flex gap-4 text-ink-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <SectionLabel>What the document covers</SectionLabel>
                <ul className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                  {sections.map((s) => (
                    <li key={s.title} className="flex items-center justify-between py-4">
                      <span className="text-[var(--color-fg)]">{s.title}</span>
                      <span className="font-mono text-sm text-ink-muted">{s.weight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <SectionLabel>When to consult this policy</SectionLabel>
                <ul className="mt-6 space-y-4 text-ink-muted">
                  <li className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="leading-relaxed">During onboarding — read it end to end on day one.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="leading-relaxed">Before requesting new equipment or expense reimbursements.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="leading-relaxed">When a client engagement requires unusual hours or location coverage.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="leading-relaxed">Before installing new tools or processing sensitive client data.</span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6">
                <AlertCircle size={20} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <p className="text-sm leading-relaxed text-ink-muted">
                  This policy supersedes any earlier remote-work guidance. If you find a conflict
                  with a prior document, this version wins. Send corrections to{' '}
                  <a href="mailto:people@growthvirex.com" className="text-[var(--color-accent)] hover:underline">people@growthvirex.com</a>.
                </p>
              </div>
            </Reveal>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            <Reveal>
              <div
                className="rounded-2xl bg-[var(--color-bg-navy)] p-8 text-white"
                style={{ boxShadow: 'var(--shadow-brutal)' }}
              >
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50">Download</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Save a local copy. Re-download whenever a new version is published.
                </p>
                <DownloadButton
                  href={FILE_URL}
                  className="mt-6 flex items-center justify-between gap-2 border border-white/20 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
                  messageClassName="mt-2 text-xs text-white/60"
                >
                  <span className="inline-flex items-center gap-2">Download policy</span>
                  <Download size={14} />
                </DownloadButton>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="rounded-2xl border border-[var(--color-border)] p-8">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">Questions?</div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  People & Ops handles interpretation of this policy and approves exceptions.
                </p>
                <a
                  href="mailto:people@growthvirex.com?subject=Remote work policy question"
                  className="mt-4 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
                >
                  people@growthvirex.com
                </a>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">Need a printed copy?</div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  We don&apos;t mail hard copies. Print from the PDF if you need one for your records.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-14 text-center">
        <div className="container-zest max-w-2xl">
          <p className="text-sm leading-relaxed text-ink-muted">
            Internal use only. Do not redistribute outside GrowthVireX without written permission.
          </p>
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
