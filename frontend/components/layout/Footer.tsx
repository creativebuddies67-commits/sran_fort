import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';
import { NAV_LINKS, SITE_NAME, DEFAULT_SITE } from '@/lib/constants';
import SocialLinks from '@/components/ui/SocialLinks';
import HotelTimings from '@/components/ui/HotelTimings';
import type { SiteSetting } from '@/lib/types';

interface FooterProps {
  site?: SiteSetting;
  logoUrl?: string;
}

export default function Footer({ site = DEFAULT_SITE, logoUrl = '/logo.svg' }: FooterProps) {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src={logoUrl} alt={`${site.siteName || SITE_NAME} logo`} width={40} height={40} />
              <div>
                <h3 className="font-display text-xl font-bold text-gold">SRAN FORT</h3>
                <p className="text-[10px] text-gold tracking-[0.2em] uppercase">Marriage Palace</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier heritage palace for luxury weddings, grand celebrations, and unforgettable events in Hanumangarh, Rajasthan.
            </p>
            <SocialLinks />
          </div>

          <div>
            <h4 className="font-display text-lg text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-gold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {site.address && (
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                  {site.address}
                </li>
              )}
              {site.phone && (
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-gray-400 text-sm hover:text-gold transition-colors"
                    aria-label={`Call ${site.phone}`}
                  >
                    <Phone size={16} className="text-gold shrink-0" />
                    {site.phone}
                  </a>
                </li>
              )}
              {site.phoneSecondary && (
                <li>
                  <a
                    href={`tel:${site.phoneSecondary.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-gray-400 text-sm hover:text-gold transition-colors"
                    aria-label={`Call ${site.phoneSecondary}`}
                  >
                    <Phone size={16} className="text-gold shrink-0" />
                    {site.phoneSecondary}
                  </a>
                </li>
              )}
              {site.email && (
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-3 text-gray-400 text-sm hover:text-gold transition-colors"
                    aria-label={`Email ${site.email}`}
                  >
                    <Mail size={16} className="text-gold shrink-0" />
                    {site.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-gold mb-4">Hotel Info</h4>
            <HotelTimings checkIn={site.checkInTime} checkOut={site.checkOutTime} />
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {site.siteName || SITE_NAME}. All rights reserved.
          </p>
          <Link href="/booking" className="btn-gold text-xs px-6 py-2">
            Enquire Now
          </Link>
        </div>
      </div>
    </footer>
  );
}
