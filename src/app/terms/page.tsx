import type { Metadata } from 'next';
import Reveal from '@/components/ui/Reveal';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Terms of Service — GrowthVireX',
  description: 'Terms and conditions governing the use of GrowthVireX services and website.',
  alternates: { canonical: '/terms/' },
};

const lastUpdated = 'April 18, 2026';

export default function TermsPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="glow absolute inset-x-0 top-0 h-[420px]" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />
        <div className="container-zest relative pt-40 pb-16">
          <Reveal>
            <h1 className="text-5xl font-light tracking-[-0.03em] md:text-6xl">Terms of Service</h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 text-sm font-light text-[var(--color-fg-muted)]">Last updated: {lastUpdated}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-zest pb-28">
        <div className="mx-auto max-w-3xl">
          <Prose>
            <p>
              Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using{' '}
              <strong>{site.url}</strong> or engaging {site.name} (&ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo;) for any services. By accessing our website
              or entering into a services agreement with us, you agree to be bound by these Terms.
            </p>

            <h2>1. Services</h2>
            <p>
              {site.name} provides performance marketing services including, but not limited to,
              search engine optimisation (SEO), pay-per-click advertising (PPC), paid social
              advertising, conversion rate optimisation (CRO), and web development
              (&ldquo;Services&rdquo;).
            </p>
            <p>
              The specific scope, deliverables, timelines, and fees for Services are defined in a
              separate Statement of Work (&ldquo;SOW&rdquo;) or service agreement signed by both
              parties. These Terms govern all such engagements unless explicitly superseded in
              writing.
            </p>

            <h2>2. Eligibility</h2>
            <p>
              By using our website or engaging our Services, you represent that you are at least 18
              years of age, have the legal authority to enter into these Terms on behalf of yourself
              or your organisation, and are not prohibited from doing so under applicable law.
            </p>

            <h2>3. Client obligations</h2>
            <p>To enable us to deliver the Services, you agree to:</p>
            <ul>
              <li>Provide accurate, complete, and timely information, assets, and access credentials as reasonably requested.</li>
              <li>Designate a primary point of contact with authority to approve work and decisions.</li>
              <li>Review and provide feedback on deliverables within the timelines specified in the SOW.</li>
              <li>Ensure that all materials you supply (copy, images, brand assets) do not infringe any third-party intellectual property rights.</li>
            </ul>

            <h2>4. Fees and payment</h2>
            <p>
              Fees are set out in the applicable SOW or invoice. Unless otherwise agreed:
            </p>
            <ul>
              <li>Invoices are due within 14 days of the invoice date.</li>
              <li>Late payments accrue interest at 1.5% per month (or the maximum permitted by law, whichever is lower).</li>
              <li>We reserve the right to suspend Services if payment is more than 30 days overdue.</li>
              <li>All fees are exclusive of applicable taxes, which are your responsibility.</li>
            </ul>

            <h2>5. Intellectual property</h2>
            <h3>Our pre-existing IP</h3>
            <p>
              We retain all rights to our methodologies, frameworks, processes, tools, and any
              pre-existing intellectual property. Nothing in these Terms transfers ownership of
              our proprietary systems to you.
            </p>
            <h3>Deliverables</h3>
            <p>
              Upon receipt of full payment, we assign to you all rights in the specific deliverables
              created exclusively for you under a SOW (e.g., ad creative, landing page copy),
              except where those deliverables incorporate our pre-existing IP or third-party
              licensed assets.
            </p>
            <h3>Your materials</h3>
            <p>
              You retain ownership of all materials you provide to us. You grant us a limited,
              non-exclusive licence to use those materials solely to perform the Services.
            </p>

            <h2>6. Confidentiality</h2>
            <p>
              Each party agrees to keep the other&rsquo;s confidential information (including
              business strategies, data, pricing, and campaign performance) strictly confidential
              and not to disclose it to third parties without prior written consent, except as
              required by law. This obligation survives termination of our engagement by two years.
            </p>
            <p>
              We may reference you as a client and describe the nature of our engagement for
              marketing purposes (e.g., case studies) unless you notify us in writing that you
              object.
            </p>

            <h2>7. Results and guarantees</h2>
            <p>
              Digital marketing outcomes depend on many variables outside our control, including
              market conditions, algorithm changes, and competitor activity. While we commit to
              professional standards and best-effort performance, we do not guarantee specific
              results unless explicitly stated in a signed SOW.
            </p>
            <p>
              Any performance guarantees stated in a SOW are subject to the client meeting their
              obligations under Section 3 and maintaining the agreed advertising spend for the
              guarantee period.
            </p>

            <h2>8. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, {site.name}&rsquo;s total liability to you
              for any claim arising from these Terms or the Services shall not exceed the total
              fees paid by you in the three months preceding the claim.
            </p>
            <p>
              We shall not be liable for any indirect, incidental, consequential, or punitive
              damages, including loss of profits, loss of data, or business interruption, even if
              we have been advised of the possibility of such damages.
            </p>

            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless {site.name} and its employees,
              contractors, and officers from any claims, damages, or expenses (including reasonable
              legal fees) arising from: (a) your breach of these Terms; (b) materials you provided
              that infringe third-party rights; or (c) your violation of applicable law.
            </p>

            <h2>10. Term and termination</h2>
            <p>
              Either party may terminate a services engagement by providing the notice period
              specified in the applicable SOW (default: 30 days written notice). Upon termination:
            </p>
            <ul>
              <li>You remain liable for all fees for work performed up to the termination date.</li>
              <li>We will provide you with all deliverables completed and paid for.</li>
              <li>Each party will return or destroy the other&rsquo;s confidential information upon request.</li>
            </ul>
            <p>
              We may terminate immediately for cause if you breach a material term of these Terms
              or any SOW and fail to cure that breach within 10 days of written notice.
            </p>

            <h2>11. Website use</h2>
            <p>
              You may use our website for lawful purposes only. You agree not to: scrape or
              harvest content without permission; attempt to gain unauthorised access to any part
              of the site; transmit malicious code; or engage in any conduct that disrupts or
              damages our website or services.
            </p>
            <p>
              We reserve the right to suspend or terminate access to our website for any user who
              violates these Terms.
            </p>

            <h2>12. Third-party services</h2>
            <p>
              Our Services may involve the use of third-party platforms (e.g., Google Ads, Meta,
              LinkedIn). Your use of those platforms is subject to their own terms of service.
              We are not responsible for changes to third-party platform policies, fees, or
              functionality that affect campaign performance.
            </p>

            <h2>13. Governing law and disputes</h2>
            <p>
              These Terms are governed by the laws of {site.legal.governingLaw}, without regard to its
              conflict of law provisions. Any dispute arising from or relating to these Terms shall be
              resolved exclusively in the state or federal courts located in {site.legal.venue}, and
              both parties consent to personal jurisdiction in those courts.
            </p>
            <p>
              Before initiating formal proceedings, both parties agree to attempt good-faith
              resolution by escalating the dispute to senior leadership for at least 30 days.
            </p>

            <h2>14. Changes to these Terms</h2>
            <p>
              We may revise these Terms at any time. The &ldquo;Last updated&rdquo; date above
              reflects the most recent revision. For ongoing engagements, material changes will be
              communicated by email with at least 14 days&rsquo; notice. Continued use of our
              website or Services after the effective date constitutes acceptance of the revised Terms.
            </p>

            <h2>15. Contact us</h2>
            <p>
              For questions about these Terms, contact:
            </p>
            <p>
              <strong>{site.name}</strong><br />
              {site.contact.address}<br />
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a><br />
              <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
            </p>
          </Prose>
        </div>
      </section>
    </main>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-light [&>p]:mt-5 [&>p]:leading-relaxed [&>p]:text-[var(--color-fg-muted)]
      [&>h2]:mt-12 [&>h2]:border-t [&>h2]:border-[var(--color-border)] [&>h2]:pt-8 [&>h2]:text-2xl [&>h2]:font-light [&>h2]:tracking-[-0.01em] [&>h2]:text-[var(--color-fg)]
      [&>h3]:mt-6 [&>h3]:text-lg [&>h3]:font-normal [&>h3]:text-[var(--color-fg)]
      [&>ul]:mt-4 [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:list-disc
      [&_li]:text-[var(--color-fg-muted)] [&_li]:leading-relaxed
      [&_a]:text-[var(--color-accent)] [&_a]:underline-offset-2 hover:[&_a]:underline
      [&_strong]:text-[var(--color-fg)] [&_strong]:font-medium
    ">
      {children}
    </div>
  );
}
