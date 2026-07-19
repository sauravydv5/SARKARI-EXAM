import { useEffect, useState } from 'react';
import { api, categoryMeta } from '../api';
import PostListItem from '../components/PostListItem';

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

  function onSearch(e) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  return (
    <>
      <div className="page-header">
        <h1>{pageTitle}</h1>
        <p>{description || `Browse all ${pageTitle.toLowerCase()} updates.`}</p>
      </div>

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
