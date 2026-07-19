import { Link } from 'react-router-dom';
import { formatDate } from '../api';

export default function PostListItem({ post, showMeta = true }) {
  const isRecent =
    post.publishedAt && Date.now() - new Date(post.publishedAt).getTime() < 1000 * 60 * 60 * 24 * 14;

  return (
    <li>
      <Link to={`/post/${post.slug}`}>
        <span className="bullet" aria-hidden="true" />
        <span>
          {post.title}
          {isRecent && <span className="badge-new">NEW</span>}
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
