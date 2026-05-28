import Link from 'next/link';
import { Mail } from 'lucide-react';
import { services } from '@/content/services';
import { site } from '@/content/site';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  const iconClass = "flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-ink-muted transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]";

  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-ink-warm)] text-[var(--color-bg)]">
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

      {/* Oversized contagious wordmark */}
      <div aria-hidden className="container-zest relative pt-16">
        <div className="select-none font-serif text-[18vw] font-extrabold leading-[0.8] tracking-[-0.04em] text-white/[0.04] md:text-[13rem]">
          spread.
        </div>
      </div>

      <div className="container-zest relative pb-10 pt-8">

        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <span className="text-[var(--color-bg)]"><Logo /></span>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {site.tagline} A growth studio for ambitious brands across Asia-Pacific and Europe.
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

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row md:items-center">
          <span>© {year} {site.name}. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy/" className="transition hover:text-[var(--color-accent)]">Privacy</Link>
            <Link href="/terms/" className="transition hover:text-[var(--color-accent)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-accent)]">{title}</div>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-white/70 transition hover:text-white">
        {children}
      </Link>
    </li>
  );
}