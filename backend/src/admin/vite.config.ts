import { mergeConfig, type UserConfig } from 'vite';

const allowedHosts = [
  'localhost',
  '127.0.0.1',
  'api.sranfortpalace.com',
  '.sranfortpalace.com',
];

const publicUrl = process.env.PUBLIC_URL || process.env.STRAPI_URL;
if (publicUrl) {
  try {
    const hostname = new URL(publicUrl).hostname;
    if (!allowedHosts.includes(hostname)) {
      allowedHosts.push(hostname);
    }
  } catch {
    // ignore invalid URL
  }
}

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      allowedHosts,
    },
  });
};
