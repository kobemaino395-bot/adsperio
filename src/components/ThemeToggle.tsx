'use client';

/** Toggles the `.dark` class on <html> and persists the choice. Pairs with the
 *  no-flash init script in the root layout.
 *
 *  The glyph is a circle filled on one half rather than a sun/moon — the same
 *  polarity-flip idea the design system uses for its inverted surfaces.
 *
 *  Holds no React state on purpose: the current theme already lives in a class
 *  on <html>, so both the rotation and the accessible name are driven by the
 *  `dark:` variant. Mirroring it into state would mean a setState-in-effect
 *  read of the DOM and a first paint at the wrong rotation. */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  function toggle() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('adsperio-theme', next ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`border-hairline text-ink-2 hover:border-hairline-strong hover:text-ink grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${className}`}
    >
      {/* Only the displayed span contributes to the accessible name. */}
      <span className="sr-only dark:hidden">Switch to dark theme</span>
      <span className="sr-only hidden dark:inline">Switch to light theme</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="transition-transform duration-300 dark:rotate-180"
      >
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 1a7 7 0 0 1 0 14Z" fill="currentColor" />
      </svg>
    </button>
  );
}
