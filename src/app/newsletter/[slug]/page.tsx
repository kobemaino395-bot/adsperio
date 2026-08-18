import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import GradientMesh from '@/components/mesh/GradientMesh';
import { issues, getIssueBySlug, type Block } from '@/content/newsletter';
import { site } from '@/content/site';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return issues.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) return { robots: { index: false, follow: false } };

  return {
    title: issue.title,
    description: issue.excerpt,
    keywords: [...issue.keywords],
    alternates: { canonical: `/newsletter/${issue.slug}/` },
    openGraph: {
      type: 'article',
      url: `${site.url}/newsletter/${issue.slug}/`,
      siteName: site.name,
      title: `${issue.title} · ${site.name}`,
      description: issue.excerpt,
      publishedTime: issue.publishedAt,
    },
  };
}

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/** Renders one content block. Each variant gets a genuinely different
 *  treatment — otherwise the long pieces turn into grey soup. */
function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="display-3 border-hairline mt-12 border-t pt-8 text-[clamp(1.375rem,2.4vw,1.75rem)] first:mt-0 first:border-0 first:pt-0">
          {block.text}
        </h2>
      );

    case 'h3':
      return <h3 className="mt-9 text-[1.125rem] font-medium tracking-[-0.015em]">{block.text}</h3>;

    case 'p':
      return <p className="text-ink-2 mt-5 text-[1.0625rem] leading-[1.7]">{block.text}</p>;

    case 'list':
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item.slice(0, 32)} className="flex gap-3.5">
              <span aria-hidden className="text-indigo-text mt-[0.45rem] shrink-0">
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path
                    d="M1 4.5L4.5 8L11 1"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-ink-2 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'quote':
      return (
        <figure className="my-10 rounded-r-lg border-l-2 border-l-[var(--indigo)] py-2 pl-6">
          <blockquote className="text-[1.25rem] leading-snug font-light tracking-[-0.015em]">
            “{block.text}”
          </blockquote>
          {block.cite && <figcaption className="caption mt-3">{block.cite}</figcaption>}
        </figure>
      );

    case 'callout':
      return (
        <aside className="border-hairline bg-canvas-soft my-9 rounded-xl border p-6">
          <span className="eyebrow">In practice</span>
          <p className="mt-3 leading-relaxed">{block.text}</p>
        </aside>
      );

    default:
      return null;
  }
}

export default async function IssuePage({ params }: { params: Params }) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) notFound();

  const ordered = [...issues].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const idx = ordered.findIndex((i) => i.slug === issue.slug);
  const newer = idx > 0 ? ordered[idx - 1] : null;
  const older = idx < ordered.length - 1 ? ordered[idx + 1] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: issue.title,
    description: issue.excerpt,
    datePublished: issue.publishedAt,
    url: `${site.url}/newsletter/${issue.slug}/`,
    author: { '@type': 'Organization', name: site.name, url: site.url },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    keywords: issue.keywords.join(', '),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Masthead ── */}
      <section className="mesh-host overflow-hidden pt-16">
        <GradientMesh height="h-[22rem] md:h-[26rem]" />
        <div className="wrap-tight py-14 md:py-20">
          <Reveal>
            <nav aria-label="Breadcrumb" className="eyebrow flex items-center gap-2">
              <Link href="/newsletter/" className="hover:text-indigo-deep transition-colors">
                Notes
              </Link>
              <span aria-hidden className="opacity-50">
                /
              </span>
              <span className="text-ink-mute">
                No. {String(issue.issueNo).padStart(3, '0')}
              </span>
            </nav>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="display-2 mt-5 max-w-[20ch]">{issue.title}</h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="lede mt-5">{issue.excerpt}</p>
          </Reveal>

          <Reveal delay={200}>
            <dl className="border-hairline mt-8 grid grid-cols-2 gap-y-4 border-t pt-5 sm:grid-cols-4">
              {[
                { k: 'Issue', v: String(issue.issueNo).padStart(3, '0') },
                { k: 'Published', v: fmtDate(issue.publishedAt) },
                { k: 'Topic', v: issue.category },
                { k: 'Length', v: issue.readTime },
              ].map((m) => (
                <div key={m.k}>
                  <dt className="caption">{m.k}</dt>
                  <dd className="mt-1 text-[0.875rem] font-medium">{m.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Body ── */}
      <article className="border-hairline border-t">
        <div className="wrap-tight py-14 md:py-16">
          {issue.body.map((block, i) => (
            <BlockView key={`${block.type}-${i}`} block={block} />
          ))}
        </div>
      </article>

      {/* ── Prev / next ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap-tight grid gap-5 py-14 md:grid-cols-2">
          {newer ? (
            <Link href={`/newsletter/${newer.slug}/`} className="card-lift group p-5">
              <span className="caption">← Newer</span>
              <h2 className="group-hover:text-indigo-text mt-2 max-w-[24ch] text-[1.0625rem] font-medium tracking-[-0.015em] transition-colors">
                {newer.title}
              </h2>
            </Link>
          ) : (
            <span />
          )}
          {older && (
            <Link
              href={`/newsletter/${older.slug}/`}
              className="card-lift group p-5 md:text-right"
            >
              <span className="caption">Older →</span>
              <h2 className="group-hover:text-indigo-text mt-2 max-w-[24ch] text-[1.0625rem] font-medium tracking-[-0.015em] transition-colors md:ml-auto">
                {older.title}
              </h2>
            </Link>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="wrap-tight py-14 md:py-16">
        <Reveal>
          <div className="card-cream p-7 md:p-9">
            <span className="text-[0.6875rem] font-medium tracking-[0.09em] uppercase opacity-60">
              If this was useful
            </span>
            <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed">
              We run this kind of read against client accounts every week. If you want one
              done on yours, send read-only access and we will come back in two weeks with the
              same thing about your own numbers.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact/" className="btn btn-solid">
                Request an audit
              </Link>
              <Link
                href="/newsletter/"
                className="btn border-[color-mix(in_oklab,var(--cream-ink)_25%,transparent)] text-[var(--cream-ink)] hover:border-[var(--cream-ink)]"
              >
                All notes
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
