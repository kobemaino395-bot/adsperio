'use client';

import { useEffect, useMemo, useState } from 'react';
import { COUNTRIES } from '@/content/countries';

const PER_FILE_MAX = 8 * 1024 * 1024;
const CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const TEST_TYPES = ['application/pdf'];

type FilePayload = { field: 'cv' | 'testAnswer'; filename: string; contentType: string; base64: string };

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export default function ApplicationForm({ showTestUpload = true }: { showTestUpload?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const startedAt = useMemo(() => Date.now(), []);

  useEffect(() => { setStatus('idle'); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const form = e.currentTarget;
    const fd = new FormData(form);

    const honeypot = String(fd.get('website') ?? '');
    if (honeypot.trim() !== '') { setStatus('error'); setErrorMsg('Submission rejected.'); return; }

    try {
      const cvFile = fd.get('cv') as File | null;
      const testFile = fd.get('testAnswer') as File | null;

      if (!cvFile || cvFile.size === 0) {
        throw new Error('Please attach your CV.');
      }
      if (!CV_TYPES.includes(cvFile.type)) {
        throw new Error('CV must be PDF or Word (DOC/DOCX).');
      }
      if (cvFile.size > PER_FILE_MAX) {
        throw new Error('CV exceeds 8 MB.');
      }
      const files: FilePayload[] = [
        { field: 'cv', filename: cvFile.name, contentType: cvFile.type, base64: await fileToBase64(cvFile) },
      ];
      if (showTestUpload) {
        if (!testFile || testFile.size === 0) {
          throw new Error('Please attach your completed Technical Assessment answer.');
        }
        if (!TEST_TYPES.includes(testFile.type)) {
          throw new Error('Test answer must be a PDF.');
        }
        if (testFile.size > PER_FILE_MAX) {
          throw new Error('Test answer exceeds 8 MB.');
        }
        files.push({ field: 'testAnswer', filename: testFile.name, contentType: testFile.type, base64: await fileToBase64(testFile) });
      }

      const payload = {
        startedAt,
        honeypot,
        fullName: String(fd.get('fullName') ?? ''),
        email: String(fd.get('email') ?? ''),
        country: String(fd.get('country') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        portfolioUrl: String(fd.get('portfolioUrl') ?? ''),
        currentCompany: String(fd.get('currentCompany') ?? ''),
        yearsExperience: Number(fd.get('yearsExperience') ?? 0),
        expectedSalary: String(fd.get('expectedSalary') ?? ''),
        noticePeriod: String(fd.get('noticePeriod') ?? ''),
        coverNote: String(fd.get('coverNote') ?? ''),
        consent: fd.get('consent') === 'on',
        files,
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? `Server error (${res.status})`);
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed.');
    }
  }

  if (status === 'success') {
    return (
      <div className="card bg-canvas-soft p-8">
        <h3 className="display-3">Thanks — we&apos;ve received your application.</h3>
        <p className="text-ink-mute mt-3 leading-relaxed">
          We review every submission{showTestUpload ? ' and your Technical Assessment' : ''} carefully. If you&apos;re a fit we&apos;ll be in touch within 5 business days with next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name" name="fullName" required />
        <Field label="Email" name="email" type="email" required />
        <CountryField label="Country" name="country" required />
        <Field label="Phone" name="phone" optional />
        <Field label="Portfolio / LinkedIn URL" name="portfolioUrl" type="url" optional placeholder="https://" />
        <Field label="Current / Most recent company" name="currentCompany" optional />
        <Field label="Years of paid-media experience" name="yearsExperience" type="number" min={0} max={60} step={1} required />
        <Field label="Expected salary (USD/year)" name="expectedSalary" required placeholder="e.g. 90,000" />
        <Field label="Notice period" name="noticePeriod" required placeholder="e.g. 1 weeks" />
      </div>

      <TextArea label="Cover note (max 2000 chars)" name="coverNote" optional maxLength={2000} rows={6} />

      <div className="grid gap-4 md:grid-cols-2">
        <FileField label="CV" name="cv" required accept=".pdf,.doc,.docx" hint="PDF or DOCX · max 8 MB" />
        {showTestUpload && (
          <FileField label="Technical Assessment answer" name="testAnswer" required accept="application/pdf,.pdf" hint="PDF only · max 8 MB" />
        )}
      </div>

      <label className="text-ink-mute flex items-start gap-3 text-[0.875rem] leading-relaxed">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[var(--indigo)]" />
        <span>
          I consent to AdsPerio processing the data in this form for the purpose of recruiting for this role,
          and storing it for up to 12 months. I can request deletion at any time by emailing hiring@adsperio.com.
        </span>
      </label>

      {status === 'error' && (
        <div className="rounded-lg border border-[color-mix(in_oklab,var(--ruby)_45%,transparent)] bg-[color-mix(in_oklab,var(--ruby)_10%,transparent)] px-4 py-3 text-[0.875rem] text-[var(--ruby)]">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn btn-solid disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit application →'}
      </button>
    </form>
  );
}

function LabelRow({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <span className="field-label">
      {label}
      {optional && (
        <>
          {' '}
          <span className="border-hairline text-ink-mute ml-1 inline-block translate-y-[-1px] rounded-full border px-1.5 py-px align-middle text-[0.625rem] font-normal">
            Optional
          </span>
        </>
      )}
    </span>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

function Field({ label, name, type = 'text', required, optional, placeholder, min, max, step }: FieldProps) {
  return (
    <label className="block">
      <LabelRow label={label} optional={optional} />
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="field"
      />
    </label>
  );
}

function TextArea({ label, name, required, optional, minLength, maxLength, rows }: { label: string; name: string; required?: boolean; optional?: boolean; minLength?: number; maxLength?: number; rows?: number; }) {
  return (
    <label className="block">
      <LabelRow label={label} optional={optional} />
      <textarea
        name={name}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        rows={rows}
        className="field"
      />
    </label>
  );
}

function CountryField({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <label className="block">
      <LabelRow label={label} />
      <select
        name={name}
        required={required}
        defaultValue=""
        className="field"
      >
        <option value="" disabled>Select your country…</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </label>
  );
}

function FileField({ label, name, required, optional, accept, hint }: { label: string; name: string; required?: boolean; optional?: boolean; accept?: string; hint?: string }) {
  return (
    <label className="block">
      <LabelRow label={label} optional={optional} />
      {hint && (
        <span className="caption mb-1.5 block">
          {hint}
        </span>
      )}
      <input
        type="file"
        name={name}
        required={required}
        accept={accept}
        className="text-ink-mute block w-full text-[0.875rem] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--indigo)] file:px-4 file:py-2 file:text-[0.8125rem] file:font-medium file:text-white hover:file:bg-[var(--indigo-deep)]"
      />
    </label>
  );
}
