import type { Metadata } from 'next';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { getGalleryItems as fetchGalleryItems } from '@/lib/strapi';
import { getGalleryItems } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse photos of weddings, events, rooms, and celebrations at Sran Fort Marriage Palace.',
};

export default async function GalleryPage() {
  const res = await fetchGalleryItems();
  const items = getGalleryItems(res?.data ?? []);

  return (
    <>
      <section className="relative h-64 flex items-center justify-center bg-maroon">
        <div className="text-center text-white px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Showcase</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Gallery</h1>
        </div>
      </section>
      <GalleryGrid items={items} />
    </>
  );
}
