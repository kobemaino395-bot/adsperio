import Link from 'next/link';

type Tab = 'banner' | 'positions' | 'files';

export default function ContentTabs({ active }: { active: Tab }) {
  const tabs: { id: Tab; label: string; href: string }[] = [
    { id: 'banner', label: 'Hiring banner', href: '/admin/content/banner' },
    { id: 'positions', label: 'Positions', href: '/admin/content/positions' },
    { id: 'files', label: 'Files', href: '/admin/content/files' },
  ];
  return (
    <nav className="flex gap-1 border-b border-zinc-200">
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          className={
            'border-b-2 px-4 py-2 text-sm font-medium transition ' +
            (t.id === active
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-900')
          }
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
