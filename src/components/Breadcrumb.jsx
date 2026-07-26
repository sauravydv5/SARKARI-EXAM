// Breadcrumb Navigation Component
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { generateBreadcrumbSchema } from '../utils/schemaGenerator';

function setJsonLd(data, id = 'breadcrumb-jsonld') {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export default function Breadcrumb({ items = [] }) {
  useEffect(() => {
    if (items.length > 0) {
      const schema = generateBreadcrumbSchema(items);
      if (schema) setJsonLd(schema);
    }
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index}>
            {index < items.length - 1 ? (
              <>
                <Link to={item.url}>{item.label}</Link>
                <span className="breadcrumb-sep">/</span>
              </>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
