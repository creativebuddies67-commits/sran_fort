import type { Core } from '@strapi/strapi';
import { seedMedia, updateSiteSettings, publishExistingGallery, attachMissingMedia } from './utils/seed-media';

const PUBLIC_READ_ACTIONS = [
  'api::room.room.find',
  'api::room.room.findOne',
  'api::wedding-package.wedding-package.find',
  'api::wedding-package.wedding-package.findOne',
  'api::decoration.decoration.find',
  'api::decoration.decoration.findOne',
  'api::gallery-item.gallery-item.find',
  'api::gallery-item.gallery-item.findOne',
  'api::testimonial.testimonial.find',
  'api::testimonial.testimonial.findOne',
  'api::catering.catering.find',
  'api::catering.catering.findOne',
  'api::site-setting.site-setting.find',
];

const PUBLIC_WRITE_ACTIONS = ['api::booking-inquiry.booking-inquiry.create'];

async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const existing = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({ where: { role: publicRole.id } });

  const existingActions = new Set(existing.map((p: { action: string }) => p.action));
  const allActions = [...PUBLIC_READ_ACTIONS, ...PUBLIC_WRITE_ACTIONS];

  for (const action of allActions) {
    if (!existingActions.has(action)) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  }
}

async function seedContent(strapi: Core.Strapi) {
  const roomCount = await strapi.db.query('api::room.room').count();
  if (roomCount === 0) {
    const rooms = [
      {
        name: 'Royal Suite',
        slug: 'royal-suite',
        shortDescription: 'Our most luxurious suite with panoramic views and premium amenities.',
        description: '<p>Experience unparalleled luxury in our Royal Suite, featuring elegant décor, a king-size bed, jacuzzi, and a private balcony overlooking the palace grounds.</p>',
        price: 8500,
        capacity: 4,
        amenities: ['King Bed', 'Jacuzzi', 'Mini Bar', 'Smart TV', 'Room Service', 'Wi-Fi'],
        featured: true,
        publishedAt: new Date(),
      },
      {
        name: 'Super Deluxe Room',
        slug: 'super-deluxe',
        shortDescription: 'Spacious comfort with modern amenities for a memorable stay.',
        description: '<p>Our Super Deluxe rooms offer the perfect blend of comfort and elegance, ideal for wedding guests and families.</p>',
        price: 5500,
        capacity: 3,
        amenities: ['Queen Bed', 'AC', 'Smart TV', 'Wi-Fi', 'Room Service'],
        featured: true,
        publishedAt: new Date(),
      },
      {
        name: 'Deluxe Room',
        slug: 'deluxe',
        shortDescription: 'Comfortable and well-appointed rooms at great value.',
        description: '<p>Perfect for guests attending your celebration, our Deluxe rooms provide all essential comforts.</p>',
        price: 3500,
        capacity: 2,
        amenities: ['Double Bed', 'AC', 'TV', 'Wi-Fi'],
        featured: false,
        publishedAt: new Date(),
      },
    ];
    for (const room of rooms) {
      await strapi.db.query('api::room.room').create({ data: room });
    }
  }

  const packageCount = await strapi.db.query('api::wedding-package.wedding-package').count();
  if (packageCount === 0) {
    const packages = [
      {
        name: 'Silver Package',
        slug: 'silver-package',
        shortDescription: 'Perfect for intimate gatherings with essential wedding services.',
        description: '<p>Includes venue decoration, basic catering for up to 200 guests, and standard sound system.</p>',
        price: 150000,
        tier: 'silver',
        features: ['Venue for 200 guests', 'Basic Mandap Setup', 'Standard Catering', 'Sound System', 'Parking'],
        featured: false,
        publishedAt: new Date(),
      },
      {
        name: 'Gold Package',
        slug: 'gold-package',
        shortDescription: 'Our most popular package with premium decoration and catering.',
        description: '<p>Everything you need for a grand celebration including premium décor, multi-cuisine catering, and professional photography coordination.</p>',
        price: 350000,
        tier: 'gold',
        features: ['Venue for 500 guests', 'Premium Mandap & Stage', 'Multi-Cuisine Catering', 'DJ & Sound', 'Bridal Room', 'Valet Parking'],
        featured: true,
        publishedAt: new Date(),
      },
      {
        name: 'Royal Package',
        slug: 'royal-package',
        shortDescription: 'The ultimate wedding experience with every luxury included.',
        description: '<p>Our flagship package for the most discerning couples — bespoke décor, gourmet catering, live entertainment, and dedicated event manager.</p>',
        price: 750000,
        tier: 'royal',
        features: ['Venue for 1000+ guests', 'Bespoke Theme Décor', 'Gourmet Multi-Cuisine', 'Live Band & DJ', 'Bridal Suite', 'Fireworks', 'Dedicated Event Manager'],
        featured: true,
        publishedAt: new Date(),
      },
    ];
    for (const pkg of packages) {
      await strapi.db.query('api::wedding-package.wedding-package').create({ data: pkg });
    }
  }

  const decorationCount = await strapi.db.query('api::decoration.decoration').count();
  if (decorationCount === 0) {
    const decorations = [
      {
        name: 'Royal Mandap',
        slug: 'royal-mandap',
        shortDescription: 'Grand mandap setup with floral arches and golden accents.',
        description: '<p>A majestic mandap design featuring fresh flowers, golden drapes, and traditional Rajasthani elements.</p>',
        category: 'mandap',
        priceRange: '₹50,000 – ₹1,50,000',
        featured: true,
        publishedAt: new Date(),
      },
      {
        name: 'Floral Wonderland',
        slug: 'floral-wonderland',
        shortDescription: 'Lush floral arrangements for stage and venue.',
        description: '<p>Transform your venue into a floral paradise with roses, marigolds, and exotic blooms.</p>',
        category: 'floral',
        priceRange: '₹30,000 – ₹80,000',
        featured: true,
        publishedAt: new Date(),
      },
      {
        name: 'Grand Entrance',
        slug: 'grand-entrance',
        shortDescription: 'Stunning entrance décor for the bride and groom.',
        description: '<p>Make a grand first impression with illuminated pathways, flower showers, and custom signage.</p>',
        category: 'entrance',
        priceRange: '₹25,000 – ₹60,000',
        featured: false,
        publishedAt: new Date(),
      },
    ];
    for (const deco of decorations) {
      await strapi.db.query('api::decoration.decoration').create({ data: deco });
    }
  }

  const cateringCount = await strapi.db.query('api::catering.catering').count();
  if (cateringCount === 0) {
    const caterings = [
      {
        name: 'Royal Feast',
        slug: 'royal-feast',
        shortDescription: 'Premium multi-cuisine buffet with live counters.',
        description: '<p>An extravagant spread featuring North Indian, Chinese, Continental, and live chaat & pasta stations.</p>',
        pricePerPlate: 850,
        cuisineType: 'multi-cuisine',
        dietType: 'both',
        menuItems: ['Paneer Tikka', 'Dal Makhani', 'Biryani', 'Live Pasta', 'Chaat Counter', 'Dessert Bar'],
        featured: true,
        publishedAt: new Date(),
      },
      {
        name: 'Traditional Thali',
        slug: 'traditional-thali',
        shortDescription: 'Authentic Rajasthani and North Indian thali service.',
        description: '<p>Classic Rajasthani flavours served in traditional style — perfect for mehendi and sangeet functions.</p>',
        pricePerPlate: 550,
        cuisineType: 'north-indian',
        dietType: 'veg',
        menuItems: ['Dal Baati Churma', 'Gatte ki Sabzi', 'Ker Sangri', 'Missi Roti', 'Ghevar'],
        featured: true,
        publishedAt: new Date(),
      },
    ];
    for (const cat of caterings) {
      await strapi.db.query('api::catering.catering').create({ data: cat });
    }
  }

  const testimonialCount = await strapi.db.query('api::testimonial.testimonial').count();
  if (testimonialCount === 0) {
    const testimonials = [
      {
        name: 'Rajesh & Priya Sharma',
        role: 'Wedding Couple',
        content: 'Our wedding at Sran Fort was absolutely magical. The team handled everything flawlessly — from décor to catering. Our guests are still talking about it!',
        rating: 5,
        eventType: 'Wedding',
        featured: true,
        publishedAt: new Date(),
      },
      {
        name: 'Amit Kumar',
        role: 'Corporate Event Organizer',
        content: 'We hosted our annual conference here and the experience was top-notch. Professional staff, excellent food, and beautiful banquet halls.',
        rating: 5,
        eventType: 'Corporate',
        featured: true,
        publishedAt: new Date(),
      },
      {
        name: 'Sunita Devi',
        role: 'Family Celebration',
        content: 'The rooms were spotless, food was delicious, and the decoration for our daughter\'s engagement was breathtaking. Highly recommended!',
        rating: 5,
        eventType: 'Engagement',
        featured: true,
        publishedAt: new Date(),
      },
    ];
    for (const t of testimonials) {
      await strapi.db.query('api::testimonial.testimonial').create({ data: t });
    }
  }

  const siteSetting = await strapi.db.query('api::site-setting.site-setting').findOne();
  if (!siteSetting) {
    await strapi.db.query('api::site-setting.site-setting').create({
      data: {
        siteName: 'Sran Fort Marriage Palace',
        tagline: 'Where Dreams Become Forever',
        heroTitle: 'Welcome to Sran Fort Marriage Palace',
        heroSubtitle: 'Luxury Wedding & Event Destination — Rooms, Banquets, Catering, Pool & Party Lawns',
        aboutTitle: 'Your Premier Marriage Palace',
        aboutContent: '<p>Sran Fort Marriage Palace is a luxurious haven where timeless traditions meet modern elegance. Nestled in the heart of Rajasthan, we offer world-class hospitality for weddings, receptions, corporate events, and celebrations of every kind.</p><p>Our passion for perfection drives us to create the finest experiences — from bespoke wedding décor and gourmet catering to opulent guest rooms and sprawling banquet halls.</p><p>At Sran Fort, we\'re not just a venue — we\'re your dreams brought to life.</p>',
        email: 'info@sranfort.com',
        phone: '+91 98765 43210',
        phoneSecondary: '+91 98765 43211',
        address: 'Sran Fort Marriage Palace, Main Bypass Road, Rajasthan 335513',
        whatsappNumber: '919876543210',
        checkInTime: '02:00 PM',
        checkOutTime: '10:00 AM',
        stats: [
          { label: 'Events Hosted', value: '500+' },
          { label: 'Happy Couples', value: '1000+' },
          { label: 'Guest Capacity', value: '2000+' },
          { label: 'Years of Excellence', value: '15+' },
        ],
      },
    });
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions(strapi);
    await seedContent(strapi);
    await updateSiteSettings(strapi);
    await seedMedia(strapi);
    await publishExistingGallery(strapi);
    await attachMissingMedia(strapi);
  },
};
