import type { Metadata } from 'next';
import SectionHeading from '@/components/ui/SectionHeading';
import BookingForm from '@/components/booking/BookingForm';
import HotelTimings from '@/components/ui/HotelTimings';
import { Phone, Mail } from 'lucide-react';
import { getSiteSettings } from '@/lib/strapi';
import { DEFAULT_SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Book Now',
  description: 'Submit a booking inquiry for your wedding, event, or room reservation at Sran Fort Marriage Palace.',
};

export default async function BookingPage() {
  const siteRes = await getSiteSettings();
  const site = siteRes?.data ?? DEFAULT_SITE;

  return (
    <>
      <section className="relative h-64 flex items-center justify-center bg-maroon">
        <div className="text-center text-white px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Reserve</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Booking Inquiry</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeading
            subtitle="Plan Your Event"
            title="Request a Booking"
            description="Fill out the form below and our team will get back to you within 24 hours with a personalized quote."
          />

          <div className="bg-cream/50 border border-cream-dark rounded-lg p-6 mb-8 text-center">
            <h4 className="font-semibold text-charcoal mb-2">Property Timings</h4>
            <HotelTimings className="text-gray-600 inline-block" />
          </div>

          <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg border border-cream-dark">
            <BookingForm />
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6 text-center">
            {site.phone && (
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-2 text-maroon hover:text-gold transition-colors" aria-label={`Call ${site.phone}`}>
                <Phone size={18} />
                {site.phone}
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className="flex items-center justify-center gap-2 text-maroon hover:text-gold transition-colors" aria-label={`Email ${site.email}`}>
                <Mail size={18} />
                {site.email}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
