import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'ul',
  'ol',
  'li',
  'h2',
  'h3',
  'h4',
  'a',
  'span',
  'blockquote',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
];

/** Sanitize HTML before dangerouslySetInnerHTML */
export function sanitizeHtml(dirty) {
  if (!dirty) return '';
  return DOMPurify.sanitize(String(dirty), {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel', 'title', 'class', 'colspan', 'rowspan'],
    ALLOW_DATA_ATTR: false,
  });
}
