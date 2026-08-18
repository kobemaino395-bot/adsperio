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
  title: 'Privacy policy',
  description: `What ${site.name} collects on ${HOST}, why we hold it, how long we keep it, who else sees it, and how to have it deleted.`,
  alternates: { canonical: '/privacy/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'article',
    url: `${site.url}/privacy/`,
    siteName: site.name,
    title: `Privacy policy · ${site.name}`,
    description: `What ${site.name} collects, why, how long it is kept, and how to have it deleted.`,
  },
};

/* Sections are declared once and drive both the contents index and the
 * document body, so the two can never fall out of step. */
const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <Prose>
        <p>
          {site.legalName} trades as {site.name}. We are a performance advertising firm at{' '}
          {site.contact.address}. We buy and run paid media for client companies.
        </p>
        <p>
          This policy covers {HOST} and the email addresses published on it. For the data described
          below, we are the controller: we decide what is collected and why.
        </p>
        <p>
          Data held inside a client&rsquo;s own advertising accounts works differently. Section 07
          covers that.
        </p>
      </Prose>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: (
      <Prose>
        <p>Four channels, and nothing else.</p>
        <DataRow label="Site visits">
          Our host writes a standard server log for every request: IP address, timestamp, page
          requested, referring page, and browser and device string. We read these to find broken
          pages and to block abuse. There is no advertising pixel on this site.
        </DataRow>
        <DataRow label="Contact form">
          Your name, work email, company, website, the monthly media budget range you pick, and
          whatever you write in the message box. We use it to reply and to work out whether we are
          the right firm for the job.
        </DataRow>
        <DataRow label="Job applications">
          Full name, email, phone, country, current employer, years of experience, expected salary,
          notice period, portfolio link, cover note, your CV file, and — on roles that include one —
          your uploaded assessment answer. We also record the IP address and browser string of the
          submission, which is how we spot bulk-submitted applications.
        </DataRow>
        <DataRow label="Newsletter">
          Your email address and the date you subscribed. Nothing else. We do not need your name to
          send you a newsletter.
        </DataRow>
        <p>
          We do not buy personal data from brokers, and{' '}
          <span className="emph">we do not sell, rent, or trade yours</span>.
        </p>
      </Prose>
    ),
  },
  {
    id: 'legal-basis',
    title: 'Why we are allowed to hold it',
    body: (
      <Prose>
        <p>For visitors in the UK and the EEA, the legal basis for each channel:</p>
        <Bullets
          items={[
            'Contract, or steps taken before one — replying to your contact form, and assessing a job application you chose to send us.',
            'Consent — the newsletter, and nothing else. Withdraw it in one click from any issue.',
            'Legitimate interest — server logs, kept to keep the site up and to block abuse. You can object; see section 08.',
          ]}
        />
        <p>
          We do not run automated decision-making. A person reads every application and every
          message.
        </p>
      </Prose>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    body: (
      <Prose>
        <Table
          head={['Record', 'Kept for']}
          rows={[
            ['Server logs', '90 days, then deleted'],
            ['Contact form submissions', '24 months from your last message'],
            [
              'Applications — not hired',
              '12 months, unless you asked to stay on file',
            ],
            ['Applications — hired', 'Moves into the employment file and leaves this policy'],
            ['CV and assessment uploads', 'Deleted with the application record above'],
            ['Newsletter list', 'Until you unsubscribe'],
          ]}
        />
        <p>
          When you unsubscribe we keep your address on a do-not-contact list so nobody can add you
          back. That list holds the address and nothing else.
        </p>
        <p>
          Nothing is kept &ldquo;just in case&rdquo;. If a record is still here past the date in
          that table, it is a mistake — tell us and we will remove it.
        </p>
      </Prose>
    ),
  },
  {
    id: 'sharing',
    title: 'Who else handles it',
    body: (
      <Prose>
        <p>A short list of suppliers. Each gets only what it needs to do its job.</p>
        <Table
          head={['Supplier', 'What it handles']}
          rows={[
            ['Website host', 'Serves the site and holds the server logs'],
            ['Web3Forms', 'Passes contact form submissions to our inbox'],
            [
              'Google Workspace',
              'Our email, plus the sheet and drive where job applications and uploaded files land',
            ],
            ['Newsletter platform', 'Stores the subscriber list and sends the issues'],
          ]}
        />
        <p>
          Advertising platforms — Google, Meta, LinkedIn, TikTok — receive nothing about you from
          this website. We work inside those platforms on behalf of clients, which section 07
          covers.
        </p>
        <p>
          Beyond that list we disclose personal data only when a court, regulator, or law requires
          it, or to stop someone being harmed. If a company buys us, the data moves with the
          business and this policy applies until we publish a replacement.
        </p>
      </Prose>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    body: (
      <Prose>
        <p>
          This site sets no advertising or analytics cookies. There is no cookie banner because
          there is nothing to ask you about.
        </p>
        <p>Two settings are stored in your own browser and never sent to us:</p>
        <Bullets
          items={[
            'Whether you chose the light or dark theme.',
            'Whether you dismissed the notice in the corner of the page.',
          ]}
        />
        <p>
          One cookie exists on this domain: a session cookie issued when a member of staff signs
          into the private admin area. If you are not staff, you will never be given it. Clearing
          your browser storage removes everything above with no effect on the site.
        </p>
      </Prose>
    ),
  },
  {
    id: 'client-data',
    title: 'Client accounts and campaign data',
    body: (
      <Prose>
        <p>
          When we run media for a client we work inside advertising accounts that the client owns.
          For that work the client is the controller and we are a processor acting on their written
          instruction. What we may do with the data is set by the services agreement and data
          processing terms we sign with them, not by this policy.
        </p>
        <p>
          We do not export a client&rsquo;s customer list to use elsewhere, and we never combine one
          client&rsquo;s data with another&rsquo;s.
        </p>
        <p>
          If you are a customer of one of our clients and want your record removed, contact that
          company. They hold it. We act on their instruction, and we cannot delete it on our own.
        </p>
      </Prose>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights, and how to use them',
    body: (
      <Prose>
        <p>You can ask us to:</p>
        <Bullets
          items={[
            'Show you a copy of everything we hold about you.',
            'Correct anything that is wrong.',
            'Delete it.',
            'Stop using it for a particular purpose, or stop entirely.',
            'Send it to you, or to someone you name, in a machine-readable file.',
            'Honour a withdrawal of consent you gave earlier.',
          ]}
        />
        <p>
          Email{' '}
          <a href={`mailto:${site.contact.email}`} className="link-inline">
            {site.contact.email}
          </a>{' '}
          with &ldquo;Data request&rdquo; in the subject line. We answer within 30 days. We will ask
          one question to confirm it is you — normally that you can receive mail at the address on
          the record. There is no charge, and if we refuse we will tell you why.
        </p>
        <p>
          In the UK or the EEA you can also complain to your data protection authority. If you live
          in California: we do not sell or share personal information as that state defines those
          words, so there is nothing for you to opt out of.
        </p>
      </Prose>
    ),
  },
  {
    id: 'security',
    title: 'Security, and where the data sits',
    body: (
      <Prose>
        <p>
          We are a New York company and our suppliers are US-based, so your data is processed in the
          United States. Transfers out of the UK and the EEA rely on the standard contractual
          clauses those suppliers publish.
        </p>
        <p>
          Application files are reachable only by the people running that hiring round. The admin
          area sits behind a password and a session that expires. Traffic to this site is encrypted
          in transit.
        </p>
        <p>
          We cannot promise a breach will never happen. If one does and it affects you, we will tell
          you and the relevant regulator rather than wait to be asked.
        </p>
      </Prose>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <Prose>
        <p>
          Nothing here is aimed at anyone under 16 and we do not knowingly collect their data. If a
          child has sent us something, write to{' '}
          <a href={`mailto:${site.contact.email}`} className="link-inline">
            {site.contact.email}
          </a>{' '}
          and we will delete it.
        </p>
      </Prose>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <Prose>
        <p>
          When this policy changes, the date at the top of the page changes with it. If a change
          affects what we do with data we already hold, we email the people affected before it takes
          effect. We keep earlier versions and will send you one on request.
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

export default function PrivacyPage() {
  return (
    <main id="top">
      {/* ── Masthead ── */}
      <section className="mesh-host overflow-hidden">
        <GradientMesh height="h-[20rem] md:h-[24rem]" />
        <div className="wrap-tight pt-28 pb-12 md:pt-36 md:pb-16">
          <Reveal>
            <span className="eyebrow">Legal</span>
            <h1 className="display-2 mt-4">Privacy policy</h1>
            <p className="lede mt-5 max-w-[34rem]">
              What we collect on {HOST}, why we hold it, how long it stays, and how to make us
              delete it.
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
                <dt className="eyebrow">Controller</dt>
                <dd className="caption mt-2">{site.legalName}</dd>
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
          <Link href="/terms/" className="link-arrow">
            Terms of service
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

/** A labelled paragraph. Mono label above, hairline to the left — the same
 *  gesture the rest of the site uses instead of bold lead-ins. */
function DataRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-hairline bg-canvas-soft rounded-lg border p-4">
      <span className="eyebrow">{label}</span>
      <p className="mt-2">{children}</p>
    </div>
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

function Table({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <div className="border-hairline overflow-x-auto rounded-xl border">
      <table className="w-full text-left">
        <thead>
          <tr className="border-hairline bg-canvas-soft border-b">
            <th className="caption w-[42%] px-5 py-3 align-bottom font-medium">{head[0]}</th>
            <th className="caption px-5 py-3 align-bottom font-medium">{head[1]}</th>
          </tr>
        </thead>
        <tbody className="divide-hairline divide-y">
          {rows.map((r) => (
            <tr key={r[0]}>
              <th scope="row" className="text-ink px-5 py-3 align-top text-[0.875rem] font-medium">
                {r[0]}
              </th>
              <td className="px-5 py-3 align-top text-[0.875rem]">{r[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
        Data requests go to the same address. Put &ldquo;Data request&rdquo; in the subject line and
        it reaches the right person on the first hop.
      </p>
    </address>
  );
}
