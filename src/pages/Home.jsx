import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import CategoryPanel from '../components/CategoryPanel';
import FeaturedCards from '../components/FeaturedCards';
import useSeo from '../hooks/useSeo';

const CURRENT_YEAR = new Date().getFullYear();

const HOME_LOADING_SECTIONS = [
  ['Latest Results', '/results'],
  ['Admit Cards', '/admit-cards'],
  ['Latest Jobs', '/latest-jobs'],
  ['Answer Keys', '/answer-keys'],
  ['Admissions', '/admission'],
  ['Syllabus', '/syllabus'],
  ['Certificates', '/certificates'],
  ['Important Updates', '/important'],
  ['Bihar Special', '/bihar-special'],
];

const RECENT_POSTS_KEY = 'sarkari-job-hub-recent-posts';
const SAVED_POSTS_KEY = 'sarkari-job-hub-saved-posts';
const RADAR_CATEGORIES = ['latest-job', 'admission', 'admit-card'];

function getDeadlineDate(value) {
  const match = String(value || '').match(/(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})/);
  if (!match) return null;
  const date = new Date(`${match[1]} ${match[2]} ${match[3]} 23:59:59`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getDeadlineRadarItems(sections) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return RADAR_CATEGORIES.flatMap((category) => (sections?.[category] || []).map((post) => {
    const deadline = getDeadlineDate(post?.importantDates?.lastDate);
    return deadline && deadline >= today ? { ...post, deadline, category } : null;
  }))
    .filter(Boolean)
    .sort((first, second) => first.deadline - second.deadline)
    .slice(0, 3);
}

function formatDaysLeft(deadline) {
  const days = Math.ceil((deadline.getTime() - Date.now()) / 86400000);
  return days <= 0 ? 'Ends today' : `${days} day${days === 1 ? '' : 's'} left`;
}

function countTodayPosts(posts) {
  const today = new Date().toISOString().slice(0, 10);
  return (posts || []).filter((post) => {
    const activityDate = post.lastUpdated || post.updatedAt || post.publishedAt;
    return String(activityDate || '').slice(0, 10) === today;
  }).length;
}

function readRecentPosts() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENT_POSTS_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((item) => item?.slug && item?.title).slice(0, 4) : [];
  } catch {
    return [];
  }
}

function readSavedPosts() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(SAVED_POSTS_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((item) => item?.slug && item?.title).slice(0, 20) : [];
  } catch {
    return [];
  }
}

function HomeLoadingState() {
  return (
    <div className="home-loading-state" aria-busy="true" aria-label="Loading latest updates">
      <div className="home-loading-featured">
        {Array.from({ length: 8 }, (_, index) => <div className="home-loading-card" key={index} />)}
      </div>
      {[[0, 3], [3, 3], [6, 3]].map(([start, columns]) => (
        <div className={`home-grid home-grid-${columns}col home-loading-grid`} key={start}>
          {HOME_LOADING_SECTIONS.slice(start, start + columns).map(([title]) => (
            <section className="panel home-loading-panel" key={title}>
              <div className="panel-head"><div className="home-loading-line home-loading-line-title" /></div>
              <div className="panel-body">
                {Array.from({ length: 6 }, (_, rowIndex) => <div className="home-loading-row" key={rowIndex} />)}
              </div>
            </section>
          ))}
        </div>
      ))}
      <section className="panel home-loading-faq">
        <div className="panel-head"><div className="home-loading-line home-loading-line-title" /></div>
        <div className="panel-body">
          <div className="home-loading-faq-row" />
          <div className="home-loading-faq-row" />
          <div className="home-loading-faq-row" />
        </div>
      </section>
    </div>
  );
}

// Quick links and category-card data removed per request

