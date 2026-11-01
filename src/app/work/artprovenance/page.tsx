import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactSection } from '@/components/layout/ContactSection';
import { SiteNav } from '@/components/navigation/SiteNav';
import { LandingPage } from '@/components/sections/artprovenance/LandingPage';
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

const title = 'Art Provenance — Case study — Tihana';
const description =
  'Art Provenance is an AI research platform that searches millions of historic auction records and scanned PDF catalogues, so anyone can research an artwork. Search UX, AI chat interface, filters, results views, style guide and landing page.';

export const metadata: Metadata = pageMetadata({ title, description, path: routes.artprovenance, type: 'article' });

export default function ArtProvenancePage() {
  return (
    <>
      <SiteNav homeHref={routes.home} workHref={routes.work} aboutHref={routes.about} current="work" />
      <main className="page" data-theme="light" data-reveal-threshold="0.08">
        <CaseHero
          titleId="artprovenance-title"
          tags="AI Platform · UI/UX · Art Market"
          caseNumber="01"
          title="Art Provenance"
          titleSize="clamp(48px, 10.4vw, 184px)"
          titleNowrap
          tagline={['Start with nothing,', 'end with a history']}
          intro="An AI research platform that searches millions of historic auction records and art references, many of them available only as scanned PDF catalogues. It lets anyone research an artwork, even without knowing anything about it."
          facts={[
            { term: 'Role', value: 'UI/UX Designer', wrap: 'nowrap' },
            { term: 'Type', value: 'Agency', wrap: 'nowrap' },
            { term: 'Platform', value: 'Web app, landing page', wrap: 'balance' },
            { term: 'Year', value: '2026', wrap: 'nowrap' },
            { term: 'Scope', value: 'Search UX, AI chat interface, filters, results views, style guide, landing page', wide: true },
          ]}
          note="Designed at Digital Arts Agency. Shown for portfolio purposes."
        >
          <figure {...reveal('fade')} className={cs.heroFigure}>
            <Image
              {...img('/images/artprovenance-hero-laptop.webp')}
              alt="Art Provenance landing page on a laptop"
              sizes="92vw"
              preload
              className={cs.shot}
            />
          </figure>
        </CaseHero>

        <Overview
          heading={{ first: 'Rare knowledge,', indent: 'Rare ', accent: 'buried in PDFs.' }}
          challenge="Provenance research usually assumes you already know the artist, the sale or the date. And the records themselves are scattered across old auction catalogues, scanned as PDFs that are hard to search."
          approach="A search that works like a conversation. Users can start knowing nothing and grow their knowledge with every refinement, entering through an image, a description or an auction reference."
          listLabel="Key goals"
          items={['Start without knowing anything', 'Three ways into one archive', 'Show every appearance of a work']}
        />

        <KeyFeatures
          project="Art Provenance"
          heading={{ first: 'From question', indent: 'From ', accent: 'to provenance.' }}
          features={[
            {
              title: 'Start with what you know.',
              text: 'Upload an image, describe the artwork in your own words, or search a known auction. Three entry points into the same archive.',
              media: { image: '/images/artprovenance-search.png' },
            },
            {
              title: 'Refine like a conversation.',
              text: 'Each follow-up narrows the results, chat-style, with filters beside it, so knowledge grows with every step.',
              media: { image: '/images/artprovenance-chat.png' },
            },
            {
              title: 'One artwork, a trail of records.',
              text: 'Results are sorted by similarity and show every catalogue appearance of a work, so its history reads at a glance.',
              media: { image: '/images/artprovenance-results.png' },
            },
            {
              title: 'Every artwork, one record.',
              text: 'Each artwork gets its own page with its image, key details and every catalogue appearance, with provenance, exhibitions and literature available when needed.',
              media: { image: '/images/artprovenance-record.png' },
            },
          ]}
        />

        <LandingPage />

        <NextProject
          href={routes.profitz}
          caseNumber="02"
          name="Profitz"
          category="SaaS · UI/UX · Branding"
          media={{ image: '/images/profitz-mobile.webp', alt: 'Profitz mobile screens' }}
        />
        <ContactSection topHref="#top" />
      </main>
      <JsonLd
        data={caseStudyGraph({
          name: 'Art Provenance',
          description,
          url: `${siteUrl}${routes.artprovenance}`,
          image: `${siteUrl}${routes.artprovenance}/opengraph-image.jpg`,
          keywords: ['AI platform', 'UI/UX', 'Art market', 'Search UX', 'Web application'],
          temporalCoverage: '2026',
        })}
      />
    </>
  );
}
