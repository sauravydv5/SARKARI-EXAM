// Sitemap generation utility
import { CATEGORIES } from '../api';

export const generateSitemapXML = (posts = []) => {
  const baseUrl = 'https://sarkarijobhud.website';
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Home page
  xml += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Category pages
  CATEGORIES.forEach((cat) => {
    xml += `  <url>
    <loc>${baseUrl}${cat.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });

  // Search page
  xml += `  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

  // Individual posts
  (posts || []).forEach((post) => {
    const lastmod = (post.updatedAt || post.publishedAt || new Date()).toISOString().split('T')[0];
    xml += `  <url>
    <loc>${baseUrl}/post/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;
    if (post.image) {
      xml += `    <image:image>
      <image:loc>${post.image}</image:loc>
      <image:title>${post.title}</image:title>
    </image:image>
`;
    }
    xml += `  </url>
`;
  });

  xml += `</urlset>`;
  return xml;
};

export const downloadSitemap = (filename = 'sitemap.xml', content = '') => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/xml;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
