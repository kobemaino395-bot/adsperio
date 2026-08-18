import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import Reveal from '@/components/ui/Reveal';
import GradientMesh from '@/components/mesh/GradientMesh';
import { site } from '@/content/site';

const HOST = new URL(site.url).host;
const UPDATED_ISO = '2026-08-11';
const UPDATED_LABEL = '11 August 2026';

export const metadata: Metadata = {
  title: 'Terms of service',
  description: `The rules for using ${HOST}: what you may do with the site, who owns what, what the performance figures in our case studies do and do not mean, and the law that applies.`,
  alternates: { canonical: '/terms/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'article',
    url: `${site.url}/terms/`,
    siteName: site.name,
    title: `Terms of service · ${site.name}`,
    description: `The rules for using ${HOST}, and what the figures published on it mean.`,
  },
};

/* Sections are declared once and drive both the contents index and the
 * document body, so the two can never fall out of step. */
const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'scope',
    title: 'What this page is',
    body: (
      <Prose>
        <p>
          These terms cover your use of {HOST}. Using the site means you accept them. If you do not,
          stop using it.
        </p>
        <p>
          {site.legalName} trades as {site.name}. &ldquo;We&rdquo; means that company.
          &ldquo;You&rdquo; means whoever is reading the site.
        </p>
        <p>
          This is not a services contract. Paid work runs on a signed agreement, and section 06 sets
          out which document wins where the two disagree.
        </p>
      </Prose>
    ),
  },
  {
    id: 'using-the-site',
    title: 'Using the site',
    body: (
      <Prose>
        <p>
          Read the pages, print them, quote a short passage with attribution and a link back. That
          is all fine and you need no permission for it.
        </p>
        <p>Do not:</p>
        <Bullets
          items={[
            'Copy the site, or a substantial part of it, to build a competing site or a template.',
            'Run automated collection heavy enough to slow the site down for other people.',
            'Try to reach the admin area, an API, or any file you were not given a link to.',
            'Upload anything malicious, or use the forms to send bulk or fraudulent messages.',
            'Strip out attribution, or present our writing as someone else’s.',
          ]}
        />
        <p>
          We can block anyone doing those things, and we do not have to warn you first.
        </p>
      </Prose>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual property',
    body: (
      <Prose>
        <p>
          The writing, layout, typography, report plates, charts, and code on this site belong to us
          or to our licensors. So do the {site.name} name and mark. Nothing on this page grants you
          a licence to any of it.
        </p>
        <p>
          Client names, logos, and marks in the case studies belong to those clients. They appear
          with permission given to us, which does not extend to you.
        </p>
        <p>
          To reproduce more than a short passage, ask{' '}
          <a href={`mailto:${site.contact.press}`} className="link-inline">
            {site.contact.press}
          </a>
          . The answer is usually yes.
        </p>
      </Prose>
    ),
  },
  {
    id: 'performance-figures',
    title: 'What the performance figures mean',
    body: (
      <Prose>
        <p>
          Every number in a case study, on the home page, or in any chart here is a{' '}
          <span className="emph">record of what happened in one account over one period</span>. It
          is history. It is not a forecast, and it is not a promise about your account.
        </p>
        <Bullets
          items={[
            'Results follow from your offer, price, margin, creative, category, and spend level. Change any of those and the number changes.',
            'Each figure is stated on the basis named beside it. A platform-reported number and a reconciled number are different numbers, and we label which is which.',
            'Some case studies are anonymised at the client’s request. The figures are unchanged; only the names are removed.',
            'The published accounts were not picked at random. They are the ones clients allowed us to publish, which makes them a biased sample by construction.',
          ]}
        />
        <p>
          Nothing on this site is a guarantee of any result. Where we do commit to a number, it is
          written into a signed statement of work with its conditions attached, and that document
          governs it — not this one.
        </p>
        <p>
          The pages here are general information about how we work. They are not advice for your
          business, and they are not legal, tax, or accounting advice. Check anything you plan to
          act on against your own numbers.
        </p>
      </Prose>
    ),
  },
  {
    id: 'third-party-platforms',
    title: 'Third-party platforms and links',
    body: (
      <Prose>
        <p>
          Our work runs on platforms nobody at this firm controls: Google, Meta, LinkedIn, TikTok,
          Amazon, and whatever analytics and payment tools a client already uses. Those companies
          change policy, pricing, auction mechanics, reporting definitions, and APIs when they
          choose, sometimes without notice. Those changes move performance, and they change what any
          of us can measure. We are not liable for them.
        </p>
        <p>
          Your use of a platform is governed by that platform&rsquo;s own terms. If one suspends or
          restricts an account we will help you appeal, but we cannot overturn the decision and we
          cannot promise a timeline.
        </p>
        <p>
          Links out of this site are references, not endorsements. We do not control those pages and
          we are not responsible for what is on them.
        </p>
      </Prose>
    ),
  },
  {
    id: 'client-engagements',
    title: 'Client work runs on a separate agreement',
    body: (
      <Prose>
        <p>
          Nothing on this site is an offer capable of acceptance. Scope, fees, deliverables,
          ownership of work product, confidentiality, service levels, term, and termination are all
          set in the master services agreement and statement of work signed by both parties.
        </p>
        <p>
          Where a term on this page conflicts with a signed agreement, the signed agreement wins for
          that client.
        </p>
      </Prose>
    ),
  },
  {
    id: 'what-you-send-us',
    title: 'What you send us',
    body: (
      <Prose>
        <p>
          You keep ownership of anything you submit through a form on this site. You give us
          permission to use it for the reason you sent it: to reply to you, or to assess your
          application. The{' '}
          <Link href="/privacy/" className="link-inline">
            privacy policy
          </Link>{' '}
          covers how long we hold it and how to have it deleted.
        </p>
        <p>
          You confirm that what you upload is yours to send and infringes nobody else&rsquo;s
          rights.
        </p>
        <p>
          Do not send confidential material through a web form. We cannot treat an unsolicited
          pitch, idea, or strategy as confidential, and we are free to use ideas sent to us that
          way. If you want a conversation covered by an NDA, ask for one first.
        </p>
      </Prose>
    ),
  },
  {
    id: 'availability',
    title: 'Availability and warranties',
    body: (
      <Prose>
        <p>
          The site is provided as it is and as available. We do not warrant that it will be
          reachable without interruption, that it is free of errors, or that a figure published
          months ago still holds today.
        </p>
        <p>
          To the extent the law allows, we exclude all implied warranties, including merchantability
          and fitness for a particular purpose.
        </p>
      </Prose>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <Prose>
        <p>
          To the extent the law allows, we are not liable for lost profit, lost revenue, lost data,
          lost opportunity, or any indirect or consequential loss arising from your use of this
          site.
        </p>
        <p>
          Our total liability for any claim connected to this site is capped at USD 100. Liability
          arising out of a paid engagement is capped by the signed agreement for that engagement,
          not by this figure.
        </p>
        <p>
          Nothing here excludes liability that cannot be excluded by law, including for fraud and
          for death or personal injury caused by negligence.
        </p>
      </Prose>
    ),
  },
  {
    id: 'indemnity',
    title: 'Indemnity',
    body: (
      <Prose>
        <p>
          If you breach these terms or use the site unlawfully and that costs us money — a
          third-party claim, a regulator, legal fees — you cover it. We will tell you about any such
          claim promptly and let you take part in the defence.
        </p>
      </Prose>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <Prose>
        <p>
          We can change these terms. The date at the top of the page changes when we do, and the
          version published at the time you use the site is the one that applies. Changes affecting
          a live client engagement are handled under that agreement rather than here.
        </p>
      </Prose>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing law',
    body: (
      <Prose>
        <p>
          These terms are governed by the law of {site.legal.governingLaw}, without regard to its
          conflict of law rules. Any dispute goes to the state or federal courts sitting in{' '}
          {site.legal.venue}, and both sides accept the jurisdiction of those courts.
        </p>
        <p>
          If a court finds any part of these terms unenforceable, that part is severed and the rest
          stays in force.
        </p>
      </Prose>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <Prose>
        <ContactBlock />
      </Prose>
    ),
  },
];

export default function TermsPage() {
  return (
    <main id="top">
      {/* ── Masthead ── */}
      <section className="mesh-host overflow-hidden">
        <GradientMesh height="h-[20rem] md:h-[24rem]" />
        <div className="wrap-tight pt-28 pb-12 md:pt-36 md:pb-16">
          <Reveal>
            <span className="eyebrow">Legal</span>
            <h1 className="display-2 mt-4">Terms of service</h1>
            <p className="lede mt-5 max-w-[34rem]">
              The rules for using {HOST}, who owns what, and what the numbers published here do and
              do not mean.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <dl className="border-hairline mt-10 grid gap-x-8 gap-y-4 border-t pt-6 sm:grid-cols-3">
              <div>
                <dt className="eyebrow">Last updated</dt>
                <dd className="caption mt-2">
                  <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Applies to</dt>
                <dd className="caption mt-2">{HOST}</dd>
              </div>
              <div>
                <dt className="eyebrow">Jurisdiction</dt>
                <dd className="caption mt-2">{site.legal.venue}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Contents ── */}
      <section className="border-hairline bg-canvas-soft border-b">
        <div className="wrap-tight py-10 md:py-12">
          <h2 className="eyebrow">Contents</h2>
          <ol className="border-hairline mt-4 grid border-t sm:grid-cols-2">
            {SECTIONS.map((s, i) => (
              <li key={s.id} className="border-hairline border-b">
                <a href={`#${s.id}`} className="group flex items-baseline gap-3 py-2.5 sm:pr-8">
                  <span className="eyebrow group-hover:text-ink tabular-nums transition-colors">
                    {num(i)}
                  </span>
                  <span className="text-ink-2 group-hover:text-ink text-[0.9375rem] transition-colors">
                    {s.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Document ── */}
      <div className="wrap-tight py-14 md:py-16">
        <div className="divide-hairline divide-y">
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 py-9 first:pt-0 md:py-11 md:first:pt-0"
            >
              <div className="grid gap-x-8 gap-y-4 md:grid-cols-[3.5rem_1fr]">
                <div className="eyebrow tabular-nums md:pt-[0.45rem]">{num(i)}</div>
                <div>
                  <h2 className="text-[1.3125rem] md:text-[1.5rem]">{s.title}</h2>
                  <div className="mt-4">{s.body}</div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="border-hairline border-t">
        <div className="wrap-tight flex flex-wrap items-center justify-between gap-5 py-8">
          <a href="#top" className="link-arrow">
            Back to top
          </a>
          <Link href="/privacy/" className="link-arrow">
            Privacy policy
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ── Pieces ─────────────────────────────────────────────────────────── */

function num(i: number) {
  return String(i + 1).padStart(2, '0');
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="text-ink-2 space-y-4 text-[0.9375rem] leading-[1.7]">{children}</div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex gap-3">
          <span aria-hidden className="bg-indigo mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function ContactBlock() {
  return (
    <address className="not-italic">
      <div className="text-ink font-medium">{site.legalName}</div>
      <div className="mt-1">{site.contact.address}</div>
      <div className="mt-3 flex flex-col gap-1">
        <a href={`mailto:${site.contact.email}`} className="link-inline w-fit">
          {site.contact.email}
        </a>
        <a href={`tel:${site.contact.phoneHref}`} className="link-inline w-fit">
          {site.contact.phone}
        </a>
      </div>
      <p className="mt-4">
        Questions about these terms go to the same address. Contract questions on a live engagement
        go to your account lead, who will answer faster.
      </p>
    </address>
  );
}
