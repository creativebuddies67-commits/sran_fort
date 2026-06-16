'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description?: string;
  image?: string;
  ctaLabel?: string;
  href?: string;
  badge?: string;
  features?: string[];
  index?: number;
}

export default function ContentCard({
  title,
  description,
  image,
  ctaLabel,
  href,
  badge,
  features,
  index = 0,
}: CardProps) {
  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md card-hover group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      <div className="relative h-56 overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {badge && (
          <span className="absolute top-4 left-4 bg-gold text-charcoal text-xs font-bold px-3 py-1 uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-charcoal mb-2 group-hover:text-maroon transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        )}
        {features && features.length > 0 && (
          <ul className="space-y-1 mb-4">
            {features.slice(0, 3).map((f) => (
              <li key={f} className="text-xs text-gray-500 flex items-center gap-2">
                <span className="w-1 h-1 bg-gold rounded-full shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}
        {ctaLabel && (
          <p className="text-maroon text-sm font-semibold mb-3">{ctaLabel}</p>
        )}
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-maroon text-sm font-semibold hover:text-gold transition-colors"
          >
            Know More <ArrowRight size={16} />
          </Link>
        ) : (
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-gold text-sm font-semibold hover:text-maroon transition-colors"
          >
            Enquire Now <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
