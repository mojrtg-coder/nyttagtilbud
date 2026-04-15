// Build entry — writes all static HTML + vercel.json + sitemap.xml + robots.txt
const fs = require('fs');
const path = require('path');
const { SITE, ZONES, CITIES, BLOG_POSTS } = require('./data');
const { home, zonePage, cityPage, blogIndex } = require('./pages');
const { blogPage } = require('./blog');

const ROOT = path.resolve(__dirname, '..');

function write(rel, content) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  ✓', rel);
}

console.log('→ Building NytTagTilbud.com');

// Homepage
write('index.html', home());

// Zone pages
console.log('→ Zones');
for (const z of ZONES) write(`${z.slug}/index.html`, zonePage(z));

// City pages
console.log('→ Cities');
for (const c of CITIES) write(`${c.zone}/${c.slug}/index.html`, cityPage(c));

// Blog
console.log('→ Blog');
write('blog/index.html', blogIndex());
for (const p of BLOG_POSTS) write(`blog/${p.slug}/index.html`, blogPage(p));

// vercel.json
const vercel = {
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
  rewrites: ZONES.map(z => ({ source: `/${z.slug}`, destination: `/${z.slug}/index.html` })),
};
write('vercel.json', JSON.stringify(vercel, null, 2));

// sitemap.xml
const urls = [
  { loc: '/', priority: '1.0', cf: 'weekly' },
  ...ZONES.map(z => ({ loc: `/${z.slug}`, priority: '0.9', cf: 'weekly' })),
  ...CITIES.map(c => ({ loc: `/${c.zone}/${c.slug}`, priority: '0.8', cf: 'monthly' })),
  { loc: '/blog', priority: '0.7', cf: 'weekly' },
  ...BLOG_POSTS.map(p => ({ loc: `/blog/${p.slug}`, priority: '0.6', cf: 'monthly' })),
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

console.log(`\n✓ Done. Generated ${1 + ZONES.length + CITIES.length + 1 + BLOG_POSTS.length} HTML pages + vercel.json + sitemap.xml + robots.txt`);
