import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, categoryMeta } from '../api';

/** Full Tailwind class names (static) so purge keeps them. Color by card index. */
const CARD_BACKGROUNDS = [
  'bg-red-600 hover:bg-red-700',
  'bg-blue-600 hover:bg-blue-700',
  'bg-green-600 hover:bg-green-700',
  'bg-purple-600 hover:bg-purple-700',
  'bg-orange-500 hover:bg-orange-600',
  'bg-indigo-600 hover:bg-indigo-700',
  'bg-pink-600 hover:bg-pink-700',
  'bg-teal-600 hover:bg-teal-700',
];

function formatPostsCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n.toLocaleString('en-IN');
}

function categoryLabel(categoryKey) {
  const meta = categoryMeta(categoryKey);
  if (meta?.label) return meta.label;
  if (!categoryKey) return 'Update';
  return String(categoryKey)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Featured Cards — latest featured posts from the existing content API.
 * No hardcoded cards. Max `limit` items (default 8).
 */
export default function FeaturedCards({ limit = 8, title = '' }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await api.getFeaturedPosts(limit);
        if (!cancelled) setPosts(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setPosts([]);
      }
    };

    load();

    // Refresh when admin flags change or the tab is focused again.
    const onStorage = (event) => {
      if (!event.key || event.key.startsWith('sr_')) load();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', load);

    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', load);
    };
  }, [limit]);

  if (!posts.length) return null;

  return (
    <section className="w-full" aria-label={title}>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[--muted]">
          </p>
          <h2 className="text-xl font-bold tracking-tight text-[--text] md:text-2xl">
            {title}
          </h2>
        </div>
        <span className="hidden text-sm text-[--muted] sm:inline">{posts.length} featured</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post, index) => {
          const colorClass = CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length];
          const postsCount = formatPostsCount(post.totalVacancies);
          const badge = categoryLabel(post.category);
          const slug = post.slug || post.id;

          return (
            <Link
              key={post._id || slug || index}
              to={`/post/${slug}`}
              className={[
                'flex h-20 cursor-pointer flex-col items-center justify-center rounded-[7px] px-2 py-2 text-center shadow-sm',
                'transition-all duration-300 hover:scale-[1.01] hover:shadow-md',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80',
                colorClass,
              ].join(' ')}
            >
              <span className="mb-0.5 inline-flex items-center rounded-full bg-white/20 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                {badge}
              </span>

              <h3 className="line-clamp-3 text-[10px] font-bold leading-snug text-white md:text-[11px]">
                {post.title}
              </h3>

              {postsCount && (
                <p className="mt-0.5 text-[8px] font-semibold text-white/95 md:text-[9px]">
                  <span className="text-[9px] font-extrabold tabular-nums md:text-[10px]">
                    {postsCount}
                  </span>{' '}
                  Posts
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
