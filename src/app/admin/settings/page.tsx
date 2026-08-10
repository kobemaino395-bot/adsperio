import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getAppSettings, RESERVED_ROUTE_SLUGS } from '@/server/app-settings';
import { listSlots } from '@/server/slot-registry';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ error?: string; updated?: string }>;

export default async function SettingsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/settings' });

  const { error, updated } = await searchParams;
  const [settings, slots] = await Promise.all([getAppSettings(), listSlots()]);

  const host = h.get('host') ?? '';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  const origin = `${proto}://${host}`;
  const sampleSlug = slots[0]?.slug ?? 'take-home';

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Site-wide configuration.</p>
      </header>

      {updated && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Download route is now <span className="font-mono">/{esc(updated)}/</span>. Links using the previous route now
          return 404.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {esc(decodeURIComponent(error))}
        </div>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Download route</h2>
          <p className="mt-1 text-xs text-zinc-500">
            The first path segment of every public download URL. Changing it retires every URL built on the old segment
            immediately — they start returning 404.
          </p>
        </header>

        <form method="POST" action="/admin/settings/update" className="space-y-4 px-6 py-5">
          <input type="hidden" name="_csrf" value={session.csrf} />

          <label className="block">
            <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Route segment</span>
            <span className="mt-1 flex items-center gap-1 font-mono text-sm text-zinc-500">
              <span>/</span>
              <input
                type="text"
                name="downloadRouteSlug"
                required
                pattern="[a-z][a-z0-9-]{0,31}"
                defaultValue={settings.downloadRouteSlug}
                className="w-48 rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono text-zinc-900"
              />
              <span>/&lt;file-slug&gt;</span>
            </span>
            <p className="mt-1 text-xs text-zinc-500">
              1–32 chars: lowercase letters, digits or hyphens, starting with a letter. Reserved (existing pages):{' '}
              <span className="font-mono">{RESERVED_ROUTE_SLUGS.join(', ')}</span>.
            </p>
          </label>

          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            Anyone holding a link on the current route loses access the moment you save. Only change this when you
            intend to rotate the download URLs.
          </div>

          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Save download route
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Current public URLs</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {slots.length} file entr{slots.length === 1 ? 'y' : 'ies'} served from this route.
          </p>
        </header>
        {slots.length === 0 ? (
          <p className="px-6 py-6 text-sm text-zinc-500">
            No file entries yet. Example: <span className="font-mono">{esc(`${origin}/${settings.downloadRouteSlug}/${sampleSlug}`)}</span>
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {slots.map((s) => (
              <li key={s.slug} className="flex flex-wrap items-baseline justify-between gap-2 px-6 py-3">
                <span className="text-sm text-zinc-700">{esc(s.title)}</span>
                <span className="font-mono text-xs text-zinc-500 break-all">
                  {esc(`${origin}/${settings.downloadRouteSlug}/${s.slug}`)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
