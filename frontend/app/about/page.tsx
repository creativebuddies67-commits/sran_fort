import type { Metadata } from 'next';
import SectionHeading from '@/components/ui/SectionHeading';
import AboutSectionVisual from '@/components/ui/AboutSectionVisual';
import { getSiteSettings, sanitizeAboutHtml } from '@/lib/strapi';
import { getAboutMediaData } from '@/lib/about-media';
import { DEFAULT_SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sran Fort Marriage Palace — your premier wedding and event destination in Rajasthan.',
};

export default async function AboutPage() {
  const siteRes = await getSiteSettings();
  const site = siteRes?.data ?? DEFAULT_SITE;
  const aboutMedia = getAboutMediaData(site);
  const stats = site.stats ?? DEFAULT_SITE.stats!;

  return (
    <>
      <section className="relative h-64 flex items-center justify-center bg-maroon">
        <div className="text-center text-white px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Our Story</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">About Us</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <AboutSectionVisual
              images={aboutMedia.sliderImages}
              youtubeWatchUrl={aboutMedia.youtubeWatchUrl}
              title={site.aboutTitle || 'About Sran Fort Marriage Palace'}
              className="relative h-96"
            />
            <div>
              <SectionHeading
                subtitle="Who We Are"
                title={site.aboutTitle || 'Your Premier Marriage Palace'}
                centered={false}
              />
              <div
                className="prose prose-lg text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeAboutHtml(site.aboutContent || DEFAULT_SITE.aboutContent!),
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-8 bg-cream rounded-lg">
                <p className="font-display text-3xl md:text-4xl font-bold text-maroon">{stat.value}</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Our Vision', text: 'To be the most trusted and beloved marriage palace, setting the standard for luxury celebrations in Rajasthan.' },
              { title: 'Our Mission', text: 'Creating extraordinary experiences through impeccable service, stunning venues, and attention to every detail.' },
              { title: 'Our Values', text: 'Excellence, integrity, warmth, and a relentless pursuit of perfection in everything we do.' },
            ].map((item) => (
              <div key={item.title} className="p-8 border border-cream-dark rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="font-display text-xl font-bold text-maroon mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
