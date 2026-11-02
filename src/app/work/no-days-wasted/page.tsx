import type { Metadata } from 'next';
import Image from 'next/image';
import { AutoplayVideo } from '@/components/behavior/AutoplayVideo';
import { ContactSection } from '@/components/layout/ContactSection';
import { SiteNav } from '@/components/navigation/SiteNav';
import { CaseHero } from '@/components/sections/case-study/CaseHero';
import { KeyFeatures } from '@/components/sections/case-study/KeyFeatures';
import { NextProject } from '@/components/sections/case-study/NextProject';
import { Overview } from '@/components/sections/case-study/Overview';
import cs from '@/components/sections/case-study/case-study.module.css';
import { JsonLd } from '@/components/ui/JsonLd';
import { img } from '@/lib/images';
import { pageMetadata } from '@/lib/metadata';
import { reveal } from '@/lib/reveal';
import { routes, siteUrl } from '@/lib/site';
import { caseStudyGraph } from '@/lib/structured-data';

const title = 'No Days Wasted — Case study — Tihana';
const description =
  'No Days Wasted is a recovery supplement brand selling in the US and Canada. A modern website redesign that finally looks and feels like the brand: UI design, hero animation and e-commerce flows.';

export const metadata: Metadata = pageMetadata({ title, description, path: routes.noDaysWasted, type: 'article' });

export default function NoDaysWastedPage() {
  return (
    <>
      <SiteNav homeHref={routes.home} workHref={routes.work} aboutHref={routes.about} current="work" />
      <main className="page" data-theme="light" data-reveal-threshold="0.08">
        <CaseHero
          titleId="no-days-wasted-title"
          tags="E-commerce · Website Redesign"
          caseNumber="03"
          title="No Days Wasted"
          titleSize="clamp(48px, 10.4vw, 184px)"
          titleNowrap
          tagline={['One brand,', 'on every page']}
          intro="A recovery supplement brand selling in the US and Canada. Their website felt different from page to page, so the goal was a modern redesign that finally looks and feels like the brand."
          facts={[
            { term: 'Role', value: 'UI/UX Designer', wrap: 'nowrap' },
            { term: 'Type', value: 'Agency', wrap: 'nowrap' },
            { term: 'Platform', value: 'Web, US & Canada stores', wrap: 'balance' },
            { term: 'Year', value: '2026', wrap: 'nowrap' },
            { term: 'Scope', value: 'Website redesign, UI design, hero animation, e-commerce flows', wide: true },
          ]}
          note="Designed at Digital Arts Agency. Shown for portfolio purposes."
        >
          <figure {...reveal('fade')} className={cs.heroFigure}>
            <Image
              {...img('/images/no-days-wasted-desktop.webp')}
              alt="No Days Wasted homepage on a desktop monitor"
              sizes="92vw"
              preload
              className={cs.shot}
            />
          </figure>
        </CaseHero>

        <Overview
          heading={{ first: 'A strong brand,', indent: 'A strong ', accent: 'an inconsistent site.' }}
          challenge="Every page used different styles, so the website didn't match the brand customers knew from the product."
          approach="One consistent visual system built from the brand itself, and a clearer shopping experience on both the US and Canadian stores."
          listLabel="Key goals"
          items={['Make the brand consistent', 'Show the products at first glance', 'Make buying options clear']}
        />

        <KeyFeatures
          project="No Days Wasted"
          heading={{ first: 'Clear at', indent: 'Clear ', accent: 'first glance.' }}
          features={[
            {
              title: 'Products, at first glance.',
              text: 'An animated hero shows the main products right away, so visitors understand what the brand sells before they scroll.',
              media: {
                video: label => <AutoplayVideo src="/videos/no-days-wasted-hero-loop.mp4" label={label} className={cs.videoFill} />,
                tone: '#e9e6f2',
              },
            },
            {
              title: 'Subscribe or buy once.',
              text: 'The product page clearly separates subscription and one-time purchase, so customers instantly see their options and savings.',
              media: { image: '/images/no-days-wasted-pdp.png' },
            },
            {
              title: 'One brand, two stores.',
              text: 'The same design system runs across the US and Canadian sites, keeping every page consistent.',
              media: { image: '/images/no-days-wasted-products.png' },
            },
          ]}
        />

        <NextProject
          href={routes.sekundarac}
          caseNumber="04"
          name="Sekundarac"
          category="Brand Identity · Rebrand"
          media={{
            diptych: [
              { image: '/images/sekundarac-logo-green.png', alt: 'Sekundarac logo, reversed on brand green', tone: '#146533' },
              { image: '/images/sekundarac-logo-white.png', alt: 'Sekundarac logo, primary on white', tone: '#ffffff', bleed: true },
            ],
          }}
        />
        <ContactSection topHref="#top" />
      </main>
      <JsonLd
        data={caseStudyGraph({
          name: 'No Days Wasted',
          description,
          url: `${siteUrl}${routes.noDaysWasted}`,
          image: `${siteUrl}${routes.noDaysWasted}/opengraph-image.jpg`,
          keywords: ['E-commerce', 'Website redesign', 'UI design', 'Hero animation'],
          temporalCoverage: '2026',
        })}
      />
    </>
  );
}
