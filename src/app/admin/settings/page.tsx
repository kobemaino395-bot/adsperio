import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, readClientIp } from '@/server/admin/security';
import { getAppSettings } from '@/server/app-settings';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/settings' });

  const settings = await getAppSettings();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-5 py-3">
          <h2 className="text-sm font-semibold tracking-tight">Download Route Configuration</h2>
        </header>
        <form method="POST" action="/admin/settings/update" className="p-5">
          <input type="hidden" name="_csrf" value={session.csrf} />

          <div className="space-y-4">
            <label className="block">
              <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">
                Download Route Slug
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-zinc-500">/</span>
                <input
                  type="text"
                  name="downloadRouteSlug"
                  defaultValue={settings.downloadRouteSlug}
                  placeholder="k"
                  pattern="^[a-z][a-z0-9-]{0,10}$"
                  required
                  className="w-32 rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
                />
                <span className="text-sm text-zinc-500">/[slug]</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                The route segment for download links. Currently:{' '}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs">
                  /{settings.downloadRouteSlug}/[slug]
                </code>
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Must be 1-11 characters, lowercase letters/digits/hyphens, starting with a letter.
                Reserved slugs: admin, api, dt, careers, positions, apply
              </p>
            </label>

            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <strong className="font-semibold">Warning:</strong> Changing this will break existing download links
              that use the current route. Make sure to update any external references.
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Save Changes
              </button>
              <a
                href="/admin/dashboard"
                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Cancel
              </a>
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-5 py-3">
          <h2 className="text-sm font-semibold tracking-tight">Current Configuration</h2>
        </header>
        <div className="p-5">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">Download Route</dt>
              <dd className="mt-1 font-mono text-zinc-900">/{settings.downloadRouteSlug}/[slug]</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">Example URL</dt>
              <dd className="mt-1 font-mono text-zinc-900">
                https://example.com/{settings.downloadRouteSlug}/my-file
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
