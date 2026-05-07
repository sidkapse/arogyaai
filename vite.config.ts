import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string };
const SW_VERSION = `${pkg.version}-${Date.now()}`;

export default defineConfig({
  base: '/arogyaai/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/icon-192.svg', 'icons/icon-512.svg', 'icons/maskable-512.svg', 'icons/favicon.svg'],
      manifest: {
        name: 'ArogyaAI',
        short_name: 'Arogya',
        description: 'Learn to manage common Indian ailments through AI-powered gamified micro-lessons',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/arogyaai/',
        scope: '/arogyaai/',
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: 'icons/maskable-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.openai\.com\/.*/,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          ai: ['openai'],
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __SW_VERSION__: JSON.stringify(SW_VERSION),
  },
});
