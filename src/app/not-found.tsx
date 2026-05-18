import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-50 opacity-60" />
      <div className="relative text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-ink-muted">Error 404</p>
        <h1 className="mt-4 text-6xl font-semibold tracking-tight md:text-8xl">
          Page not found.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-ink-muted dark:text-neutral-400">
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