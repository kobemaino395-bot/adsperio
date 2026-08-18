import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { listPositions } from '@/server/content/positions';
import ContentTabs from '../ContentTabs';
import { ACTION_BTN, DANGER_BTN, Notice, Tag } from '@/components/admin/ui';

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
        <h1 className="display-3">Content</h1>
        <p className="text-ink-mute mt-2 text-sm">Banner, careers positions, and downloadable files.</p>
      </header>
      <ContentTabs active="positions" />

      {ok && <Notice tone="ok" label="Saved">Changes saved.</Notice>}
      {created && (
        <Notice tone="ok" label="Created">
          Position &ldquo;{esc(created)}&rdquo; created.{' '}
          <Link href={`/admin/content/positions/${esc(created)}`} className="link-inline">
            Edit it now →
          </Link>
        </Notice>
      )}
      {copied && (
        <Notice tone="ok" label="Copied">
          Copied to &ldquo;{esc(copied)}&rdquo; (starts hidden).{' '}
          <Link href={`/admin/content/positions/${esc(copied)}`} className="link-inline">
            Edit it →
          </Link>
        </Notice>
      )}
      {deleted && (
        <Notice tone="warn" label="Deleted">
          Position &ldquo;{esc(deleted)}&rdquo; deleted.
        </Notice>
      )}
      {toggled && (
        <Notice tone="ok" label="Toggled">
          Visibility toggled for &ldquo;{esc(toggled)}&rdquo;.
        </Notice>
      )}
      {error && (
        <Notice tone="error" label="Error">
          {esc(decodeURIComponent(error))}
        </Notice>
      )}

      <section className="card">
        <header className="border-hairline flex items-center justify-between gap-4 border-b px-6 py-4">
          <div>
            <h2 className="eyebrow text-ink">Open positions</h2>
            <p className="text-ink-mute mt-2 text-xs tabular-nums">
              {positions.length} total · click a row to edit.
            </p>
          </div>
          <Link href="/admin/content/positions/new" className={ACTION_BTN}>
            + Add position
          </Link>
        </header>

        {positions.length === 0 ? (
          <p className="text-ink-mute px-6 py-10 text-center text-sm">No positions yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-hairline border-b">
                <th className="eyebrow px-5 py-2.5 text-left">Title</th>
                <th className="eyebrow px-5 py-2.5 text-left">Slug</th>
                <th className="eyebrow px-5 py-2.5 text-left">Status</th>
                <th className="eyebrow px-5 py-2.5 text-left">Updated</th>
                <th className="eyebrow px-5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-hairline divide-y">
              {positions.map((p) => (
                <tr key={p.slug} className="hover:bg-canvas-soft align-top transition-colors">
                  <td className="max-w-[14rem] px-5 py-3">
                    <div className="truncate font-medium" title={`${p.title}${p.subtitle ? ' ' + p.subtitle : ''}`}>
                      {esc(p.title)}
                      {p.subtitle && <span className="text-ink-mute ml-1 italic">{esc(p.subtitle)}</span>}
                    </div>
                    {p.tagline && (
                      <div className="text-ink-mute mt-0.5 truncate text-xs" title={p.tagline}>
                        {esc(p.tagline)}
                      </div>
                    )}
                  </td>
                  <td className="text-ink-2 px-5 py-3 font-mono text-xs">{esc(p.slug)}</td>
                  <td className="px-5 py-3">
                    {p.hidden ? <Tag tone="dashed">Hidden</Tag> : <Tag tone="solid">Visible</Tag>}
                  </td>
                  <td className="text-ink-mute whitespace-nowrap px-5 py-3 text-xs tabular-nums">
                    {new Date(p.updatedAt).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/admin/content/positions/${p.slug}`} className={ACTION_BTN}>
                        Edit
                      </Link>
                      <form method="POST" action={`/admin/content/positions/${p.slug}/toggle-hidden`}>
                        <input type="hidden" name="_csrf" value={session.csrf} />
                        <button type="submit" className={ACTION_BTN}>
                          {p.hidden ? 'Show' : 'Hide'}
                        </button>
                      </form>
                      <form method="POST" action={`/admin/content/positions/${p.slug}/copy`}>
                        <input type="hidden" name="_csrf" value={session.csrf} />
                        <button type="submit" className={ACTION_BTN}>
                          Copy
                        </button>
                      </form>
                      <form method="POST" action={`/admin/content/positions/${p.slug}/delete`}>
                        <input type="hidden" name="_csrf" value={session.csrf} />
                        <button type="submit" className={DANGER_BTN}>
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>
    </div>
  );
}
