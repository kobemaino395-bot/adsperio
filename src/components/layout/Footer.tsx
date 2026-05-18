import Link from 'next/link';
import { Mail, ArrowUpRight } from 'lucide-react';
import { services } from '@/content/services';
import { site } from '@/content/site';

export default function Footer() {
  const year = new Date().getFullYear();
  const iconClass = "flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-ink-muted transition hover:border-zest-300 hover:text-zest-400";

  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <div aria-hidden className="pointer-events-none absolute -bottom-48 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-zest-300/10 blur-3xl" />

      <div className="container-zest relative pt-20 pb-10">

        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em]">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-zest-300" />
              {site.name}
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-muted">
              {site.tagline} Modern advertising growth for brands across Asia-Pacific and Europe.
            </p>
            <div className="mt-6 flex gap-2">
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconClass}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4V9z"/>
            </svg>
            </a>
            <a href={site.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className={iconClass}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            </a>
              <a href={`mailto:${site.contact.email}`} aria-label="Email" className={iconClass}>
                <Mail size={14} />
              </a>
            </div>
          </div>

          <FooterCol title="Services" className="md:col-span-3">
            {services.map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}/`}>{s.navTitle}</FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Company" className="md:col-span-2">
            <FooterLink href="/about/">About</FooterLink>
            <FooterLink href="/case-studies/">Case studies</FooterLink>
            <FooterLink href="/careers/">Careers</FooterLink>
          </FooterCol>

          <FooterCol title="Connect" className="md:col-span-2">
            <FooterLink href="/contact/">Contact</FooterLink>
            <FooterLink href="/newsletter/">Newsletter</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-border)] pt-8 text-xs text-ink-muted md:flex-row md:items-center">
          <span>© {year} {site.name}. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy/" className="transition hover:text-[var(--color-fg)]">Privacy</Link>
            <Link href="/terms/" className="transition hover:text-[var(--color-fg)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ink-muted">{title}</div>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-[var(--color-fg)]/80 transition hover:text-zest-400">
        {children}
      </Link>
    </li>
  );
}