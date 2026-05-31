import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { site } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Contact — Let\'s Build Your Growth Engine',
  description:
    'Get in touch with GrowthVireX. Free 30-minute strategy call, no commitment. Response within one business day, guaranteed.',
  keywords: ['contact GrowthVireX', 'growth marketing studio contact', 'book a growth consultation'],
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <main>
      <section className="relative">
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[440px]" />
        <div className="container-zest relative pt-40 pb-14 text-center md:pt-48">
          <Reveal>
            <span className="pill-tag mx-auto">Contact</span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-light leading-[1.04] tracking-[-0.04em] md:text-7xl">
              Let&apos;s talk <span className="hl">growth.</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mx-auto mt-6 max-w-xl text-lg font-light text-[var(--color-fg-muted)]">
              Tell us where you are and where you want to be. We&apos;ll reply within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-zest pb-28">
        <Reveal>
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[2fr_1fr]">
          {/* FORM */}
          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8 md:p-12"
          >
            {/* Replace with your Web3Forms access key from https://web3forms.com */}
            <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
            <input type="hidden" name="subject" value="New contact from growthvirex.com" />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Your name" name="name" required />
              <Field label="Work email" name="email" type="email" required />
              <Field label="Company" name="company" required />
              <Field label="Website" name="website" type="url" placeholder="https://" />
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-ink-muted">
                Monthly marketing budget
              </label>
              <select
                name="budget"
                required
                className="w-full rounded-xl border border-[var(--color-border-input)] bg-[var(--color-bg)] px-4 py-3 text-base font-light transition focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="">Select a range</option>
                <option>Under $10K / month</option>
                <option>$10K – $30K / month</option>
                <option>$30K – $100K / month</option>
                <option>$100K+ / month</option>
              </select>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-ink-muted">
                What are you trying to solve?
              </label>
              <textarea
                name="message"
                rows={5}
                required
                className="w-full resize-none rounded-xl border border-[var(--color-border-input)] bg-[var(--color-bg)] px-4 py-3 text-base font-light transition focus:border-[var(--color-accent)] focus:outline-none"
                placeholder="Tell us about your goals, current marketing setup, and where you're feeling stuck."
              />
            </div>

            <button type="submit" className="btn-primary mt-8 w-full md:w-auto">
              Send message →
            </button>

            <p className="mt-4 text-xs text-ink-muted">
              By submitting, you agree to our privacy policy. We&apos;ll never spam you or share your info.
            </p>
          </form>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <ContactCard icon={<Mail size={16} />} label="Email" value={site.contact.email} href={`mailto:${site.contact.email}`} />
            <ContactCard icon={<Phone size={16} />} label="Phone" value={site.contact.phone} href={`tel:${site.contact.phone.replace(/\s/g, '')}`} />
            <ContactCard icon={<MapPin size={16} />} label="Based in" value={site.contact.address} />

            <div className="card bg-[var(--color-bg-sunken)] p-8">
              <div className="label-tech">Response time</div>
              <div className="tnum mt-3 text-3xl font-light tracking-tight">&lt; 24 hours</div>
              <p className="mt-2 text-sm font-light text-[var(--color-fg-muted)]">
                Every inquiry gets a real reply from a senior strategist — not a sales bot.
              </p>
            </div>
          </aside>
        </div>
        </Reveal>
      </section>
    </main>
  );
}

function Field({
  label, name, type = 'text', required = false, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[var(--color-fg-muted)]">
        {label} {required && <span className="text-[var(--color-accent)]">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--color-border-input)] bg-[var(--color-bg)] px-4 py-3 text-base font-light transition focus:border-[var(--color-accent)] focus:outline-none"
      />
    </div>
  );
}

function ContactCard({
  icon, label, value, href,
}: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-fg-muted)]">
        {icon} {label}
      </div>
      <div className="mt-2 text-lg font-normal">{value}</div>
    </>
  );
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6 transition hover:border-[var(--color-accent)]">
      {href ? <a href={href} className="block">{content}</a> : content}
    </div>
  );
}