import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Vite configuration for the Offline Notes App
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Lets Vite understand React (JSX, fast refresh)
    react(),

    // PWA plugin: builds our own service worker and the web app manifest
    VitePWA({
      // Use our hand written service worker instead of a generated one
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',

      // We register the service worker ourselves in main.jsx
      injectRegister: false,

      // Files that should be cached for offline use
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
      },

      // Details used when the app is installed on a device
      manifest: {
        name: 'Offline Notes App',
        short_name: 'Notes',
        description: 'A simple notes app that works without internet',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1e293b',
        // Square PNG icons in the two sizes browsers expect
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  // Fixed ports so the app always opens on the same address
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
})
