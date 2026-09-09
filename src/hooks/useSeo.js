import { useEffect } from 'react';

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_TITLE = `Sarkari Job Hub ${CURRENT_YEAR} — Government Jobs, Results, Admit Cards & Exam Guidance`;
const DEFAULT_DESCRIPTION =
  'Explore practical government job updates, exam guidance, eligibility explainers, admit-card notices, results, and preparation resources for Indian aspirants.';
const DEFAULT_KEYWORDS =
  'sarkari job, government jobs, exam guidance, admit card, answer key, syllabus, admission, job notification, preparation strategy';
const DEFAULT_URL = 'https://sarkarijobhub.website';
const DEFAULT_IMAGE = '/logo.png';

function normalizeCanonicalUrl(inputUrl) {
  const baseUrl = DEFAULT_URL;
  const source = String(inputUrl || baseUrl).trim();
  const fullUrl = source.startsWith('http') ? source : `${baseUrl}${source.startsWith('/') ? source : `/${source}`}`;
  const parsed = new URL(fullUrl, baseUrl);

  parsed.protocol = 'https:';
  parsed.hostname = parsed.hostname.replace(/^www\./i, '').toLowerCase();
  parsed.search = '';
  parsed.hash = '';

  const rawPath = parsed.pathname || '/';
  const normalizedPath = rawPath === '/' ? '/' : rawPath.replace(/\/+$/g, '');
  const canonical = `${baseUrl}${normalizedPath === '/' ? '/' : normalizedPath}`;

  return canonical;
}

function normalizeImageUrl(inputImage) {
  const image = String(inputImage || DEFAULT_IMAGE).trim();
  return new URL(image, DEFAULT_URL).href;
}

function setMeta(selector, attr, value) {
  if (!value) return;
  let element = document.querySelector(selector);
  if (!element) {
    if (selector.startsWith('meta[')) {
      element = document.createElement('meta');
      const nameMatch = selector.match(/meta\[(name|property)="(.+?)"\]/);
      if (nameMatch) {
        element.setAttribute(nameMatch[1], nameMatch[2]);
      }
    } else if (selector.startsWith('link[')) {
      element = document.createElement('link');
      const relMatch = selector.match(/link\[(rel)="(.+?)"\]/);
      if (relMatch) {
        element.setAttribute(relMatch[1], relMatch[2]);
      }
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
}

function setJsonLd(data, id = 'seo-jsonld') {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export default function useSeo({
  title,
  description,
  url,
  image,
  noIndex = false,
  keywords = DEFAULT_KEYWORDS,
  schemaType = 'WebSite',
  schemaData,
}) {
  useEffect(() => {
    const pageTitle = title ? `${title} | Sarkari Job Hub` : DEFAULT_TITLE;
    const pageUrl = normalizeCanonicalUrl(url || DEFAULT_URL);
    const pageImage = normalizeImageUrl(image || DEFAULT_IMAGE);
    document.title = pageTitle;

    setMeta('meta[name="description"]', 'content', description || DEFAULT_DESCRIPTION);
    setMeta('meta[name="keywords"]', 'content', keywords || DEFAULT_KEYWORDS);
    setMeta('meta[name="robots"]', 'content', noIndex ? 'noindex, follow' : 'index, follow');
    setMeta('meta[name="author"]', 'content', 'Sarkari Job Hub');
    setMeta('meta[name="language"]', 'content', 'en');
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', description || DEFAULT_DESCRIPTION);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:image"]', 'content', pageImage);
    setMeta('meta[property="og:site_name"]', 'content', 'Sarkari Job Hub');
    setMeta('meta[property="og:locale"]', 'content', 'en_IN');
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', description || DEFAULT_DESCRIPTION);
    setMeta('meta[name="twitter:image"]', 'content', pageImage);

    const siteUrl = pageUrl.replace(/\/$/, '');

    if (schemaType === 'Article') {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: schemaData?.headline || pageTitle,
        description: description || DEFAULT_DESCRIPTION,
        image: normalizeImageUrl(schemaData?.image || image || DEFAULT_IMAGE),
        author: schemaData?.author || { '@type': 'Organization', name: 'Sarkari Job Hub' },
        publisher: schemaData?.publisher || {
          '@type': 'Organization',
          name: 'Sarkari Job Hub',
          logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
        },
        datePublished: schemaData?.datePublished || new Date().toISOString(),
        dateModified: schemaData?.dateModified,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        articleSection: schemaData?.articleSection || 'Government Jobs',
      };
      setJsonLd(articleSchema);
    } else if (schemaType !== 'none') {
      setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Sarkari Job Hub',
        url: siteUrl,
        description: description || DEFAULT_DESCRIPTION,
        publisher: {
          '@type': 'Organization',
          name: 'Sarkari Job Hub',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      });
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);
  }, [title, description, url, image, noIndex, keywords, schemaType, schemaData]);
}
