export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /** Two sentences maximum. Where they came from, and what they own here. */
  bio: string;
  since: string;
};

/** No portraits. People are set in type — see MonogramPlate. Stock headshots of
 *  strangers were the first thing we removed. */
export const team: TeamMember[] = [
  {
    slug: 'rachel-tan',
    name: 'Rachel Tan',
    role: 'Founder',
    bio: 'Ran paid media in-house at two DTC brands and hated every agency report she was sent, which is roughly the origin story of this one. Owns measurement standards and takes the call when a client disagrees with a number.',
    since: '2019',
  },
  {
    slug: 'wang-xinyi',
    name: 'Wang Xinyi',
    role: 'Head of Paid Media',
    bio: 'Twelve years buying search and social, most recently across a portfolio spending $40M a year. Sets account structure and signs off on every budget change above 15%.',
    since: '2020',
  },
  {
    slug: 'adrian-goh',
    name: 'Adrian Goh',
    role: 'Head of Measurement',
    bio: 'Statistician by training, which is why our holdout tests are powered properly and take longer than clients would like. Designs every incrementality test and writes the readouts.',
    since: '2021',
  },
  {
    slug: 'noor-haddad',
    name: 'Noor Haddad',
    role: 'Creative Director',
    bio: 'Came from direct response television, where the feedback loop was already brutal before anyone called it performance creative. Runs the creator roster and the concept library.',
    since: '2022',
  },
  {
    slug: 'daniel-ferreira',
    name: 'Daniel Ferreira',
    role: 'Analytics Engineer',
    bio: 'Builds the server-side tracking and the reconciliation pipeline, and is the reason the monthly variance report arrives on the second working day. Previously data infrastructure at a payments company.',
    since: '2023',
  },
];
