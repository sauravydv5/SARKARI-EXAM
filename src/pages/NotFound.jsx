import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';

export default function NotFound() {
  useSeo({
    title: 'Page Not Found',
    description: 'The requested page is not available on Sarkari Job Hub.',
    url: 'https://sarkarijobhub.website/404',
    noIndex: true,
  });

  return (
    <section className="panel" aria-labelledby="not-found-title">
      <div className="panel-body" style={{ padding: '32px 20px', textAlign: 'center' }}>
        <h1 id="not-found-title">Page not found</h1>
        <p>This link may be outdated, or the update may have been removed. Use a category below to find an official-source summary.</p>
        <p><Link to="/latest-jobs" className="btn btn-primary">Browse latest jobs</Link></p>
      </div>
    </section>
  );
}
