'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';

interface AnimatedCTAProps {
  image?: string;
}

export default function AnimatedCTA({ image = PLACEHOLDER_IMAGES.wedding }: AnimatedCTAProps) {
  return (
    <section className="py-20 bg-maroon relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image src={image} alt="" fill className="object-cover" />
      </div>
      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Plan Your Dream Event?
        </h2>
        <p className="text-gray-200 mb-8 text-lg">
          Let us help you create unforgettable memories. Contact us today for a personalized quote.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link href="/booking" className="btn-gold inline-flex">Get a Custom Quote</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-charcoal inline-flex">
              Contact Us for Pricing
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
