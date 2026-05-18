'use client';

import { useEffect, useMemo, useState } from 'react';
import { COUNTRIES } from '@/content/countries';

const PER_FILE_MAX = 8 * 1024 * 1024;
const CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const TEST_TYPES = [
  ...CV_TYPES,
  'application/zip',
  'application/x-zip-compressed',
];

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

export default function ApplicationForm() {
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
      if (!testFile || testFile.size === 0) {
        throw new Error('Please attach your completed Technical Assessment answer.');
      }
      if (!TEST_TYPES.includes(testFile.type)) {
        throw new Error('Test answer must be PDF, Word, or ZIP.');
      }
      if (testFile.size > PER_FILE_MAX) {
        throw new Error('Test answer exceeds 8 MB.');
      }
      const files: FilePayload[] = [
        { field: 'cv', filename: cvFile.name, contentType: cvFile.type, base64: await fileToBase64(cvFile) },
        { field: 'testAnswer', filename: testFile.name, contentType: testFile.type, base64: await fileToBase64(testFile) },
      ];

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
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8">
        <h3 className="font-serif text-2xl font-medium tracking-tight">Thanks — we&apos;ve received your application.</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          We review every submission and your Technical Assessment carefully. If you&apos;re a fit we&apos;ll be in touch within 5 business days with next steps.
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
        <FileField label="Technical Assessment answer" name="testAnswer" required accept=".pdf,.doc,.docx,.zip" hint="PDF, DOCX, or ZIP · max 8 MB" />
      </div>

      <label className="flex items-start gap-3 text-sm text-ink-muted">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[var(--color-accent)]" />
        <span>
          I consent to Adnovara processing the data in this form for the purpose of recruiting for this role,
          and storing it for up to 12 months. I can request deletion at any time by emailing hiring@adnovara.com.
        </span>
      </label>

      {status === 'error' && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-3 bg-[var(--color-ink-warm)] px-8 py-4 text-sm font-medium text-[var(--color-bg)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ boxShadow: 'var(--shadow-brutal)' }}
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit application →'}
      </button>
    </form>
  );
}

function LabelRow({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <span className="block font-mono text-[0.65rem] uppercase leading-snug tracking-[0.2em] text-ink-muted">
      {label}
      {optional && (
        <>
          {' '}
          <span className="ml-1 inline-block translate-y-[-1px] rounded-full border border-[var(--color-border)] px-1.5 py-px align-middle text-[0.55rem] tracking-[0.15em] text-ink-muted/80">
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
        className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] focus:border-[var(--color-accent)] focus:outline-none"
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
        className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] focus:border-[var(--color-accent)] focus:outline-none"
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
        className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] focus:border-[var(--color-accent)] focus:outline-none"
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
        <span className="mt-1 block font-mono text-[0.55rem] uppercase tracking-[0.2em] text-ink-muted/70">
          {hint}
        </span>
      )}
      <input
        type="file"
        name={name}
        required={required}
        accept={accept}
        className="mt-2 block w-full text-sm text-ink-muted file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-ink-warm)] file:px-3 file:py-2 file:text-xs file:font-medium file:text-[var(--color-bg)]"
      />
    </label>
  );
}
