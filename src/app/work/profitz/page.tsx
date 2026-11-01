import type { Metadata } from 'next';
import { ContactSection } from '@/components/layout/ContactSection';
import { SiteNav } from '@/components/navigation/SiteNav';
import { KeyFeatures } from '@/components/sections/profitz/KeyFeatures';
import { NextProject } from '@/components/sections/profitz/NextProject';
import { Overview } from '@/components/sections/profitz/Overview';
import { ProfitzHero } from '@/components/sections/profitz/ProfitzHero';
import { BrandLanding, Outcome, SystemMobile } from '@/components/sections/profitz/SystemAndBrand';
import { JsonLd } from '@/components/ui/JsonLd';
import { pageMetadata } from '@/lib/metadata';
import { routes, siteUrl } from '@/lib/site';
import { caseStudyGraph } from '@/lib/structured-data';

const title = 'Profitz — Case study — Tihana';
const description =
  'Profitz is a SaaS analytics platform that shows Shopify store owners what they actually earn, not just what they sell. UX architecture, UI design, design system, prototyping, brand identity and landing page.';

export const metadata: Metadata = pageMetadata({ title, description, path: routes.profitz, type: 'article' });

export default function ProfitzPage() {
  return (
    <>
      <SiteNav homeHref={routes.home} workHref={routes.work} aboutHref={routes.about} current="work" />
      <main className="page" data-theme="light" data-reveal-threshold="0.08">
        <ProfitzHero />
        <Overview />
        <KeyFeatures />
        <SystemMobile />
        <BrandLanding />
        <Outcome />
        <NextProject />
        <ContactSection topHref="#top" />
      </main>
      <JsonLd
        data={caseStudyGraph({
          name: 'Profitz',
          description,
          url: `${siteUrl}${routes.profitz}`,
          image: `${siteUrl}/work/profitz/opengraph-image.jpg`,
          keywords: ['SaaS', 'UI/UX', 'Branding', 'Product design', 'Analytics'],
          temporalCoverage: '2025-12/2026-09',
        })}
      />
    </>
  );
}
