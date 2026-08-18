'use client';

import Link from 'next/link';
import { useState } from 'react';
import { services } from '@/content/services';
import { site } from '@/content/site';
import Logo from './Logo';

type Props = { open: boolean; onClose: () => void };

const LINKS = [
  { href: '/case-studies/', label: 'Work' },
  { href: '/about/', label: 'Studio' },
  { href: '/careers/', label: 'Careers' },
  { href: '/newsletter/', label: 'Notes' },
];

export default function MobileNav({ open, onClose }: Props) {
  const [servicesExpanded, setServicesExpanded] = useState(false);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[#0d253d]/45 backdrop-blur-[2px] transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
      />

      <aside
        className={`border-hairline bg-canvas fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l transition-transform duration-300 ease-[cubic-bezier(0.16,0.84,0.44,1)] md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <div className="border-hairline flex h-16 shrink-0 items-center justify-between border-b px-5">
          <Logo asLink={false} />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="border-hairline text-ink-2 hover:text-ink grid h-8 w-8 place-items-center rounded-full border transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <button
            onClick={() => setServicesExpanded((v) => !v)}
            aria-expanded={servicesExpanded}
            className="hover:bg-canvas-soft flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[1.0625rem] font-medium transition-colors"
          >
            Services
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              aria-hidden
              className={`text-ink-mute transition-transform duration-200 ${
                servicesExpanded ? 'rotate-180' : ''
              }`}
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {servicesExpanded && (
            <ul className="bg-canvas-soft mt-1 mb-1 space-y-0.5 rounded-lg p-1.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}/`}
                    onClick={onClose}
                    className="hover:bg-canvas block rounded-md px-3 py-2.5 transition-colors"
                  >
                    <span className="block text-[0.9375rem] font-medium">{s.navTitle}</span>
                    <span className="text-ink-mute mt-0.5 block text-[0.8125rem] leading-snug">
                      {s.navDesc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="hover:bg-canvas-soft flex items-center justify-between rounded-lg px-3 py-3 text-[1.0625rem] font-medium transition-colors"
            >
              {l.label}
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
                aria-hidden
                className="text-ink-mute"
              >
                <path
                  d="M7 1L11 5L7 9M11 5H1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}

          <div className="px-3 py-6">
            <div className="caption mb-2">Direct</div>
            <a href={`mailto:${site.contact.email}`} className="link-inline block text-[0.875rem]">
              {site.contact.email}
            </a>
            <a
              href={`tel:${site.contact.phoneHref}`}
              className="link-inline mt-1 block text-[0.875rem] tabular-nums"
            >
              {site.contact.phone}
            </a>
          </div>
        </nav>

        <div className="border-hairline shrink-0 border-t p-4">
          <Link href="/contact/" onClick={onClose} className="btn btn-solid w-full">
            Request an audit
          </Link>
        </div>
      </aside>
    </>
  );
}
