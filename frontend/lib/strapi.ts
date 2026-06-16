const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export function getStrapiURL(path = '') {
  return `${STRAPI_URL}${path}`;
}

export function getStrapiMediaURL(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return getStrapiURL(url);
}

interface FetchOptions {
  method?: string;
  body?: unknown;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export async function fetchAPI<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const { method = 'GET', body, cache, next } = options;

  try {
    const res = await fetch(getStrapiURL(`/api${path}`), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: cache ?? (method === 'GET' ? 'force-cache' : 'no-store'),
      next: next ?? (method === 'GET' ? { revalidate: 60, tags: ['strapi'] } : undefined),
    });

    if (!res.ok) {
      console.error(`Strapi API error: ${res.status} ${path}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(`Strapi fetch failed: ${path}`, error);
    return null;
  }
}

export async function getSiteSettings() {
  return fetchAPI<{ data: import('./types').SiteSetting }>(
    '/site-setting?populate=*'
  );
}

export async function getRooms(featured?: boolean) {
  const filters = featured ? '&filters[featured][$eq]=true' : '';
  return fetchAPI<{ data: import('./types').Room[] }>(
    `/rooms?populate=images&sort=price:desc${filters}`
  );
}

export async function getWeddingPackages(featured?: boolean) {
  const filters = featured ? '&filters[featured][$eq]=true' : '';
  return fetchAPI<{ data: import('./types').WeddingPackage[] }>(
    `/wedding-packages?populate=images&sort=price:asc${filters}`
  );
}

export async function getDecorations(featured?: boolean) {
  const filters = featured ? '&filters[featured][$eq]=true' : '';
  return fetchAPI<{ data: import('./types').Decoration[] }>(
    `/decorations?populate=images&sort=name:asc${filters}`
  );
}

export async function getGalleryItems(category?: string) {
  const filters = category ? `&filters[category][$eq]=${category}` : '';
  return fetchAPI<{ data: import('./types').GalleryItem[] }>(
    `/gallery-items?populate=image&sort=sortOrder:asc${filters}`
  );
}

export async function getTestimonials(featured?: boolean) {
  const filters = featured ? '&filters[featured][$eq]=true' : '';
  return fetchAPI<{ data: import('./types').Testimonial[] }>(
    `/testimonials?populate=avatar&sort=createdAt:desc${filters}`
  );
}

export async function getCaterings(featured?: boolean) {
  const filters = featured ? '&filters[featured][$eq]=true' : '';
  return fetchAPI<{ data: import('./types').Catering[] }>(
    `/caterings?populate=images&sort=pricePerPlate:asc${filters}`
  );
}

export async function submitBookingInquiry(data: import('./types').BookingInquiry) {
  // Use Next.js API proxy so submissions work from localhost AND LAN IPs (e.g. 192.168.x.x)
  try {
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json() as Promise<{ data: unknown }>;
  } catch (error) {
    console.error('Booking submission failed:', error);
    return null;
  }
}

// Strapi v5 returns flat objects; images may be array or nested under data
export function getImageUrl(
  images?: unknown,
  fallback = '/images/room-1.jpg'
): string {
  if (!images) return fallback;

  if (Array.isArray(images)) {
    const first = images[0] as { url?: string } | undefined;
    return first?.url ? getStrapiMediaURL(first.url) : fallback;
  }

  const obj = images as { data?: Array<{ url?: string }> | { url?: string } | null; url?: string };
  if (obj.url) return getStrapiMediaURL(obj.url);

  const data = obj.data;
  if (!data) return fallback;

  if (Array.isArray(data)) {
    return data[0]?.url ? getStrapiMediaURL(data[0].url) : fallback;
  }

  return data.url ? getStrapiMediaURL(data.url) : fallback;
}

export function getSingleImageUrl(
  image?: unknown,
  fallback = '/images/hero.jpg'
): string {
  if (!image) return fallback;

  const obj = image as {
    url?: string;
    mime?: string;
    formats?: {
      large?: { url?: string };
      medium?: { url?: string };
      small?: { url?: string };
    };
    data?: { url?: string; mime?: string } | null;
  };

  const mime = obj.mime ?? obj.data?.mime;
  if (mime && !mime.startsWith('image/')) return fallback;

  const url =
    obj.url ??
    obj.data?.url ??
    obj.formats?.large?.url ??
    obj.formats?.medium?.url ??
    obj.formats?.small?.url;

  return url ? getStrapiMediaURL(url) : fallback;
}

function extractImageUrl(item: unknown): string | null {
  if (!item || typeof item !== 'object') return null;

  const obj = item as {
    url?: string;
    mime?: string;
    attributes?: { url?: string; mime?: string };
    data?: { url?: string; mime?: string; attributes?: { url?: string; mime?: string } } | null;
    formats?: {
      large?: { url?: string };
      medium?: { url?: string };
      small?: { url?: string };
    };
  };

  const mime =
    obj.mime ??
    obj.attributes?.mime ??
    obj.data?.mime ??
    obj.data?.attributes?.mime;
  if (mime && !mime.startsWith('image/')) return null;

  const url =
    obj.url ??
    obj.attributes?.url ??
    obj.data?.url ??
    obj.data?.attributes?.url ??
    obj.formats?.large?.url ??
    obj.formats?.medium?.url ??
    obj.formats?.small?.url;

  return url ? getStrapiMediaURL(url) : null;
}

/** All image URLs from a Strapi multiple-media field (v4/v5 shapes) */
export function getMultipleImageUrls(
  images?: unknown,
  fallback: string[] = []
): string[] {
  if (!images) return fallback;

  if (Array.isArray(images)) {
    const urls = images
      .map(extractImageUrl)
      .filter((url): url is string => Boolean(url));
    return urls.length > 0 ? urls : fallback;
  }

  const obj = images as { data?: unknown };
  if (Array.isArray(obj.data)) {
    const urls = obj.data
      .map(extractImageUrl)
      .filter((url): url is string => Boolean(url));
    return urls.length > 0 ? urls : fallback;
  }

  const single = extractImageUrl(images);
  return single ? [single] : fallback;
}

export function getSiteVideoUrl(video?: unknown): string | null {
  if (!video) return null;

  const obj = video as {
    url?: string;
    mime?: string;
    data?: { url?: string; mime?: string } | null;
  };

  const mime = obj.mime ?? obj.data?.mime;
  if (!mime?.startsWith('video/')) return null;

  const url = obj.url ?? obj.data?.url;
  return url ? getStrapiMediaURL(url) : null;
}

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace(/^\//, '').split('/')[0];
      return id || null;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const fromQuery = parsed.searchParams.get('v');
      if (fromQuery) return fromQuery;

      const embedMatch = parsed.pathname.match(/^\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) return embedMatch[1];

      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) return shortsMatch[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeVideoId(url?: string | null): string | null {
  if (!url?.trim()) return null;
  return extractYouTubeVideoId(url);
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function buildYouTubeEmbedUrl(
  videoId: string,
  options: { autoplay?: boolean } = {}
): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });

  if (options.autoplay) {
    params.set('autoplay', '1');
    params.set('mute', '1');
    params.set('loop', '1');
    params.set('playlist', videoId);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function toYouTubeEmbedUrl(
  url?: string | null,
  options: { autoplay?: boolean } = { autoplay: true }
): string | null {
  if (!url?.trim()) return null;

  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return buildYouTubeEmbedUrl(videoId, options);
}

/** Strip embedded media from rich text — use About Video field instead */
export function sanitizeAboutHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<video[\s\S]*?<\/video>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<embed[^>]*\/?>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}
