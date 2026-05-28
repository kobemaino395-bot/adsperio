import type { Metadata } from 'next';
import Reveal from '@/components/ui/Reveal';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Privacy Policy — GrowthVireX',
  description: 'How GrowthVireX collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy/' },
};

const lastUpdated = 'April 18, 2026';

export default function PrivacyPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-50" />
        <div className="container-zest relative pt-40 pb-16">
          <Reveal>
            <span className="inline-block rounded-full border border-ink/10 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur">
              Legal
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-6xl">Privacy Policy</h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 text-sm text-ink-muted">Last updated: {lastUpdated}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-zest pb-28">
        <div className="mx-auto max-w-3xl">
          <Prose>
            <p>
              {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates{' '}
              <strong>{site.url}</strong>. This Privacy Policy explains what information we collect,
              why we collect it, how we use it, and the choices you have.
            </p>

            <h2>1. Information we collect</h2>
            <h3>Information you provide directly</h3>
            <ul>
              <li><strong>Contact &amp; inquiry data</strong> — name, work email, company name, website URL, marketing budget, and message content when you submit our contact form.</li>
              <li><strong>Newsletter subscription</strong> — email address when you subscribe to The Growth Engine newsletter.</li>
              <li><strong>Job applications</strong> — name, email, and any information included in your application email.</li>
            </ul>
            <h3>Information collected automatically</h3>
            <ul>
              <li><strong>Usage data</strong> — pages visited, time on site, referral source, browser type, and device type via analytics tools.</li>
              <li><strong>Cookies</strong> — essential cookies required for site functionality, and optional analytics cookies (see Section 5).</li>
            </ul>

            <h2>2. How we use your information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Respond to inquiries and schedule strategy calls.</li>
              <li>Deliver the newsletter you subscribed to.</li>
              <li>Improve website content, performance, and user experience.</li>
              <li>Comply with legal obligations and prevent fraud.</li>
              <li>Send service-related communications (never unsolicited marketing from third parties).</li>
            </ul>

            <h2>3. Legal basis for processing (GDPR)</h2>
            <p>For visitors in the European Economic Area, we process personal data under the following legal bases:</p>
            <ul>
              <li><strong>Consent</strong> — newsletter subscriptions and optional analytics cookies.</li>
              <li><strong>Legitimate interests</strong> — responding to business inquiries and improving our services.</li>
              <li><strong>Legal obligation</strong> — where required by applicable law.</li>
            </ul>

            <h2>4. How we share your information</h2>
            <p>
              We do not sell, rent, or trade your personal information. We may share data with
              trusted service providers who assist us in operating our website and delivering
              services (e.g., form submission processing via Web3Forms, email delivery, analytics).
              These providers are contractually required to keep your data confidential and use it
              only for the services they provide to us.
            </p>
            <p>
              We may also disclose information when required by law or to protect our legal rights.
            </p>

            <h2>5. Cookies</h2>
            <p>We use the following types of cookies:</p>
            <ul>
              <li><strong>Essential cookies</strong> — necessary for the site to function. Cannot be disabled.</li>
              <li><strong>Analytics cookies</strong> — help us understand how visitors interact with the site. You may opt out via your browser settings or a cookie preference tool.</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Disabling analytics cookies
              will not affect your ability to use the site.
            </p>

            <h2>6. Data retention</h2>
            <p>
              We retain contact form submissions for up to 24 months. Newsletter subscriber data is
              retained until you unsubscribe. Analytics data is aggregated and retained for up to
              26 months. You may request deletion of your data at any time (see Section 7).
            </p>

            <h2>7. Your rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data (&ldquo;right to be forgotten&rdquo;).</li>
              <li>Object to or restrict certain processing.</li>
              <li>Data portability (receive your data in a structured, machine-readable format).</li>
              <li>Withdraw consent at any time (without affecting prior processing).</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{' '}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>. We will respond
              within 30 days.
            </p>

            <h2>8. Third-party links</h2>
            <p>
              Our site may contain links to third-party websites. We are not responsible for their
              privacy practices. We encourage you to review the privacy policy of any site you visit.
            </p>

            <h2>9. Children&rsquo;s privacy</h2>
            <p>
              Our services are not directed at individuals under 16 years of age. We do not
              knowingly collect personal data from children. If you believe we have inadvertently
              collected such data, please contact us for immediate deletion.
            </p>

            <h2>10. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo;
              date at the top of this page reflects the most recent revision. Continued use of our
              site after changes constitutes acceptance of the updated policy.
            </p>

            <h2>11. Contact us</h2>
            <p>
              For questions or concerns about this Privacy Policy or your personal data, contact:
            </p>
            <p>
              <strong>{site.name}</strong><br />
              10 Anson Road, Level 6, Singapore 079903<br />
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a><br />
              <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`}>{site.contact.phone}</a>
            </p>
          </Prose>
        </div>
      </section>
    </main>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="[&>p]:mt-5 [&>p]:leading-relaxed [&>p]:text-ink-muted
      [&>h2]:mt-12 [&>h2]:border-t [&>h2]:border-[var(--color-border)] [&>h2]:pt-8 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:text-[var(--color-fg)]
      [&>h3]:mt-6 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[var(--color-fg)]
      [&>ul]:mt-4 [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:list-disc
      [&_li]:text-ink-muted [&_li]:leading-relaxed
      [&_a]:text-zest-400 [&_a]:underline-offset-2 hover:[&_a]:underline
      [&_strong]:text-[var(--color-fg)] [&_strong]:font-semibold
    ">
      {children}
    </div>
  );
}
