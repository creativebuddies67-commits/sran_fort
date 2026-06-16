import type { Metadata } from 'next';
import Link from 'next/link';
import ContentCard from '@/components/ui/ContentCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { getWeddingPackages } from '@/lib/strapi';
import { PLACEHOLDER_IMAGES, STATIC_IMAGES, PRICING_CTA, getImageUrl, getStaticImage } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Wedding Packages',
  description: 'Explore our wedding packages at Sran Fort Marriage Palace — contact us for custom pricing.',
};

const tierColors: Record<string, string> = {
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  royal: 'Royal',
};

export default async function PackagesPage() {
  const res = await getWeddingPackages();
  const packages = res?.data ?? [];

  return (
    <>
      <section className="relative h-64 flex items-center justify-center bg-maroon">
        <div className="text-center text-white px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Celebrations</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Wedding Packages</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            subtitle="Choose Your Package"
            title="Packages for Every Dream"
            description="From intimate gatherings to grand royal celebrations, we have a package tailored for you."
          />

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, i) => (
                <ContentCard
                  key={pkg.id}
                  index={i}
                  title={pkg.name}
                  description={pkg.shortDescription}
                  image={getImageUrl(pkg.images, getStaticImage(STATIC_IMAGES.wedding, i))}
                  ctaLabel={PRICING_CTA.contact}
                  badge={tierColors[pkg.tier] || pkg.tier}
                  features={pkg.features}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Packages coming soon. Check back later!</p>
          )}

          <div className="mt-16 text-center bg-cream p-10 rounded-lg">
            <h3 className="font-display text-2xl font-bold text-charcoal mb-3">
              Need a Custom Package?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Every celebration is unique. Contact us to create a bespoke package tailored to your vision.
            </p>
            <Link href="/booking" className="btn-primary">{PRICING_CTA.quote}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
