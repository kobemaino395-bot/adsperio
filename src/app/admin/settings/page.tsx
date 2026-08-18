import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getAppSettings, RESERVED_ROUTE_SLUGS } from '@/server/app-settings';
import { listSlots } from '@/server/slot-registry';
import { Notice } from '@/components/admin/ui';

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
      <header className="border-hairline border-b pb-5">
        <h1 className="display-3">Settings</h1>
        <p className="text-ink-mute mt-2 text-sm">Site-wide configuration.</p>
      </header>

      {updated && (
        <Notice tone="ok" label="Updated">
          Download route is now <span className="text-ink font-mono">/{esc(updated)}/</span>. Links using the previous
          route now return 404.
        </Notice>
      )}
      {error && (
        <Notice tone="error" label="Error">
          {esc(decodeURIComponent(error))}
        </Notice>
      )}

      <section className="card">
        <header className="border-hairline border-b px-6 py-4">
          <h2 className="eyebrow text-ink">Download route</h2>
          <p className="text-ink-mute mt-2 text-xs">
            The first path segment of every public download URL. Changing it retires every URL built on the old segment
            immediately — they start returning 404.
          </p>
        </header>

        <form method="POST" action="/admin/settings/update" className="space-y-5 px-6 py-5">
          <input type="hidden" name="_csrf" value={session.csrf} />

          <label className="block">
            <span className="field-label">Route segment</span>
            <span className="text-ink-mute flex items-center gap-1 font-mono text-sm">
              <span>/</span>
              <input
                type="text"
                name="downloadRouteSlug"
                required
                pattern="[a-z][a-z0-9-]{0,31}"
                defaultValue={settings.downloadRouteSlug}
                className="field text-ink w-48 font-mono text-sm"
              />
              <span>/&lt;file-slug&gt;</span>
            </span>
            <p className="text-ink-mute mt-1.5 text-xs">
              1–32 chars: lowercase letters, digits or hyphens, starting with a letter. Reserved (existing pages):{' '}
              <span className="text-ink-2 font-mono">{RESERVED_ROUTE_SLUGS.join(', ')}</span>.
            </p>
          </label>

          <Notice tone="warn" label="Careful">
            Anyone holding a link on the current route loses access the moment you save. Only change this when you
            intend to rotate the download URLs.
          </Notice>

          <button type="submit" className="btn btn-solid">
            Save download route
          </button>
        </form>
      </section>

      <section className="card">
        <header className="border-hairline border-b px-6 py-4">
          <h2 className="eyebrow text-ink">Current public URLs</h2>
          <p className="text-ink-mute mt-2 text-xs tabular-nums">
            {slots.length} file entr{slots.length === 1 ? 'y' : 'ies'} served from this route.
          </p>
        </header>
        {slots.length === 0 ? (
          <p className="text-ink-mute px-6 py-6 text-sm">
            No file entries yet. Example:{' '}
            <span className="text-ink-2 font-mono text-xs">
              {esc(`${origin}/${settings.downloadRouteSlug}/${sampleSlug}`)}
            </span>
          </p>
        ) : (
          <ul className="divide-hairline divide-y">
            {slots.map((s) => (
              <li key={s.slug} className="flex flex-wrap items-baseline justify-between gap-2 px-6 py-3">
                <span className="text-ink-2 text-sm">{esc(s.title)}</span>
                <span className="text-ink-mute break-all font-mono text-xs">
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
