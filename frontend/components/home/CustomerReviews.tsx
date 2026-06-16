'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import StarRating, { AverageRating } from '@/components/ui/StarRating';
import type { TestimonialWithAvatar } from '@/lib/types';
import { DEFAULT_REVIEWS } from '@/lib/constants';

interface CustomerReviewsProps {
  reviews?: TestimonialWithAvatar[];
}

function GoogleReviewCard({ review }: { review: TestimonialWithAvatar }) {
  const initial = review.name.charAt(0).toUpperCase();
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mx-2 h-full flex flex-col border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        {review.avatarUrl ? (
          <Image
            src={review.avatarUrl}
            alt={review.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-maroon text-white flex items-center justify-center font-bold text-lg shrink-0">
            {initial}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-charcoal">{review.name}</h4>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">Google</span>
          </div>
          {review.role && <p className="text-xs text-gray-500 mt-0.5">{review.role}</p>}
          <StarRating rating={review.rating} size={14} className="mt-2" />
        </div>
      </div>
      <Quote size={24} className="text-gold/30 mb-3" aria-hidden="true" />
      <p className="text-gray-600 text-sm md:text-base leading-relaxed flex-1 italic">
        &ldquo;{review.content}&rdquo;
      </p>
      {review.eventType && (
        <span className="inline-block mt-4 text-xs bg-cream text-maroon px-3 py-1 rounded-full self-start">
          {review.eventType}
        </span>
      )}
    </div>
  );
}

export default function CustomerReviews({ reviews = [] }: CustomerReviewsProps) {
  const items = reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused = useRef(false);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent((index + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (items.length <= 1) return;
    timerRef.current = setInterval(() => {
      if (!isPaused.current) next();
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items.length, next, current]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) next();
    else if (info.offset.x > 50) prev();
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section
      className="py-20 bg-cream relative overflow-hidden"
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <SectionHeading
          subtitle="Customer Reviews"
          title="What Our Guests Say"
          description="Real experiences from couples and families who celebrated with us."
        />
        <AverageRating reviews={items} />

        <div className="relative">
          <div className="overflow-hidden min-h-[280px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing"
              >
                <GoogleReviewCard review={items[current]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {items.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 p-2 rounded-full bg-white shadow-md border border-gray-100 text-maroon hover:bg-maroon hover:text-white transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 p-2 rounded-full bg-white shadow-md border border-gray-100 text-maroon hover:bg-maroon hover:text-white transition-colors"
                aria-label="Next review"
              >
                <ChevronRight size={22} />
              </button>
              <div className="flex justify-center gap-2 mt-8">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > current ? 1 : -1)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'w-8 bg-maroon' : 'w-2 bg-maroon/30 hover:bg-maroon/50'
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
