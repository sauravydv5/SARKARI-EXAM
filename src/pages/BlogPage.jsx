import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import { blogArticles } from '../data/blogArticles';
const TOPICS = ['SSC', 'UPSC', 'Railway', 'Bank', 'Police', 'BPSC', 'Teaching', 'Defence', 'Preparation', 'Interview'];
export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [visibleArticles, setVisibleArticles] = useState(blogArticles);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useSeo({
    title: 'Government Exam Blogs & Career Guides - Sarkari Job Hub',
    description: 'Read in-depth guides on SSC, UPSC, BPSC, Railway, teaching, bank, police, defence, and career planning to improve your exam preparation journey.',
    url: 'https://sarkarijobhub.website/blog',
    keywords: 'blog, government exam blog, ssc blog, upsc blog, railway blog, bank blog, preparation strategy, career guidance',
  });

  const filteredArticles = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return blogArticles;
    return blogArticles.filter((article) => `${article.title} ${article.category} ${article.tags.join(' ')}`.toLowerCase().includes(term));
  }, [query]);

  useEffect(() => {
    setVisibleArticles(filteredArticles);
  }, [filteredArticles]);

  return (
    <div className="blog-page">
      <div className="page-header">
        <h1>Expert Government Exam Blogs & Career Guides</h1>
        <p>Explore 100+ practical articles designed to improve preparation, exam understanding, and career planning for competitive exams in India.</p>
      </div>

      <form className="toolbar" onSubmit={(event) => event.preventDefault()}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search blog topics like SSC, UPSC, Railway..."
        />
      </form>

      <section className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-body">
          <div className="compact-resource-strip" style={{ padding: '12px 16px', justifyContent: 'flex-start' }}>
            {TOPICS.map((topic) => (
              <span key={topic} className="tag">{topic}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="home-grid">
        {visibleArticles.map((article) => (
          <article key={article.slug} className="cat-card blog-card">
            <div className="icon-wrap">📝</div>
            <div className="label">{article.title}</div>
            <div className="count">{article.category} · {article.readingTime}</div>
            <p style={{ marginTop: 8 }}>{article.excerpt}</p>
            <Link to={`/blog/${article.slug}`} className="btn btn-outline" style={{ marginTop: 12, display: 'inline-flex' }}>
              Read Guide
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
