'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { NAV_LINKS, DEFAULT_SITE } from '@/lib/constants';
import type { SiteSetting } from '@/lib/types';

interface HeaderProps {
  site?: SiteSetting;
  logoUrl?: string;
}

export default function Header({ site = DEFAULT_SITE, logoUrl = '/logo.svg' }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div className="hidden md:block bg-maroon-dark text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {site.phone && (
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-gold transition-colors"
                aria-label={`Call ${site.phone}`}
              >
                <Phone size={14} />
                {site.phone}
              </a>
            )}
            {site.phoneSecondary && (
              <a
                href={`tel:${site.phoneSecondary.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-gold transition-colors"
                aria-label={`Call ${site.phoneSecondary}`}
              >
                <Phone size={14} />
                {site.phoneSecondary}
              </a>
            )}
            {site.email && (
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 hover:text-gold transition-colors"
                aria-label={`Email ${site.email}`}
              >
                <Mail size={14} />
                {site.email}
              </a>
            )}
          </div>
          <p className="text-gold tracking-widest uppercase text-xs">Luxury Wedding & Event Destination</p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <Image src={logoUrl} alt={site.siteName || 'Sran Fort Marriage Palace'} width={48} height={48} className="shrink-0" />
              <div className="flex flex-col">
                <span className="font-display text-xl md:text-2xl font-bold text-maroon tracking-wide leading-tight">
                  SRAN FORT
                </span>
                <span className="text-[10px] md:text-xs text-gold tracking-[0.25em] uppercase">
                  Marriage Palace
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-charcoal hover:text-maroon transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/booking" className="hidden sm:inline-flex btn-gold text-xs px-6 py-2.5">
                Enquire Now
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-charcoal hover:text-maroon"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
        <nav
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-24">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-lg font-medium text-charcoal hover:text-maroon hover:bg-cream rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/booking" onClick={() => setIsOpen(false)} className="mt-4 btn-gold text-center">
                Enquire Now
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
