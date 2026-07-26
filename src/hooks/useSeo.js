import { useEffect } from 'react';

const DEFAULT_TITLE = 'Sarkari Job Hub 2026 — Latest Sarkari Jobs, Results & Admit Cards';
const DEFAULT_DESCRIPTION =
  'Find the latest Sarkari job alerts, government exam results, admit cards, answer keys, syllabus and admission updates for India.';
const DEFAULT_KEYWORDS =
  'sarkari job, sarkari result, govt jobs, latest jobs, admit card, answer key, syllabus, admission, government job alert, job notification';
const DEFAULT_URL = 'https://sarkarijobhud.website/';
const DEFAULT_IMAGE = '/logo.png';

function setMeta(selector, attr, value) {
  if (!value) return;
  let element = document.querySelector(selector);
  if (!element) {
    if (selector.startsWith('meta[')) {
      element = document.createElement('meta');
      const nameMatch = selector.match(/meta\[(name|property)=\"(.+?)\"\]/);
      if (nameMatch) {
        element.setAttribute(nameMatch[1], nameMatch[2]);
      }
    } else if (selector.startsWith('link[')) {
      element = document.createElement('link');
      const relMatch = selector.match(/link\[(rel)=\"(.+?)\"\]/);
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

function addBreadcrumbSchema(breadcrumbs) {
  const items = breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: item.url,
  }));
  setJsonLd(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    },
    'breadcrumb-jsonld'
  );
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
    const pageUrl = url || DEFAULT_URL;
    document.title = pageTitle;

    setMeta('meta[name="description"]', 'content', description || DEFAULT_DESCRIPTION);
    setMeta('meta[name="keywords"]', 'content', keywords || DEFAULT_KEYWORDS);
    setMeta('meta[name="robots"]', 'content', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMeta('meta[name="author"]', 'content', 'Sarkari Job Hub');
    setMeta('meta[name="language"]', 'content', 'en');
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', description || DEFAULT_DESCRIPTION);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:image"]', 'content', image || DEFAULT_IMAGE);
    setMeta('meta[property="og:site_name"]', 'content', 'Sarkari Job Hub');
    setMeta('meta[property="og:locale"]', 'content', 'en_IN');
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', description || DEFAULT_DESCRIPTION);
    setMeta('meta[name="twitter:image"]', 'content', image || DEFAULT_IMAGE);

    const siteUrl = pageUrl.replace(/\/$/, '');

    if (schemaType === 'Article') {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: schemaData?.headline || pageTitle,
        description: description || DEFAULT_DESCRIPTION,
        image: schemaData?.image || image || DEFAULT_IMAGE,
        author: schemaData?.author || { '@type': 'Organization', name: 'Sarkari Job Hub' },
        publisher: schemaData?.publisher || {
          '@type': 'Organization',
          name: 'Sarkari Job Hub',
          logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
        },
        datePublished: schemaData?.datePublished || new Date().toISOString(),
        dateModified: schemaData?.dateModified || new Date().toISOString(),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        articleSection: schemaData?.articleSection || 'Government Jobs',
      };
      setJsonLd(articleSchema);
    } else {
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
