import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vismo Agency',
    short_name: 'Vismo',
    description: 'Реклама в Google та Instagram для бізнесу',
    lang: 'uk',
    start_url: '/',
    display: 'browser',
    theme_color: '#1E1F22',
    background_color: '#1E1F22',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
