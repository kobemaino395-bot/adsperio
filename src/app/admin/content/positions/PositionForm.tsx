import { HERO_TINTS, type Position } from '@/server/content/positions';

type Props = {
  position: Position;
  isNew: boolean;
  csrf: string;
};

function joinLines(arr: string[]): string {
  return arr.join('\n');
}

function joinRoles(roles: Position['roleOptions']): string {
  return roles
    .map((r) => [r.id, r.label, r.blurb, r.minSalary || '', r.maxSalary || '', r.testDescription].join(' | '))
    .join('\n');
}

export default function PositionForm({ position, isNew, csrf }: Props) {
  const action = isNew
    ? '/admin/content/positions/create'
    : `/admin/content/positions/${position.slug}/update`;

  return (
    <form method="POST" action={action} className="space-y-8">
      <input type="hidden" name="_csrf" value={csrf} />

      <Section title="Identity">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="URL slug"
            name="slug"
            defaultValue={position.slug}
            placeholder="e.g. senior-seo-lead"
            mono
            required
            hint="lowercase, dashes only. Becomes /careers/<slug>/. Renaming moves any uploaded take-home files along with it."
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
              className="accent-ink h-4 w-4"
            />
            <span>
              <span className="font-medium">Hidden</span>
              <span className="text-ink-mute ml-2 text-xs">When checked, no public page and not in /careers list.</span>
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
            <div key={i} className="border-hairline bg-canvas-soft grid grid-cols-[1fr_2fr] gap-2 border p-3">
              <input
                type="text"
                name={`statKey${i}`}
                defaultValue={position.statCards[i]?.key ?? ''}
                placeholder="Key (e.g. Location)"
                className="field px-2 py-1.5 text-xs"
              />
              <input
                type="text"
                name={`statValue${i}`}
                defaultValue={position.statCards[i]?.value ?? ''}
                placeholder="Value"
                className="field px-2 py-1.5 text-xs"
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

      <Section title="Role options (optional)">
        <p className="text-ink-mute text-xs leading-relaxed">
          Leave empty for a single-role page. Add rows to turn this into one shared application page covering
          several jobs — the visitor picks one from a dropdown and it&apos;s forwarded to the hiring sheet. Each role
          can get its own take-home file below (once this position is saved). Salary of 0 falls back to the
          position&apos;s own salary range.
        </p>
        <Field
          label="Roles — one per line: id | label | blurb | min salary | max salary | test description"
          name="roleOptions"
          type="textarea"
          rows={6}
          defaultValue={joinRoles(position.roleOptions)}
          hint='Id is lowercase-with-dashes and doubles as the ?role= deep link, e.g. "senior-media-buyer | Senior Media Buyer | Owns spend at $250k+/mo | 95000 | 130000 | Strategy brief".'
          mono
        />
      </Section>

      <Section title="Take-home test — position-level fallback (optional)">
        <p className="text-ink-mute text-xs leading-relaxed">
          Shown when there&apos;s no role picker, or the selected role doesn&apos;t have its own file. Upload the
          file itself below (once this position is saved).
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="showDownload"
              defaultChecked={position.showDownload}
              className="accent-ink h-4 w-4"
            />
            <span>
              <span className="font-medium">Show download card</span>
            </span>
          </label>
          <Field label="Download card title" name="downloadTitle" defaultValue={position.downloadTitle} />
        </div>
        <Field label="Download blurb" name="downloadBlurb" type="textarea" rows={3} defaultValue={position.downloadBlurb} />
        <Field
          label="Test description (shown on the application page)"
          name="testDescription"
          type="textarea"
          rows={2}
          defaultValue={position.testDescription}
        />
      </Section>

      <Section title="Body — About">
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

      <Section title="Body — Responsibilities">
        <Field label="Heading" name="responsibilitiesHeading" defaultValue={position.responsibilitiesHeading} />
        <Field
          label="Bullets (one per line)"
          name="responsibilities"
          type="textarea"
          rows={8}
          defaultValue={joinLines(position.responsibilities)}
        />
      </Section>

      <Section title="Body — Must have">
        <Field label="Heading" name="mustHaveHeading" defaultValue={position.mustHaveHeading} />
        <Field
          label="Bullets (one per line)"
          name="mustHave"
          type="textarea"
          rows={6}
          defaultValue={joinLines(position.mustHave)}
        />
      </Section>

      <Section title="Body — Nice to have">
        <Field label="Heading" name="niceToHaveHeading" defaultValue={position.niceToHaveHeading} />
        <Field
          label="Bullets (one per line)"
          name="niceToHave"
          type="textarea"
          rows={5}
          defaultValue={joinLines(position.niceToHave)}
        />
      </Section>

      <Section title="Body — Hiring process">
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

      <div className="border-hairline flex items-center gap-4 border-t pt-6">
        <button type="submit" className="btn btn-solid">
          {isNew ? 'Create position' : 'Save changes'}
        </button>
        <a href="/admin/content/positions" className="eyebrow text-ink hover:text-ink-mute transition-colors">
          Cancel
        </a>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="card space-y-4 p-5">
      <legend className="eyebrow text-ink px-2">{title}</legend>
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
    'field text-sm ' +
    (mono ? 'font-mono ' : '') +
    (disabled ? 'bg-canvas-deep text-ink-mute' : '');
  return (
    <label className="block">
      <span className="field-label">{label}</span>
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
      {hint && <p className="text-ink-mute mt-1.5 text-xs">{hint}</p>}
    </label>
  );
}
