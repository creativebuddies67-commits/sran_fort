import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';

const SEED_DIR = path.join(process.cwd(), 'data', 'seed-images');

type SeedFile = {
  filename: string;
  alt: string;
};

async function uploadLocalImage(strapi: Core.Strapi, file: SeedFile) {
  const filePath = path.join(SEED_DIR, file.filename);
  if (!fs.existsSync(filePath)) {
    strapi.log.warn(`Seed image missing: ${file.filename}`);
    return null;
  }

  const stat = fs.statSync(filePath);
  if (stat.size < 1000) {
    strapi.log.warn(`Seed image too small, skipping: ${file.filename}`);
    return null;
  }

  const uploadService = strapi.plugin('upload').service('upload');
  const uploaded = await uploadService.upload({
    data: {
      fileInfo: {
        name: file.filename,
        alternativeText: file.alt,
        caption: file.alt,
      },
    },
    files: {
      filepath: filePath,
      originalFilename: file.filename,
      mimetype: 'image/jpeg',
      size: stat.size,
    },
  });

  return Array.isArray(uploaded) ? uploaded[0] : uploaded;
}

async function linkFileToEntity(
  strapi: Core.Strapi,
  fileId: number,
  relatedId: number,
  relatedType: string,
  field: string
) {
  const existing = await strapi.db.connection('files_related_mph')
    .where({ file_id: fileId, related_id: relatedId, related_type: relatedType, field })
    .first();

  if (!existing) {
    await strapi.db.connection('files_related_mph').insert({
      file_id: fileId,
      related_id: relatedId,
      related_type: relatedType,
      field,
      order: 1,
    });
  }
}

async function updateWithImages(
  strapi: Core.Strapi,
  uid: string,
  entityId: number,
  field: string,
  fileIds: number[]
) {
  for (const fileId of fileIds) {
    await linkFileToEntity(strapi, fileId, entityId, uid, field);
  }
}

