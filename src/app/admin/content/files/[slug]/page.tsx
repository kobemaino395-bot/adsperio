import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSlot } from '@/server/slot-registry';
import { effectivePublicDownload, readSlotStatus } from '@/server/files';
import { readSlotStats } from '@/server/slot-stats';
import ContentTabs from '../../ContentTabs';

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

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{esc(slot.title)}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Public URL: <span className="font-mono">/api/downloads/{esc(slot.slug)}</span>
            {slot.isBuiltin && (
              <span className="ml-2 rounded-full border border-zinc-300 px-2 py-px font-mono text-[0.55rem] uppercase tracking-[0.18em] text-zinc-500">
                Built-in
              </span>
            )}
          </p>
        </div>
        <Link href="/admin/content/files" className="text-xs text-zinc-500 hover:text-zinc-900">← Back to files</Link>
      </header>
      <ContentTabs active="files" />

      {ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">File saved.</div>
      )}
      {updated && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Settings updated.</div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {esc(decodeURIComponent(error))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold tracking-tight">Status</h2>
          <dl className="mt-3 space-y-1 text-sm">
            {status.hasFile ? (
              <>
                <Row k="Status" v={<span className="text-green-700">In place</span>} />
                {status.meta?.originalFilename && (
                  <Row k="Uploaded as" v={<span className="font-mono">{esc(status.meta.originalFilename)}</span>} />
                )}
                <Row k="Served as" v={<span className="font-mono">{esc(effective.filename)}</span>} />
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
              <Row k="Status" v={<span className="text-amber-700">No file uploaded yet</span>} />
            )}
          </dl>

          {status.hasFile && (
            <div className="mt-4 space-x-4 text-sm">
              <a href={`/admin/files/${slot.slug}/file`} className="text-blue-600 hover:underline">
                Download (admin) →
              </a>
              <a href={`/api/downloads/${slot.slug}`} className="text-blue-600 hover:underline">
                Public link →
              </a>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold tracking-tight">
            {status.hasFile ? 'Replace file' : 'Upload file'}
          </h2>
          <form
            method="POST"
            action={`/admin/files/${slot.slug}/replace`}
            encType="multipart/form-data"
            className="mt-3 space-y-3"
          >
            <input type="hidden" name="_csrf" value={session.csrf} />
            <input
              type="file"
              name="file"
              required
              className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white"
            />
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              {status.hasFile ? 'Upload & replace' : 'Upload'}
            </button>
            <p className="text-xs text-zinc-500">
              Max {(slot.maxBytes / (1024 * 1024)).toFixed(0)} MB.
              {/zip/i.test(slot.publicMimeType) || /\.zip$/i.test(slot.publicFilename)
                ? ' ZIP magic-bytes are enforced.'
                : ''}
            </p>
          </form>
        </section>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold tracking-tight">Settings</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Rename the display name without touching the URL. The slug
          (<span className="font-mono">/api/downloads/{esc(slot.slug)}</span>) is immutable.
        </p>
        <form method="POST" action={`/admin/files/${slot.slug}/update`} className="mt-4 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="_csrf" value={session.csrf} />
          <label className="block">
            <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Display name</span>
            <input
              type="text"
              name="title"
              required
              defaultValue={slot.title}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Public filename (saved as)</span>
            <input
              type="text"
              name="publicFilename"
              defaultValue={slot.publicFilename}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
            />
            <p className="mt-1 text-xs text-zinc-500">Blank = use the file as uploaded. Extension always follows the upload.</p>
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Save settings
            </button>
          </div>
        </form>
      </section>

      {!slot.isBuiltin && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-5">
          <h2 className="text-sm font-semibold tracking-tight text-red-800">Danger zone</h2>
          <p className="mt-1 text-xs text-red-700">
            Removes this entry and the file on disk. Public URL will return 404.
          </p>
          <form method="POST" action={`/admin/files/${slot.slug}/delete`} className="mt-3">
            <input type="hidden" name="_csrf" value={session.csrf} />
            <button
              type="submit"
              className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
            >
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
    <div className="grid grid-cols-[10rem_1fr] gap-3">
      <dt className="text-xs uppercase tracking-wider text-zinc-500">{k}</dt>
      <dd className="text-sm text-zinc-800">{v}</dd>
    </div>
  );
}
