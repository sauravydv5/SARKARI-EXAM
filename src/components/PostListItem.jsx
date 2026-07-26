import { Link } from 'react-router-dom';
import { formatDate } from '../api';

export default function PostListItem({ post, showMeta = true }) {
  const isRecent =
    post.publishedAt && Date.now() - new Date(post.publishedAt).getTime() < 1000 * 60 * 60 * 24 * 14;
  const showNewBadge = Boolean(post.showNewBadge ?? (post.isNew || (!post.hasExplicitNewOverride && isRecent)));

  return (
    <li>
      <Link to={`/post/${post.slug}`}>
        <span className="bullet" aria-hidden="true" />
        <span>
          {post.title}
          {showNewBadge && <span className="badge-new">NEW</span>}
          {post.statusNote && (
            <span className="status-note" style={{ display: 'block', color: '#2e7d32', fontSize: '0.85em', fontWeight: 600 }}>
              ✅ {post.statusNote}
            </span>
          )}
          {showMeta && (
            <span className="meta">
              {post.organization ? `${post.organization} · ` : ''}
              {formatDate(post.publishedAt)}
              {post.importantDates?.lastDate ? ` · Last date: ${post.importantDates.lastDate}` : ''}
              {post.importantDates?.resultDate ? ` · Result: ${post.importantDates.resultDate}` : ''}
              {post.importantDates?.examDate && !post.importantDates?.lastDate
                ? ` · Exam: ${post.importantDates.examDate}`
                : ''}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}
