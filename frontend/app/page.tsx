import Link from 'next/link';
import AnimatedHero from '@/components/home/AnimatedHero';
import AnimatedAboutSection from '@/components/home/AnimatedAboutSection';
import ServicesSection from '@/components/home/ServicesSection';
import CustomerReviews from '@/components/home/CustomerReviews';
import AnimatedGalleryPreview from '@/components/home/AnimatedGalleryPreview';
import AnimatedCTA from '@/components/home/AnimatedCTA';
import SectionHeading from '@/components/ui/SectionHeading';
import ContentCard from '@/components/ui/ContentCard';
import { ScrollReveal } from '@/components/ui/motion';
import {
  getSiteSettings,
  getRooms,
  getWeddingPackages,
  getTestimonials,
  getGalleryItems as fetchGalleryItems,
} from '@/lib/strapi';
import { getAboutMediaData } from '@/lib/about-media';
import {
  DEFAULT_SITE,
  PLACEHOLDER_IMAGES,
  STATIC_IMAGES,
  PRICING_CTA,
  getSiteImageUrl,
  getImageUrl,
  getStaticImage,
  getGalleryItems,
} from '@/lib/constants';

export default async function HomePage() {
  const [siteRes, roomsRes, packagesRes, testimonialsRes, galleryRes] = await Promise.all([
    getSiteSettings(),
    getRooms(true),
    getWeddingPackages(true),
    getTestimonials(true),
    fetchGalleryItems(),
  ]);

  const site = siteRes?.data ?? DEFAULT_SITE;
  const rooms = roomsRes?.data ?? [];
  const packages = packagesRes?.data ?? [];
  const testimonials = testimonialsRes?.data ?? [];
  const gallery = getGalleryItems(galleryRes?.data ?? []).slice(0, 6);

  const heroImage = getSiteImageUrl(site.heroImage, PLACEHOLDER_IMAGES.hero);
  const ctaImage = getSiteImageUrl(site.ctaImage, PLACEHOLDER_IMAGES.wedding);
  const aboutMedia = getAboutMediaData(site);
  const stats = site.stats ?? DEFAULT_SITE.stats!;
  const reviewsWithAvatars = testimonials.map((review) => ({
    ...review,
    avatarUrl: getSiteImageUrl(review.avatar, ''),
  }));

  return (
    <>
      <AnimatedHero title={site.heroTitle} subtitle={site.heroSubtitle} image={heroImage} />

      <AnimatedAboutSection
        sliderImages={aboutMedia.sliderImages}
        youtubeWatchUrl={aboutMedia.youtubeWatchUrl}
        aboutTitle={site.aboutTitle || 'Your Premier Marriage Palace'}
        aboutContent={site.aboutContent || DEFAULT_SITE.aboutContent!}
        stats={stats}
      />

      <ServicesSection />

      {packages.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal>
              <SectionHeading
                subtitle="Packages"
                title="Wedding Packages"
                description="Choose the perfect package for your dream celebration."
              />
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, i) => (
                <ContentCard
                  key={pkg.id}
                  index={i}
                  title={pkg.name}
                  description={pkg.shortDescription}
                  image={getImageUrl(pkg.images, getStaticImage(STATIC_IMAGES.wedding, i))}
                  ctaLabel={PRICING_CTA.contact}
                  badge={pkg.tier}
                  features={pkg.features}
                  href="/packages"
                />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/booking" className="btn-outline">{PRICING_CTA.quote}</Link>
            </div>
          </div>
        </section>
      )}

      {rooms.length > 0 && (
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal>
              <SectionHeading
                subtitle="Accommodation"
                title="Luxury Rooms"
                description="Comfortable and elegant rooms for you and your guests."
              />
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, i) => (
                <ContentCard
                  key={room.id}
                  index={i}
                  title={room.name}
                  description={room.shortDescription}
                  image={getImageUrl(room.images, getStaticImage(STATIC_IMAGES.room, i))}
                  ctaLabel={PRICING_CTA.contact}
                  features={room.amenities}
                  href="/rooms"
                />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/rooms" className="btn-outline">View All Rooms</Link>
            </div>
          </div>
        </section>
      )}

      <AnimatedGalleryPreview items={gallery} />
      <CustomerReviews reviews={reviewsWithAvatars} />
      <AnimatedCTA image={ctaImage} />
    </>
  );
}