export async function seedMedia(strapi: Core.Strapi) {
  if (!fs.existsSync(SEED_DIR)) {
    strapi.log.warn('Seed images directory not found, skipping media seed.');
    return;
  }

  const galleryCount = await strapi.db.query('api::gallery-item.gallery-item').count();

  if (galleryCount > 0) {
    strapi.log.info('Gallery already seeded, skipping media seed.');
    return;
  }

  const fileCount = await strapi.db.query('plugin::upload.file').count();
  strapi.log.info('Seeding media files...');

  const images: Record<string, SeedFile> = {
    hero: { filename: 'hero.jpg', alt: 'Sran Fort Marriage Palace exterior' },
    about: { filename: 'about.jpg', alt: 'Elegant wedding banquet hall' },
    room1: { filename: 'room-1.jpg', alt: 'Royal Suite luxury room' },
    room2: { filename: 'room-2.jpg', alt: 'Super Deluxe room' },
    room3: { filename: 'room-3.jpg', alt: 'Deluxe room' },
    wedding1: { filename: 'wedding-1.jpg', alt: 'Wedding ceremony setup' },
    wedding2: { filename: 'wedding-2.jpg', alt: 'Grand wedding celebration' },
    wedding3: { filename: 'wedding-3.jpg', alt: 'Royal wedding reception' },
    decoration1: { filename: 'decoration-1.jpg', alt: 'Royal mandap decoration' },
    decoration2: { filename: 'decoration-2.jpg', alt: 'Floral stage decoration' },
    decoration3: { filename: 'decoration-3.jpg', alt: 'Grand entrance decoration' },
    catering1: { filename: 'catering-1.jpg', alt: 'Gourmet catering buffet' },
    catering2: { filename: 'catering-2.jpg', alt: 'Multi-cuisine dining spread' },
    gallery1: { filename: 'gallery-1.jpg', alt: 'Wedding celebration' },
    gallery2: { filename: 'gallery-2.jpg', alt: 'Event party' },
    gallery3: { filename: 'gallery-3.jpg', alt: 'Banquet hall' },
    gallery4: { filename: 'gallery-4.jpg', alt: 'Couple portrait' },
    gallery5: { filename: 'gallery-5.jpg', alt: 'Birthday celebration' },
    gallery6: { filename: 'gallery-6.jpg', alt: 'Live music event' },
  };

  const uploaded: Record<string, { id: number } | null> = {};

  // Re-use existing uploads if already present
  if (fileCount > 0) {
    const existingFiles = await strapi.db.query('plugin::upload.file').findMany();
    for (const f of existingFiles) {
      const key = Object.entries(images).find(([, v]) => v.filename === f.name)?.[0];
      if (key) uploaded[key] = { id: f.id };
    }
  }

  for (const [key, file] of Object.entries(images)) {
    if (!uploaded[key]) {
      uploaded[key] = await uploadLocalImage(strapi, file);
    }
  }

  const id = (key: string) => uploaded[key]?.id;

  // Site settings
  const siteSetting = await strapi.db.query('api::site-setting.site-setting').findOne();
  if (siteSetting?.id) {
    const heroId = id('hero');
    const aboutId = id('about');
    if (heroId) await linkFileToEntity(strapi, heroId, siteSetting.id, 'api::site-setting.site-setting', 'heroImage');
    if (aboutId) await linkFileToEntity(strapi, aboutId, siteSetting.id, 'api::site-setting.site-setting', 'aboutImage');
    const aboutSliderIds = ['about', 'gallery1', 'gallery2', 'wedding1', 'wedding2']
      .map((key) => id(key))
      .filter((fileId): fileId is number => Boolean(fileId));
    if (aboutSliderIds.length > 0) {
      await updateWithImages(
        strapi,
        'api::site-setting.site-setting',
        siteSetting.id,
        'aboutImages',
        aboutSliderIds
      );
    }
    const ctaId = id('wedding1');
    if (ctaId) await linkFileToEntity(strapi, ctaId, siteSetting.id, 'api::site-setting.site-setting', 'ctaImage');
  }

  // Rooms
  const rooms = await strapi.db.query('api::room.room').findMany({ orderBy: { id: 'asc' } });
  const roomImages = ['room1', 'room2', 'room3'];
  for (let i = 0; i < rooms.length && i < roomImages.length; i++) {
    const fileId = id(roomImages[i]);
    if (fileId && rooms[i].id) {
      await updateWithImages(strapi, 'api::room.room', rooms[i].id, 'images', [fileId]);
    }
  }

  // Wedding packages
  const packages = await strapi.db.query('api::wedding-package.wedding-package').findMany({ orderBy: { id: 'asc' } });
  const pkgImages = ['wedding1', 'wedding2', 'wedding3'];
  for (let i = 0; i < packages.length && i < pkgImages.length; i++) {
    const fileId = id(pkgImages[i]);
    if (fileId && packages[i].id) {
      await updateWithImages(strapi, 'api::wedding-package.wedding-package', packages[i].id, 'images', [fileId]);
    }
  }

  // Decorations
  const decorations = await strapi.db.query('api::decoration.decoration').findMany({ orderBy: { id: 'asc' } });
  const decoImages = ['decoration1', 'decoration2', 'decoration3'];
  for (let i = 0; i < decorations.length && i < decoImages.length; i++) {
    const fileId = id(decoImages[i]);
    if (fileId && decorations[i].id) {
      await updateWithImages(strapi, 'api::decoration.decoration', decorations[i].id, 'images', [fileId]);
    }
  }

  // Catering
  const caterings = await strapi.db.query('api::catering.catering').findMany({ orderBy: { id: 'asc' } });
  const catImages = ['catering1', 'catering2'];
  for (let i = 0; i < caterings.length && i < catImages.length; i++) {
    const fileId = id(catImages[i]);
    if (fileId && caterings[i].id) {
      await updateWithImages(strapi, 'api::catering.catering', caterings[i].id, 'images', [fileId]);
    }
  }

  // Gallery items
  const galleryItems: Array<{
      title: string;
      category: 'wedding' | 'events' | 'rooms' | 'catering' | 'decoration' | 'banquet';
      imageKey: string;
      featured: boolean;
      sortOrder: number;
    }> = [
      { title: 'Grand Wedding Ceremony', category: 'wedding', imageKey: 'gallery1', featured: true, sortOrder: 1 },
      { title: 'Reception Celebration', category: 'events', imageKey: 'gallery2', featured: true, sortOrder: 2 },
      { title: 'Banquet Hall Setup', category: 'banquet', imageKey: 'gallery3', featured: true, sortOrder: 3 },
      { title: 'Bridal Portrait', category: 'wedding', imageKey: 'gallery4', featured: false, sortOrder: 4 },
      { title: 'Birthday Party', category: 'events', imageKey: 'gallery5', featured: false, sortOrder: 5 },
      { title: 'Live Music Night', category: 'events', imageKey: 'gallery6', featured: false, sortOrder: 6 },
      { title: 'Royal Suite Room', category: 'rooms', imageKey: 'room1', featured: true, sortOrder: 7 },
      { title: 'Mandap Decoration', category: 'decoration', imageKey: 'decoration1', featured: true, sortOrder: 8 },
      { title: 'Gourmet Buffet', category: 'catering', imageKey: 'catering1', featured: true, sortOrder: 9 },
    ];

    for (const item of galleryItems) {
      const fileId = id(item.imageKey);
      if (!fileId) continue;
      await strapi.documents('api::gallery-item.gallery-item').create({
        data: {
          title: item.title,
          category: item.category,
          featured: item.featured,
          sortOrder: item.sortOrder,
          image: fileId,
        },
        status: 'published',
      });
    }

  strapi.log.info('Media seeding complete.');
}

