import type { Metadata } from 'next';
import Link from 'next/link';
import ContentCard from '@/components/ui/ContentCard';
import SectionHeading from '@/components/ui/SectionHeading';
import HotelTimings from '@/components/ui/HotelTimings';
import { getRooms } from '@/lib/strapi';
import { PLACEHOLDER_IMAGES, STATIC_IMAGES, PRICING_CTA, getImageUrl, getStaticImage } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Rooms',
  description: 'Luxury rooms and suites at Sran Fort Marriage Palace for wedding guests and visitors.',
};

export default async function RoomsPage() {
  const res = await getRooms();
  const rooms = res?.data ?? [];

  return (
    <>
      <section className="relative h-64 flex items-center justify-center bg-maroon">
        <div className="text-center text-white px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Accommodation</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Luxury Rooms</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            subtitle="Stay With Us"
            title="Comfort & Elegance"
            description="Choose from our range of beautifully appointed rooms — perfect for wedding guests and families."
          />

          {rooms.length > 0 ? (
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
                  badge={room.capacity ? `Up to ${room.capacity} guests` : undefined}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Rooms coming soon. Check back later!</p>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="text-center p-6 bg-cream rounded-lg col-span-full">
              <h4 className="font-display text-lg font-bold text-maroon mb-3">Property Timings</h4>
              <HotelTimings className="text-charcoal text-center inline-block" />
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/booking" className="btn-primary">{PRICING_CTA.enquire}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
