'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface AboutMediaProps {
  posterUrl: string;
  videoFileUrl?: string | null;
  youtubeVideoId?: string | null;
  youtubeWatchUrl?: string | null;
  title?: string;
  className?: string;
}

function buildEmbedSrc(videoId: string, autoplay: boolean): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
  });

  if (typeof window !== 'undefined') {
    params.set('origin', window.location.origin);
  }

  if (autoplay) {
    params.set('autoplay', '1');
    params.set('mute', '1');
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export default function AboutMedia({
  posterUrl,
  videoFileUrl,
  youtubeVideoId,
  youtubeWatchUrl,
  title = 'About Sran Fort Marriage Palace',
  className = 'relative h-80 lg:h-[450px]',
}: AboutMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);

  const startVideo = useCallback(() => {
    if (!youtubeVideoId || playing) return;
    setEmbedSrc(buildEmbedSrc(youtubeVideoId, true));
    setPlaying(true);
  }, [youtubeVideoId, playing]);

  // Autoplay when About section scrolls into view
  useEffect(() => {
    if (!youtubeVideoId || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startVideo();
      },
      { threshold: 0.4 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [youtubeVideoId, startVideo]);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className={`${className} relative rounded-lg overflow-hidden shadow-xl ring-1 ring-gold/20 bg-charcoal`}
      >
        {playing && embedSrc && youtubeVideoId ? (
          <iframe
            src={embedSrc}
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : youtubeVideoId ? (
          <button
            type="button"
            onClick={startVideo}
            className="absolute inset-0 w-full h-full group cursor-pointer z-10"
            aria-label={`Play video: ${title}`}
          >
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <span className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-maroon/95 border-2 border-gold flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play size={34} className="text-gold fill-gold ml-1" />
              </span>
            </span>
          </button>
        ) : videoFileUrl ? (
          <video
            src={videoFileUrl}
            poster={posterUrl}
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
      </div>

      {youtubeWatchUrl && (
        <p className="text-xs text-gray-500 text-center">
          Video not playing?{' '}
          <a
            href={youtubeWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-maroon hover:text-gold underline"
          >
            Open on YouTube
          </a>
        </p>
      )}
    </div>
  );
}
