"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Calendar, Gift, ChevronDown } from "lucide-react";
import { PLACEHOLDER_IMAGES, SITE_NAME } from "@/lib/constants";

interface AnimatedHeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

function parseHeroTitle(title?: string) {
  const full = title || `Welcome to ${SITE_NAME}`;
  const match = full.match(/^Welcome to\s+(.+)$/i);
  if (match) return { welcome: "Welcome to", main: match[1] };
  return { welcome: "Welcome to", main: full };
}

function HeroOrnament() {
  return (
    <svg
      viewBox="0 0 280 32"
      className="w-48 md:w-64 h-8 mx-auto mb-6 text-gold"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M140 4c-8 0-14 6-14 14h-4c0-10 8-18 18-18s18 8 18 18h-4c0-8-6-14-14-14z"
        opacity="0.9"
      />
      <path
        d="M20 16h80M180 16h80"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="20" cy="16" r="3" />
      <circle cx="260" cy="16" r="3" />
      <path
        d="M100 16c10-6 20-6 30 0M150 16c10 6 20 6 30 0"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path d="M125 10l15 6-15 6-15-6z" opacity="0.85" />
      <path
        d="M110 22c5-3 10-3 15 0M155 22c5 3 10 3 15 0"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

function HeroTitleLines() {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-5 w-full max-w-3xl mx-auto">
      <span className="h-px flex-1 max-w-[120px] md:max-w-[180px] bg-gradient-to-r from-transparent via-gold to-gold/80" />
      <span className="w-2 h-2 rotate-45 border border-gold shrink-0" />
      <span className="h-px flex-1 max-w-[120px] md:max-w-[180px] bg-gradient-to-l from-transparent via-gold to-gold/80" />
    </div>
  );
}

export default function AnimatedHero({
  title,
  subtitle,
  image,
}: AnimatedHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroImage = image || PLACEHOLDER_IMAGES.hero;
  const { welcome, main } = parseHeroTitle(title);

  return (
    <section
      ref={ref}
      className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden bg-maroon"
    >
      {/* Background image — floral detail visible on the right */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={heroImage}
          alt="Sran Fort Marriage Palace"
          fill
          priority
          className="object-cover object-[70%_center] scale-105 brightness-110"
          sizes="100vw"
        />
      </motion.div>

      {/* Burgundy overlay — lighter so background image shows through more */}
      <div className="absolute inset-0 bg-gradient-to-r from-maroon/75 via-maroon/60 to-maroon-light/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-maroon/55" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-24 pb-28 md:pb-32"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          <HeroOrnament />
        </motion.div>

        <motion.p
          className="font-display text-gold text-xl md:text-2xl italic mb-4 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
        >
          {welcome}
        </motion.p>

        <motion.div
          className="space-y-4 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroTitleLines />
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight px-2">
            {main}
          </h1>
          <HeroTitleLines />
        </motion.div>

        <motion.p
          className="text-sm md:text-base lg:text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
        >
          {subtitle ||
            "Luxury Wedding & Event Destination — Rooms, Banquets, Catering, Pool & Party Lawns"}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Link href="/booking" className="hero-btn-primary">
              <Calendar size={18} strokeWidth={2.5} />
              Book Your Event
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Link href="/packages" className="hero-btn-outline">
              <Gift size={18} strokeWidth={2.5} />
              View Packages
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator on the curve */}
      <motion.a
        href="#about"
        className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-10 h-14 rounded-full border-2 border-gray-300/80 bg-white/95 shadow-sm pointer-events-auto"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll down"
      >
        <ChevronDown size={20} className="text-maroon/70" />
      </motion.a>
    </section>
  );
}
