// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://your-domain.com', // Replace with your actual domain
  output: 'server',
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      assetsInlineLimit: 0, // Don't inline any assets
    },
    // Ensure public directory assets are properly handled
    publicDir: 'public',
  },
  adapter: netlify(),
});
