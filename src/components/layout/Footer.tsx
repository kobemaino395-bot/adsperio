import Link from 'next/link';
import { Mail } from 'lucide-react';
import { services } from '@/content/services';
import { site } from '@/content/site';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  const iconClass =
    'flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]';

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-sunken)]">
      {/* CTA strip */}
      <div className="container-zest flex flex-col gap-6 border-b border-[var(--color-border)] py-14 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-xl text-3xl font-light tracking-[-0.02em] md:text-5xl">
          Let&apos;s make something<br />worth spreading.
        </h2>
        <Link href="/contact/" className="btn-primary self-start md:self-auto">
          Start a project
        </Link>
      </div>

      <div className="container-zest grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {site.tagline} A growth studio for ambitious brands across North America and Europe.
          </p>
          <div className="mt-6 flex gap-2.5">
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconClass}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4V9z" />
              </svg>
            </a>
            <a href={site.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className={iconClass}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href={`mailto:${site.contact.email}`} aria-label="Email" className={iconClass}>
              <Mail size={15} />
            </a>
          </div>
        </div>

        <FooterCol title="Services" className="md:col-span-3">
          {services.map((s) => (
            <FooterLink key={s.slug} href={`/services/${s.slug}/`}>{s.navTitle}</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Studio" className="md:col-span-2">
          <FooterLink href="/about/">About</FooterLink>
          <FooterLink href="/case-studies/">Work</FooterLink>
          <FooterLink href="/careers/">Careers</FooterLink>
        </FooterCol>

        <FooterCol title="Connect" className="md:col-span-2">
          <FooterLink href="/contact/">Contact</FooterLink>
          <FooterLink href="/newsletter/">Newsletter</FooterLink>
        </FooterCol>
      </div>

      <div className="container-zest flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] py-6 text-sm text-[var(--color-fg-muted)] md:flex-row md:items-center">
        <span>© {year} {site.name}. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy/" className="hover:text-[var(--color-fg)]">Privacy</Link>
          <Link href="/terms/" className="hover:text-[var(--color-fg)]">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="label-tech mb-4">{title}</div>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
        {children}
      </Link>
    </li>
  );
}
