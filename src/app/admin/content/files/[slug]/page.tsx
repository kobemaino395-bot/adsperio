import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSlot, isRemoteKind } from '@/server/slot-registry';
import { effectivePublicDownload, readSlotStatus } from '@/server/files';
import { readSlotStats } from '@/server/slot-stats';
import { downloadPathFor } from '@/server/app-settings';
import ContentTabs from '../../ContentTabs';
import CopyButton from '@/components/admin/CopyButton';
import SettingsKindFields from '@/components/admin/SettingsKindFields';
import { DANGER_BTN, Notice, Tag } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ ok?: string; error?: string; updated?: string }>;

export default async function FileDetailPage({
  params, searchParams,
}: { params: Params; searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const { slug } = await params;
  const slot = await getSlot(slug);
  if (!slot) notFound();

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: `/admin/content/files/${slug}` });

  const [status, stats] = await Promise.all([readSlotStatus(slug), readSlotStats(slug)]);
  const { ok, error, updated } = await searchParams;
  const effective = effectivePublicDownload(slot, status.meta);

  const host = h.get('host') ?? '';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  const downloadPath = await downloadPathFor(slot.slug);
  const downloadUrl = `${proto}://${host}${downloadPath}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display-3">{esc(slot.title)}</h1>
            {slot.kind === 'proxy' ? (
              <Tag tone="line">Proxy</Tag>
            ) : slot.kind === 'redirect' ? (
              <Tag tone="line">Redirect</Tag>
            ) : (
              <Tag tone="line">Local</Tag>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-ink-2 break-all font-mono text-xs">{downloadUrl}</span>
            <CopyButton
              text={downloadUrl}
              className="border-hairline text-ink-mute hover:border-hairline-strong hover:text-ink rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium transition-colors"
            />
            {slot.isBuiltin && <Tag tone="ghost">Built-in</Tag>}
          </div>
        </div>
        <Link href="/admin/content/files" className="eyebrow text-ink hover:text-ink-mute transition-colors">
          ← Back to files
        </Link>
      </header>
      <ContentTabs active="files" />

      {ok && <Notice tone="ok" label="Saved">File saved.</Notice>}
      {updated && <Notice tone="ok" label="Updated">Settings updated.</Notice>}
      {error && (
        <Notice tone="error" label="Error">
          {esc(decodeURIComponent(error))}
        </Notice>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card p-5">
          <h2 className="eyebrow text-ink">Status</h2>
          <dl className="divide-hairline border-hairline mt-4 divide-y border-t text-sm">
            {isRemoteKind(slot.kind) ? (
              <>
                <Row
                  k="Status"
                  v={
                    slot.remoteUrl
                      ? <Tag tone="solid">Configured</Tag>
                      : <Tag tone="dashed">No {slot.kind === 'redirect' ? 'redirect' : 'remote'} URL set</Tag>
                  }
                />
                {slot.remoteUrl && (
                  <Row
                    k={slot.kind === 'redirect' ? 'Redirect URL' : 'Remote URL'}
                    v={
                      <a href={slot.remoteUrl} target="_blank" rel="noopener noreferrer" className="link-inline break-all font-mono text-xs">
                        {esc(slot.remoteUrl)}
                      </a>
                    }
                  />
                )}
                <Row k="Downloads" v={String(stats.downloads)} />
                <Row
                  k="Last download"
                  v={
                    stats.lastDownloadedAt
                      ? `${new Date(stats.lastDownloadedAt).toLocaleString()}${stats.lastDownloadIp ? ` · ${stats.lastDownloadIp}` : ''}`
                      : '—'
                  }
                />
                {status.hasFile && (
                  <Row
                    k="Local backup"
                    v={<span className="text-ink-mute text-xs">{(status.size / 1024).toFixed(1)} KB still on disk (from before switch)</span>}
                  />
                )}
              </>
            ) : status.hasFile ? (
              <>
                <Row k="Status" v={<Tag tone="solid">In place</Tag>} />
                {status.meta?.originalFilename && (
                  <Row k="Uploaded as" v={<span className="font-mono text-xs">{esc(status.meta.originalFilename)}</span>} />
                )}
                <Row k="Served as" v={<span className="font-mono text-xs">{esc(effective.filename)}</span>} />
                <Row k="Size" v={`${(status.size / 1024).toFixed(1)} KB`} />
                <Row k="Modified" v={new Date(status.mtimeMs).toLocaleString()} />
                {status.meta?.uploadedBy && <Row k="Uploaded by" v={esc(status.meta.uploadedBy)} />}
                {status.meta?.uploadedAt && <Row k="Uploaded at" v={new Date(status.meta.uploadedAt).toLocaleString()} />}
                <Row k="Downloads" v={String(stats.downloads)} />
                <Row
                  k="Last download"
                  v={
                    stats.lastDownloadedAt
                      ? `${new Date(stats.lastDownloadedAt).toLocaleString()}${stats.lastDownloadIp ? ` · ${stats.lastDownloadIp}` : ''}`
                      : '—'
                  }
                />
                {status.backupSize > 0 && (
                  <Row k="Backup" v={`${(status.backupSize / 1024).toFixed(1)} KB`} />
                )}
              </>
            ) : (
              <Row k="Status" v={<Tag tone="dashed">No file uploaded yet</Tag>} />
            )}
          </dl>

          <div className="mt-5 flex flex-wrap gap-5">
            {slot.kind === 'local' && status.hasFile && (
              <a href={`/admin/files/${slot.slug}/file`} className="eyebrow text-ink hover:text-ink-mute transition-colors">
                Download (admin) →
              </a>
            )}
            {(isRemoteKind(slot.kind) ? !!slot.remoteUrl : status.hasFile) && (
              <a href={downloadPath} className="eyebrow text-ink hover:text-ink-mute transition-colors">
                Public link →
              </a>
            )}
          </div>
        </section>

        {isRemoteKind(slot.kind) ? (
          <section className="card p-5">
            <h2 className="eyebrow text-ink">
              {slot.kind === 'redirect' ? 'Edit redirect URL' : 'Edit remote URL'}
            </h2>
            <form method="POST" action={`/admin/files/${slot.slug}/update`} className="mt-4 space-y-4">
              <input type="hidden" name="_csrf" value={session.csrf} />
              <input type="hidden" name="title" value={slot.title} />
              <input type="hidden" name="kind" value={slot.kind} />
              <input
                type="text"
                name="remoteUrl"
                required
                defaultValue={slot.remoteUrl}
                placeholder="https://example.com/path/to/file.zip"
                className="field font-mono text-sm"
              />
              <button type="submit" className="btn btn-solid">
                Save URL
              </button>
              <p className="text-ink-mute text-xs">
                {slot.kind === 'redirect'
                  ? 'Visitors are 302-redirected here with no referrer, so the destination never learns our site sent them.'
                  : `Visitors get bytes streamed from this URL on every request. Hard ${(slot.maxBytes / (1024 * 1024)).toFixed(0)} MB cap per download.`}
              </p>
            </form>
          </section>
        ) : (
          <section className="card p-5">
            <h2 className="eyebrow text-ink">
              {status.hasFile ? 'Replace file' : 'Upload file'}
            </h2>
            <form
              method="POST"
              action={`/admin/files/${slot.slug}/replace`}
              encType="multipart/form-data"
              className="mt-4 space-y-4"
            >
              <input type="hidden" name="_csrf" value={session.csrf} />
              <input
                type="file"
                name="file"
                required
                className="text-ink-mute block w-full text-[0.875rem] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--indigo)] file:px-4 file:py-2 file:text-[0.8125rem] file:font-medium file:text-white hover:file:bg-[var(--indigo-deep)]"
              />
              <button type="submit" className="btn btn-solid">
                {status.hasFile ? 'Upload & replace' : 'Upload'}
              </button>
              <p className="text-ink-mute text-xs">
                Max {(slot.maxBytes / (1024 * 1024)).toFixed(0)} MB.
                {/zip/i.test(slot.publicMimeType) || /\.zip$/i.test(slot.publicFilename)
                  ? ' ZIP magic-bytes are enforced.'
                  : ''}
              </p>
            </form>
          </section>
        )}
      </div>

      <section className="card p-5">
        <h2 className="eyebrow text-ink">Settings</h2>
        <p className="text-ink-mute mt-2 text-xs">
          Rename the display name without touching the URL. The slug
          (<span className="text-ink font-mono">{esc(downloadPath)}</span>) is immutable.
        </p>
        <form method="POST" action={`/admin/files/${slot.slug}/update`} className="mt-5 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="_csrf" value={session.csrf} />
          <label className="block">
            <span className="field-label">Display name</span>
            <input
              type="text"
              name="title"
              required
              defaultValue={slot.title}
              className="field"
            />
          </label>
          <SettingsKindFields initialKind={slot.kind} initialRemoteUrl={slot.remoteUrl} />
          <label className="block md:col-span-2">
            <span className="field-label">Public filename (saved as)</span>
            <input
              type="text"
              name="publicFilename"
              defaultValue={slot.publicFilename}
              className="field font-mono text-sm"
            />
            <p className="text-ink-mute mt-1.5 text-xs">Blank = use the file as uploaded (local) or the upstream filename (remote).</p>
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-solid">
              Save settings
            </button>
          </div>
        </form>
      </section>

      {!slot.isBuiltin && (
        <section className="border-hairline border border-l-2 border-l-red-600 p-5">
          <h2 className="eyebrow text-red-700 dark:text-red-400">Danger zone</h2>
          <p className="text-ink-2 mt-2 text-xs">
            Removes this entry and the file on disk. Public URL will return 404.
          </p>
          <form method="POST" action={`/admin/files/${slot.slug}/delete`} className="mt-4">
            <input type="hidden" name="_csrf" value={session.csrf} />
            <button type="submit" className={DANGER_BTN}>
              Delete file entry
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] gap-3 py-2">
      <dt className="eyebrow pt-1">{k}</dt>
      <dd className="text-ink-2 text-sm tabular-nums">{v}</dd>
    </div>
  );
}
