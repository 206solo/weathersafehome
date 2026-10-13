// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Pages are served at /slug/ (Netlify redirects /slug to it), so link there directly
  trailingSlash: 'always',
});
