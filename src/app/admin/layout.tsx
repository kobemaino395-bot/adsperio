import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { site } from '@/content/site';
import { ACTION_BTN } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Admin · ${site.name}`,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/applications', label: 'Applications' },
  { href: '/admin/content', label: 'Content' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-adn-pathname') ?? '';
  const session = await readSessionFromCookies();
  const isLogin = pathname === '/admin/login' || pathname === '/admin/login/';
  const showNav = !!session && !isLogin;

  return (
    <div className="bg-canvas text-ink min-h-screen">
      {showNav && (
        <header className="border-hairline bg-canvas sticky top-0 z-40 border-b">
          <div className="wrap flex h-16 items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <a
                href="/admin/dashboard"
                className="text-[0.9375rem] font-semibold tracking-[-0.015em]"
              >
                {site.name}
                <span className="text-ink-mute"> / Admin</span>
              </a>
              <nav className="flex gap-6" aria-label="Admin">
                {NAV.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className={`text-[0.875rem] transition-colors ${
                      pathname.startsWith(l.href) ? 'text-indigo-text font-medium' : 'text-ink-mute hover:text-ink'
                    }`}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>
            <form method="POST" action="/admin/logout">
              <input type="hidden" name="_csrf" value={session.csrf} />
              <button type="submit" className={ACTION_BTN}>
                Sign out · {session.username}
              </button>
            </form>
          </div>
        </header>
      )}
      <main className="wrap py-10">{children}</main>
    </div>
  );
}
