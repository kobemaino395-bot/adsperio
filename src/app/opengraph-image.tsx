import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* The real mark, inlined. Satori lays out flexbox and rasterises <img>, but it
   will not draw stroked SVG written as JSX — so the logo goes in as a data URI
   and comes out identical to the one in the header, rather than approximated
   with rotated divs (which splay apart and stop reading as an A). */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
<path d="M5.2 28 14.3 5" stroke="#ffffff" stroke-width="4.6" stroke-linecap="round"/>
<path d="M17.7 5 26.8 28" stroke="#ffffff" stroke-width="4.6" stroke-linecap="round"/>
<path d="M9.6 19.8H22.4" stroke="#533afd" stroke-width="4.6" stroke-linecap="round"/>
</svg>`;

const MARK_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(MARK)}`;

/* The mesh band and the wash that settles it onto the plate are the same
   height on purpose: the wash reaches full navy exactly where the band ends,
   so there is no seam. Mismatch them and a hard horizontal line appears. */
const BAND = 330;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0d253d',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* the mesh, flattened to one wash — same stops, same left-to-right
            order as GradientMesh, one layer instead of six */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${BAND}px`,
            background:
              'linear-gradient(100deg, #f5c26b 0%, #ff8a5b 22%, #a78bfa 48%, #533afd 72%, #ea2261 100%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${BAND}px`,
            background: 'linear-gradient(180deg, rgba(13,37,61,0) 22%, #0d253d 100%)',
          }}
        />

        {/* wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK_SRC} width={46} height={46} alt="" />
          <div
            style={{ display: 'flex', fontSize: '34px', fontWeight: 600, letterSpacing: '-0.8px' }}
          >
            AdsPerio
          </div>
        </div>

        {/* headline — thin and tightly tracked, as the display tier is set */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '76px',
              fontWeight: 300,
              letterSpacing: '-2.6px',
              lineHeight: 1.05,
              maxWidth: '940px',
            }}
          >
            We buy media, and we tell you what it actually did.
          </div>
        </div>

        {/* footer strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid rgba(255,255,255,0.22)',
            paddingTop: '24px',
            fontSize: '21px',
            color: '#bfcfe2',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex' }}>Performance advertising · New York</div>
          <div style={{ display: 'flex' }}>adsperio.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
