import { MAP_EMBED_URL, MAP_DIRECTIONS_URL, ADDRESS } from '@/lib/constants';

interface GoogleMapProps {
  height?: string;
  showDirections?: boolean;
}

export default function GoogleMap({ height = 'h-96', showDirections = true }: GoogleMapProps) {
  return (
    <section className={height}>
      <iframe
        title="Sran Fort Marriage Palace location on Google Maps"
        src={MAP_EMBED_URL}
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      {showDirections && (
        <div className="bg-cream py-4 text-center">
          <a
            href={MAP_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get directions to Sran Fort on Google Maps"
            className="text-maroon font-semibold text-sm hover:text-gold transition-colors"
          >
            Get Directions to {ADDRESS}
          </a>
        </div>
      )}
    </section>
  );
}
