import {
  getImageUrl as strapiGetImageUrl,
  getMultipleImageUrls as strapiGetMultipleImageUrls,
  getSingleImageUrl as strapiGetSingleImageUrl,
} from './strapi';

/** Set to "false" in .env.local once real images are uploaded via admin panel */
export const USE_STATIC_IMAGES =
  process.env.NEXT_PUBLIC_USE_STATIC_IMAGES !== 'false';

export const STATIC_IMAGES = {
  hero: '/images/hero.jpg',
  about: '/images/about.jpg',
  room: ['/images/room-1.jpg', '/images/room-2.jpg', '/images/room-3.jpg'],
  wedding: ['/images/wedding-1.jpg', '/images/wedding-2.jpg', '/images/wedding-3.jpg'],
  decoration: ['/images/decoration-1.jpg', '/images/decoration-2.jpg', '/images/decoration-3.jpg'],
  catering: ['/images/catering-1.jpg', '/images/catering-2.jpg'],
  gallery: [
    '/images/gallery-1.jpg',
    '/images/gallery-2.jpg',
    '/images/gallery-3.jpg',
    '/images/gallery-4.jpg',
    '/images/gallery-5.jpg',
    '/images/gallery-6.jpg',
  ],
  banquet: '/images/gallery-3.jpg',
} as const;

export const STATIC_GALLERY_ITEMS = [
  { id: 1, title: 'Grand Wedding Ceremony', category: 'wedding', featured: true, sortOrder: 1, image: STATIC_IMAGES.gallery[0] },
  { id: 2, title: 'Reception Celebration', category: 'events', featured: true, sortOrder: 2, image: STATIC_IMAGES.gallery[1] },
  { id: 3, title: 'Banquet Hall Setup', category: 'banquet', featured: true, sortOrder: 3, image: STATIC_IMAGES.gallery[2] },
  { id: 4, title: 'Bridal Portrait', category: 'wedding', featured: false, sortOrder: 4, image: STATIC_IMAGES.gallery[3] },
  { id: 5, title: 'Birthday Party', category: 'events', featured: false, sortOrder: 5, image: STATIC_IMAGES.gallery[4] },
  { id: 6, title: 'Live Music Night', category: 'events', featured: false, sortOrder: 6, image: STATIC_IMAGES.gallery[5] },
  { id: 7, title: 'Royal Suite Room', category: 'rooms', featured: true, sortOrder: 7, image: STATIC_IMAGES.room[0] },
  { id: 8, title: 'Mandap Decoration', category: 'decoration', featured: true, sortOrder: 8, image: STATIC_IMAGES.decoration[0] },
  { id: 9, title: 'Gourmet Buffet', category: 'catering', featured: true, sortOrder: 9, image: STATIC_IMAGES.catering[0] },
];

export function getStaticImage(paths: readonly string[], index = 0, fallback?: string): string {
  return paths[index] ?? paths[0] ?? fallback ?? '/images/hero.jpg';
}

export function getImageUrl(images: unknown, fallback: string): string {
  if (USE_STATIC_IMAGES) return fallback;
  return strapiGetImageUrl(images, fallback);
}

export function getSingleImageUrl(image: unknown, fallback: string): string {
  if (USE_STATIC_IMAGES) return fallback;
  return strapiGetSingleImageUrl(image, fallback);
}

/** Hero / About images from Site Settings — always use Strapi when uploaded */
export function getSiteImageUrl(image: unknown, fallback: string): string {
  return strapiGetSingleImageUrl(image, fallback);
}

/** About Us slider images from Site Settings — always use Strapi when uploaded */
export function getSiteMultipleImageUrls(
  images: unknown,
  fallback: readonly string[] = []
): string[] {
  return strapiGetMultipleImageUrls(images, [...fallback]);
}

/** Gallery item image — supports static string path or Strapi media object */
export function getGalleryImageUrl(image: unknown, fallback: string): string {
  if (USE_STATIC_IMAGES) {
    if (typeof image === 'string') return image;
    return fallback;
  }
  if (typeof image === 'string') return image;
  return strapiGetSingleImageUrl(image, fallback);
}

export function getGalleryItems<T extends { id: number; title: string; category: string; featured: boolean; sortOrder: number; image?: unknown }>(
  apiItems: T[]
): Array<T | (typeof STATIC_GALLERY_ITEMS)[number]> {
  if (USE_STATIC_IMAGES || apiItems.length === 0) {
    return STATIC_GALLERY_ITEMS;
  }
  return apiItems;
}
