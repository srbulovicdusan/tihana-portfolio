export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const site = {
  name: 'Tihana',
  fullName: 'Tihana Drvenica',
  jobTitle: 'Multidisciplinary designer',
  email: 'tdrvenica@gmail.com',
  disciplines: ['Brand Identity', 'UI/UX Design', 'Web Design', 'Email Design'],
} as const;

export const routes = {
  home: '/',
  work: '/#work',
  about: '/about',
  artprovenance: '/work/artprovenance',
  profitz: '/work/profitz',
  noDaysWasted: '/work/no-days-wasted',
  sekundarac: '/work/sekundarac',
  emailDesign: '/work/email-design',
} as const;
