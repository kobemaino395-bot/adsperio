'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu } from 'lucide-react';
import { services } from '@/content/services';
import MobileNav from './MobileNav';
import Logo from './Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

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
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  const navLink = 'text-sm font-medium transition-colors';

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl"
      >
        <div className="container-zest flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                onMouseEnter={() => setDropdownOpen(true)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 ${navLink} ${isActive('/services') ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'}`}
              >
                Services
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                onMouseLeave={() => setDropdownOpen(false)}
                className={`absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3 transition-opacity ${
                  dropdownOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
                role="menu"
              >
                <div className="card overflow-hidden p-1.5 shadow-[var(--shadow-lg)]">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}/`}
                      role="menuitem"
                      className="block rounded-lg p-3 transition-colors hover:bg-[var(--color-bg-alt)]"
                    >
                      <div className="text-sm font-medium">{s.navTitle}</div>
                      <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">{s.navDesc}</p>
                    </Link>
                  ))}
                  <Link
                    href="/services/"
                    role="menuitem"
                    className="mt-1 flex items-center justify-between rounded-lg border-t border-[var(--color-border)] p-3 text-sm font-medium text-[var(--color-accent)]"
                  >
                    All services <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/case-studies/" className={`${navLink} ${isActive('/case-studies') ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'}`}>
              Work
            </Link>
            <Link href="/about/" className={`${navLink} ${isActive('/about') ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'}`}>
              Studio
            </Link>
            <ThemeToggle />
            <Link href="/contact/" className="btn-primary px-5 py-2 text-sm">
              Book a call
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium"
            >
              <Menu size={15} /> Menu
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
