import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/layout/PageHero';
import { listPositions } from '@/server/content/positions';
import { site } from '@/content/site';

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

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Careers',
  description: `Open roles at ${site.name}. Everyone here owns accounts and writes the reports that go with them. Listed roles are open today.`,
  keywords: [
    'paid media jobs',
    'performance marketing careers',
    'media buyer jobs',
    'marketing measurement jobs',
    `${site.name} careers`,
  ],
  alternates: { canonical: '/careers/' },
};

/* The terms of employment, stated plainly. If one of these stops being true
   it comes off the page. */
const TERMS = [
  {
    title: 'Remote, with four offsites',
    desc: 'Work where you like. We meet in New York once a quarter for the parts that are worse over video.',
  },
  {
    title: 'Output, not hours',
    desc: 'No timesheets. Async by default, two fixed overlap hours a day so nobody waits eighteen hours for an answer.',
  },
  {
    title: '$2,500 a year to learn',
    desc: 'Courses, certifications, conferences, books. Spend it or lose it; we would rather you spent it.',
  },
  {
    title: 'Equity after year one',
    desc: 'A real stake for every full-time employee, on the same terms for everyone at the same level.',
  },
];

function stat(cards: { key: string; value: string }[], re: RegExp): string {
  return cards.find((c) => re.test(c.key))?.value ?? '';
}

export default async function CareersPage() {
  const openings = await listPositions({ visibleOnly: true });

  return (
    <main>
      <PageHero
        eyebrow="Careers · New York and remote"
        title="Open roles, and what the work actually is."
        titleMax="max-w-[15ch]"
        lede="We are a small firm. Everyone here owns accounts and writes the reports that go with them, including the reports that say a campaign did nothing. If a role is listed below it is open today. When it is filled, it comes off this page."
      />

      {/* ─────────────────── OPEN ROLES ─────────────────── */}
      <section>
        <div className="wrap pb-20 md:pb-24">
          <Reveal>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow">Open roles</span>
                <h2 className="display-2 mt-4">Hiring now</h2>
              </div>
              <span className="caption tnum">
                {openings.length} open position{openings.length === 1 ? '' : 's'}
              </span>
            </div>
          </Reveal>

          {openings.length === 0 ? (
            <Reveal delay={80}>
              <div className="card bg-canvas-soft mt-10 px-6 py-12">
                <p className="text-ink-mute max-w-[54ch] leading-relaxed">
                  Nothing is open right now. We keep speculative applications on file for twelve
                  months and read them when a role opens. Send yours to{' '}
                  <a href={`mailto:${site.contact.careers}`} className="link-inline">
                    {site.contact.careers}
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          ) : (
            <ul className="mt-12 space-y-4">
              {openings.map((r, i) => {
                const team = stat(r.statCards, /team/i);
                const level = stat(r.statCards, /level|seniority/i);
                const location = stat(r.statCards, /location/i);
                const type = stat(r.statCards, /type/i);
                return (
                  <Reveal key={r.slug} delay={i * 60} as="li">
                    <Link
                      href={`/careers/${r.slug}/`}
                      className="card-lift group flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:gap-8"
                    >
                      <span className="min-w-0">
                        <span className="group-hover:text-indigo-text block text-[1.25rem] font-light tracking-[-0.02em] transition-colors">
                          {r.title}
                          {r.subtitle && (
                            <span className="text-ink-mute ml-2 text-[0.7em]">{r.subtitle}</span>
                          )}
                        </span>
                        <span className="caption mt-2 block">
                          {[team, level, location, type].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                      <span className="link-arrow shrink-0 text-[0.875rem]">
                        View role <Arrow />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ─────────────────── THE TERMS ─────────────────── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap py-20 md:py-24">
          <Reveal>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow">Terms</span>
                <h2 className="display-2 mt-4 max-w-[16ch]">What the job comes with.</h2>
              </div>
              <p className="text-ink-mute max-w-sm leading-relaxed">
                The same for everyone at the same level, and written down before you ask.
              </p>
            </div>
          </Reveal>

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TERMS.map((b, i) => (
              <Reveal key={b.title} delay={i * 60} as="li">
                <div className="card h-full p-6">
                  <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em]">{b.title}</h3>
                  <p className="text-ink-mute mt-2.5 leading-relaxed">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────────── NO FIT ─────────────────── */}
      <section className="wrap py-20 md:py-24">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <span className="eyebrow">Nothing above fits</span>
              <h2 className="display-2 mt-4 max-w-[18ch]">Write to us anyway.</h2>
              <p className="text-ink-mute mt-5 max-w-[52ch] leading-relaxed">
                Tell us what you have run, what it cost, and what it returned. One page is plenty.
                We keep speculative applications for twelve months and read them when a role opens.
              </p>
            </div>
            <div className="md:col-span-5 md:flex md:justify-end">
              <a
                href={`mailto:${site.contact.careers}?subject=${encodeURIComponent('Speculative application')}`}
                className="btn btn-solid"
              >
                Email {site.contact.careers}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
