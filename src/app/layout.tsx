import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { revealRuntime } from '@/lib/runtime/reveal-runtime';
import { site, siteUrl } from '@/lib/site';
import './globals.css';

// Inter Tight latin subset (variable wght), exactly as served in the design
// exports. The unicode-range mirrors Google Fonts' latin subset so glyphs
// outside it fall back to the same system fonts as the originals (arrows are
// SVG icons, components/ui/Arrow.tsx: iOS would draw them as emoji);
// for the same reason no metric-adjusted fallback face is generated.
const interTight = localFont({
  src: [
    { path: './fonts/inter-tight-latin.woff2', weight: '400 800', style: 'normal' },
    { path: './fonts/inter-tight-latin-italic.woff2', weight: '300 500', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-inter-tight',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${site.name} — Portfolio`,
  applicationName: site.name,
  authors: [{ name: site.fullName, url: siteUrl }],
  creator: site.fullName,
  formatDetection: { email: false, telephone: false, address: false },
  robots: { index: true, follow: true },
  openGraph: { siteName: site.name, locale: 'en_US', type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#060606',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={interTight.variable} suppressHydrationWarning>
      <head>
        {/* Enables JS-only initial states (scroll reveals) before first paint */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: `(${revealRuntime.toString()})()` }} />
      </body>
    </html>
  );
}
