// Dynamic XML sitemap (pages + all live blog posts from MySQL).
// Replaces the old sitemap.php — same URLs, same priorities.

const ROUTES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/hotels/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/locations/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/contact/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/no-deposit/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/monthly-rental/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/compare/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/ar/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/taxi/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/blog/', changefreq: 'daily', priority: '0.8' },
  { loc: '/privacy/', changefreq: 'yearly', priority: '0.3' },
  { loc: '/terms/', changefreq: 'yearly', priority: '0.3' },
];

const esc = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function getServerSideProps({ res }) {
  const { getSiteData } = await import('../lib/site-data');
  const site = await getSiteData();
  const base = (site.settings.site_url || 'https://uaerentcar.com').replace(/\/$/, '');
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const r of ROUTES) {
    xml += `  <url>\n    <loc>${esc(base + r.loc)}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
  }
  for (const p of site.posts) {
    const lastmod = p.updated ? p.updated.slice(0, 10) : p.date;
    xml += `  <url>\n    <loc>${esc(`${base}/blog/${p.slug}/`)}</loc>\n    <lastmod>${esc(lastmod)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  }
  xml += '</urlset>\n';
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
