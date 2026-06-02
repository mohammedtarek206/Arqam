import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arqam Platform',
    short_name: 'Arqam',
    description: 'استمتع بتجربة أسرع وأسهل واستخدم المنصة كتطبيق حقيقي مباشرة من الشاشة الرئيسية.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0066ff',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      }
    ],
  }
}
