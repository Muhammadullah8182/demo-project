/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server mode for cPanel "Setup Node.js App" (Passenger): the build outputs
  // a self-contained standalone server (.next/standalone/server.js).
  // Directory-style URLs (/hotels/ -> /hotels/) match the site's canonical
  // pretty URLs exactly.
  output: 'standalone',
  trailingSlash: true,
  images: { unoptimized: true },
  // 301: old .html / .php URLs -> pretty URLs (keeps old links & rankings).
  async redirects() {
    const pages = [
      'hotels',
      'locations',
      'contact',
      'no-deposit',
      'monthly-rental',
      'compare',
      'ar',
      'taxi',
      'privacy',
      'terms',
    ];
    const rules = [
      { source: '/index.html', destination: '/', permanent: true },
      ...pages.map((p) => ({
        source: `/${p}.html`,
        destination: `/${p}/`,
        permanent: true,
      })),
      { source: '/blog.php', destination: '/blog/', permanent: true },
      {
        source: '/post.php',
        has: [{ type: 'query', key: 'slug', value: '(?<slug>[a-zA-Z0-9-]+)' }],
        destination: '/blog/:slug/',
        permanent: true,
      },
    ];
    return rules;
  },
};

module.exports = nextConfig;
