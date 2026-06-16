import {
  ABOUT_SLIDER_IMAGES,
  DEFAULT_ABOUT_YOUTUBE_URL,
  PLACEHOLDER_IMAGES,
} from './constants';
import { getSiteImageUrl, getSiteMultipleImageUrls } from './images';
import {
  getSiteVideoUrl,
  getYouTubeVideoId,
  toYouTubeEmbedUrl,
} from './strapi';
import type { SiteSetting } from './types';

export interface AboutMediaData {
  posterUrl: string;
  sliderImages: string[];
  videoFileUrl: string | null;
  youtubeVideoId: string | null;
  youtubeEmbedUrl: string | null;
  youtubeWatchUrl: string | null;
}

const MAX_SLIDER_IMAGES = 12;

export function getAboutMediaData(
  site: Pick<SiteSetting, 'aboutImage' | 'aboutImages' | 'aboutVideo' | 'aboutVideoUrl'>
): AboutMediaData {
  const posterUrl = getSiteImageUrl(site.aboutImage, PLACEHOLDER_IMAGES.about);

  const youtubeSource =
    site.aboutVideoUrl?.trim() ||
    process.env.NEXT_PUBLIC_ABOUT_YOUTUBE_URL?.trim() ||
    DEFAULT_ABOUT_YOUTUBE_URL;

  const youtubeVideoId = getYouTubeVideoId(youtubeSource);
  const youtubeEmbedUrl = youtubeVideoId
    ? toYouTubeEmbedUrl(youtubeSource, { autoplay: true })
    : null;
  const youtubeWatchUrl = youtubeVideoId
    ? `https://www.youtube.com/watch?v=${youtubeVideoId}`
    : null;

  const videoFileUrl = youtubeVideoId ? null : getSiteVideoUrl(site.aboutVideo);

  const strapiSliderImages = getSiteMultipleImageUrls(site.aboutImages, []);
  const sliderImages =
    strapiSliderImages.length > 0
      ? strapiSliderImages.slice(0, MAX_SLIDER_IMAGES)
      : [
          posterUrl,
          ...ABOUT_SLIDER_IMAGES.filter((img) => img !== posterUrl),
        ].slice(0, 5);

  return {
    posterUrl,
    sliderImages,
    videoFileUrl,
    youtubeVideoId,
    youtubeEmbedUrl,
    youtubeWatchUrl,
  };
}

export function hasAboutVideo(data: AboutMediaData): boolean {
  return Boolean(data.videoFileUrl || data.youtubeEmbedUrl);
}
