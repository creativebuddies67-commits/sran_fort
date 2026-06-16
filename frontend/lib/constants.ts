import type { SiteSetting } from './types';
import type { Testimonial } from './types';

export const SITE_NAME = 'Sran Fort Marriage Palace';

/** Default About Us YouTube video — override in Strapi Site Settings → About Video Url */
export const DEFAULT_ABOUT_YOUTUBE_URL =
  'https://youtu.be/sesx8Q4Gs6A';

/** About Us image slider — auto-rotates every 2 seconds */
export const ABOUT_SLIDER_IMAGES = [
  '/images/about.jpg',
  '/images/gallery-1.jpg',
  '/images/wedding-1.jpg',
  '/images/gallery-2.jpg',
  '/images/wedding-2.jpg',
] as const;

export const ADDRESS =
  'Sran Fort, Sangria Road, Near Manaksar Village, Hanumangarh, Rajasthan';

export const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=Sran+Fort+Sangria+Road+Near+Manaksar+Village+Hanumangarh+Rajasthan&output=embed';

export const MAP_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Sran+Fort,+Sangria+Road,+Near+Manaksar+Village,+Hanumangarh,+Rajasthan';

export const HOTEL_INFO = {
  checkIn: '10:00 AM',
  checkOut: '10:00 AM',
  minAge: 18,
  parking: 'Complimentary On-Site Parking',
};

export const PRICING_CTA = {
  contact: 'Contact Us for Pricing',
  quote: 'Get a Custom Quote',
  enquire: 'Enquire Now',
} as const;

export const SOCIAL_LINKS = {
  googleBusiness: {
    url: 'https://g.co/kgs/Gfq1c5K',
    label: 'Google Business Profile',
  },
  youtube: {
    url: 'https://www.youtube.com/@sranfortpalace',
    label: 'YouTube',
  },
  instagram: {
    url: 'https://www.instagram.com/sranfort_palace?igsh=aDFjdDVpeDl5bDMy',
    label: 'Instagram',
  },
  facebook: {
    url: 'https://www.facebook.com/Sranfort?mibextid=ZbWKwL',
    label: 'Facebook',
  },
  whatsapp: {
    url: 'https://wa.me/917734910001',
    label: 'WhatsApp',
  },
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/packages', label: 'Wedding Packages' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/catering', label: 'Catering' },
  { href: '/decoration', label: 'Decoration' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/testimonials', label: 'Customer Reviews' },
  { href: '/contact', label: 'Contact' },
];

export const SERVICES = [
  { icon: 'Heart', title: 'Weddings', description: 'Dream weddings crafted with perfection' },
  { icon: 'PartyPopper', title: 'Events & Parties', description: 'Birthdays, anniversaries & celebrations' },
  { icon: 'UtensilsCrossed', title: 'Catering', description: 'Gourmet multi-cuisine dining' },
  { icon: 'Flower2', title: 'Decoration', description: 'Bespoke floral & theme décor' },
  { icon: 'Building2', title: 'Banquet Halls', description: 'Grand halls for every occasion' },
  { icon: 'Bed', title: 'Luxury Rooms', description: 'Comfortable stays for your guests' },
];

export const GALLERY_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'wedding', label: 'Weddings' },
  { value: 'events', label: 'Events' },
  { value: 'rooms', label: 'Rooms' },
  { value: 'catering', label: 'Catering' },
  { value: 'decoration', label: 'Decoration' },
  { value: 'banquet', label: 'Banquet' },
];

export const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'reception', label: 'Reception' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'other', label: 'Other' },
];

export const PLACEHOLDER_IMAGES = {
  hero: '/images/hero.jpg',
  about: '/images/about.jpg',
  room: '/images/room-1.jpg',
  wedding: '/images/wedding-1.jpg',
  decoration: '/images/decoration-1.jpg',
  catering: '/images/catering-1.jpg',
  gallery: '/images/gallery-1.jpg',
  banquet: '/images/gallery-3.jpg',
};

export { USE_STATIC_IMAGES, STATIC_IMAGES, getStaticImage, getImageUrl, getSingleImageUrl, getSiteImageUrl, getGalleryImageUrl, getGalleryItems } from './images';

export const DEFAULT_REVIEWS: Testimonial[] = [
  {
    id: 1,
    name: 'Rajesh & Priya Sharma',
    role: 'Wedding Couple',
    content: 'Our wedding at Sran Fort was absolutely magical. The team handled everything flawlessly — from décor to catering. Our guests are still talking about it!',
    rating: 5,
    eventType: 'Wedding',
    featured: true,
  },
  {
    id: 2,
    name: 'Amit Kumar',
    role: 'Corporate Event Organizer',
    content: 'We hosted our annual conference here and the experience was top-notch. Professional staff, excellent food, and beautiful banquet halls.',
    rating: 5,
    eventType: 'Corporate',
    featured: true,
  },
  {
    id: 3,
    name: 'Sunita Devi',
    role: 'Family Celebration',
    content: 'The rooms were spotless, food was delicious, and the decoration for our daughter\'s engagement was breathtaking. Highly recommended!',
    rating: 5,
    eventType: 'Engagement',
    featured: true,
  },
  {
    id: 4,
    name: 'Pankaj Bansal',
    role: 'Guest',
    content: 'Sran Fort is a five-star gem with remarkable amenities, tantalizing food, and an unwavering commitment to cleanliness. A destination I wholeheartedly recommend.',
    rating: 5,
    eventType: 'Wedding',
    featured: true,
  },
];

export const DEFAULT_SITE: SiteSetting = {
  id: 0,
  siteName: SITE_NAME,
  tagline: 'Where Dreams Become Forever',
  heroTitle: 'Welcome to Sran Fort Marriage Palace',
  heroSubtitle: 'Luxury Wedding & Event Destination — Rooms, Banquets, Catering, Pool & Party Lawns',
  aboutTitle: 'Your Premier Marriage Palace in Hanumangarh',
  aboutContent:
    'Sran Fort Marriage Palace is a luxurious heritage venue where timeless Rajasthani traditions meet modern elegance. Located on Sangria Road near Manaksar Village in Hanumangarh, we offer world-class hospitality for weddings, receptions, corporate events, and celebrations of every kind.',
  email: 'beant.singh36@gmail.com',
  phone: '+91 77349 10001',
  phoneSecondary: '+91 94136 94175',
  address: ADDRESS,
  whatsappNumber: '917734910001',
  whatsappUrl: SOCIAL_LINKS.whatsapp.url,
  googleBusinessUrl: SOCIAL_LINKS.googleBusiness.url,
  facebookUrl: SOCIAL_LINKS.facebook.url,
  instagramUrl: SOCIAL_LINKS.instagram.url,
  youtubeUrl: SOCIAL_LINKS.youtube.url,
  checkInTime: HOTEL_INFO.checkIn,
  checkOutTime: HOTEL_INFO.checkOut,
  stats: [
    { label: 'Events Hosted', value: '500+' },
    { label: 'Happy Couples', value: '1000+' },
    { label: 'Guest Capacity', value: '2000+' },
    { label: 'Years of Excellence', value: '15+' },
  ],
};
