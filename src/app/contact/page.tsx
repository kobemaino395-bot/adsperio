import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/layout/PageHero';
import { site } from '@/content/site';

const DESCRIPTION =
  'Send read-only access to an ad account and we will tell you what is wrong with it. Two weeks, no fee, no obligation.';

export const metadata: Metadata = {
  title: 'Contact',
  description: DESCRIPTION,
  alternates: { canonical: '/contact/' },
  openGraph: {
    type: 'website',
    url: `${site.url}/contact/`,
    siteName: site.name,
    title: `Contact · ${site.name}`,
    description: DESCRIPTION,
  },
};

const WHAT_HAPPENS = [
  {
    n: '01',
    t: 'You send access',
    d: 'Read-only is enough — Google Ads, Meta, whichever worries you most. If you can add one month of revenue from your finance system, the audit gets considerably more useful.',
  },
  {
    n: '02',
    t: 'We read it',
    d: 'Two weeks. A named person goes through the account history, search terms or creative, and the tracking setup. There is no discovery call unless something needs explaining.',
  },
  {
    n: '03',
    t: 'You get it in writing',
    d: 'A ranked list of what is costing you money, with the exports attached, and an estimate of what each item is worth per month. Yours to keep either way.',
  },
  {
    n: '04',
    t: 'We both decide',
    d: 'About a third of the companies we audit do not become clients. Sometimes the answer is that the account is already fine, and occasionally it is that you need a different kind of help entirely.',
  },
];

const ROUTES = [
  { k: 'New business', v: site.contact.newBusiness },
  { k: 'Careers', v: site.contact.careers },
  { k: 'Press', v: site.contact.press },
  { k: 'Anything else', v: site.contact.email },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Send us an account. We’ll tell you what’s wrong with it."
        titleMax="max-w-[15ch]"
        lede="No deck, no discovery call, no fee. If the account is in good shape we will say that instead, and the audit is still yours."
      />

      {/* ── Form + details ── */}
      <section>
        <div className="wrap grid gap-12 pb-20 md:pb-24 lg:grid-cols-12 lg:gap-12">
          {/* Web3Forms — endpoint and field names must stay exactly as they are.
              The access key is a placeholder and needs replacing before launch. */}
          <div className="lg:col-span-7">
            <Reveal>
              <form
                action="https://api.web3forms.com/submit"
                method="POST"
                className="card shadow-lift-1 p-6 md:p-8"
              >
                <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
                <input type="hidden" name="subject" value="New enquiry from adsperio.com" />
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <span className="text-ink text-[1.0625rem] font-medium">Enquiry</span>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="field-label">
                      Name
                    </label>
                    <input id="name" name="name" type="text" required className="field" />
                  </div>
                  <div>
                    <label htmlFor="email" className="field-label">
                      Work email
                    </label>
                    <input id="email" name="email" type="email" required className="field" />
                  </div>
                  <div>
                    <label htmlFor="company" className="field-label">
                      Company
                    </label>
                    <input id="company" name="company" type="text" className="field" />
                  </div>
                  <div>
                    <label htmlFor="spend" className="field-label">
                      Monthly media spend
                    </label>
                    <input
                      id="spend"
                      name="spend"
                      type="text"
                      placeholder="e.g. $60K"
                      className="field"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="message" className="field-label">
                    What is the problem?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Which accounts, what you think is wrong, and what you have already tried."
                    className="field resize-none"
                  />
                </div>

                <div className="border-hairline mt-6 flex flex-wrap items-center gap-4 border-t pt-6">
                  <button type="submit" className="btn btn-solid">
                    Send enquiry
                  </button>
                  <p className="caption">
                    A person replies within two working days.
                  </p>
                </div>
              </form>
            </Reveal>
          </div>

          {/* ── Direct routes ── */}
          <div className="lg:col-span-5">
            <Reveal delay={110}>
              <div className="card overflow-hidden">
                <div className="border-hairline bg-canvas-soft border-b px-5 py-3">
                  <span className="text-ink text-[0.8125rem] font-medium">Direct</span>
                </div>
                <dl className="divide-hairline divide-y">
                  {ROUTES.map((r) => (
                    <div key={r.k} className="flex items-baseline gap-4 px-5 py-3.5">
                      <dt className="caption w-[7.5rem] shrink-0">{r.k}</dt>
                      <dd className="min-w-0">
                        <a
                          href={`mailto:${r.v}`}
                          className="link-inline text-[0.875rem] break-all"
                        >
                          {r.v}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="card mt-6 overflow-hidden">
                <div className="border-hairline bg-canvas-soft border-b px-5 py-3">
                  <span className="text-ink text-[0.8125rem] font-medium">Office</span>
                </div>
                <div className="space-y-2.5 px-5 py-4">
                  <p className="text-[0.875rem] leading-relaxed">{site.contact.address}</p>
                  <p className="caption">{site.contact.hours}</p>
                  <a
                    href={`tel:${site.contact.phoneHref}`}
                    className="link-inline block text-[0.875rem] tabular-nums"
                  >
                    {site.contact.phone}
                  </a>
                </div>
              </div>

              <p className="text-ink-mute mt-6 leading-relaxed">
                Looking for a job rather than an agency?{' '}
                <Link href="/careers/" className="link-inline">
                  Open roles are here
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── What happens next ── */}
      <section className="border-hairline bg-canvas-soft border-y">
        <div className="wrap py-20 md:py-24">
          <Reveal>
            <span className="eyebrow">What happens next</span>
            <h2 className="display-2 mt-4 max-w-[16ch]">The whole process, start to finish.</h2>
          </Reveal>

          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {WHAT_HAPPENS.map((s, i) => (
              <Reveal key={s.n} delay={i * 55} as="li">
                <div className="card h-full p-6">
                  <span className="pill-tag tabular-nums">{s.n}</span>
                  <h3 className="mt-4 text-[1.125rem] leading-tight font-light tracking-[-0.015em]">
                    {s.t}
                  </h3>
                  <p className="text-ink-mute mt-3 leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
