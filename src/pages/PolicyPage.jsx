import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import { policyPages } from '../data/policyPages';

export default function PolicyPage() {
  const { slug } = useParams();
  const page = policyPages.find((item) => item.slug === slug) || policyPages[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useSeo({
    title: `${page.title} - Sarkari Job Hub`,
    description: page.description,
    url: `https://sarkarijobhud.website/${page.slug}`,
    keywords: `${page.title}, sarkari job hub, government job portal, policy, editorial standards`,
  });

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
