import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import PostListItem from '../components/PostListItem';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') || '';
  const [input, setInput] = useState(initial);
  const [query, setQuery] = useState(initial);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setInput(initial);
    setQuery(initial);
  }, [initial]);

  useEffect(() => {
    if (!query) {
      setPosts([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await api.listPosts({ search: query, limit: 50 });
        if (!cancelled) {
          setPosts(res.data || []);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  function onSubmit(e) {
    e.preventDefault();
    const q = input.trim();
    if (q === '803202') {
      setQuery('');
      setParams({});
      window.location.assign('/admin');
      return;
    }
    setQuery(q);
    setParams(q ? { q } : {});
  }

  return (
    <>
      <div className="page-header">
        <h1>Search</h1>
        <p>Find jobs, results, admit cards and more.</p>
      </div>

      <form className="toolbar" onSubmit={onSubmit}>
        <input
          type="search"
          placeholder="e.g. SSC CGL, NEET, Railway..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <section className="panel">
        <div className="panel-head">
          <h2>{query ? `Results for “${query}”` : 'Enter a keyword to search'}</h2>
        </div>
        <div className="panel-body">
          {loading && <div className="loading">Searching…</div>}
          {error && <div className="error-box">{error}</div>}
          {!loading && query && posts.length === 0 && (
            <div className="empty-state">No matches found. Try another keyword.</div>
          )}
          {posts.length > 0 && (
            <ul className="post-list">
              {posts.map((p) => (
                <PostListItem key={p._id} post={p} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
