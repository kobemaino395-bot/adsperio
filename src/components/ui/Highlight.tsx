import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  color?: 'accent' | 'ink' | 'white';
  height?: 'sm' | 'md' | 'lg';   // how much of the text the bar covers
};

export default function Highlight({
  children,
  color = 'accent',
  height = 'md',
}: Props) {
  const bgMap = {
    accent: 'bg-[var(--color-accent)]',
    ink:    'bg-[var(--color-ink-warm)]',
    white:  'bg-[var(--color-bg)]',
  };

  const heightMap = {
    sm: 'h-[0.25em]',
    md: 'h-[0.35em]',
    lg: 'h-[0.5em]',
  };

  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className={`absolute bottom-[0.05em] left-0 right-0 -z-0 ${heightMap[height]} ${bgMap[color]}`}
      />
    </span>
  );
}