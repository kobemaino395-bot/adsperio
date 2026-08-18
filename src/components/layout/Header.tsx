'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { services } from '@/content/services';
import MobileNav from './MobileNav';
import Logo from './Logo';
import ThemeToggle from '@/components/ThemeToggle';

const NAV = [
  { href: '/case-studies/', label: 'Work' },
  { href: '/about/', label: 'Studio' },
  { href: '/newsletter/', label: 'Notes' },
  { href: '/careers/', label: 'Careers' },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close both menus when a link navigates. Adjusted during render rather than
  // in an effect so the menus never paint open on the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDropdownOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDropdownOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : (pathname?.startsWith(href) ?? false);

  /* Nav is body-md at weight 400 — sans, sentence case. The bar sits over the
     gradient mesh, so it stays translucent rather than plating over it. */
  const item = 'text-[0.9375rem] transition-colors';

  return (
    <>
      <header className="bg-canvas/70 fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
        <div className="wrap flex h-16 items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                onMouseEnter={() => setDropdownOpen(true)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={`${item} flex items-center gap-1.5 ${
                  isActive('/services') ? 'text-indigo-text' : 'text-ink-2 hover:text-indigo-text'
                }`}
              >
                Services
                <Chevron open={dropdownOpen} />
              </button>

              <div
                onMouseLeave={() => setDropdownOpen(false)}
                className={`absolute top-full left-1/2 w-[27rem] -translate-x-1/2 pt-3 transition-all duration-150 ${
                  dropdownOpen
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-1 opacity-0'
                }`}
                role="menu"
              >
                <div className="border-hairline bg-canvas shadow-lift-2 overflow-hidden rounded-xl border p-1.5">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}/`}
                      role="menuitem"
                      className="hover:bg-canvas-soft block rounded-lg px-3.5 py-3 transition-colors"
                    >
                      <span className="text-ink block text-[0.9375rem] font-medium">
                        {s.navTitle}
                      </span>
                      <span className="text-ink-mute mt-0.5 block text-[0.8125rem] leading-snug">
                        {s.navDesc}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/services/"
                    role="menuitem"
                    className="link-arrow hover:bg-canvas-soft mt-0.5 rounded-lg px-3.5 py-2.5 text-[0.875rem] transition-colors"
                  >
                    All services
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
                      <path
                        d="M7 1L11 5L7 9M11 5H1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${item} ${
                  isActive(l.href) ? 'text-indigo-text' : 'text-ink-2 hover:text-indigo-text'
                }`}
              >
                {l.label}
              </Link>
            ))}

            <ThemeToggle />
            <Link href="/contact/" className="btn btn-solid btn-sm">
              Request an audit
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="border-hairline-strong text-ink-2 flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.8125rem]"
            >
              <span aria-hidden className="flex flex-col gap-[3px]">
                <span className="bg-ink-2 block h-px w-3.5" />
                <span className="bg-ink-2 block h-px w-3.5" />
              </span>
              Menu
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
