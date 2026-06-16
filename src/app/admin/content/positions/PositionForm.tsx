import { HERO_TINTS, type Position } from '@/server/content/positions';
import { listSlots, type SlotRecord } from '@/server/slot-registry';

type Props = {
  position: Position;
  isNew: boolean;
  csrf: string;
};

function joinLines(arr: string[]): string {
  return arr.join('\n');
}

export default async function PositionForm({ position, isNew, csrf }: Props) {
  const slots: SlotRecord[] = await listSlots();
  const action = isNew
    ? '/admin/content/positions/create'
    : `/admin/content/positions/${position.slug}/update`;

  const slugLocked = !isNew && !!position.downloadSlotSlug;

  return (
    <form method="POST" action={action} className="space-y-8">
      <input type="hidden" name="_csrf" value={csrf} />
      {slugLocked && <input type="hidden" name="slug" value={position.slug} />}

      <Section title="Identity">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="URL slug"
            name="slug"
            defaultValue={position.slug}
            placeholder="e.g. senior-seo-lead"
            mono
            required
            disabled={slugLocked}
            hint={
              slugLocked
                ? 'Locked because a downloadable file is linked. Detach the file to rename.'
                : 'lowercase, dashes only. Becomes /careers/<slug>/.'
            }
          />
          <Field
            label="Hero tint"
            name="heroTint"
            type="select"
            defaultValue={position.heroTint}
            options={HERO_TINTS.map((t) => ({ value: t, label: t }))}
          />
          <Field label="Title" name="title" defaultValue={position.title} required />
          <Field
            label="Subtitle (italic)"
            name="subtitle"
            defaultValue={position.subtitle}
            placeholder="e.g. (Paid Media)"
          />
          <Field label="Eyebrow" name="eyebrow" defaultValue={position.eyebrow} />
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="hidden"
              defaultChecked={position.hidden}
              className="h-4 w-4"
            />
            <span>
              <span className="font-medium">Hidden</span>
              <span className="ml-2 text-xs text-zinc-500">When checked, no public page and not in /careers list.</span>
            </span>
          </label>
        </div>
        <Field
          label="Tagline (under title)"
          name="tagline"
          type="textarea"
          rows={3}
          defaultValue={position.tagline}
        />
      </Section>

      <Section title="Stat cards (4)">
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr] gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <input
                type="text"
                name={`statKey${i}`}
                defaultValue={position.statCards[i]?.key ?? ''}
                placeholder="Key (e.g. Location)"
                className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs"
              />
              <input
                type="text"
                name={`statValue${i}`}
                defaultValue={position.statCards[i]?.value ?? ''}
                placeholder="Value"
                className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Apply section">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Apply subtitle" name="applySubtitle" defaultValue={position.applySubtitle} />
        </div>
        <Field label="Apply blurb" name="applyBlurb" type="textarea" rows={3} defaultValue={position.applyBlurb} />
      </Section>

      <Section title="Download card (optional)">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="showDownload"
            defaultChecked={position.showDownload}
            className="h-4 w-4"
          />
          <span>
            <span className="font-medium">Show download</span>
            <span className="ml-2 text-xs text-zinc-500">When checked, the download card is visible on the job page.</span>
          </span>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Linked file slot"
            name="downloadSlotSlug"
            type="select"
            defaultValue={position.downloadSlotSlug}
            options={[{ value: '', label: '— none —' }, ...slots.map((s) => ({ value: s.slug, label: `${s.slug} — ${s.title}` }))]}
            hint="Pick a file from /admin/content/files. Renders a download card on the role page."
          />
          <Field label="Download card title" name="downloadTitle" defaultValue={position.downloadTitle} />
        </div>
        <Field label="Download blurb" name="downloadBlurb" type="textarea" rows={3} defaultValue={position.downloadBlurb} />
      </Section>

      <Section title="About the role">
        <Field label="Heading" name="aboutHeading" defaultValue={position.aboutHeading} />
        <Field
          label="Paragraphs (one paragraph per blank line)"
          name="aboutParagraphs"
          type="textarea"
          rows={6}
          defaultValue={position.aboutParagraphs.join('\n\n')}
          hint="Separate paragraphs with a blank line."
        />
      </Section>

      <Section title="Responsibilities">
        <Field label="Heading" name="responsibilitiesHeading" defaultValue={position.responsibilitiesHeading} />
        <Field
          label="Bullets (one per line)"
          name="responsibilities"
          type="textarea"
          rows={8}
          defaultValue={joinLines(position.responsibilities)}
        />
      </Section>

      <Section title="Must-have">
        <Field label="Heading" name="mustHaveHeading" defaultValue={position.mustHaveHeading} />
        <Field
          label="Bullets (one per line)"
          name="mustHave"
          type="textarea"
          rows={6}
          defaultValue={joinLines(position.mustHave)}
        />
      </Section>

      <Section title="Nice-to-have">
        <Field label="Heading" name="niceToHaveHeading" defaultValue={position.niceToHaveHeading} />
        <Field
          label="Bullets (one per line)"
          name="niceToHave"
          type="textarea"
          rows={5}
          defaultValue={joinLines(position.niceToHave)}
        />
      </Section>

      <Section title="Hiring process">
        <Field label="Heading" name="processHeading" defaultValue={position.processHeading} />
        <Field
          label="Numbered steps (one per line)"
          name="processSteps"
          type="textarea"
          rows={6}
          defaultValue={joinLines(position.processSteps)}
        />
        <Field
          label="Steps when download is hidden (one per line)"
          name="processStepsNoDownload"
          type="textarea"
          rows={4}
          defaultValue={joinLines(position.processStepsNoDownload ?? [])}
          hint="Shown instead of the steps above when the download card is off. Leave blank to hide the process panel entirely."
        />
      </Section>

      <Section title="Benefits">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Heading" name="benefitsHeading" defaultValue={position.benefitsHeading} />
          <Field label="Blurb (optional)" name="benefitsBlurb" defaultValue={position.benefitsBlurb} />
        </div>
        <Field
          label="Benefit rows — one per line, format: key | value | sub"
          name="benefitsGrid"
          type="textarea"
          rows={8}
          defaultValue={position.benefits
            .map((b) => [b.key, b.value, b.sub].join(' | '))
            .join('\n')}
          hint="`sub` is optional. Use the pipe (|) character to separate fields."
          mono
        />
      </Section>

      <Section title="Equal opportunity">
        <Field
          label="Statement"
          name="equalOpportunity"
          type="textarea"
          rows={3}
          defaultValue={position.equalOpportunity}
        />
      </Section>

      <Section title="SEO + JobPosting JSON-LD">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="SEO page title" name="seoTitle" defaultValue={position.seoTitle} />
          <Field label="SEO meta description" name="seoDescription" defaultValue={position.seoDescription} />
          <Field label="Date posted (YYYY-MM-DD)" name="datePosted" defaultValue={position.datePosted} mono />
          <Field label="Valid through (YYYY-MM-DD)" name="validThrough" defaultValue={position.validThrough} mono />
          <Field
            label="Salary min (USD/year)"
            name="salaryMin"
            type="number"
            defaultValue={position.salaryMin ? String(position.salaryMin) : ''}
            mono
          />
          <Field
            label="Salary max (USD/year)"
            name="salaryMax"
            type="number"
            defaultValue={position.salaryMax ? String(position.salaryMax) : ''}
            mono
          />
        </div>
        <Field
          label="JobPosting description (Google Jobs)"
          name="jobPostingDescription"
          type="textarea"
          rows={4}
          defaultValue={position.jobPostingDescription}
          hint="If blank, falls back to About paragraphs joined together."
        />
      </Section>

      <div className="flex items-center gap-3 border-t border-zinc-200 pt-6">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {isNew ? 'Create position' : 'Save changes'}
        </button>
        <a href="/admin/content/positions" className="text-xs text-zinc-500 hover:text-zinc-900">
          Cancel
        </a>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
      <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">{title}</legend>
      {children}
    </fieldset>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'select' | 'number';
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  mono?: boolean;
  rows?: number;
  hint?: string;
  options?: { value: string; label: string }[];
};

function Field({
  label, name, type = 'text', defaultValue, placeholder, required, disabled, mono, rows, hint, options,
}: FieldProps) {
  const cls =
    'mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm ' +
    (mono ? 'font-mono ' : '') +
    (disabled ? 'bg-zinc-100 text-zinc-500' : '');
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">{label}</span>
      {type === 'textarea' ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={cls}
        />
      ) : type === 'select' ? (
        <select name={name} defaultValue={defaultValue} disabled={disabled} className={cls}>
          {(options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cls}
        />
      )}
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </label>
  );
}
