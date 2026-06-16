import type { Metadata } from 'next';
import CustomerReviews from '@/components/home/CustomerReviews';
import { getTestimonials } from '@/lib/strapi';
import { getSiteImageUrl } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description: 'Read what our guests say about their experience at Sran Fort Marriage Palace.',
};

export default async function TestimonialsPage() {
  const res = await getTestimonials();
  const reviews = (res?.data ?? []).map((review) => ({
    ...review,
    avatarUrl: getSiteImageUrl(review.avatar, ''),
  }));

  return (
    <>
      <section className="relative h-64 flex items-center justify-center bg-maroon">
        <div className="text-center text-white px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Reviews</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Customer Reviews</h1>
        </div>
      </section>
      <CustomerReviews reviews={reviews} />
    </>
  );
}
