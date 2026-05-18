import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { listPositions } from '@/server/content/positions';
import ContentTabs from '../ContentTabs';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ ok?: string; error?: string; created?: string; deleted?: string; copied?: string; toggled?: string }>;

export default async function PositionsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/content/positions' });

  const { ok, error, created, deleted, copied, toggled } = await searchParams;
  const positions = await listPositions();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
        <p className="mt-1 text-sm text-zinc-500">Banner, careers positions, and downloadable files.</p>
      </header>
      <ContentTabs active="positions" />

      {ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Saved.</div>
      )}
      {created && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Position &ldquo;{esc(created)}&rdquo; created. <Link href={`/admin/content/positions/${esc(created)}`} className="underline">Edit it now →</Link>
        </div>
      )}
      {copied && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Copied to &ldquo;{esc(copied)}&rdquo; (starts hidden). <Link href={`/admin/content/positions/${esc(copied)}`} className="underline">Edit it →</Link>
        </div>
      )}
      {deleted && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Position &ldquo;{esc(deleted)}&rdquo; deleted.
        </div>
      )}
      {toggled && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Visibility toggled for &ldquo;{esc(toggled)}&rdquo;.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {esc(decodeURIComponent(error))}
        </div>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Open positions</h2>
            <p className="mt-1 text-xs text-zinc-500">{positions.length} total · click a row to edit.</p>
          </div>
          <Link
            href="/admin/content/positions/new"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
          >
            + Add position
          </Link>
        </header>

        {positions.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-500">No positions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-2">Title</th>
                <th className="px-5 py-2">Slug</th>
                <th className="px-5 py-2">Status</th>
                <th className="px-5 py-2">Updated</th>
                <th className="px-5 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.slug} className="border-t border-zinc-100 align-top">
                  <td className="px-5 py-3">
                    <div className="font-medium">
                      {esc(p.title)}
                      {p.subtitle && <span className="ml-1 italic text-zinc-500">{esc(p.subtitle)}</span>}
                    </div>
                    {p.tagline && (
                      <div className="mt-0.5 max-w-xl truncate text-xs text-zinc-500" title={p.tagline}>
                        {esc(p.tagline)}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-zinc-600">{esc(p.slug)}</td>
                  <td className="px-5 py-3">
                    {p.hidden ? (
                      <span className="inline-block rounded-full bg-zinc-100 px-2 py-px text-xs text-zinc-600">Hidden</span>
                    ) : (
                      <span className="inline-block rounded-full bg-green-100 px-2 py-px text-xs text-green-700">Visible</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-zinc-500">
                    {new Date(p.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/content/positions/${p.slug}`}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50"
                      >
                        Edit
                      </Link>
                      <form method="POST" action={`/admin/content/positions/${p.slug}/toggle-hidden`}>
                        <input type="hidden" name="_csrf" value={session.csrf} />
                        <button
                          type="submit"
                          className="rounded border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50"
                        >
                          {p.hidden ? 'Show' : 'Hide'}
                        </button>
                      </form>
                      <form method="POST" action={`/admin/content/positions/${p.slug}/copy`}>
                        <input type="hidden" name="_csrf" value={session.csrf} />
                        <button
                          type="submit"
                          className="rounded border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50"
                        >
                          Copy
                        </button>
                      </form>
                      <form method="POST" action={`/admin/content/positions/${p.slug}/delete`}>
                        <input type="hidden" name="_csrf" value={session.csrf} />
                        <button
                          type="submit"
                          className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
