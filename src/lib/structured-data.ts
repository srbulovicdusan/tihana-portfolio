import { routes, site, siteUrl } from './site';

const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;

// Only facts stated on the site itself.
export const person = {
  '@type': 'Person',
  '@id': personId,
  name: site.fullName,
  givenName: site.name,
  jobTitle: site.jobTitle,
  url: siteUrl,
  knowsAbout: [...site.disciplines],
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Novi Sad' },
};

export const website = {
  '@type': 'WebSite',
  '@id': websiteId,
  url: siteUrl,
  name: site.name,
  inLanguage: 'en',
  publisher: { '@id': personId },
};

export function homeGraph() {
  return { '@context': 'https://schema.org', '@graph': [website, person] };
}

export function aboutGraph() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${siteUrl}${routes.about}`,
    isPartOf: { '@id': websiteId },
    mainEntity: person,
  };
}

export function caseStudyGraph(cs: { name: string; description: string; url: string; image: string; keywords: string[]; temporalCoverage: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${cs.name} — Case study`,
    about: cs.name,
    description: cs.description,
    url: cs.url,
    image: cs.image,
    keywords: cs.keywords.join(', '),
    temporalCoverage: cs.temporalCoverage,
    creator: { '@id': personId },
    isPartOf: { '@id': websiteId },
  };
}
