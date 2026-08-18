import Link from 'next/link';
import GradientMesh from '@/components/mesh/GradientMesh';
import { site } from '@/content/site';

const ELSEWHERE = [
  { href: '/services/', label: 'Services', desc: 'Paid search, paid social, measurement, creative' },
  { href: '/case-studies/', label: 'Work', desc: 'Five accounts, written up honestly' },
  { href: '/newsletter/', label: 'Notes', desc: 'Field notes from accounts we run' },
  { href: '/contact/', label: 'Contact', desc: 'Send an account, get an audit back' },
];

export default function NotFound() {
  return (
    <main>
      <section className="mesh-host overflow-hidden pt-16">
        <GradientMesh height="h-[26rem] md:h-[30rem]" />
        <div className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <span className="eyebrow">Error 404</span>
            <h1 className="display-1 mt-5 max-w-[12ch]">This page is not here.</h1>
            <p className="lede mt-6 max-w-[44ch]">
              Either the address is wrong or we moved something and did not leave a
              forwarding note. The second one is our fault.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-solid">
                Back to the front
              </Link>
              <a href={`mailto:${site.contact.email}`} className="btn btn-line">
                Tell us what broke
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pt-3">
            <span className="eyebrow">Elsewhere</span>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {ELSEWHERE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="card-lift group block h-full p-5">
                    <span className="group-hover:text-indigo-text block text-[1.0625rem] font-medium tracking-[-0.015em] transition-colors">
                      {l.label}
                    </span>
                    <span className="caption mt-1 block">{l.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
