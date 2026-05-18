import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ContentIndex() {
  redirect('/admin/content/banner');
}
