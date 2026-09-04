import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, categoryMeta } from '../api';
import PostListItem from '../components/PostListItem';
import useSeo from '../hooks/useSeo';

export default function CategoryPage({ category, title, description }) {
  const meta = categoryMeta(category);
  const pageTitle = title || meta.label;
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await api.listPosts({
          category,
          page,
          limit: 20,
          search: query || undefined,
        });
        if (cancelled) return;
        setPosts(res.data || []);
        setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
        setError('');
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, page, query]);

  const categoryKeywords = [
    pageTitle,
    meta.label,
    'sarkari job',
    'government job',
    'job notification',
    'job alert',
    'India',
    ...(category === 'admit-card' ? ['admit card download', 'exam admit card', 'hall ticket'] : []),
    ...(category === 'result' ? ['exam result', 'sarkari result', 'test result'] : []),
    ...(category === 'latest-job' ? ['latest jobs', 'new jobs', 'job opening'] : []),
  ]
    .filter(Boolean)
    .slice(0, 15)
    .join(', ');

  useSeo({
    title: `${pageTitle} - Latest Sarkari Job Notifications & Updates 2026`,
    description: `Browse all latest ${pageTitle} updates, government exam notifications and sarkari job alerts for India. Daily updated notifications with eligibility, dates and official links.`,
    url: `https://sarkarijobhub.website${meta.path}`,
    keywords: categoryKeywords,
  });

  function onSearch(e) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  return (
    <>
      <div className="page-header">
        <h1>{pageTitle}</h1>
        <p>
          {description || `Browse all ${pageTitle.toLowerCase()} updates for latest Sarkari jobs, results and government notices.`}
        </p>
      </div>

      <section className="panel" aria-labelledby="category-usage-note" style={{ marginBottom: 12 }}>
        <div className="panel-body" style={{ padding: '14px 16px' }}>
          <h2 id="category-usage-note" className="sr-only">How to use this section</h2>
          <p className="m-0 text-sm leading-6 text-slate-700 dark:text-slate-300">
            Use each update as a readable summary, then open its official source before you apply, pay a fee, download a document, or make a preparation decision. Dates and eligibility can change through an official corrigendum.
          </p>
        </div>
      </section>

      <form className="toolbar" onSubmit={onSearch}>
        <input
          type="search"
          placeholder={`Search in ${pageTitle}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        {query && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setSearch('');
              setQuery('');
              setPage(1);
            }}
          >
            Clear
          </button>
        )}
      </form>

      <section className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-body" style={{ padding: '10px 16px' }}>
          <div className="compact-resource-strip" style={{ margin: 0 }}>
            <Link to="/latest-jobs" className="home-compact-card" style={{ minHeight: '38px', padding: '8px 10px' }}>Latest Jobs</Link>
            <Link to="/results" className="home-compact-card" style={{ minHeight: '38px', padding: '8px 10px' }}>Results</Link>
            <Link to="/admit-cards" className="home-compact-card" style={{ minHeight: '38px', padding: '8px 10px' }}>Admit Cards</Link>
            <Link to="/blog" className="home-compact-card" style={{ minHeight: '38px', padding: '8px 10px' }}>Blogs</Link>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>
            {pageTitle} ({pagination.total})
          </h2>
        </div>
        <div className="panel-body">
          {loading && <div className="loading">Loading…</div>}
          {error && <div className="error-box">{error}</div>}
          {!loading && !error && posts.length === 0 && (
            <div className="empty-state">No posts found.</div>
          )}
          {!loading && posts.length > 0 && (
            <ul className="post-list">
              {posts.map((p) => (
                <PostListItem key={p._id} post={p} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-outline btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
