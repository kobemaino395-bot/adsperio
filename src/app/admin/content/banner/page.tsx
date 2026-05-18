import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { readBanner } from '@/server/content/banner';
import ContentTabs from '../ContentTabs';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ ok?: string; error?: string }>;

export default async function BannerPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/content/banner' });

  const { ok, error } = await searchParams;
  const cfg = await readBanner();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
        <p className="mt-1 text-sm text-zinc-500">Banner, careers positions, and downloadable files.</p>
      </header>
      <ContentTabs active="banner" />

      {ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Banner saved.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {esc(decodeURIComponent(error))}
        </div>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Hiring banner</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Shown at the top of every public page. Auto-hides on the page the CTA links to.
            Visitors can dismiss it locally (remembered in localStorage).
          </p>
        </header>
        <form method="POST" action="/admin/content/banner/save" className="space-y-5 px-6 py-5">
          <input type="hidden" name="_csrf" value={session.csrf} />

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={cfg.enabled}
              className="mt-0.5 h-4 w-4"
            />
            <span>
              <span className="font-medium">Enabled</span>
              <span className="mt-0.5 block text-xs text-zinc-500">
                When off, the banner doesn&apos;t render on any public page.
              </span>
            </span>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Badge text"
              name="badge"
              defaultValue={cfg.badge}
              placeholder="e.g. We're hiring"
            />
            <Field
              label="Main message"
              name="message"
              defaultValue={cfg.message}
              placeholder="e.g. Ads Manager"
            />
            <Field
              label="CTA text"
              name="ctaText"
              defaultValue={cfg.ctaText}
              placeholder="e.g. See the role →"
            />
            <Field
              label="CTA URL"
              name="ctaUrl"
              defaultValue={cfg.ctaUrl}
              placeholder="/careers/ads-manager/ or https://…"
              mono
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Save banner
            </button>
            <span className="text-xs text-zinc-500">Changes apply on next page load.</span>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({
  label, name, defaultValue, placeholder, mono,
}: { label: string; name: string; defaultValue?: string; placeholder?: string; mono?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={
          'mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm ' +
          (mono ? 'font-mono' : '')
        }
      />
    </label>
  );
}
