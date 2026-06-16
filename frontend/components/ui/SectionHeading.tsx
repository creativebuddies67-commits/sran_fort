interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  light?: boolean;
  centered?: boolean;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  light = false,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <p className={`text-sm tracking-[0.3em] uppercase mb-2 ${light ? 'text-gold' : 'text-maroon'}`}>
          {subtitle}
        </p>
      )}
      <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${light ? 'text-white' : 'text-charcoal'}`}>
        {title}
      </h2>
      <div className={`section-divider mb-4 ${centered ? 'mx-auto' : ''}`} />
      {description && (
        <p className={`max-w-2xl text-lg leading-relaxed ${centered ? 'mx-auto' : ''} ${light ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
