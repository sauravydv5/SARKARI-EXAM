import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES } from '../api';
import CategoryPanel from '../components/CategoryPanel';

const ICONS = {
  'latest-job': '💼',
  result: '📊',
  'admit-card': '🎫',
  'answer-key': '🔑',
  syllabus: '📘',
  admission: '🎓',
  important: '⭐',
  certificate: '📜',
};

const ICON_BG = {
  'latest-job': '#fef2f2',
  result: '#eff6ff',
  'admit-card': '#ecfdf5',
  'answer-key': '#faf5ff',
  syllabus: '#fff7ed',
  admission: '#ecfeff',
  important: '#fdf2f8',
  certificate: '#f8fafc',
};

export default function Home() {
  const [sections, setSections] = useState(null);
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sec, st] = await Promise.all([api.homeSections(), api.categoryStats()]);
        if (cancelled) return;
        setSections(sec.data);
        const map = {};
        (st.data || []).forEach((s) => {
          map[s.category] = s.count;
        });
        setStats(map);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="loading">Loading latest updates…</div>;
  if (error) {
    return (
      <div className="error-box">
        Could not load data: {error}
        <br />
        <small>Make sure the backend is running on port 5001.</small>
      </div>
    );
  }

  return (
    <>
      <section className="hero">
        <div className="hero-badge">👋 Welcome to Sarkari Job Hub</div>
        <h2>Quickly find Sarkari Naukri, Results &amp; Admit Cards</h2>
        <p>
          Your friendly guide to government job alerts, exam updates, admit cards, and official
          notices. Browse easily and stay on top of the latest information.
        </p>
        <div className="hero-actions">
          <Link to="/latest-jobs" className="btn btn-primary">
            Browse Latest Jobs
          </Link>
          <Link to="/results" className="btn btn-outline">
            Check Results
          </Link>
          <Link to="/admit-cards" className="btn btn-gold">
            Admit Cards
          </Link>
          <Link to="/search" className="btn btn-outline">
            Search
          </Link>
        </div>
        <div className="hero-subtext">
          Need a quick start? Pick a category and get instant updates.
        </div>
      </section>

      <div className="cat-grid">
        {CATEGORIES.map((c) => (
          <Link
            key={c.key}
            to={c.path}
            className="cat-card"
            style={{
              '--accent': c.color,
              '--icon-bg': ICON_BG[c.key] || '#fef2f2',
            }}
          >
            <div className="icon-wrap">{ICONS[c.key] || '📌'}</div>
            <div className="label">{c.label}</div>
            <div className="count">{stats[c.key] ?? 0} updates</div>
          </Link>
        ))}
      </div>

      <div className="home-grid">
        <CategoryPanel
          title="Latest Jobs"
          viewAllTo="/latest-jobs"
          posts={sections?.['latest-job'] || []}
        />
        <CategoryPanel title="Result" viewAllTo="/results" posts={sections?.result || []} />
        <CategoryPanel
          title="Admit Card"
          viewAllTo="/admit-cards"
          posts={sections?.['admit-card'] || []}
        />
        <CategoryPanel
          title="Answer Key"
          viewAllTo="/answer-keys"
          posts={sections?.['answer-key'] || []}
        />
        <CategoryPanel title="Syllabus" viewAllTo="/syllabus" posts={sections?.syllabus || []} />
        <CategoryPanel title="Admission" viewAllTo="/admission" posts={sections?.admission || []} />
        <CategoryPanel title="Important" viewAllTo="/important" posts={sections?.important || []} />
        <CategoryPanel
          title="Certificate"
          viewAllTo="/certificates"
          posts={sections?.certificate || []}
        />
      </div>
    </>
  );
}
