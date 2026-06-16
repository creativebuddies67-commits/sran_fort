'use client';

import {
  Heart,
  PartyPopper,
  UtensilsCrossed,
  Flower2,
  Building2,
  Bed,
  LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { ScrollReveal, staggerContainer, fadeUp } from '@/components/ui/motion';
import { SERVICES } from '@/lib/constants';

const iconMap: Record<string, LucideIcon> = {
  Heart,
  PartyPopper,
  UtensilsCrossed,
  Flower2,
  Building2,
  Bed,
};

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <SectionHeading
            subtitle="What We Offer"
            title="Hotel Services"
            description="From dream weddings to corporate events, we provide comprehensive hospitality services for every celebration."
          />
        </ScrollReveal>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon] || Heart;
            return (
              <motion.div
                key={service.title}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 30, 58, 0.12)' }}
                className="text-center p-8 rounded-lg border border-cream-dark hover:border-gold transition-colors duration-300 group"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream flex items-center justify-center group-hover:bg-maroon transition-colors duration-300"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <Icon size={28} className="text-maroon group-hover:text-gold transition-colors duration-300" />
                </motion.div>
                <h3 className="font-display text-xl font-bold text-charcoal mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