export async function attachMissingMedia(strapi: Core.Strapi) {
  if (!fs.existsSync(SEED_DIR)) return;

  const images: Record<string, SeedFile> = {
    room1: { filename: 'room-1.jpg', alt: 'Royal Suite luxury room' },
    room2: { filename: 'room-2.jpg', alt: 'Super Deluxe room' },
    room3: { filename: 'room-3.jpg', alt: 'Deluxe room' },
    wedding1: { filename: 'wedding-1.jpg', alt: 'Wedding ceremony setup' },
    wedding2: { filename: 'wedding-2.jpg', alt: 'Grand wedding celebration' },
    wedding3: { filename: 'wedding-3.jpg', alt: 'Royal wedding reception' },
    decoration1: { filename: 'decoration-1.jpg', alt: 'Royal mandap decoration' },
    decoration2: { filename: 'decoration-2.jpg', alt: 'Floral stage decoration' },
    decoration3: { filename: 'decoration-3.jpg', alt: 'Grand entrance decoration' },
    catering1: { filename: 'catering-1.jpg', alt: 'Gourmet catering buffet' },
    catering2: { filename: 'catering-2.jpg', alt: 'Multi-cuisine dining spread' },
    hero: { filename: 'hero.jpg', alt: 'Sran Fort Marriage Palace exterior' },
    about: { filename: 'about.jpg', alt: 'Elegant wedding banquet hall' },
  };

  const existingFiles = await strapi.db.query('plugin::upload.file').findMany();
  const fileMap: Record<string, number> = {};
  for (const f of existingFiles) {
    const key = Object.entries(images).find(([, v]) => v.filename === f.name)?.[0];
    if (key) fileMap[key] = f.id;
  }

  const id = (key: string) => fileMap[key];

  const rooms = await strapi.db.query('api::room.room').findMany({ orderBy: { id: 'asc' } });
  const roomKeys = ['room1', 'room2', 'room3'];
  for (let i = 0; i < rooms.length && i < roomKeys.length; i++) {
    const fileId = id(roomKeys[i]);
    if (fileId && rooms[i].id) {
      await updateWithImages(strapi, 'api::room.room', rooms[i].id, 'images', [fileId]);
    }
  }

  const packages = await strapi.db.query('api::wedding-package.wedding-package').findMany({ orderBy: { id: 'asc' } });
  const pkgKeys = ['wedding1', 'wedding2', 'wedding3'];
  for (let i = 0; i < packages.length && i < pkgKeys.length; i++) {
    const fileId = id(pkgKeys[i]);
    if (fileId && packages[i].id) {
      await updateWithImages(strapi, 'api::wedding-package.wedding-package', packages[i].id, 'images', [fileId]);
    }
  }

  const decorations = await strapi.db.query('api::decoration.decoration').findMany({ orderBy: { id: 'asc' } });
  const decoKeys = ['decoration1', 'decoration2', 'decoration3'];
  for (let i = 0; i < decorations.length && i < decoKeys.length; i++) {
    const fileId = id(decoKeys[i]);
    if (fileId && decorations[i].id) {
      await updateWithImages(strapi, 'api::decoration.decoration', decorations[i].id, 'images', [fileId]);
    }
  }

  const caterings = await strapi.db.query('api::catering.catering').findMany({ orderBy: { id: 'asc' } });
  const catKeys = ['catering1', 'catering2'];
  for (let i = 0; i < caterings.length && i < catKeys.length; i++) {
    const fileId = id(catKeys[i]);
    if (fileId && caterings[i].id) {
      await updateWithImages(strapi, 'api::catering.catering', caterings[i].id, 'images', [fileId]);
    }
  }

  const siteSetting = await strapi.db.query('api::site-setting.site-setting').findOne();
  if (siteSetting?.id) {
    if (id('hero')) await linkFileToEntity(strapi, id('hero')!, siteSetting.id, 'api::site-setting.site-setting', 'heroImage');
    if (id('about')) await linkFileToEntity(strapi, id('about')!, siteSetting.id, 'api::site-setting.site-setting', 'aboutImage');
    const aboutSliderIds = ['about', 'gallery1', 'gallery2', 'wedding1', 'wedding2']
      .map((key) => id(key))
      .filter((fileId): fileId is number => Boolean(fileId));
    if (aboutSliderIds.length > 0) {
      await updateWithImages(
        strapi,
        'api::site-setting.site-setting',
        siteSetting.id,
        'aboutImages',
        aboutSliderIds
      );
    }
    const ctaId = id('wedding1');
    if (ctaId) await linkFileToEntity(strapi, ctaId, siteSetting.id, 'api::site-setting.site-setting', 'ctaImage');
  }
}

