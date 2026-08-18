import Link from 'next/link';

type Tab = 'banner' | 'positions' | 'files';

export default function ContentTabs({ active }: { active: Tab }) {
  const tabs: { id: Tab; label: string; href: string }[] = [
    { id: 'banner', label: 'Hiring banner', href: '/admin/content/banner' },
    { id: 'positions', label: 'Positions', href: '/admin/content/positions' },
    { id: 'files', label: 'Files', href: '/admin/content/files' },
  ];
  return (
    <nav className="border-hairline flex gap-7 border-b">
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          className={
            '-mb-px border-b-2 pb-3 text-[0.875rem] font-medium leading-none transition-colors ' +
            (t.id === active
              ? 'border-ink text-ink'
              : 'border-transparent text-ink-mute hover:text-ink')
          }
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
