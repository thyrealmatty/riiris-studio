import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // registered manually in src/main.jsx (production only)
      includeAssets: ['icons/*.svg', 'offline.html'],
      manifest: false, // we ship our own public/manifest.json
      devOptions: { enabled: false },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        globIgnores: ['admin/**', 'images/**', 'audio/**'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/admin/, /^\/\.netlify/, /^\/api/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Audio needs HTTP Range support (Safari/iOS seeking) when served from cache.
            urlPattern: ({ request }) => request.destination === 'audio',
            handler: 'CacheFirst',
            options: {
              cacheName: 'babyriiri-audio',
              rangeRequests: true,
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: ({ request, url }) => request.destination === 'image' && !url.pathname.startsWith('/admin'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'babyriiri-images',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ],
  server: { port: 5173 }
})
