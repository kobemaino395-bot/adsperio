import { redirect } from 'next/navigation';
import { ensurePreAuthCsrf, readSessionFromCookies } from '@/server/admin/auth';
import { esc } from '@/server/admin/security';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (session) redirect('/admin/dashboard');

  const { error } = await searchParams;
  const csrf = await ensurePreAuthCsrf();

  return (
    <div className="mx-auto mt-12 max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-lg font-semibold tracking-tight">Adnovara · Admin sign-in</h1>
      <p className="mt-1 text-sm text-zinc-500">Restricted area. Activity is logged.</p>

      {error && (
        <div
          className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {esc(error === 'ratelimit' ? 'Too many attempts. Try again in 15 minutes.' : 'Invalid credentials.')}
        </div>
      )}

      <form method="POST" action="/admin/login/submit" className="mt-6 space-y-4">
        <input type="hidden" name="_csrf" value={csrf} />
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Username</label>
          <input
            type="text"
            name="username"
            required
            autoComplete="username"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Password</label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
