import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES, formatDate } from '../api';
import CategoryPanel from '../components/CategoryPanel';
import useSeo from '../hooks/useSeo';
import { blogArticles } from '../data/blogArticles';

const QUICK_LINKS = [
  { key: 'latest-job', title: 'Latest Jobs', description: 'Latest government job notifications.', path: '/latest-jobs', icon: '💼' },
  { key: 'result', title: 'Latest Results', description: 'Latest exam and result posts.', path: '/results', icon: '📊' },
  { key: 'admit-card', title: 'Admit Cards', description: 'Latest admit card notices.', path: '/admit-cards', icon: '🎫' },
  { key: 'answer-key', title: 'Answer Keys', description: 'Latest answer key updates.', path: '/answer-keys', icon: '🔑' },
  { key: 'admission', title: 'Admissions', description: 'Latest admission notices.', path: '/admission', icon: '🎓' },
  { key: 'syllabus', title: 'Syllabus', description: 'Latest syllabus updates.', path: '/syllabus', icon: '📘' },
  { key: 'certificate', title: 'Certificates', description: 'Latest certificate notices.', path: '/certificates', icon: '📜' },
  { key: 'important', title: 'Important Updates', description: 'Latest important government notices.', path: '/important', icon: '⭐' },
];

const HOME_ROWS = [
  [
    { title: 'Latest Jobs', key: 'latest-job', path: '/latest-jobs' },
    { title: 'Latest Results', key: 'result', path: '/results' },
    { title: 'Admit Cards', key: 'admit-card', path: '/admit-cards' },
  ],
  [
    { title: 'Answer Keys', key: 'answer-key', path: '/answer-keys' },
    { title: 'Admissions', key: 'admission', path: '/admission' },
    { title: 'Syllabus', key: 'syllabus', path: '/syllabus' },
  ],
  [
    { title: 'Certificates', key: 'certificate', path: '/certificates' },
    { title: 'Important Updates', key: 'important', path: '/important' },
  ],
];

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
          <div className="stat-label">Active Alerts</div>
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
      'Sarkari Job Hub - India\'s trusted authority for latest SSC, Railway, Bank, UPSC, Police jobs, exam results, admit cards, answer keys, syllabus and practical exam-guidance content.',
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
      <section className="home-compact-shell">
        <div className="home-search-card">
          <div className="home-search-heading">
            <p className="eyebrow">Government jobs, exam updates and preparation guides</p>
            <h2>Find the right opportunity faster.</h2>
          </div>
          <Link to="/search" className="btn btn-primary home-search-cta">Search jobs and updates</Link>
        </div>
      </section>

      <section className="quick-links-grid" aria-label="Quick link grid">
        {QUICK_LINKS.map((item) => {
          const count = sections?.[item.key]?.length || 0;
          return (
            <Link key={item.key} to={item.path} className="quick-link-card">
              <div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 10, background: 'var(--surface-2)' }}>{item.icon}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
                <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--muted)' }}>
                  {count > 0 ? `${count} updates` : 'No updates available'}
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <div className="home-grid home-grid-3col">
        <CategoryPanel title="Latest Jobs" viewAllTo="/latest-jobs" posts={sections?.['latest-job'] || []} />
        <CategoryPanel title="Latest Results" viewAllTo="/results" posts={sections?.result || []} />
        <CategoryPanel title="Admit Cards" viewAllTo="/admit-cards" posts={sections?.['admit-card'] || []} />
      </div>

      <div className="home-grid home-grid-3col">
        <CategoryPanel title="Answer Keys" viewAllTo="/answer-keys" posts={sections?.['answer-key'] || []} />
        <CategoryPanel title="Admissions" viewAllTo="/admission" posts={sections?.admission || []} />
        <CategoryPanel title="Syllabus" viewAllTo="/syllabus" posts={sections?.syllabus || []} />
      </div>

      <div className="home-grid home-grid-2col">
        <CategoryPanel title="Certificates" viewAllTo="/certificates" posts={sections?.certificate || []} />
        <CategoryPanel title="Important Updates" viewAllTo="/important" posts={sections?.important || []} />
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>FAQ</h2>
        </div>
        <div className="panel-body">
          <div className="faq-container">
            <details>
              <summary>What is Sarkari Job Hub?</summary>
              <p>Sarkari Job Hub aggregates government job notifications, results, admit cards, answer keys, syllabus and admission updates in one place.</p>
            </details>
            <details>
              <summary>How often does the homepage update?</summary>
              <p>The homepage refreshes automatically with the latest content from all categories, including jobs, results, admit cards, answer keys, admissions, syllabus, certificates, and important updates.</p>
            </details>
            <details>
              <summary>Can I see empty categories?</summary>
              <p>Yes. Every category section is rendered even when there are no updates. Empty categories display “No updates available”.</p>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
