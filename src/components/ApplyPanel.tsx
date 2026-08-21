'use client';

import { useState } from 'react';
import Reveal from '@/components/ui/Reveal';
import ApplicationForm, { type RoleOptionLite } from '@/components/ApplicationForm';

// Mirrors POSITION_FALLBACK_KEY in src/server/content/position-files.ts — kept
// as a literal here since that module is 'server-only' and can't be imported
// from a client component.
const POSITION_FALLBACK_KEY = '_position';

export type ApplyPanelProps = {
  positionSlug: string;
  positionTitle: string;
  applySubtitle: string;
  applyBlurb: string;
  roleOptions: RoleOptionLite[];
  positionTestFileName: string;
  positionTestDescription: string;
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

export default function ApplyPanel({
  positionSlug,
  positionTitle,
  applySubtitle,
  applyBlurb,
  roleOptions,
  positionTestFileName,
  positionTestDescription,
  downloadTitle,
  downloadBlurb,
  showDownload,
  processHeading,
  processSteps,
  processStepsNoDownload,
}: ApplyPanelProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const role = roleOptions.length > 0 ? roleOptions.find((r) => r.id === selectedRole) : undefined;

  const testFileName = role?.testFileName || positionTestFileName;
  const testDescription = (role?.testFileName ? role.testDescription : '') || positionTestDescription;
  const downloadKey = role?.testFileName ? role.id : POSITION_FALLBACK_KEY;
  const downloadUrl = testFileName ? `/careers/${positionSlug}/take-home/${downloadKey}` : '';
  const hasFile = showDownload && !!downloadUrl;
  const visibleProcessSteps = hasFile ? processSteps : processStepsNoDownload;

  return (
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
              onSelectRole={setSelectedRole}
              positionSlug={positionSlug}
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
  );
}
