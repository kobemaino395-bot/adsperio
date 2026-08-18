import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { DEFAULT_MAX_BYTES, isRemoteKind, listSlots, type SlotKind } from '@/server/slot-registry';
import { readSlotStatus } from '@/server/files';
import { readSlotStats } from '@/server/slot-stats';
import { getDownloadRouteSlug } from '@/server/app-settings';
import { site } from '@/content/site';
import ContentTabs from '../ContentTabs';
import FileTypeToggle from './FileTypeToggle';
import CopyButton from '@/components/admin/CopyButton';
import { Notice, Tag } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ ok?: string; error?: string; created?: string; deleted?: string }>;

export default async function FilesListPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/content/files' });

  const { ok, error, created, deleted } = await searchParams;
  const slots = await listSlots();
  const host = h.get('host') ?? '';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  const origin = `${proto}://${host}`;
  const downloadRouteSlug = await getDownloadRouteSlug();
  const [statuses, stats] = await Promise.all([
    Promise.all(slots.map((s) => readSlotStatus(s.slug))),
    Promise.all(slots.map((s) => readSlotStats(s.slug))),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display-3">Content</h1>
        <p className="text-ink-mute mt-2 text-sm">Banner, careers positions, and downloadable files.</p>
      </header>
      <ContentTabs active="files" />

      {ok && <Notice tone="ok" label="Saved">Changes saved.</Notice>}
      {created && (
        <Notice tone="ok" label="Created">
          File entry &ldquo;{esc(created)}&rdquo; created.{' '}
          <Link href={`/admin/content/files/${esc(created)}`} className="link-inline">
            Upload a file →
          </Link>
        </Notice>
      )}
      {deleted && (
        <Notice tone="warn" label="Deleted">
          File entry &ldquo;{esc(deleted)}&rdquo; deleted.
        </Notice>
      )}
      {error && (
        <Notice tone="error" label="Error">
          {esc(decodeURIComponent(error))}
        </Notice>
      )}

      <section className="card border-dashed">
        <header className="border-hairline border-b border-dashed px-6 py-4">
          <h2 className="eyebrow text-ink">Add a new file</h2>
          <p className="text-ink-mute mt-2 text-xs">
            Creates a public URL at <span className="text-ink font-mono">/{esc(downloadRouteSlug)}/&lt;slug&gt;</span>.
            Upload the file on the next screen.
          </p>
        </header>
        <form method="POST" action="/admin/files/create" className="grid gap-4 px-6 py-5 md:grid-cols-2">
          <input type="hidden" name="_csrf" value={session.csrf} />
          <FileTypeToggle name="kind" />
          <label className="block">
            <span className="field-label">URL slug</span>
            <input
              type="text"
              name="slug"
              required
              pattern="^[a-z][a-z0-9-]{1,40}$"
              placeholder="e.g. employee-handbook"
              className="field font-mono text-sm"
            />
            <p className="text-ink-mute mt-1.5 text-xs">URL stays fixed regardless of display name.</p>
          </label>
          <label className="block">
            <span className="field-label">Display name</span>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Employee handbook"
              className="field"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Public filename (saved as)</span>
            <input
              type="text"
              name="publicFilename"
              placeholder={`e.g. ${site.name}_Handbook.zip`}
              className="field font-mono text-sm"
            />
          </label>
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <button type="submit" className="btn btn-solid">
              Create
            </button>
            <span className="caption">
              Max upload defaults to {Math.round(DEFAULT_MAX_BYTES / (1024 * 1024))} MB.
            </span>
          </div>
        </form>
      </section>

      <section className="card">
        <header className="border-hairline border-b px-6 py-4">
          <h2 className="eyebrow text-ink">Files</h2>
          <p className="text-ink-mute mt-2 text-xs tabular-nums">
            {slots.length} entr{slots.length === 1 ? 'y' : 'ies'}.
          </p>
        </header>
        {slots.length === 0 ? (
          <p className="text-ink-mute px-6 py-10 text-center text-sm">No files yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-hairline border-b">
                <th className="eyebrow px-5 py-2.5 text-left">Display name</th>
                <th className="eyebrow px-5 py-2.5 text-left">Slug</th>
                <th className="eyebrow px-5 py-2.5 text-left">Kind</th>
                <th className="eyebrow px-5 py-2.5 text-left">Status</th>
                <th className="eyebrow px-5 py-2.5 text-left">Size</th>
                <th className="eyebrow px-5 py-2.5 text-left">Modified</th>
                <th className="eyebrow min-w-[12rem] px-5 py-2.5 text-left">Downloads</th>
                <th className="px-5 py-2.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-hairline divide-y">
              {slots.map((s, i) => {
                const status = statuses[i]!;
                const st = stats[i]!;
                return (
                  <tr key={s.slug} className="hover:bg-canvas-soft transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/content/files/${s.slug}`} className="font-medium hover:underline">
                        {esc(s.title)}
                      </Link>
                      {s.isBuiltin && (
                        <span className="ml-2 inline-block align-middle">
                          <Tag tone="ghost">Built-in</Tag>
                        </span>
                      )}
                    </td>
                    <td className="text-ink-2 px-5 py-3 font-mono text-xs">{esc(s.slug)}</td>
                    <td className="px-5 py-3">
                      <KindBadge kind={s.kind} />
                    </td>
                    <td className="px-5 py-3">
                      {isRemoteKind(s.kind) ? (
                        s.remoteUrl ? (
                          <Tag tone="solid">Configured</Tag>
                        ) : (
                          <Tag tone="dashed">No URL</Tag>
                        )
                      ) : status.hasFile ? (
                        <Tag tone="solid">In place</Tag>
                      ) : (
                        <Tag tone="dashed">No file</Tag>
                      )}
                    </td>
                    <td className="text-ink-2 whitespace-nowrap px-5 py-3 text-xs tabular-nums">
                      {isRemoteKind(s.kind)
                        ? '—'
                        : status.hasFile ? `${(status.size / 1024).toFixed(1)} KB` : '—'}
                    </td>
                    <td className="text-ink-mute whitespace-nowrap px-5 py-3 text-xs tabular-nums">
                      {isRemoteKind(s.kind)
                        ? '—'
                        : status.hasFile ? new Date(status.mtimeMs).toLocaleString() : '—'}
                    </td>
                    <td className="text-ink-2 px-5 py-3 text-xs tabular-nums">
                      {st.downloads}
                      {st.lastDownloadedAt && (
                        <span className="text-ink-mute block">last {new Date(st.lastDownloadedAt).toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <CopyButton
                          text={`${origin}/${downloadRouteSlug}/${s.slug}`}
                          className="eyebrow text-ink-mute hover:text-ink transition-colors"
                        />
                        <Link
                          href={`/admin/content/files/${s.slug}`}
                          className="eyebrow text-ink hover:text-ink-mute transition-colors"
                        >
                          Open →
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </section>
    </div>
  );
}

const KIND_LABEL: Record<SlotKind, string> = {
  local: 'Local',
  proxy: 'Proxy',
  redirect: 'Redirect',
};

function KindBadge({ kind }: { kind: SlotKind }) {
  return <Tag tone="line">{KIND_LABEL[kind] ?? KIND_LABEL.local}</Tag>;
}
