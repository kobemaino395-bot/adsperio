import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { DEFAULT_MAX_BYTES, listSlots } from '@/server/slot-registry';
import { readSlotStatus } from '@/server/files';
import { readSlotStats } from '@/server/slot-stats';
import ContentTabs from '../ContentTabs';
import FileTypeToggle from './FileTypeToggle';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ ok?: string; error?: string; created?: string; deleted?: string }>;

export default async function FilesListPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/content/files' });

  const { ok, error, created, deleted } = await searchParams;
  const slots = await listSlots();
  const [statuses, stats] = await Promise.all([
    Promise.all(slots.map((s) => readSlotStatus(s.slug))),
    Promise.all(slots.map((s) => readSlotStats(s.slug))),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
        <p className="mt-1 text-sm text-zinc-500">Banner, careers positions, and downloadable files.</p>
      </header>
      <ContentTabs active="files" />

      {ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Saved.</div>
      )}
      {created && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          File entry &ldquo;{esc(created)}&rdquo; created. <Link href={`/admin/content/files/${esc(created)}`} className="underline">Upload a file →</Link>
        </div>
      )}
      {deleted && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          File entry &ldquo;{esc(deleted)}&rdquo; deleted.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {esc(decodeURIComponent(error))}
        </div>
      )}

      <section className="rounded-lg border border-dashed border-zinc-300 bg-white">
        <header className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Add a new file</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Creates a public URL at <span className="font-mono">/api/downloads/&lt;slug&gt;</span>. Upload the file on the next screen.
          </p>
        </header>
        <form method="POST" action="/admin/files/create" className="grid gap-4 px-6 py-5 md:grid-cols-2">
          <input type="hidden" name="_csrf" value={session.csrf} />
          <FileTypeToggle name="kind" />
          <label className="block">
            <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">URL slug</span>
            <input
              type="text"
              name="slug"
              required
              pattern="^[a-z][a-z0-9-]{1,40}$"
              placeholder="e.g. employee-handbook"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
            />
            <p className="mt-1 text-xs text-zinc-500">URL stays fixed regardless of display name.</p>
          </label>
          <label className="block">
            <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Display name</span>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Employee handbook"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Public filename (saved as)</span>
            <input
              type="text"
              name="publicFilename"
              placeholder="e.g. Adnovara_Handbook.zip"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Create
            </button>
            <span className="ml-3 text-xs text-zinc-500">
              Max upload defaults to {Math.round(DEFAULT_MAX_BYTES / (1024 * 1024))} MB.
            </span>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Files</h2>
          <p className="mt-1 text-xs text-zinc-500">{slots.length} entr{slots.length === 1 ? 'y' : 'ies'}.</p>
        </header>
        {slots.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-500">No files yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-2">Display name</th>
                <th className="px-5 py-2">Slug</th>
                <th className="px-5 py-2">Kind</th>
                <th className="px-5 py-2">Status</th>
                <th className="px-5 py-2">Size</th>
                <th className="px-5 py-2">Modified</th>
                <th className="px-5 py-2">Downloads</th>
                <th className="px-5 py-2 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s, i) => {
                const status = statuses[i]!;
                const st = stats[i]!;
                return (
                  <tr key={s.slug} className="border-t border-zinc-100">
                    <td className="px-5 py-3">
                      <Link href={`/admin/content/files/${s.slug}`} className="font-medium hover:underline">
                        {esc(s.title)}
                      </Link>
                      {s.isBuiltin && (
                        <span className="ml-2 inline-block rounded-full border border-zinc-300 px-2 py-px font-mono text-[0.55rem] uppercase tracking-[0.18em] text-zinc-500">
                          Built-in
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-600">{esc(s.slug)}</td>
                    <td className="px-5 py-3">
                      {s.kind === 'remote' ? (
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-px text-xs text-blue-700">Remote</span>
                      ) : (
                        <span className="inline-block rounded-full bg-zinc-100 px-2 py-px text-xs text-zinc-700">Local</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {s.kind === 'remote' ? (
                        s.remoteUrl ? (
                          <span className="inline-block rounded-full bg-green-100 px-2 py-px text-xs text-green-700">Configured</span>
                        ) : (
                          <span className="inline-block rounded-full bg-amber-100 px-2 py-px text-xs text-amber-800">No URL</span>
                        )
                      ) : status.hasFile ? (
                        <span className="inline-block rounded-full bg-green-100 px-2 py-px text-xs text-green-700">In place</span>
                      ) : (
                        <span className="inline-block rounded-full bg-amber-100 px-2 py-px text-xs text-amber-800">No file</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-600">
                      {s.kind === 'remote'
                        ? '—'
                        : status.hasFile ? `${(status.size / 1024).toFixed(1)} KB` : '—'}
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-500">
                      {s.kind === 'remote'
                        ? '—'
                        : status.hasFile ? new Date(status.mtimeMs).toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-600">
                      {st.downloads}
                      {st.lastDownloadedAt && (
                        <span className="block text-zinc-400">last {new Date(st.lastDownloadedAt).toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/content/files/${s.slug}`}
                        className="text-xs text-zinc-500 hover:text-zinc-900"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
