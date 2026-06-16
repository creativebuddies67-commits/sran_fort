'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

interface AboutImageSliderProps {
  images: string[];
  alt?: string;
  intervalMs?: number;
  className?: string;
}

export default function AboutImageSlider({
  images,
  alt = 'Sran Fort Marriage Palace',
  intervalMs = 2000,
  className = 'relative h-80 lg:h-[450px]',
}: AboutImageSliderProps) {
  const [index, setIndex] = useState(0);
  const slides = images.length > 0 ? images : ['/images/about.jpg'];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, intervalMs]);

  return (
    <div
      className={`${className} relative rounded-lg overflow-hidden shadow-xl ring-1 ring-gold/20 bg-charcoal`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index]}
            alt={`${alt} — slide ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-gold' : 'w-1.5 bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
