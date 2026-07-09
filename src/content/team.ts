export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const team: TeamMember[] = [
  {
    slug: 'rachel-tan',
    name: 'Rachel Tan',
    role: 'Founder & Managing Director',
    bio: 'Built GrowthVireX in 2020 after a decade leading paid media at consumer and SaaS brands across New York and San Francisco.',
    image: '/images/team/rachel-tan.jpg',
  },
  {
    slug: 'wang-xinyi',
    name: 'Wang Xinyi',
    role: 'Head of Paid Media',
    bio: 'Manages portfolio strategy across Google, Meta, and LinkedIn. Previously scaled DTC brands from $1M to $20M in annual revenue.',
    image: '/images/team/wang-xinyi.jpg',
  },
  {
    slug: 'adrian-goh',
    name: 'Adrian Goh',
    role: 'Lead Growth Strategist',
    bio: 'Specialises in attribution modelling, LTV-aware bidding, and creative testing systems for high-velocity teams.',
    image: '/images/team/adrian-goh.jpg',
  },
];
