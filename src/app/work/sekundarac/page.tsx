import type { Metadata } from 'next';
import { AutoplayVideo } from '@/components/behavior/AutoplayVideo';
import { ContactSection } from '@/components/layout/ContactSection';
import { SiteNav } from '@/components/navigation/SiteNav';
import { CaseHero } from '@/components/sections/case-study/CaseHero';
import { NextProject } from '@/components/sections/case-study/NextProject';
import cs from '@/components/sections/case-study/case-study.module.css';
import { Applications, Concept } from '@/components/sections/sekundarac/ConceptAndApplications';
import styles from '@/components/sections/sekundarac/sekundarac.module.css';
import { JsonLd } from '@/components/ui/JsonLd';
import { pageMetadata } from '@/lib/metadata';
import { reveal } from '@/lib/reveal';
import { routes, siteUrl } from '@/lib/site';
import { caseStudyGraph } from '@/lib/structured-data';

const title = 'Sekundarac — Case study — Tihana';
const description =
  'Sekundarac is a metal recycling company and aluminium foundry. Its new logo forms the letter S from two recycling arrows. Logo redesign, animation, stationery and promotional materials.';

export const metadata: Metadata = pageMetadata({ title, description, path: routes.sekundarac, type: 'article' });

export default function SekundaracPage() {
  return (
    <>
      <SiteNav homeHref={routes.home} workHref={routes.work} aboutHref={routes.about} current="work" />
      <main className="page" data-theme="light" data-reveal-threshold="0.08">
        <CaseHero
          titleId="sekundarac-title"
          tags="Brand Identity · Rebrand · Motion"
          caseNumber="04"
          title="Sekundarac"
          titleSize="clamp(56px, 13vw, 230px)"
          tagline={['A mark for turning', 'waste into value']}
          intro="An established metal recycling company and aluminium foundry with outdated branding. They needed a new logo that clearly shows what they do: buying and recycling metal, and their contribution to a sustainable future."
          facts={[
            { term: 'Role', value: 'Brand Designer' },
            { term: 'Type', value: 'Client work · Freelance' },
            { term: 'Year', value: '2023' },
            { term: 'Deliverables', value: 'Logo redesign, animation, stationery, promotional materials', wide: true },
          ]}
        >
          <figure {...reveal('fade')} className={cs.heroFigure}>
            <div className={`${cs.videoFrame} ${styles.heroVideo}`}>
              {/* Reduced motion: paused on the completed logo (8.4 s) */}
              <AutoplayVideo
                src="/videos/sekundarac-logo-animation-wide.mp4"
                label="Sekundarac logo animation"
                className={cs.videoFill}
                eager
                still={8.4}
              />
            </div>
            <figcaption className={`eyebrow ${cs.caption}`}>
              <span className={cs.captionStrong}>
                <span className={cs.liveDot} style={{ background: '#146533' }} />
                Logo animation
              </span>
            </figcaption>
          </figure>
        </CaseHero>

        <Concept />
        <Applications />

        <NextProject
          href={routes.emailDesign}
          caseNumber="05"
          name="Email Design"
          category="Email Design · E-commerce · Lifecycle"
          media={{ image: '/images/email-design-hero.webp', alt: 'BetterBone and Pawse emails shown on four phone mockups' }}
        />
        <ContactSection topHref="#top" />
      </main>
      <JsonLd
        data={caseStudyGraph({
          name: 'Sekundarac',
          description,
          url: `${siteUrl}${routes.sekundarac}`,
          image: `${siteUrl}${routes.sekundarac}/opengraph-image.jpg`,
          keywords: ['Brand identity', 'Rebrand', 'Logo design', 'Motion', 'Stationery'],
          temporalCoverage: '2023',
        })}
      />
    </>
  );
}
