import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import CategoryPanel from '../components/CategoryPanel';
import FeaturedCards from '../components/FeaturedCards';
import useSeo from '../hooks/useSeo';

const CURRENT_YEAR = new Date().getFullYear();


export default function Home() {
  const [sections, setSections] = useState(() => api.initialHomeSections().data);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadSections = async () => {
      try {
        const sec = await api.homeSections();
        if (cancelled) return;
        setSections(sec.data || {});
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    };

    loadSections();

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
