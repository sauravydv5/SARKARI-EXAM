import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import CategoryPanel from '../components/CategoryPanel';
import FeaturedCards from '../components/FeaturedCards';
import useSeo from '../hooks/useSeo';

const CURRENT_YEAR = new Date().getFullYear();

const HOME_LOADING_SECTIONS = [
  ['Latest Jobs', '/latest-jobs'],
  ['Latest Results', '/results'],
  ['Admit Cards', '/admit-cards'],
  ['Answer Keys', '/answer-keys'],
  ['Admissions', '/admission'],
  ['Syllabus', '/syllabus'],
  ['Certificates', '/certificates'],
  ['Important Updates', '/important'],
];

function HomeLoadingState({ initialPosts = [] }) {
  return (
    <div className="home-loading-state" aria-busy="true" aria-label="Loading latest updates">
      <section className="home-compact-shell">
        <div className="home-search-card home-loading-search">
          <div>
            <div className="home-loading-line home-loading-line-wide" />
            <div className="home-loading-line home-loading-line-heading" />
          </div>
          <div className="home-loading-button" />
        </div>
      </section>
      <div className="home-loading-featured">
        {Array.from({ length: 8 }, (_, index) => <div className="home-loading-card" key={index} />)}
      </div>
      {[[0, 3], [3, 3], [6, 2]].map(([start, columns]) => (
        <div className={`home-grid home-grid-${columns}col home-loading-grid`} key={start}>
          {HOME_LOADING_SECTIONS.slice(start, start + columns).map(([title, viewAllTo], index) => (
            start === 0 && index === 0 && initialPosts.length > 0 ? (
              <CategoryPanel title={title} viewAllTo={viewAllTo} posts={initialPosts} className="home-loading-panel" key={title} />
            ) : (
              <section className="panel home-loading-panel" key={title}>
                <div className="panel-head"><div className="home-loading-line home-loading-line-title" /></div>
                <div className="panel-body">
                  {Array.from({ length: 10 }, (_, rowIndex) => <div className="home-loading-row" key={rowIndex} />)}
                </div>
              </section>
            )
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

  if (loading) return <HomeLoadingState initialPosts={sections?.['latest-job'] || []} />;
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

      <div className="container home-featured-block my-6 md:my-8">
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
