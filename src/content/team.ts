export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const team: TeamMember[] = [
  {
    slug: 'maya-tan',
    name: 'Maya Tan',
    role: 'Founder & Managing Director',
    bio: 'Built Adnovara in 2020 after a decade leading paid media at consumer and SaaS brands across Singapore and Sydney.',
    image: '/images/team/maya-tan.jpg',
  },
  {
    slug: 'daniel-chen',
    name: 'Daniel Chen',
    role: 'Head of Paid Media',
    bio: 'Manages portfolio strategy across Google, Meta, and LinkedIn. Previously scaled DTC brands from $1M to $20M in annual revenue.',
    image: '/images/team/daniel-chen.jpg',
  },
  {
    slug: 'priya-anand',
    name: 'Priya Anand',
    role: 'Lead Growth Strategist',
    bio: 'Specialises in attribution modelling, LTV-aware bidding, and creative testing systems for high-velocity teams.',
    image: '/images/team/priya-anand.jpg',
  },
];
