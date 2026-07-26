import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES } from '../api';
import CategoryPanel from '../components/CategoryPanel';
import useSeo from '../hooks/useSeo';

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

function CountUp({ value = 0, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) {
      setDisplay(0);
      return;
    }
    const stepTime = Math.max(Math.floor(duration / end), 8);
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span className="countup">{display}</span>;
}

function StatsPanel({ stats = {} }) {
  const latest = stats['latest-job'] || 0;
  const results = stats['result'] || 0;
  const admit = stats['admit-card'] || 0;
  const notifications = Object.values(stats).reduce((s, v) => s + (v || 0), 0);
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">💼</div>
        <div className="stat-body">
          <div className="stat-num"><CountUp value={latest} /></div>
          <div className="stat-label">Latest Jobs</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-body">
          <div className="stat-num"><CountUp value={results} /></div>
          <div className="stat-label">Latest Results</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🎫</div>
        <div className="stat-body">
          <div className="stat-num"><CountUp value={admit} /></div>
          <div className="stat-label">Admit Cards</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🔔</div>
        <div className="stat-body">
          <div className="stat-num"><CountUp value={notifications} /></div>
          <div className="stat-label">Active Notifications</div>
        </div>
      </div>
    </div>
  );
}

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

  useSeo({
    title: 'Latest Sarkari Jobs 2026 - Government Exam Results, Admit Cards & Notifications',
    description:
      'Sarkari Job Hub - India\'s #1 government job portal. Get latest SSC, Railway, Bank, UPSC, Police jobs, exam results, admit cards, answer keys, syllabus and free job alerts. Updated daily.',
    url: 'https://sarkarijobhud.website/',
    keywords:
      'sarkari job, sarkari naukri, govt jobs, government jobs, SSC jobs, Railway jobs, Bank jobs, UPSC jobs, admit card, answer key, syllabus, exam notification, job alert, 2026, India',
  });

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
        <div className="hero-grid">
          <div className="hero-main">
            <div className="hero-badge">👋 Welcome to Sarkari Job Hub</div>
            <h2>Latest Sarkari Jobs, Results &amp; Admit Cards 2026</h2>
            <p>
              Your friendly guide to government job alerts, sarkari result updates, admit cards,
              answer keys, and official notices. Browse easily and stay on top of the latest
              information.
            </p>
            <div className="hero-actions">
              <Link to="/latest-jobs" className="btn btn-primary">
                💼 Browse Latest Jobs
              </Link>
              <Link to="/results" className="btn btn-outline">
                📊 Check Results
              </Link>
              <Link to="/admit-cards" className="btn btn-gold">
                🎫 Admit Cards
              </Link>
              <Link to="/search" className="btn btn-outline">
                🔎 Search
              </Link>
            </div>
            <div className="hero-subtext">Need a quick start? Pick a category and get instant updates.</div>
          </div>

          <aside className="hero-stats" aria-hidden>
            <StatsPanel stats={stats} />
          </aside>
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
