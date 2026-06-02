import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arqam Academy | أكاديمية أرقام',
    short_name: 'Arqam',
    description: 'أكاديمية أرقام - المنصة الرائدة لتعليم البرمجة والتكنولوجيا. استمتع بتجربة تعليمية استثنائية من هاتفك مباشرة.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0a0e27',
    theme_color: '#0066ff',
    categories: ['education', 'productivity'],
    lang: 'ar',
    dir: 'rtl',
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
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  }
}
