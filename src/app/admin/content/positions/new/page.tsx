import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import PositionForm from '../PositionForm';
import ContentTabs from '../../ContentTabs';
import { Notice } from '@/components/admin/ui';
import type { Position } from '@/server/content/positions';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ error?: string }>;

const blank: Position = {
  slug: '',
  title: '',
  subtitle: '',
  eyebrow: 'Careers · Open role',
  tagline: '',
  heroTint: 'accent',
  statCards: [
    { key: 'Team', value: '' },
    { key: 'Level', value: '' },
    { key: 'Location', value: 'Remote' },
    { key: 'Type', value: 'Full-time' },
  ],
  applySubtitle: 'Apply for this role',
  applyBlurb: '',
  roleOptions: [],
  testFileName: '',
  testDescription: '',
  downloadTitle: '',
  downloadBlurb: '',
  showDownload: false,
  aboutHeading: 'About the role',
  aboutParagraphs: [],
  responsibilitiesHeading: "What you'll do",
  responsibilities: [],
  mustHaveHeading: "What we're looking for",
  mustHave: [],
  niceToHaveHeading: 'Nice to have',
  niceToHave: [],
  processHeading: 'Process',
  processSteps: [],
  processStepsNoDownload: [],
  benefitsHeading: 'What you get',
  benefitsBlurb: '',
  benefits: [],
  equalOpportunity: '',
  seoTitle: '',
  seoDescription: '',
  jobPostingDescription: '',
  datePosted: new Date().toISOString().slice(0, 10),
  validThrough: '',
  salaryMin: 0,
  salaryMax: 0,
  hidden: true,
  createdAt: '',
  updatedAt: '',
};

export default async function NewPositionPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/content/positions/new' });

  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="display-3">Content</h1>
          <p className="text-ink-mute mt-2 text-sm">Add a new position.</p>
        </div>
        <Link href="/admin/content/positions" className="eyebrow text-ink hover:text-ink-mute transition-colors">
          ← Back to list
        </Link>
      </header>
      <ContentTabs active="positions" />

      {error && (
        <Notice tone="error" label="Error">
          {esc(decodeURIComponent(error))}
        </Notice>
      )}

      <PositionForm position={blank} isNew={true} csrf={session.csrf} />
    </div>
  );
}
