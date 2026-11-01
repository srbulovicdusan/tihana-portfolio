import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactSection } from '@/components/layout/ContactSection';
import { SiteNav } from '@/components/navigation/SiteNav';
import { CaseHero } from '@/components/sections/case-study/CaseHero';
import { KeyFeatures } from '@/components/sections/case-study/KeyFeatures';
import { NextProject } from '@/components/sections/case-study/NextProject';
import { Overview } from '@/components/sections/case-study/Overview';
import cs from '@/components/sections/case-study/case-study.module.css';
import { BrandLanding, Outcome, SystemMobile } from '@/components/sections/profitz/SystemAndBrand';
import styles from '@/components/sections/profitz/profitz.module.css';
import { JsonLd } from '@/components/ui/JsonLd';
import { img } from '@/lib/images';
import { pageMetadata } from '@/lib/metadata';
import { reveal } from '@/lib/reveal';
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
        <CaseHero
          titleId="profitz-title"
          tags="SaaS · UI/UX · Branding"
          caseNumber="02"
          title="Profitz"
          tagline={['Designing clarity into', 'e-commerce profitability']}
          intro="A SaaS analytics platform that shows Shopify store owners what they actually earn, not just what they sell. I joined at the MVP stage and stayed as it grew into a full financial platform."
          facts={[
            { term: 'Role', value: 'UI/UX & Brand Designer', wrap: 'nowrap' },
            { term: 'Type', value: 'Client work · Freelance', wrap: 'nowrap' },
            { term: 'Platform', value: 'Web, mobile, landing page', wrap: 'nowrap' },
            { term: 'Timeline', value: 'Dec 2025 – Sep 2026', tabular: true },
            { term: 'Scope', value: 'UX architecture, UI design, design system, prototyping, brand identity, landing page', wide: true },
          ]}
        >
          <figure {...reveal('fade')} className={cs.heroFigure}>
            <Image
              {...img('/images/profitz-dashboard.webp')}
              alt="Profitz main dashboard in a browser window"
              sizes="(min-width: 1740px) 1600px, 92vw"
              preload
              className={styles.dashboard}
            />
            <figcaption className={`eyebrow ${cs.caption}`}>
              <span className={cs.captionStrong}>
                <span className={cs.liveDot} />
                Main dashboard
              </span>
              <span>Net profit at the centre</span>
            </figcaption>
          </figure>
        </CaseHero>

        <Overview
          heading={{ first: 'High revenue can hide', indent: 'High revenue can ', accent: 'thin margins.' }}
          challenge="Shopify shows revenue, Meta Ads shows spend, and everything else lives in spreadsheets. Store owners couldn't see what they actually earn."
          approach="One interface built around net profit. Revenue, costs, ad spend and ROAS are arranged around it, from a global overview down to products, campaigns and daily metrics."
          listLabel="Key questions"
          items={['How much am I actually making?', 'Which products are profitable?', 'Is my advertising paying off?', 'Where am I losing money?']}
        />

        <KeyFeatures
          project="Profitz"
          heading={{ first: 'Designing for', indent: 'Designing ', accent: 'real limits.' }}
          features={[
            {
              title: 'Profit comes first.',
              text: 'Net profit sits at the centre, and every module follows the same logic.',
              media: { image: '/images/profitz-pnl.png' },
            },
            {
              title: 'Design for the real case.',
              text: "Automatic ad-to-product matching isn't always reliable, so users can correct connections themselves.",
              media: { image: '/images/profitz-mapping.png' },
            },
            {
              title: 'Show the change, not the total.',
              text: 'The competitor watchlist highlights shifts in active ads, because a spike says more than a number.',
              media: { image: '/images/profitz-watchlist.png' },
            },
          ]}
        />

        <SystemMobile />
        <BrandLanding />
        <Outcome />

        <NextProject
          href={routes.noDaysWasted}
          caseNumber="03"
          name="No Days Wasted"
          category="E-commerce · Website Redesign"
          media={{ image: '/images/no-days-wasted-laptop.webp', alt: 'No Days Wasted website on a laptop', position: '50% 40%' }}
        />
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
