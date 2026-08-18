import Reveal from '@/components/ui/Reveal';
import GradientMesh from '@/components/mesh/GradientMesh';

/**
 * Every marketing page opens the same way: mesh band, eyebrow, thin display
 * headline, lede. The spec is explicit that a bare-canvas hero reads as
 * off-brand, so the mesh is baked in here rather than left to each page to
 * remember.
 */
export default function PageHero({
  eyebrow,
  title,
  lede,
  titleMax = 'max-w-[16ch]',
  meshHeight,
  children,
  aside,
}: {
  /** Usually a short label; detail pages pass a breadcrumb instead. */
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Measure for the headline — shorter titles want a tighter one. */
  titleMax?: string;
  meshHeight?: string;
  /** Buttons or metadata under the lede. */
  children?: React.ReactNode;
  /** Optional right-hand column, usually a product panel. */
  aside?: React.ReactNode;
}) {
  const head = (
    <>
      <Reveal>
        <div className="eyebrow">{eyebrow}</div>
      </Reveal>
      <Reveal delay={80}>
        <h1 className={`display-1 mt-5 ${titleMax}`}>{title}</h1>
      </Reveal>
      {lede && (
        <Reveal delay={150}>
          <p className="lede mt-6 max-w-[56ch]">{lede}</p>
        </Reveal>
      )}
      {children && (
        <Reveal delay={220}>
          <div className="mt-8">{children}</div>
        </Reveal>
      )}
    </>
  );

  return (
    <section className="mesh-host overflow-hidden pt-16">
      <GradientMesh height={meshHeight ?? (aside ? 'h-[34rem] md:h-[38rem]' : 'h-[24rem] md:h-[28rem]')} />
      {aside ? (
        <div className="wrap grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">{head}</div>
          <Reveal delay={180} className="lg:col-span-6">
            {aside}
          </Reveal>
        </div>
      ) : (
        <div className="wrap py-16 md:py-24">{head}</div>
      )}
    </section>
  );
}
