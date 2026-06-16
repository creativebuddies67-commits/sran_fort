import type { StrapiApp } from '@strapi/strapi/admin';

const maroon = {
  primary100: '#f5e6e8',
  primary200: '#e8c4c8',
  primary500: '#800020',
  primary600: '#600018',
  primary700: '#400010',
};

export default {
  config: {
    locales: ['en'],
    tutorials: false,
    notifications: { releases: false },
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Sran Fort CMS',
        'app.components.LeftMenu.navbrand.workplace': 'Content Manager',
        'Auth.form.welcome.title': 'Sran Fort Marriage Palace',
        'Auth.form.welcome.subtitle': 'Manage website photos, text & bookings',
      },
    },
    theme: {
      light: {
        colors: {
          ...maroon,
          buttonPrimary500: maroon.primary500,
          buttonPrimary600: maroon.primary600,
        },
      },
      dark: {
        colors: {
          ...maroon,
          buttonPrimary500: maroon.primary500,
          buttonPrimary600: maroon.primary600,
        },
      },
    },
  },
  bootstrap(_app: StrapiApp) {},
};
