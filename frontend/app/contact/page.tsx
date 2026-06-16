import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import BookingForm from '@/components/booking/BookingForm';
import SocialLinks from '@/components/ui/SocialLinks';
import GoogleMap from '@/components/ui/GoogleMap';
import HotelTimings from '@/components/ui/HotelTimings';
import { getSiteSettings } from '@/lib/strapi';
import { DEFAULT_SITE, SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Sran Fort Marriage Palace for bookings, inquiries, and event planning.',
};

export default async function ContactPage() {
  const siteRes = await getSiteSettings();
  const site = siteRes?.data ?? DEFAULT_SITE;

  return (
    <>
      <section className="relative h-64 flex items-center justify-center bg-maroon">
        <div className="text-center text-white px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Get In Touch</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Contact Us</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionHeading
                subtitle="Reach Out"
                title="We'd Love to Hear From You"
                centered={false}
              />
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-maroon" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal">Address</h4>
                    <p className="text-gray-600 text-sm mt-1">{site.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-maroon" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal">Phone</h4>
                    <a href={`tel:${site.phone?.replace(/\s/g, '')}`} className="text-gray-600 text-sm mt-1 hover:text-maroon block" aria-label={`Call ${site.phone}`}>
                      {site.phone}
                    </a>
                    {site.phoneSecondary && (
                      <a href={`tel:${site.phoneSecondary.replace(/\s/g, '')}`} className="text-gray-600 text-sm hover:text-maroon block" aria-label={`Call ${site.phoneSecondary}`}>
                        {site.phoneSecondary}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-maroon" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal">Email</h4>
                    <a href={`mailto:${site.email}`} className="text-gray-600 text-sm mt-1 hover:text-maroon" aria-label={`Email ${site.email}`}>
                      {site.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-maroon" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal">Property Timings</h4>
                    <HotelTimings className="text-gray-600 text-sm mt-1" />
                  </div>
                </div>
                <a
                  href={SOCIAL_LINKS.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with us on WhatsApp"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={20} />
                  Chat on WhatsApp
                </a>
                <div>
                  <h4 className="font-semibold text-charcoal mb-3">Follow Us</h4>
                  <SocialLinks variant="inline" />
                </div>
              </div>
            </div>

            <div className="bg-cream p-8 rounded-lg">
              <h3 className="font-display text-2xl font-bold text-charcoal mb-6">Send a Message</h3>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      <GoogleMap />
    </>
  );
}
