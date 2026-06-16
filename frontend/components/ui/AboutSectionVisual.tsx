import AboutImageSlider from './AboutImageSlider';

interface AboutSectionVisualProps {
  images: string[];
  youtubeWatchUrl?: string | null;
  title?: string;
  className?: string;
}

export default function AboutSectionVisual({
  images,
  youtubeWatchUrl,
  title = 'Sran Fort Marriage Palace',
  className,
}: AboutSectionVisualProps) {
  return (
    <div className="space-y-3">
      <AboutImageSlider
        images={images}
        alt={title}
        intervalMs={2000}
        className={className ?? 'relative h-80 lg:h-[450px]'}
      />

      {youtubeWatchUrl && (
        <p className="text-sm text-center">
          <a
            href={youtubeWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-maroon font-semibold hover:text-gold transition-colors underline underline-offset-2"
          >
            Video link
          </a>
        </p>
      )}
    </div>
  );
}
