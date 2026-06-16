export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: StrapiImage;
  } | null;
}

export interface StrapiMediaArray {
  data: Array<{
    id: number;
    attributes: StrapiImage;
  }>;
}

export interface Room {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  capacity: number;
  amenities?: string[];
  featured: boolean;
  images?: StrapiMediaArray;
}

export interface WeddingPackage {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  features?: string[];
  tier: 'silver' | 'gold' | 'platinum' | 'royal';
  featured: boolean;
  images?: StrapiMediaArray;
}

export interface Decoration {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category: string;
  priceRange?: string;
  featured: boolean;
  images?: StrapiMediaArray;
}

export interface GalleryItem {
  id: number;
  documentId?: string;
  title: string;
  category: string;
  featured: boolean;
  sortOrder: number;
  image?: StrapiMedia;
}

export interface Testimonial {
  id: number;
  documentId?: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  eventType?: string;
  featured: boolean;
  avatar?: StrapiMedia;
}

export interface Catering {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  menuItems?: string[];
  pricePerPlate?: number;
  cuisineType: string;
  dietType: string;
  featured: boolean;
  images?: StrapiMediaArray;
}

export interface SiteSetting {
  id: number;
  siteName: string;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutContent?: string;
  email?: string;
  phone?: string;
  phoneSecondary?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  googleBusinessUrl?: string;
  whatsappUrl?: string;
  whatsappNumber?: string;
  checkInTime?: string;
  checkOutTime?: string;
  stats?: Array<{ label: string; value: string }>;
  logo?: StrapiMedia;
  heroImage?: StrapiMedia;
  aboutImage?: StrapiMedia;
  aboutImages?: StrapiMediaArray;
  aboutVideo?: StrapiMedia;
  aboutVideoUrl?: string;
  ctaImage?: StrapiMedia;
}

export interface TestimonialWithAvatar extends Testimonial {
  avatarUrl?: string;
}

export interface BookingInquiry {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate?: string;
  guestCount?: number;
  message?: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
