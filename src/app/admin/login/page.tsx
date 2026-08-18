import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { esc } from '@/server/admin/security';
import { site } from '@/content/site';
import { Notice } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (session) redirect('/admin/dashboard');

  const { error } = await searchParams;
  const h = await headers();
  const csrf = h.get('x-adn-pcsrf') ?? '';

  return (
    <div className="card mx-auto mt-12 max-w-sm p-8">
      <span className="eyebrow">{site.name} · Admin</span>
      <h1 className="display-3 mt-3">Sign in</h1>
      <p className="text-ink-mute mt-2 text-sm">Restricted area. Activity is logged.</p>

      {error && (
        <div className="mt-5">
          <Notice tone="error" label="Denied">
            {esc(
              error === 'ratelimit'
                ? 'Too many attempts. Try again in 15 minutes.'
                : 'Invalid credentials.',
            )}
          </Notice>
        </div>
      )}

      <form method="POST" action="/admin/login/submit" className="mt-7 space-y-5">
        <input type="hidden" name="_csrf" value={csrf} />
        <div>
          <label className="field-label">Username</label>
          <input type="text" name="username" required autoComplete="username" className="field" />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="field"
          />
        </div>
        <button type="submit" className="btn btn-solid w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}
