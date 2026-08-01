import { Link } from 'react-router-dom';
import { formatDate } from '../api';

export default function PostListItem({ post, showMeta = true }) {
  const isRecent =
    post.publishedAt && Date.now() - new Date(post.publishedAt).getTime() < 1000 * 60 * 60 * 24 * 14;
  const showNewBadge = Boolean(post.showNewBadge ?? (post.isNew || (!post.hasExplicitNewOverride && isRecent)));

  return (
    <li className="compact-list-item">
      <Link to={`/post/${post.slug}`}>
        <span className="bullet" aria-hidden="true" />
        <span className="compact-list-body">
          <span className="compact-list-title-row">
            <span className="compact-list-title">{post.title}</span>
            {showNewBadge && <span className="badge-new">NEW</span>}
          </span>
          {post.statusNote && (
            <span className="status-note">✅ {post.statusNote}</span>
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
