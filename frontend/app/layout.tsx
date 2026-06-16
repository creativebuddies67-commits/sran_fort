import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_NAME, DEFAULT_SITE, getSiteImageUrl } from '@/lib/constants';
import { getSiteSettings } from '@/lib/strapi';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Luxury Wedding & Event Destination`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Sran Fort Marriage Palace in Hanumangarh, Rajasthan — luxury heritage wedding venue with rooms, banquets, catering, decoration, and banquet halls. Contact us for pricing.',
  keywords: ['Sran Fort', 'marriage palace', 'wedding venue', 'Hanumangarh', 'Rajasthan', 'banquet hall', 'wedding packages'],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteRes = await getSiteSettings();
  const site = siteRes?.data ?? DEFAULT_SITE;
  const logoUrl = getSiteImageUrl(site.logo, '/logo.svg');

  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header site={site} logoUrl={logoUrl} />
        <main className="flex-1">{children}</main>
        <Footer site={site} logoUrl={logoUrl} />
      </body>
    </html>
  );
}
