import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Clock, FileText, AlertCircle } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import DownloadButton from '@/components/DownloadButton';

export const metadata: Metadata = {
  title: 'Ads Manager Test — Adnovara',
  description:
    'Download the Adnovara Ads Manager candidate assignment. A two-day strategic test on paid media planning, budget allocation, and campaign optimization.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/ads-manager-test/' },
};

const FILE_URL = '/api/downloads/take-home';

const meta = [
  { icon: Clock,    label: 'Time to complete',  value: '2 days' },
  { icon: FileText, label: 'Submission format', value: 'PDF · Times New Roman · 13pt' },
];

const evaluates = [
  'How you analyse market data, platform performance, and audience behaviour.',
  'How you develop an effective multi-channel campaign structure.',
  'How you allocate and optimise advertising budgets across Google Ads and Meta.',
  'How you make data-driven decisions and respond to live campaign results.',
];

const sections = [
  { title: 'Account Audit & Strategic Foundation',  weight: '20%' },
  { title: 'Channel & Funnel Strategy',             weight: '25%' },
  { title: 'Creative & Messaging Strategy',         weight: '20%' },
  { title: 'Budget Allocation & Phased Rollout',    weight: '20%' },
  { title: 'KPIs, Measurement & Risk Management',   weight: '15%' },
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
              Candidate assignment · Ads Manager
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-6 max-w-3xl text-[2.5rem] font-medium leading-[1] tracking-[-0.03em] md:text-[4.5rem]">
              Ads Manager Test
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              A short, strategic assessment designed to evaluate your planning, problem-solving,
              and paid media expertise through a simulated real-world scenario. Download the brief
              below and submit your response within 2 days.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <DownloadButton
              href={FILE_URL}
              className="group mt-10 inline-flex items-center gap-3 bg-[var(--color-ink-warm)] px-8 py-4 text-sm font-medium text-[var(--color-bg)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              messageClassName="mt-2 text-xs text-ink-muted"
            >
              <Download size={16} />
              Download assignment (DOCX)
            </DownloadButton>
          </Reveal>
        </div>
      </section>

      {/* META STRIP */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-ink-warm)] text-[var(--color-bg)]">
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
                <SectionLabel>What this test evaluates</SectionLabel>
                <ul className="mt-6 space-y-4">
                  {evaluates.map((r) => (
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
                <SectionLabel>Submission guidelines</SectionLabel>
                <ul className="mt-6 space-y-4 text-ink-muted">
                  <li className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="leading-relaxed"><strong className="text-[var(--color-fg)]">Deadline:</strong> within 2 days of receiving the assignment.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="leading-relaxed"><strong className="text-[var(--color-fg)]">Format:</strong> PDF only.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="leading-relaxed"><strong className="text-[var(--color-fg)]">File name:</strong> <span className="font-mono text-sm">date_name_test.pdf</span> (e.g. <span className="font-mono text-sm">2026-05-01_JaneDoe_Test.pdf</span>).</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="leading-relaxed"><strong className="text-[var(--color-fg)]">Typography:</strong> Times New Roman, 13pt, with clear headers on each page.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="leading-relaxed"><strong className="text-[var(--color-fg)]">Presentation:</strong> maintain a professional layout — formatting and attention to detail count.</span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <SectionLabel>Sections & weighting</SectionLabel>
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
              <div className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6">
                <AlertCircle size={20} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <p className="text-sm leading-relaxed text-ink-muted">
                  Your submission must reflect your own strategic thinking, experience, and creative
                  approach. We read every response — copy-paste answers are easy to spot.
                </p>
              </div>
            </Reveal>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            <Reveal>
              <div
                className="rounded-2xl bg-[var(--color-ink-warm)] p-8 text-[var(--color-bg)]"
                style={{ boxShadow: 'var(--shadow-brutal)' }}
              >
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50">Download</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Save the brief, read it carefully, and submit your completed response by email
                  within 2 days.
                </p>
                <DownloadButton
                  href={FILE_URL}
                  className="mt-6 flex items-center justify-between gap-2 border border-white/20 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
                  messageClassName="mt-2 text-xs text-white/60"
                >
                  <span className="inline-flex items-center gap-2">Download DOCX</span>
                  <Download size={14} />
                </DownloadButton>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="rounded-2xl border border-[var(--color-border)] p-8">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">Questions?</div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  If anything in the brief is unclear, reach out before you start.
                </p>
                <a
                  href="mailto:hiring@adnovara.com?subject=Question about Ads Manager Test"
                  className="mt-4 inline-block text-sm font-medium text-zest-400 hover:underline"
                >
                  hiring@adnovara.com
                </a>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">About the role</div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  This test is part of the hiring process for the Ads Manager position at Adnovara.
                </p>
                <Link
                  href="/careers/ads-manager/"
                  className="mt-4 inline-block text-sm font-medium text-zest-400 hover:underline"
                >
                  View job description →
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-14 text-center">
        <div className="container-zest max-w-2xl">
          <p className="text-sm leading-relaxed text-ink-muted">
            Good luck — and thank you for your time and effort.
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
