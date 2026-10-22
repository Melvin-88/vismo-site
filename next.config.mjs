/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: false,
  // CSS вбудовується в HTML: без окремого render-blocking запиту (Lighthouse −0,6 с на 4G)
  experimental: { inlineCss: true },
};
