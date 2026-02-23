import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://cortega26.github.io',
  base: '/tuplatainforma',
  integrations: [tailwind()],
});