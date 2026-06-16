import type { Metadata } from 'next';
import Link from 'next/link';
import ContentCard from '@/components/ui/ContentCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { getDecorations } from '@/lib/strapi';
import { STATIC_IMAGES, PRICING_CTA, getImageUrl, getStaticImage } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Decoration',
  description: 'Bespoke wedding and event decoration themes at Sran Fort Marriage Palace.',
};

const categoryLabels: Record<string, string> = {
  mandap: 'Mandap',
  stage: 'Stage',
  entrance: 'Entrance',
  reception: 'Reception',
  floral: 'Floral',
  lighting: 'Lighting',
  theme: 'Theme',
};

export default async function DecorationPage() {
  const res = await getDecorations();
  const decorations = res?.data ?? [];

  return (
    <>
      <section className="relative h-64 flex items-center justify-center bg-maroon">
        <div className="text-center text-white px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Décor</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Decoration</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            subtitle="Transform Your Venue"
            title="Stunning Decorations"
            description="From royal mandaps to floral wonderlands, our decoration team brings your vision to life."
          />

          {decorations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {decorations.map((deco, i) => (
                <ContentCard
                  key={deco.id}
                  index={i}
                  title={deco.name}
                  description={deco.shortDescription}
                  image={getImageUrl(deco.images, getStaticImage(STATIC_IMAGES.decoration, i))}
                  ctaLabel={PRICING_CTA.contact}
                  badge={categoryLabels[deco.category] || deco.category}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Decoration themes coming soon!</p>
          )}

          <div className="mt-16 bg-maroon text-white p-10 rounded-lg text-center">
            <h3 className="font-display text-2xl font-bold mb-3">Custom Theme Design</h3>
            <p className="text-gray-200 mb-6 max-w-xl mx-auto">
              Have a unique theme in mind? Our creative team specializes in bespoke decoration designs for every occasion.
            </p>
            <Link href="/booking" className="btn-gold">{PRICING_CTA.quote}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
