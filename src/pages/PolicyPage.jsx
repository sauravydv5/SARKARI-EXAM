import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import { policyPages } from '../data/policyPages';

export default function PolicyPage() {
  const { slug } = useParams();
  const page = policyPages.find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useSeo({
    title: page ? `${page.title} - Sarkari Job Hub` : 'Page Not Found',
    description: page?.description || 'This page is not available.',
    url: `https://sarkarijobhub.website/${page?.slug || slug}`,
    noIndex: !page,
    keywords: page ? `${page.title}, sarkari job hub, government job portal, policy, editorial standards` : '',
  });

  if (!page) {
    return <div className="error-box">This page is not available. Please use the main navigation to continue.</div>;
  }

  return (
    <article className="policy-page">
      <div className="page-header">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      <section className="panel">
        <div className="panel-body">
          <div className="content-html" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </section>
    </article>
  );
}
