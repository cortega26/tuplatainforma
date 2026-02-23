import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cortega26.github.io',
  base: '/tuplatainforma',
  vite: {
    plugins: [tailwindcss()],
  },
});