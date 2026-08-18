import Link from 'next/link';
import { services } from '@/content/services';
import { site } from '@/content/site';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* ── Closing call. The one filled pill in this band. ── */}
      <section className="bg-canvas-soft border-hairline border-t">
        <div className="wrap flex flex-col gap-7 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <span className="eyebrow">Next step</span>
            <h2 className="display-3 mt-3 max-w-lg">
              Send us an account. We&apos;ll tell you what&apos;s wrong with it.
            </h2>
            <p className="text-ink-2 mt-3 max-w-md">
              No pitch deck. A read of your numbers, in writing, within five working days.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/contact/" className="btn btn-solid">
              Request an audit
            </Link>
            <Link href="/case-studies/" className="btn btn-line">
              See the work
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-hairline bg-canvas border-t">
        {/* ── Colophon grid ── */}
        <div className="wrap grid gap-10 py-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Logo />
            <p className="text-ink-mute mt-5 max-w-xs text-[0.875rem] leading-relaxed">
              A performance advertising firm in New York. We buy media, build creative, and
              reconcile the spend against revenue you can verify.
            </p>

            <dl className="mt-7 space-y-2">
              <div className="flex gap-3">
                <dt className="caption w-14 shrink-0">Email</dt>
                <dd>
                  <a href={`mailto:${site.contact.email}`} className="link-inline text-[0.875rem]">
                    {site.contact.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="caption w-14 shrink-0">Phone</dt>
                <dd>
                  <a
                    href={`tel:${site.contact.phoneHref}`}
                    className="link-inline text-[0.875rem] tabular-nums"
                  >
                    {site.contact.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="caption w-14 shrink-0">Office</dt>
                <dd className="text-ink-mute max-w-[16rem] text-[0.875rem]">
                  {site.contact.address}
                </dd>
              </div>
            </dl>
          </div>

          <FooterCol title="Services" className="md:col-span-3">
            {services.map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}/`}>
                {s.navTitle}
              </FooterLink>
            ))}
            <FooterLink href="/services/">All services</FooterLink>
          </FooterCol>

          <FooterCol title="Studio" className="md:col-span-2">
            <FooterLink href="/about/">About</FooterLink>
            <FooterLink href="/case-studies/">Work</FooterLink>
            <FooterLink href="/careers/">Careers</FooterLink>
            <FooterLink href="/newsletter/">Notes</FooterLink>
          </FooterCol>

          <FooterCol title="Elsewhere" className="md:col-span-3">
            <FooterLink href="/contact/">Contact</FooterLink>
            <FooterExternal href={site.social.linkedin}>LinkedIn</FooterExternal>
            <FooterExternal href={site.social.twitter}>X / Twitter</FooterExternal>
            <FooterLink href={`mailto:${site.contact.press}`}>Press enquiries</FooterLink>
          </FooterCol>
        </div>

        {/* ── The name, explained. Every good colophon has one. ── */}
        <div className="wrap border-hairline flex flex-col items-start justify-between gap-3 border-t py-6 md:flex-row md:items-center">
          <p className="caption">
            <span className="text-ink-2 font-medium">adsperio</span>
            <span className="mx-2">·</span>
            <span className="italic">{site.brand.etymologyLanguage.toLowerCase()}</span>
            <span className="mx-2">·</span>
            {site.brand.etymology}, v. — {site.brand.etymologyGloss}
          </p>
          <div className="flex items-center gap-6">
            <span className="caption">
              © {year} {site.legalName}
            </span>
            <Link href="/privacy/" className="caption hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="/terms/" className="caption hover:text-ink transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-ink mb-4 text-[0.8125rem] font-medium">{title}</div>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-ink-mute hover:text-indigo-text text-[0.875rem] transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function FooterExternal({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink-mute hover:text-indigo-text text-[0.875rem] transition-colors"
      >
        {children}
      </a>
    </li>
  );
}
