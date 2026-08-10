import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Admin · GrowthVireX',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-adn-pathname') ?? '';
  const session = await readSessionFromCookies();
  const isLogin = pathname === '/admin/login' || pathname === '/admin/login/';
  const showNav = !!session && !isLogin;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {showNav && (
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
              <a href="/admin/dashboard" className="text-sm font-semibold tracking-tight">
                GrowthVireX · Admin
              </a>
              <nav className="flex gap-4 text-sm text-zinc-600">
                <a href="/admin/dashboard" className="hover:text-zinc-900">Dashboard</a>
                <a href="/admin/applications" className="hover:text-zinc-900">Applications</a>
                <a href="/admin/content" className="hover:text-zinc-900">Content</a>
                <a href="/admin/settings" className="hover:text-zinc-900">Settings</a>
              </nav>
            </div>
            <form method="POST" action="/admin/logout">
              <input type="hidden" name="_csrf" value={session.csrf} />
              <button
                type="submit"
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Sign out · {session.username}
              </button>
            </form>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
