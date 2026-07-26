import { useEffect } from 'react';

const DEFAULT_TITLE = 'Sarkari Job Hub 2026 — Jobs, Results, Admit Cards';
const DEFAULT_DESCRIPTION =
  'Sarkari Job Hub provides the latest government exam updates, results, admit cards, answer keys, syllabus and admission alerts across India.';
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

export default function useSeo({ title, description, url, image, noIndex = false }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | Sarkari Job Hub` : DEFAULT_TITLE;
    document.title = pageTitle;

    setMeta('meta[name="description"]', 'content', description || DEFAULT_DESCRIPTION);
    setMeta('meta[name="robots"]', 'content', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', description || DEFAULT_DESCRIPTION);
    setMeta('meta[property="og:url"]', 'content', url || DEFAULT_URL);
    setMeta('meta[property="og:image"]', 'content', image || DEFAULT_IMAGE);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', description || DEFAULT_DESCRIPTION);
    setMeta('meta[name="twitter:image"]', 'content', image || DEFAULT_IMAGE);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || DEFAULT_URL);
  }, [title, description, url, image, noIndex]);
}
