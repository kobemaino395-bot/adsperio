import { redirect } from 'next/navigation';
import { readSessionFromCookies } from '@/server/admin/auth';

export const dynamic = 'force-dynamic';

export default async function AdminIndex() {
  const session = await readSessionFromCookies();
  redirect(session ? '/admin/dashboard' : '/admin/login');
}
