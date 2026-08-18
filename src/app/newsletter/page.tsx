import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/layout/PageHero';
import { issues } from '@/content/newsletter';
import { site } from '@/content/site';

const DESCRIPTION =
  'Field notes from the accounts we run. Published when there is something worth saying, which is not on a schedule.';

export const metadata: Metadata = {
  title: 'Notes',
  description: DESCRIPTION,
  alternates: { canonical: '/newsletter/' },
  openGraph: {
    type: 'website',
    url: `${site.url}/newsletter/`,
    siteName: site.name,
    title: `Notes · ${site.name}`,
    description: DESCRIPTION,
  },
};

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function NewsletterPage() {
  const sorted = [...issues].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <main>
      <PageHero
        eyebrow="Notes"
        title="Field notes from accounts we run."
        titleMax="max-w-[14ch]"
        lede="Written by the people doing the work, usually about something that just went wrong. No schedule is promised and none has been kept — there are five issues here and the gaps between them are honest."
      />

      {/* ── Archive ── */}
      <section>
        <ul className="wrap grid gap-5 pb-20 md:grid-cols-2 md:pb-24">
          {sorted.map((issue, i) => (
            <li key={issue.slug}>
              <Reveal delay={i * 50}>
                <Link
                  href={`/newsletter/${issue.slug}/`}
                  className="card-lift group flex h-full flex-col p-6 md:p-7"
                >
                  <article className="flex h-full flex-col">
                    <div className="flex items-center gap-3">
                      <span className="pill-tag">{issue.category}</span>
                      <span className="caption">
                        {fmtDate(issue.publishedAt)} · No. {String(issue.issueNo).padStart(3, '0')}
                      </span>
                    </div>

                    <h2 className="group-hover:text-indigo-text mt-4 max-w-[26ch] text-[1.375rem] leading-tight font-light tracking-[-0.02em] transition-colors">
                      {issue.title}
                    </h2>
                    <p className="text-ink-mute mt-3 max-w-[58ch] flex-1 leading-relaxed">
                      {issue.excerpt}
                    </p>
                    <p className="caption mt-5">{issue.readTime}</p>
                  </article>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Subscribe ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap py-16 md:py-20">
          <Reveal>
            <div className="grid gap-6 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-4">
                <span className="eyebrow">Getting these by email</span>
              </div>
              <div className="md:col-span-8">
                <p className="text-[1.0625rem] leading-relaxed">
                  There is no signup form here because we have not built a list, and a form that
                  collects addresses for a mailing we might not send is worse than nothing. If
                  you want the next one,{' '}
                  <Link href="/contact/" className="link-inline">
                    say so
                  </Link>{' '}
                  and you will be added by hand.
                </p>
                <p className="text-ink-mute mt-4 leading-relaxed">
                  Roughly 400 people get it. We have never sold or shared the list and there is
                  nothing in it worth selling.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