export default function Home() {
  const [sections, setSections] = useState(() => api.initialHomeSections().data);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState(readRecentPosts);
  const [savedPosts, setSavedPosts] = useState(readSavedPosts);

  useEffect(() => {
    let cancelled = false;
    const loadSections = async () => {
      try {
        const sec = await api.homeSections();
        if (cancelled) return;
        setSections(sec.data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const idleId = typeof window.requestIdleCallback === 'function'
      ? window.requestIdleCallback(loadSections, { timeout: 1200 })
      : window.requestAnimationFrame(loadSections);

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === 'function' && typeof idleId === 'number') {
        window.cancelIdleCallback(idleId);
      } else {
        window.cancelAnimationFrame(idleId);
      }
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

  if (loading) return <HomeLoadingState />;
  if (error) {
    return (
      <div className="error-box">
        Could not load data: {error}
        <br />
        <small>Make sure the backend is running on port 5001.</small>
      </div>
    );
  }

  const deadlineRadarItems = getDeadlineRadarItems(sections);

  function clearRecentPosts() {
    window.localStorage.removeItem(RECENT_POSTS_KEY);
    setRecentPosts([]);
  }

  function clearSavedPosts() {
    window.localStorage.removeItem(SAVED_POSTS_KEY);
    setSavedPosts([]);
  }

  return (
    <>
      <section className="home-deadline-radar" aria-labelledby="home-deadline-radar-title">
        <div className="home-deadline-radar-head">
          <div>
            <span className="home-deadline-radar-kicker">Live from listings</span>
            <h2 id="home-deadline-radar-title">Deadline Radar</h2>
            <p>Next application deadlines, sorted for you.</p>
          </div>
          <span className="home-deadline-radar-signal" aria-hidden="true"><i /> Radar active</span>
        </div>
        <div className="home-deadline-radar-list">
          {deadlineRadarItems.length > 0 ? deadlineRadarItems.map((post) => (
            <Link key={post.slug || post.id} to={`/post/${post.slug || post.id}`} className="home-deadline-radar-item">
              <span className="home-deadline-radar-date">
                <strong>{post.deadline.toLocaleDateString('en-IN', { day: '2-digit' })}</strong>
                <small>{post.deadline.toLocaleDateString('en-IN', { month: 'short' })}</small>
              </span>
              <span className="home-deadline-radar-copy">
                <strong>{post.title}</strong>
                <small>{formatDaysLeft(post.deadline)} · {post.importantDates?.lastDate}</small>
              </span>
              <span className="home-deadline-radar-arrow" aria-hidden="true">→</span>
            </Link>
          )) : (
            <Link to="/latest-jobs" className="home-deadline-radar-empty">Open latest listings to see upcoming deadlines →</Link>
          )}
        </div>
      </section>

      <nav className="home-quick-stats" aria-label="Browse update categories">
        <span className="home-quick-stats-label"><i aria-hidden="true" /> Today&apos;s updates</span>
        <Link to="/latest-jobs"><strong>{countTodayPosts(sections?.['latest-job'])}</strong><span>Jobs</span></Link>
        <Link to="/results"><strong>{countTodayPosts(sections?.result)}</strong><span>Results</span></Link>
        <Link to="/admit-cards"><strong>{countTodayPosts(sections?.['admit-card'])}</strong><span>Admit Cards</span></Link>
        <Link to="/answer-keys"><strong>{countTodayPosts(sections?.['answer-key'])}</strong><span>Answer Keys</span></Link>
      </nav>

      {recentPosts.length > 0 && (
        <section className="home-recent" aria-labelledby="home-recent-title">
          <div className="home-recent-heading">
            <div>
              <p className="eyebrow">Pick up where you left off</p>
              <h2 id="home-recent-title">Recently Viewed</h2>
            </div>
            <button type="button" className="home-recent-clear" onClick={clearRecentPosts}>Clear</button>
          </div>
          <div className="home-recent-list">
            {recentPosts.map((item) => (
              <Link key={item.slug} to={`/post/${item.slug}`} className="home-recent-item">
                <span className="home-recent-category">{item.category.replace('-', ' ')}</span>
                <strong>{item.title}</strong>
                <span className="home-recent-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {savedPosts.length > 0 && (
        <section className="home-recent home-saved" aria-labelledby="home-saved-title">
          <div className="home-recent-heading">
            <div>
              <p className="eyebrow">Keep them close</p>
              <h2 id="home-saved-title">Saved for Later</h2>
            </div>
            <button type="button" className="home-recent-clear" onClick={clearSavedPosts}>Clear all</button>
          </div>
          <div className="home-recent-list">
            {savedPosts.slice(0, 4).map((item) => (
              <Link key={item.slug} to={`/post/${item.slug}`} className="home-recent-item">
                <span className="home-recent-category">{item.category.replace('-', ' ')}</span>
                <strong>{item.title}</strong>
                <span className="home-recent-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="container home-featured-block my-6 md:my-8">
        <FeaturedCards limit={8} title="" />
      </div>

      {/* Category cards removed — lists below move up immediately under Featured Cards */}

      <div className="home-grid home-grid-all">
        <CategoryPanel title="Latest Results" viewAllTo="/results" posts={sections?.result || []} />
        <CategoryPanel title="Admit Cards" viewAllTo="/admit-cards" posts={sections?.['admit-card'] || []} />
        <CategoryPanel title="Latest Jobs" viewAllTo="/latest-jobs" posts={sections?.['latest-job'] || []} />
        <CategoryPanel title="Answer Keys" viewAllTo="/answer-keys" posts={sections?.['answer-key'] || []} />
        <CategoryPanel title="Admissions" viewAllTo="/admission" posts={sections?.admission || []} />
        <CategoryPanel title="Syllabus" viewAllTo="/syllabus" posts={sections?.syllabus || []} />
        <CategoryPanel title="Certificates" viewAllTo="/certificates" posts={sections?.certificate || []} />
        <CategoryPanel title="Important Updates" viewAllTo="/important" posts={sections?.important || []} />
        <CategoryPanel title="Bihar Special" viewAllTo="/bihar-special" posts={sections?.['bihar-special'] || []} />
      </div>

    </>
  );
}
