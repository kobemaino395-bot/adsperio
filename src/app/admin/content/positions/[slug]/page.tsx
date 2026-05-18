import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getPosition } from '@/server/content/positions';
import PositionForm from '../PositionForm';
import ContentTabs from '../../ContentTabs';

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
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit position</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Public URL: <Link href={`/careers/${position.slug}/`} className="font-mono text-zinc-700 underline">/careers/{esc(position.slug)}/</Link>
          </p>
        </div>
        <Link href="/admin/content/positions" className="text-xs text-zinc-500 hover:text-zinc-900">← Back to list</Link>
      </header>
      <ContentTabs active="positions" />

      {ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Saved.</div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {esc(decodeURIComponent(error))}
        </div>
      )}

      <PositionForm position={position} isNew={false} csrf={session.csrf} />
    </div>
  );
}
