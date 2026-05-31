'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { services } from '@/content/services';
import Logo from './Logo';

type Props = { open: boolean; onClose: () => void };

export default function MobileNav({ open, onClose }: Props) {
  const [servicesExpanded, setServicesExpanded] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[var(--color-ink)]/30 transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-[var(--color-border)] bg-[var(--color-bg-alt)] transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-5">
          <Logo asLink={false} />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full border border-[var(--color-border)] p-2"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="border-b border-[var(--color-border)]">
            <button
              onClick={() => setServicesExpanded((v) => !v)}
              aria-expanded={servicesExpanded}
              className="flex w-full items-center justify-between px-2 py-4 text-left text-lg font-semibold"
            >
              Services
              <ChevronDown size={18} className={`text-[var(--color-fg-muted)] transition-transform ${servicesExpanded ? 'rotate-180' : ''}`} />
            </button>
            {servicesExpanded && (
              <div className="space-y-1 pb-3 pl-2">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}/`}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-2.5 text-sm text-[var(--color-fg-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-fg)]"
                  >
                    {s.navTitle}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {[
            { href: '/case-studies/', label: 'Work' },
            { href: '/about/', label: 'Studio' },
            { href: '/careers/', label: 'Careers' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="flex items-center justify-between border-b border-[var(--color-border)] px-2 py-4 text-lg font-semibold"
            >
              {l.label} <span aria-hidden className="text-[var(--color-fg-muted)]">→</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-[var(--color-border)] p-4">
          <Link href="/contact/" onClick={onClose} className="btn-primary w-full">
            Book a call
          </Link>
        </div>
      </aside>
    </>
  );
}