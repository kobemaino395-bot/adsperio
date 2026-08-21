'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import ApplicationForm, { type RoleOptionLite } from '@/components/ApplicationForm';

export type ApplyPanelProps = {
  positionSlug: string;
  positionTitle: string;
  applySubtitle: string;
  applyBlurb: string;
  roleOptions: RoleOptionLite[];
  testFileName: string;
  testDescription: string;
  downloadTitle: string;
  downloadBlurb: string;
  showDownload: boolean;
  processHeading: string;
  processSteps: string[];
  processStepsNoDownload: string[];
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

function salaryBand(min: number, max: number): string {
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
  if (min > 0 && max > 0) return `${fmt(min)}–${fmt(max)}`;
  if (min > 0) return `${fmt(min)}+`;
  if (max > 0) return `up to ${fmt(max)}`;
  return '';
}

export default function ApplyPanel({
  positionSlug,
  positionTitle,
  applySubtitle,
  applyBlurb,
  roleOptions,
  testFileName,
  testDescription,
  downloadTitle,
  downloadBlurb,
  showDownload,
  processHeading,
  processSteps,
  processStepsNoDownload,
}: ApplyPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState('');

  // Honour ?role= so a link from the careers list, an email, or the banner
  // can land here with the right role already chosen. Unknown ids are
  // ignored rather than pre-filling something that isn't offered.
  useEffect(() => {
    const wanted = searchParams.get('role') ?? '';
    if (wanted && roleOptions.some((r) => r.id === wanted)) setSelectedRole(wanted);
    // Only meant to run once on load — later changes come from selectRole itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in step with the picker so the page stays shareable.
  function selectRole(id: string) {
    setSelectedRole(id);
    const next = new URLSearchParams(searchParams.toString());
    if (id) next.set('role', id);
    else next.delete('role');
    router.replace(next.size > 0 ? `${pathname}?${next.toString()}` : pathname, { scroll: false });
  }

  function selectAndScroll(id: string) {
    selectRole(id);
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const downloadUrl = testFileName ? `/careers/${positionSlug}/take-home` : '';
  const hasFile = showDownload && !!downloadUrl;
  const visibleProcessSteps = hasFile ? processSteps : processStepsNoDownload;

  return (
    <>
      <section id="apply" className="border-hairline bg-canvas border-b py-20 md:py-24">
        <div className="wrap">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <div className="card shadow-lift-1 p-7 md:p-10">
                <SectionLabel>{applySubtitle}</SectionLabel>
                <h2 className="display-3 mt-3">Tell us about yourself.</h2>
                {applyBlurb && <p className="text-ink-mute mt-3 max-w-xl leading-relaxed">{applyBlurb}</p>}
                <div className="mt-8">
                  <ApplicationForm
                    roleOptions={roleOptions}
                    selectedRole={selectedRole}
                    onSelectRole={selectRole}
                    positionSlug={positionSlug}
                    showTestUpload={hasFile}
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                {hasFile && (
                  <div className="card bg-canvas-soft p-6">
                    <div className="text-ink text-[0.9375rem] font-medium">{downloadTitle || 'Download'}</div>
                    {(testDescription || downloadBlurb) && (
                      <p className="text-ink-mute mt-2 leading-relaxed">{testDescription || downloadBlurb}</p>
                    )}
                    <a href={downloadUrl} className="btn btn-line mt-5 w-full" download>
                      <span>{downloadTitle || 'Download'}</span>
                      <span aria-hidden>↓</span>
                    </a>
                  </div>
                )}

                {visibleProcessSteps.length > 0 && (
                  <div className="card bg-canvas-soft p-6">
                    <div className="text-ink text-[0.9375rem] font-medium">{processHeading || 'Process'}</div>
                    <ol className="text-ink-mute mt-4 space-y-3 leading-relaxed">
                      {visibleProcessSteps.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-indigo-text shrink-0 text-[0.8125rem] font-medium tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="card p-6">
                  <div className="text-ink text-[0.9375rem] font-medium">Questions?</div>
                  <a
                    href={`mailto:hiring@adsperio.com?subject=${encodeURIComponent(`Question about ${positionTitle} role`)}`}
                    className="link-inline mt-3 inline-block"
                  >
                    hiring@adsperio.com
                  </a>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sits below the form on purpose: the picker in the form is the fast
          path, and these cards are the browse-and-compare view. Choosing one
          scrolls back up with it selected. */}
      {roleOptions.length > 0 && (
        <section id="roles" className="scroll-mt-32 border-hairline border-b py-16 md:py-24">
          <div className="wrap">
            <span className="eyebrow">Open roles · {roleOptions.length}</span>
            <h2 className="display-2 mt-3">The roles, in detail</h2>
            <p className="text-ink-mute mt-4 max-w-2xl leading-relaxed">
              Every role uses the application form above. Pick one here and it&apos;s selected for you.
            </p>
            <ul className="mt-12 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {roleOptions.map((r, i) => {
                const active = r.id === selectedRole;
                const band = salaryBand(r.minSalary, r.maxSalary);
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectAndScroll(r.id)}
                      className={`flex h-full w-full flex-col p-5 text-left transition-colors ${
                        active ? 'card border-2 border-[var(--indigo)]' : 'card hover:border-ink-mute'
                      }`}
                    >
                      <span className="text-ink-mute font-mono text-xs tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-ink mt-4 text-[1.0625rem] font-medium">{r.label}</span>
                      <span className="text-ink-mute mt-2 flex-1 text-[0.9375rem] leading-relaxed">{r.blurb}</span>
                      <span className="border-hairline mt-5 flex items-center justify-between gap-4 border-t pt-3 font-mono text-xs uppercase tracking-wide">
                        <span className="text-ink-mute">{band || 'Comp on request'}</span>
                        <span className={active ? 'text-indigo-text' : 'text-ink-mute'}>
                          {active ? 'Selected' : 'Apply →'}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