export async function publishExistingGallery(strapi: Core.Strapi) {
  const drafts = await strapi.db.query('api::gallery-item.gallery-item').findMany({
    where: { publishedAt: null },
  });

  for (const item of drafts) {
    if (item.documentId) {
      await strapi.documents('api::gallery-item.gallery-item').publish({
        documentId: item.documentId,
      });
    }
  }

  if (drafts.length > 0) {
    strapi.log.info(`Published ${drafts.length} gallery items.`);
  }
}

export async function updateSiteSettings(strapi: Core.Strapi) {
  const siteSetting = await strapi.db.query('api::site-setting.site-setting').findOne();
  if (!siteSetting?.documentId) return;

  await strapi.documents('api::site-setting.site-setting').update({
    documentId: siteSetting.documentId,
    data: {
      siteName: 'Sran Fort Marriage Palace',
      tagline: 'Where Dreams Become Forever',
      heroTitle: 'Welcome to Sran Fort Marriage Palace',
      heroSubtitle: 'Luxury Wedding & Event Destination — Rooms, Banquets, Catering, Pool & Party Lawns',
      aboutTitle: 'Your Premier Marriage Palace in Hanumangarh',
      aboutContent:
        '<p>Sran Fort Marriage Palace is a luxurious heritage venue where timeless Rajasthani traditions meet modern elegance. Located on Sangria Road near Manaksar Village in Hanumangarh, we offer world-class hospitality for weddings, receptions, corporate events, and celebrations of every kind.</p><p>Our passion for perfection drives us to create the finest experiences — from bespoke wedding décor and gourmet catering to opulent guest rooms and sprawling banquet halls.</p><p>At Sran Fort, we\'re not just a venue — we\'re your dreams brought to life.</p>',
      email: 'beant.singh36@gmail.com',
      phone: '+91 77349 10001',
      phoneSecondary: '+91 94136 94175',
      address: 'Sran Fort, Sangria Road, Near Manaksar Village, Hanumangarh, Rajasthan',
      whatsappNumber: '917734910001',
      whatsappUrl: 'https://wa.me/917734910001',
      googleBusinessUrl: 'https://g.co/kgs/Gfq1c5K',
      facebookUrl: 'https://www.facebook.com/Sranfort?mibextid=ZbWKwL',
      instagramUrl: 'https://www.instagram.com/sranfort_palace?igsh=aDFjdDVpeDl5bDMy',
      youtubeUrl: 'https://www.youtube.com/@sranfortpalace',
      ...(process.env.ABOUT_YOUTUBE_URL
        ? { aboutVideoUrl: process.env.ABOUT_YOUTUBE_URL }
        : {}),
      checkInTime: '10:00 AM',
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
