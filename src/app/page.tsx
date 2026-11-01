import type { Metadata } from 'next';
import { ContactSection } from '@/components/layout/ContactSection';
import { SiteNav } from '@/components/navigation/SiteNav';
import { Expertise } from '@/components/sections/portfolio/Expertise';
import { Hero } from '@/components/sections/portfolio/Hero';
import { Perspective } from '@/components/sections/portfolio/Perspective';
import { PortfolioEffects } from '@/components/sections/portfolio/PortfolioEffects';
import { SelectedWork } from '@/components/sections/portfolio/SelectedWork';
import { WorkRouteDialog } from '@/components/sections/portfolio/WorkRouteDialog';
import { JsonLd } from '@/components/ui/JsonLd';
import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/lib/site';
import { homeGraph } from '@/lib/structured-data';

const title = 'Tihana — Portfolio';
const description =
  'Tihana is a multidisciplinary designer working across brand identity, UI/UX, web and email design — designing brands and everything they touch, from the first logo to the last email.';

export const metadata: Metadata = pageMetadata({ title, description, path: routes.home });

export default function HomePage() {
  return (
    <>
      <SiteNav revealOnScroll label="Sticky" homeHref="#intro" workHref="#work" aboutHref={routes.about} />
      <main className="page" data-theme="dark">
        <Hero />
        <Perspective />
        <SelectedWork />
        <Expertise />
        <ContactSection withHeader topHref="#intro" />
        <WorkRouteDialog />
      </main>
      <PortfolioEffects />
      <JsonLd data={homeGraph()} />
    </>
  );
}
