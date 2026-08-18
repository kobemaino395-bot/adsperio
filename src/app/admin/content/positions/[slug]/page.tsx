import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getPosition } from '@/server/content/positions';
import PositionForm from '../PositionForm';
import ContentTabs from '../../ContentTabs';
import { Notice } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ ok?: string; error?: string }>;

export default async function EditPositionPage({
  params,
  searchParams,
}: { params: Params; searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const { slug } = await params;
  const position = await getPosition(slug);
  if (!position) notFound();

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: `/admin/content/positions/${slug}` });

  const { ok, error } = await searchParams;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="display-3">Edit position</h1>
          <p className="text-ink-mute mt-2 text-sm">
            Public URL:{' '}
            <Link href={`/careers/${position.slug}/`} className="link-inline font-mono text-xs">
              /careers/{esc(position.slug)}/
            </Link>
          </p>
        </div>
        <Link href="/admin/content/positions" className="eyebrow text-ink hover:text-ink-mute transition-colors">
          ← Back to list
        </Link>
      </header>
      <ContentTabs active="positions" />

      {ok && <Notice tone="ok" label="Saved">Changes saved.</Notice>}
      {error && (
        <Notice tone="error" label="Error">
          {esc(decodeURIComponent(error))}
        </Notice>
      )}

      <PositionForm position={position} isNew={false} csrf={session.csrf} />
    </div>
  );
}
