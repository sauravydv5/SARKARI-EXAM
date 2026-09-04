import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import CategoryPanel from '../components/CategoryPanel';
import FeaturedCards from '../components/FeaturedCards';
import useSeo from '../hooks/useSeo';
import { blogArticles } from '../data/blogArticles';

const CURRENT_YEAR = new Date().getFullYear();

// Quick links and category-card data removed per request

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
    title: `Latest Sarkari Jobs ${CURRENT_YEAR} - Government Exam Results, Admit Cards & Notifications`,
    description:
      'Sarkari Job Hub - India\'s trusted authority for latest SSC, Railway, Bank, UPSC, Police jobs, exam results, admit cards, answer keys, syllabus and practical exam-guidance content.',
    url: 'https://sarkarijobhub.website/',
    keywords:
      `sarkari job, sarkari naukri, govt jobs, government jobs, SSC jobs, Railway jobs, Bank jobs, UPSC jobs, admit card, answer key, syllabus, exam notification, job alert, ${CURRENT_YEAR}, India`,
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

      <div className="container my-6 md:my-8">
        <FeaturedCards limit={8} title="" />
      </div>

      {/* Category cards removed — lists below move up immediately under Featured Cards */}

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
