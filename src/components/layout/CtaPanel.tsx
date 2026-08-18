import Reveal from '@/components/ui/Reveal';

/**
 * The closing band: the polarity-flipped navy tier from the spec, with a single
 * indigo field bled into one corner. It is the only place on a page where the
 * mesh appears a second time, and it only gets one stop.
 */
export default function CtaPanel({
  eyebrow = 'Start here',
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body: React.ReactNode;
  /** The buttons. One filled, the rest outline. */
  children: React.ReactNode;
}) {
  return (
    <section className="wrap py-20 md:py-28">
      <Reveal>
        <div className="card-navy relative overflow-hidden px-7 py-14 md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--indigo) 0%, transparent 65%)' }}
          />
          <div className="relative max-w-2xl">
            <span className="eyebrow" style={{ color: 'var(--indigo-subdued)' }}>
              {eyebrow}
            </span>
            <h2 className="display-2 mt-4">{title}</h2>
            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed font-light opacity-75">
              {body}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">{children}</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
