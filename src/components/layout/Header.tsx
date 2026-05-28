'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu } from 'lucide-react';
import { services } from '@/content/services';
import MobileNav from './MobileNav';
import Logo from './Logo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const showBanner = !pathname?.startsWith('/careers');

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Scroll state for header glassmorphism
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click + Escape
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

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <>
      <header
        className={`fixed inset-x-0 z-50 transition-all duration-300 ${
          showBanner ? 'top-9' : 'top-0'
        } ${
          scrolled
            ? 'border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-zest flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {/* Services dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                onMouseEnter={() => setDropdownOpen(true)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 text-sm transition hover:text-[var(--color-fg)] ${
                  isActive('/services') ? 'text-[var(--color-fg)]' : 'text-ink-muted'
                }`}
              >
                Services
                <ChevronDown
                  size={14}
                  className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                onMouseLeave={() => setDropdownOpen(false)}
                className={`absolute left-1/2 top-full w-80 -translate-x-1/2 pt-4 transition ${
                  dropdownOpen
                    ? 'pointer-events-auto opacity-100'
                    : 'pointer-events-none opacity-0'
                }`}
                role="menu"
              >
                <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-2 shadow-2xl shadow-black/5">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}/`}
                      role="menuitem"
                      className="block rounded-xl p-3 transition hover:bg-[var(--color-bg-alt)]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{s.navTitle}</span>
                        <span className="text-xs text-ink-muted">→</span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-muted">{s.navDesc}</p>
                    </Link>
                  ))}
                  <div className="mt-1 border-t border-[var(--color-border)] pt-1">
                    <Link
                      href="/services/"
                      role="menuitem"
                      className="flex items-center justify-between rounded-xl p-3 transition hover:bg-[var(--color-bg-alt)]"
                    >
                      <span className="text-sm font-medium text-ink-muted">View all services</span>
                      <span className="text-xs text-zest-400">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/case-studies/"
              className={`text-sm transition hover:text-[var(--color-fg)] ${
                isActive('/case-studies') ? 'text-[var(--color-fg)]' : 'text-ink-muted'
              }`}
            >
              Case studies
            </Link>
            <Link
              href="/about/"
              className={`text-sm transition hover:text-[var(--color-fg)] ${
                isActive('/about') ? 'text-[var(--color-fg)]' : 'text-ink-muted'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact/"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-accent-fg)] shadow-[0_6px_18px_rgba(255,90,44,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Book a call
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs font-medium md:hidden"
          >
            <Menu size={14} /> Menu
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}