'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { PLACEHOLDER_IMAGES, getGalleryImageUrl } from '@/lib/constants';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  featured: boolean;
  sortOrder: number;
  image?: unknown;
}

interface GalleryGridProps {
  items: GalleryItem[];
  showFilter?: boolean;
}

export default function GalleryGrid({ items, showFilter = true }: GalleryGridProps) {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const categories = ['all', ...new Set(items.map((i) => i.category))];
  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  const getImage = (item: GalleryItem) =>
    getGalleryImageUrl(item.image, PLACEHOLDER_IMAGES.gallery);

  return (
    <>
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          {showFilter && (
            <>
              <SectionHeading
                subtitle="Showcase"
                title="Our Gallery"
                description="Browse through our collection of memorable weddings, events, and celebrations."
              />
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2 text-sm font-medium uppercase tracking-wider transition-all ${
                      filter === cat
                        ? 'bg-maroon text-white'
                        : 'bg-white text-charcoal hover:bg-maroon/10'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </>
          )}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setLightbox(item)}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={getImage(item)}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-maroon/0 group-hover:bg-maroon/40 transition-colors duration-300 flex items-end">
                    <p className="text-white font-display text-lg p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {item.title}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No gallery images yet. Upload images from the admin panel.
            </p>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gold z-10"
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getImage(lightbox)}
                alt={lightbox.title}
                fill
                className="object-contain"
                sizes="90vw"
              />
              <p className="text-white text-center mt-4 font-display text-lg">{lightbox.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
