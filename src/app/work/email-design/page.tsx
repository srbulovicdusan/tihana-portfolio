import type { Metadata } from 'next';
import Image from 'next/image';
import { AutoplayVideo } from '@/components/behavior/AutoplayVideo';
import { ContactSection } from '@/components/layout/ContactSection';
import { SiteNav } from '@/components/navigation/SiteNav';
import { CaseHero } from '@/components/sections/case-study/CaseHero';
import { NextProject } from '@/components/sections/case-study/NextProject';
import { Overview } from '@/components/sections/case-study/Overview';
import cs from '@/components/sections/case-study/case-study.module.css';
import { SelectedEmails, type Email } from '@/components/sections/email-design/SelectedEmails';
import { JsonLd } from '@/components/ui/JsonLd';
import { img } from '@/lib/images';
import { pageMetadata } from '@/lib/metadata';
import { reveal } from '@/lib/reveal';
import { routes, siteUrl } from '@/lib/site';
import { caseStudyGraph } from '@/lib/structured-data';

const title = 'Email Design — Case study — Tihana';
const description =
  'Campaign and lifecycle emails for e-commerce and lifestyle brands, from product launches and sales to retention and storytelling. Each email is built around one clear goal and designed to work in the inbox.';

export const metadata: Metadata = pageMetadata({ title, description, path: routes.emailDesign, type: 'article' });

const EMAILS: Email[] = [
  {
    brand: 'BetterBone',
    desc: 'A bundle offer told through a familiar dog-owner moment, with hand-drawn annotations guiding the eye.',
    image: '/images/email-design/betterbone.webp',
  },
  {
    brand: 'The Ace VIP',
    desc: 'A partner email for travel agencies, presenting a full luxury concierge offer in Mykonos.',
    image: '/images/email-design/the-ace-vip.webp',
  },
  {
    brand: 'Pawse',
    desc: 'A National Mutt Day email built on narrative copy and a customer testimonial.',
    image: '/images/email-design/pawse.webp',
  },
  {
    brand: 'Highland Soap Co.',
    desc: "An ingredient-led email helping customers choose skincare by what's inside.",
    image: '/images/email-design/highland-soap.webp',
  },
  {
    brand: 'ChowMore',
    desc: 'A post-purchase email turning a variety pack trial into a subscription.',
    image: '/images/email-design/chowmore.webp',
  },
  {
    brand: 'Alloura',
    desc: 'A fragrance guide organized by occasion, pairing each scent with a moment.',
    image: '/images/email-design/alloura.webp',
  },
  {
    brand: 'Panda Drum',
    desc: 'A product ladder guiding customers from beginner to pro instrument.',
    image: '/images/email-design/panda-drum.webp',
  },
  {
    brand: 'Gantri',
    desc: 'A collection launch introducing the products and the designers behind them.',
    image: '/images/email-design/gantri.webp',
  },
];

export default function EmailDesignPage() {
  return (
    <>
      <SiteNav homeHref={routes.home} workHref={routes.work} aboutHref={routes.about} current="work" />
      <main className="page" data-theme="light" data-reveal-threshold="0.04">
        <CaseHero
          titleId="email-design-title"
          tags="Email Design · E-commerce · Lifecycle"
          caseNumber="05"
          title="Email Design"
          titleSize="clamp(48px, 10.4vw, 184px)"
          titleNowrap
          tagline={['One goal, every send.']}
          intro="Campaign and lifecycle emails for e-commerce and lifestyle brands, from product launches and sales to retention and storytelling. Each email is built around one clear goal and designed to work in the inbox, not just in Figma."
          facts={[
            { term: 'Role', value: 'Email Designer', wrap: 'balance' },
            { term: 'Type', value: 'Campaign & lifecycle', wrap: 'balance' },
            { term: 'Tools', value: 'Figma, Klaviyo', wrap: 'balance' },
            { term: 'Year', value: '2022–2026', wrap: 'balance' },
            {
              term: 'Scope',
              value: 'Promo, product launch, retention and storytelling emails across pet, beauty, luxury travel and lifestyle brands',
              wrap: 'balance',
              wide: true,
            },
          ]}
          factsFour
        >
          <figure {...reveal('fade')} className={cs.heroFigure}>
            <Image
              {...img('/images/email-design-hero.webp')}
              alt="BetterBone and Pawse emails shown on four phone mockups"
              sizes="92vw"
              preload
              className={cs.shot}
            />
          </figure>
        </CaseHero>

        <Overview
          heading={{ first: 'Small screens,', indent: 'Small ', accent: 'one clear job.' }}
          challenge="An email gets a few seconds in a crowded inbox, usually on a phone. It has to be recognised as the brand, understood at a glance and lead to one action, while rendering reliably across email clients."
          approach="Every email starts from its goal. Layouts are modular and built at 600px, hierarchy is designed for mobile first, and each send extends the brand's own visual identity instead of a generic template."
          listLabel="Key principles"
          items={[
            { title: 'Built for the inbox', text: '600px modular layouts that render reliably across email clients.' },
            { title: 'Mobile first', text: 'Hierarchy and tap targets designed for the phone.' },
            { title: 'One goal per email', text: 'Every layout leads to a single clear action.' },
            { title: 'On brand, every send', text: "Each email extends the brand's identity." },
          ]}
        />

        <SelectedEmails emails={EMAILS} />

        <NextProject
          direction="previous"
          href={routes.sekundarac}
          caseNumber="04"
          name="Sekundarac"
          category="Brand Identity · Rebrand"
          media={{
            video: className => (
              <AutoplayVideo src="/videos/sekundarac-logo-animation-wide.mp4" label="Sekundarac logo animation" className={className} still={8.4} />
            ),
            tone: '#ffffff',
          }}
        />
        <ContactSection topHref="#top" divider />
      </main>
      <JsonLd
        data={caseStudyGraph({
          name: 'Email Design',
          description,
          url: `${siteUrl}${routes.emailDesign}`,
          image: `${siteUrl}${routes.emailDesign}/opengraph-image.jpg`,
          keywords: ['Email design', 'E-commerce', 'Lifecycle emails', 'Klaviyo', 'Campaigns'],
          temporalCoverage: '2022/2026',
        })}
      />
    </>
  );
}
