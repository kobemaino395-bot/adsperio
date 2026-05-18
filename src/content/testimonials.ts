export type Testimonial = {
  slug: string;
  author: string;
  role: string;
  company: string;
  caseSlug?: string;
  quote: string;
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    slug: 'lila-park',
    author: 'Lila Park',
    role: 'Marketing Director',
    company: 'Aura Wellness',
    caseSlug: 'aura-wellness',
    quote:
      'Adnovara took our paid social from break-even to 4x blended ROAS in eight months. Their team thinks like operators, not vendors — every recommendation is tied to a number we agreed on up front.',
    image: '/images/testimonials/lila-park.jpg',
  },
  {
    slug: 'marcus-wong',
    author: 'Marcus Wong',
    role: 'Founder',
    company: 'EduTech Academy',
    caseSlug: 'edutech-academy',
    quote:
      'Course enrollments tripled in the first quarter. What I value most is how transparent the reporting is — I see exactly where every dollar is going and why.',
    image: '/images/testimonials/marcus-wong.jpg',
  },
  {
    slug: 'aisha-rashid',
    author: 'Aisha Rashid',
    role: 'VP Growth',
    company: 'Finova',
    caseSlug: 'finova',
    quote:
      'We worked with three agencies before Adnovara. They are the first one that actually understood our SaaS metrics and built campaigns around LTV, not just clicks.',
    image: '/images/testimonials/aisha-rashid.jpg',
  },
];
