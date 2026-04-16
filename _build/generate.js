// Build entry — writes all static HTML + vercel.json + sitemap.xml + robots.txt
const fs = require('fs');
const path = require('path');
const { SITE, ZONES, KOMMUNER, BLOG_POSTS } = require('./data');
const { home, zonePage, kommunePage, blogIndex, omOsPage, privatlivspolitikPage } = require('./pages');
const { blogPage } = require('./blog');

const ROOT = path.resolve(__dirname, '..');

function write(rel, content) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  ✓', rel);
}

console.log('→ Building NytTagTilbud.com v5 CRO');

// Homepage
write('index.html', home());

// Zone pages
console.log('→ Zones (15)');
for (const z of ZONES) write(`${z.slug}/index.html`, zonePage(z));

// Kommune pages
console.log(`→ Kommuner (${KOMMUNER.length})`);
for (const k of KOMMUNER) write(`${k.zone}/${k.slug}/index.html`, kommunePage(k));

// Blog
console.log('→ Blog');
write('blog/index.html', blogIndex());
for (const p of BLOG_POSTS) write(`blog/${p.slug}/index.html`, blogPage(p));

// Om os
console.log('→ Pages');
write('om-os/index.html', omOsPage());
write('privatlivspolitik/index.html', privatlivspolitikPage());

// vercel.json — with www-redirect + kommune wildcard rewrite
const vercel = {
  cleanUrls: true,
  trailingSlash: false,
  redirects: [{
    source: '/:path*',
    has: [{ type: 'host', value: 'nyttagtilbud.com' }],
    destination: 'https://www.nyttagtilbud.com/:path*',
    permanent: true,
  }],
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Robots-Tag', value: 'index, follow' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
  rewrites: [
    ...ZONES.map(z => ({ source: `/${z.slug}`, destination: `/${z.slug}/index.html` })),
    { source: '/privatlivspolitik', destination: '/privatlivspolitik/index.html' },
    { source: '/om-os', destination: '/om-os/index.html' },
    { source: '/:zone/:kommune', destination: '/:zone/:kommune/index.html' },
  ],
};
write('vercel.json', JSON.stringify(vercel, null, 2));

// sitemap.xml
const urls = [
  { loc: '/', priority: '1.0', cf: 'weekly' },
  ...ZONES.map(z => ({ loc: `/${z.slug}`, priority: '0.9', cf: 'weekly' })),
  ...KOMMUNER.map(k => ({ loc: `/${k.zone}/${k.slug}`, priority: '0.8', cf: 'monthly' })),
  { loc: '/blog', priority: '0.7', cf: 'weekly' },
  ...BLOG_POSTS.map(p => ({ loc: `/blog/${p.slug}`, priority: '0.6', cf: 'monthly' })),
  { loc: '/om-os', priority: '0.5', cf: 'monthly' },
  { loc: '/privatlivspolitik', priority: '0.3', cf: 'yearly' },
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE.domain}${u.loc}</loc>
    <lastmod>${SITE.buildDate}</lastmod>
    <changefreq>${u.cf}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);

// robots.txt
write('robots.txt', `User-agent: *
Allow: /
Disallow: /_build/

Sitemap: ${SITE.domain}/sitemap.xml
`);

const total = 1 + ZONES.length + KOMMUNER.length + 1 + BLOG_POSTS.length + 2;
console.log(`\n✓ Done. Generated ${total} HTML pages + vercel.json + sitemap.xml + robots.txt`);
