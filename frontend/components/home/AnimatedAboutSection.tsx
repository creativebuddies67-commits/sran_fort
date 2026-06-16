'use client';

import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import AboutSectionVisual from '@/components/ui/AboutSectionVisual';
import { ScrollReveal, AnimatedCounter } from '@/components/ui/motion';
import { sanitizeAboutHtml, stripHtml } from '@/lib/strapi';

interface AnimatedAboutSectionProps {
  sliderImages: string[];
  youtubeWatchUrl?: string | null;
  aboutTitle: string;
  aboutContent: string;
  stats: Array<{ label: string; value: string }>;
}

export default function AnimatedAboutSection({
  sliderImages,
  youtubeWatchUrl,
  aboutTitle,
  aboutContent,
  stats,
}: AnimatedAboutSectionProps) {
  const plainText = stripHtml(sanitizeAboutHtml(aboutContent));
  const preview =
    plainText.length > 300 ? `${plainText.slice(0, 300).trim()}...` : plainText;

  return (
    <section id="about" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <AboutSectionVisual
              images={sliderImages}
              youtubeWatchUrl={youtubeWatchUrl}
              title={aboutTitle}
            />
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.15}>
            <div>
              <SectionHeading subtitle="About Us" title={aboutTitle} centered={false} />
              <p className="text-gray-600 leading-relaxed mb-6">{preview}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <AnimatedCounter
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    delay={i * 0.1}
                  />
                ))}
              </div>
              <Link href="/about" className="btn-primary">
                Learn More
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
