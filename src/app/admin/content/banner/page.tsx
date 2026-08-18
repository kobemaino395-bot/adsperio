import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { readBanner } from '@/server/content/banner';
import ContentTabs from '../ContentTabs';
import { Notice } from '@/components/admin/ui';

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
        <h1 className="display-3">Content</h1>
        <p className="text-ink-mute mt-2 text-sm">Banner, careers positions, and downloadable files.</p>
      </header>
      <ContentTabs active="banner" />

      {ok && (
        <Notice tone="ok" label="Saved">
          Banner saved.
        </Notice>
      )}
      {error && (
        <Notice tone="error" label="Error">
          {esc(decodeURIComponent(error))}
        </Notice>
      )}

      <section className="card">
        <header className="border-hairline border-b px-6 py-4">
          <h2 className="eyebrow text-ink">Hiring banner</h2>
          <p className="text-ink-mute mt-2 text-xs">
            Shown at the top of every public page. Auto-hides on the page the CTA links to.
            Visitors can dismiss it locally (remembered in localStorage).
          </p>
        </header>
        <form method="POST" action="/admin/content/banner/save" className="space-y-6 px-6 py-5">
          <input type="hidden" name="_csrf" value={session.csrf} />

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={cfg.enabled}
              className="accent-ink mt-0.5 h-4 w-4"
            />
            <span>
              <span className="font-medium">Enabled</span>
              <span className="text-ink-mute mt-0.5 block text-xs">
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

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-solid">
              Save banner
            </button>
            <span className="caption">Changes apply on next page load.</span>
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
      <span className="field-label">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={'field ' + (mono ? 'font-mono text-sm' : '')}
      />
    </label>
  );
}
