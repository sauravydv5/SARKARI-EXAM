import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import { blogArticles } from '../data/blogArticles';
import { buildReadingTime } from '../utils/contentUtils';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const article = useMemo(() => blogArticles.find((item) => item.slug === slug) || blogArticles[0], [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useSeo({
    title: `${article.title} - Sarkari Job Hub Blog`,
    description: article.summary,
    url: `https://sarkarijobhud.website/blog/${article.slug}`,
    keywords: `${article.title}, ${article.category}, government exam guide, preparation strategy`,
    schemaType: 'Article',
    schemaData: {
      headline: article.title,
      image: '/logo.png',
      articleSection: article.category,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: { '@type': 'Organization', name: article.author },
      publisher: { '@type': 'Organization', name: 'Sarkari Job Hub' },
    },
  });

  if (!article) {
    return <div className="error-box">Article not found.</div>;
  }

  return (
    <article className="blog-detail-page">
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="pd-bc-sep">/</span>
        <Link to="/blog">Blog</Link>
        <span className="pd-bc-sep">/</span>
        <span className="pd-bc-current">{article.title}</span>
      </nav>

      <div className="page-header">
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
        <div className="pd-meta-chips">
          <span className="pd-chip">🗓 {article.publishedAt}</span>
          <span className="pd-chip">🕒 {article.readingTime}</span>
          <span className="pd-chip">✍️ {article.author}</span>
        </div>
      </div>

      <section className="panel">
        <div className="panel-body">
          <div className="content-html" dangerouslySetInnerHTML={{ __html: article.content }} />
          <div className="pd-section" style={{ marginTop: 24 }}>
            <div className="pd-section-head">
              <h2>Sources & Editorial Notes</h2>
            </div>
            <div className="pd-content">
              <ul className="guide-list">
                {article.sources.map((source) => <li key={source}>{source}</li>)}
              </ul>
              <p><strong>Official notification:</strong> <a href={article.officialNotification} target="_blank" rel="noreferrer">Visit official source</a></p>
              <p><strong>Official website:</strong> <a href={article.officialWebsite} target="_blank" rel="noreferrer">Visit official website</a></p>
              <p><strong>Author:</strong> {article.author}</p>
              <p><strong>Published:</strong> {article.publishedAt} · <strong>Updated:</strong> {article.updatedAt}</p>
              <p><strong>Reading time:</strong> {article.readingTime}</p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
