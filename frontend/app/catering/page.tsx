import type { Metadata } from 'next';
import Link from 'next/link';
import ContentCard from '@/components/ui/ContentCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { getCaterings } from '@/lib/strapi';
import { STATIC_IMAGES, PRICING_CTA, getImageUrl, getStaticImage } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Catering',
  description: 'Gourmet multi-cuisine catering services for weddings and events at Sran Fort Marriage Palace.',
};

const cuisineLabels: Record<string, string> = {
  'north-indian': 'North Indian',
  'south-indian': 'South Indian',
  'multi-cuisine': 'Multi-Cuisine',
  continental: 'Continental',
  custom: 'Custom Menu',
};

export default async function CateringPage() {
  const res = await getCaterings();
  const caterings = res?.data ?? [];

  return (
    <>
      <section className="relative h-64 flex items-center justify-center bg-maroon">
        <div className="text-center text-white px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Dining</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Catering Services</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            subtitle="Gourmet Dining"
            title="Exquisite Catering"
            description="From traditional Rajasthani thalis to international buffets, our culinary team creates memorable dining experiences."
          />

          {caterings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caterings.map((cat, i) => (
                <ContentCard
                  key={cat.id}
                  index={i}
                  title={cat.name}
                  description={cat.shortDescription}
                  image={getImageUrl(cat.images, getStaticImage(STATIC_IMAGES.catering, i))}
                  ctaLabel={PRICING_CTA.contact}
                  badge={cuisineLabels[cat.cuisineType] || cat.cuisineType}
                  features={cat.menuItems}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Catering menus coming soon!</p>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Live Counters', desc: 'Chaat, pasta, tandoor, and dessert stations prepared fresh for your guests.' },
              { title: 'Custom Menus', desc: 'Work with our chefs to design a menu that reflects your taste and traditions.' },
              { title: 'Dietary Options', desc: 'Vegetarian, non-vegetarian, Jain, and special dietary requirements accommodated.' },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-cream rounded-lg text-center">
                <h3 className="font-display text-lg font-bold text-maroon mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/booking" className="btn-primary">{PRICING_CTA.quote}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
