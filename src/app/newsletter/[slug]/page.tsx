import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { issues, getIssueBySlug, type Block } from '@/content/newsletter';
import { site } from '@/content/site';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return issues.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) return {};
  const canonical = `/newsletter/${issue.slug}/`;
  return {
    title: `${issue.title} — Issue #${issue.issueNo}`,
    description: issue.excerpt,
    keywords: issue.keywords,
    alternates: { canonical },
    openGraph: {
      title: issue.title,
      description: issue.excerpt,
      url: `${site.url}${canonical}`,
      type: 'article',
      publishedTime: issue.publishedAt,
      authors: [site.name],
    },
    twitter: { card: 'summary_large_image', title: issue.title, description: issue.excerpt },
  };
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="prose-heading mt-14 mb-5 font-serif text-[1.75rem] font-light leading-[1.2] tracking-[-0.02em] md:text-[2.125rem]">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={i} className="mt-10 mb-3 font-serif text-[1.375rem] font-normal leading-snug tracking-[-0.01em]">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p key={i} className="prose-p mb-6 font-serif text-[1.1875rem] leading-[1.75] text-[var(--color-fg)]/90">
          {block.text}
        </p>
      );
    case 'list':
      return (
        <ul key={i} className="mb-8 ml-0 list-none space-y-3 border-l border-[var(--color-border)] pl-6 font-serif text-[1.1875rem] leading-[1.7] text-[var(--color-fg)]/90">
          {block.items.map((item, j) => (
            <li key={j} className="relative before:absolute before:-left-[1.75rem] before:top-[0.65em] before:font-sans before:text-xs before:text-ink-muted before:content-[counter(list-item)'.']">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <figure key={i} className="my-12 border-t border-b border-[var(--color-border)] py-10">
          <blockquote className="font-serif text-[1.5rem] leading-[1.4] tracking-tight text-[var(--color-fg)] md:text-[1.875rem]">
            {block.text}
          </blockquote>
          {block.cite && (
            <figcaption className="mt-5 font-sans text-xs uppercase tracking-[0.18em] text-ink-muted">
              — {block.cite}
            </figcaption>
          )}
        </figure>
      );
    case 'callout':
      return (
        <p key={i} className="my-8 border-l-2 border-[var(--color-fg)] pl-6 font-serif text-[1.0625rem] italic leading-[1.7] text-ink-muted">
          {block.text}
        </p>
      );
  }
}

export default async function IssuePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) notFound();

  const formattedDate = new Date(issue.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const nextIssue = issues.find((i) => i.issueNo === issue.issueNo + 1);
  const prevIssue = issues.find((i) => i.issueNo === issue.issueNo - 1);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: issue.title,
    description: issue.excerpt,
    datePublished: issue.publishedAt,
    author: { '@type': 'Organization', name: site.name, url: site.url },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: `${site.url}/favicon.svg` },
    },
    mainEntityOfPage: `${site.url}/newsletter/${issue.slug}/`,
    keywords: issue.keywords.join(', '),
  };

  return (
    <main className="bg-[var(--color-bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* THIN TOP METADATA BAR */}
      <div className="border-b border-[var(--color-border)] pt-24">
        <div className="container-zest py-5">
          <div className="flex items-center justify-between text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-muted">
            <Link href="/newsletter/" className="transition hover:text-[var(--color-fg)]">
              ← The Growth Engine
            </Link>
            <div className="flex items-center gap-4">
              <span>Issue No. {issue.issueNo}</span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* EDITORIAL MASTHEAD */}
      <header className="border-b border-[var(--color-border)]">
        <div className="container-zest py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
              {issue.category} &nbsp;/&nbsp; {issue.readTime}
            </div>
            <h1 className="font-serif text-[2.5rem] font-light leading-[1.04] tracking-[-0.04em] md:text-[4rem] lg:text-[4.5rem]">
              {issue.title}
            </h1>
            <p className="mt-8 max-w-2xl font-serif text-[1.25rem] font-light leading-[1.5] text-[var(--color-fg-muted)] md:text-[1.375rem]">
              {issue.excerpt}
            </p>
            <div className="mt-12 flex items-center gap-3 text-[0.75rem] uppercase tracking-[0.15em] text-ink-muted">
              <span className="inline-block h-px w-10 bg-[var(--color-fg)]" />
              <span>By the {site.shortName} editorial team</span>
            </div>
          </div>
        </div>
      </header>

      {/* ARTICLE BODY */}
      <article className="container-zest">
        <div className="mx-auto max-w-[38rem] py-20">
          {/* Drop cap on first paragraph */}
          <style>{`
            .dropcap > p:first-of-type::first-letter {
              float: left;
              font-family: ui-serif, Georgia, serif;
              font-size: 4.5rem;
              line-height: 0.85;
              padding: 0.3rem 0.6rem 0 0;
              font-weight: 500;
            }
          `}</style>
          <div className="dropcap">
            {issue.body.map(renderBlock)}
          </div>

          {/* SIGN-OFF */}
          <div className="mt-20 flex items-center gap-4">
            <span className="inline-block h-px flex-1 bg-[var(--color-border)]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">End of issue</span>
            <span className="inline-block h-px flex-1 bg-[var(--color-border)]" />
          </div>
        </div>
      </article>

      {/* SUBSCRIBE — EDITORIAL STYLE, NOT BOXED */}
      <section className="border-t border-b border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="container-zest py-24">
          <div className="mx-auto max-w-3xl md:grid md:grid-cols-[1fr_1.5fr] md:gap-16">
            <div>
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
                Subscribe
              </div>
              <h2 className="mt-4 font-serif text-[2rem] font-light leading-[1.1] tracking-[-0.02em] md:text-[2.5rem]">
                Tuesday mornings, in your inbox.
              </h2>
            </div>
            <div className="mt-8 md:mt-2">
              <p className="font-serif text-[1.0625rem] leading-[1.6] text-ink-muted">
                One issue a week. No affiliate links, no "ultimate guides," no thread-bait. Just what we\'re seeing work (and not work) inside live accounts.
              </p>
              <form action="#" method="POST" className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  className="flex-1 border-b border-[var(--color-fg)] bg-transparent px-1 py-3 font-serif text-base focus:outline-none focus:border-[var(--color-accent)]"
                />
                <button
                  type="submit"
                  className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-accent)] transition hover:text-[var(--color-accent-deep)]"
                >
                  Subscribe →
                </button>
              </form>
              <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-ink-muted">
                15,412 readers · Free forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PREV / NEXT — NEWSPAPER STYLE */}
      <nav className="container-zest py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-0 md:grid-cols-2 md:divide-x md:divide-[var(--color-border)]">
          {prevIssue ? (
            <Link href={`/newsletter/${prevIssue.slug}/`} className="group block py-6 md:pr-10">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
                ← Previous · No. {prevIssue.issueNo}
              </div>
              <h3 className="mt-3 font-serif text-xl font-normal leading-snug transition group-hover:text-[var(--color-accent)] md:text-2xl">
                {prevIssue.title}
              </h3>
            </Link>
          ) : <div className="hidden md:block" />}
          {nextIssue ? (
            <Link href={`/newsletter/${nextIssue.slug}/`} className="group block border-t border-[var(--color-border)] py-6 md:border-t-0 md:pl-10 md:text-right">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
                Next · No. {nextIssue.issueNo} →
              </div>
              <h3 className="mt-3 font-serif text-xl font-normal leading-snug transition group-hover:text-[var(--color-accent)] md:text-2xl">
                {nextIssue.title}
              </h3>
            </Link>
          ) : <div className="hidden md:block" />}
        </div>
      </nav>
    </main>
  );
}