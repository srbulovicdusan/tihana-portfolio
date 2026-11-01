import type { Metadata } from 'next';
import { ContactSection } from '@/components/layout/ContactSection';
import { SiteNav } from '@/components/navigation/SiteNav';
import { AboutHero } from '@/components/sections/about/AboutHero';
import { Education } from '@/components/sections/about/Education';
import { Experience } from '@/components/sections/about/Experience';
import { Skills } from '@/components/sections/about/Skills';
import { JsonLd } from '@/components/ui/JsonLd';
import { pageMetadata } from '@/lib/metadata';
import { routes } from '@/lib/site';
import { aboutGraph } from '@/lib/structured-data';

const title = 'About — Tihana';
const description =
  "Hi, I'm Tihana, a multidisciplinary designer working across brand identity, UI/UX, web and email design. Based in Serbia, working worldwide.";

export const metadata: Metadata = pageMetadata({ title, description, path: routes.about, type: 'profile' });

export default function AboutPage() {
  return (
    <>
      <SiteNav homeHref={routes.home} workHref={routes.work} aboutHref="#about" current="about" />
      <main className="page" data-theme="dark">
        <AboutHero />
        <Experience />
        <Skills />
        <Education />
        <ContactSection topHref="#about" />
      </main>
      <JsonLd data={aboutGraph()} />
    </>
  );
}
