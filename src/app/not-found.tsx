import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div aria-hidden className="glow absolute inset-x-0 top-0 h-[520px]" />
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      <div className="relative text-center">
        <p className="tnum text-sm font-medium uppercase tracking-widest text-[var(--color-accent-deep)]">Error 404</p>
        <h1 className="mt-4 text-6xl font-light tracking-[-0.04em] md:text-8xl">
          Page not found.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg font-light text-[var(--color-fg-muted)]">
          We couldn&apos;t find that page. It may have moved, or never existed at all.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">Back to home</Link>
          <Link href="/contact/" className="btn-ghost">Contact us</Link>
        </div>
      </div>
    </main>
  );
}