'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';
import { getGalleryImageUrl } from '@/lib/constants';

interface GalleryItem {
  id: number;
  title: string;
  image?: unknown;
}

interface AnimatedGalleryPreviewProps {
  items: GalleryItem[];
}

export default function AnimatedGalleryPreview({ items }: AnimatedGalleryPreviewProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading subtitle="Showcase" title="Gallery" light />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
            >
              <Image
                src={getGalleryImageUrl(item.image, PLACEHOLDER_IMAGES.gallery)}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <motion.div
                className="absolute inset-0 bg-maroon/0 hover:bg-maroon/30 transition-colors duration-300"
                whileHover={{ backgroundColor: 'rgba(123, 30, 58, 0.3)' }}
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/gallery" className="btn-gold">View Full Gallery</Link>
        </motion.div>
      </div>
    </section>
  );
}
