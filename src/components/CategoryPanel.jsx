import { Link } from 'react-router-dom';
import PostListItem from './PostListItem';

export default function CategoryPanel({ title, viewAllTo, posts = [], emptyText = 'No updates yet.', className = '' }) {
  return (
    <section className={`panel ${className}`.trim()}>
      <div className="panel-head">
        <h2>{title}</h2>
        {viewAllTo && <Link to={viewAllTo}>View All →</Link>}
      </div>
      <div className="panel-body">
        {posts.length === 0 ? (
          <div className="empty-state">{emptyText}</div>
        ) : (
          <ul className="post-list">
            {posts.map((p) => (
              <PostListItem key={p._id || p.slug} post={p} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
