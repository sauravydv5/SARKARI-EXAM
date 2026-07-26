import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../api';
import ThemeToggle from './ThemeToggle';

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || '1111';

const navItems = [
  { to: '/', label: 'Home', end: true, icon: '🏠' },
  { to: '/latest-jobs', label: 'Latest Jobs', icon: '💼' },
  { to: '/results', label: 'Results', icon: '📊' },
  { to: '/admit-cards', label: 'Admit Card', icon: '🎫' },
  { to: '/answer-keys', label: 'Answer Key', icon: '🔑' },
  { to: '/syllabus', label: 'Syllabus', icon: '📘' },
  { to: '/admission', label: 'Admission', icon: '🎓' },
  { to: '/important', label: 'Important', icon: '⭐' },
  { to: '/search', label: 'Search', icon: '🔎' },
];

export default function Layout() {
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  function onSearch(e) {
    e.preventDefault();
    const term = q.trim();
    if (term === ADMIN_SECRET) {
      navigate('/admin');
      setMenuOpen(false);
      return;
    }
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="container top-bar-inner">
          <span className="top-bar-date">📅 {today}</span>
          <div className="top-bar-right">
            <span className="top-bar-tagline">
              🔔 Free Govt Job Alerts — <Link to="/latest-jobs">SSC | Railway | Bank | UPSC →</Link>
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container brand-row">
          <Link to="/" className="brand">
            <img
              src="/logo.png"
              alt="Sarkari Jobs Hub logo"
              className="brand-logo-img"
              width={72}
              height={72}
              decoding="async"
            />
            <div className="brand-text">
              <h1>Sarkari Job Hub</h1>
              <p>Sarkari Jobs | Government Exam Results | Admit Cards | Answer Keys | Notifications | 2026</p>
            </div>
          </Link>
          <form className="header-search" onSubmit={onSearch}>
            <input
              type="search"
              placeholder="Search SSC, Railway, NEET, Bank jobs..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search"
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <nav className="main-nav" aria-label="Main">
        <div className="container nav-inner">
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="main-nav-list"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕ Close' : '☰ Menu'}
          </button>
          <div className="nav-actions-mobile">
            <ThemeToggle />
          </div>
          <ul id="main-nav-list" className={menuOpen ? 'open' : ''}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="marquee-bar">
        <div className="container">
          <span className="marquee-label">LIVE</span>
          <div className="marquee-track">
            <span>
              Welcome to Sarkari Job Hub — Latest Government Jobs, Sarkari Result, Admit Cards, Answer
              Keys, Syllabus &amp; Admission · SSC · UPSC · Railway · Banking · Police · State Jobs
              · Board Results · Free Sarkari Job Alert Portal for India
            </span>
          </div>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer" aria-label="Site Footer">
        <div className="footer-top">
          <div className="container">Free Job Alert · Sarkari Job Hub · Result · Admit Card · Answer Key · Syllabus</div>
        </div>

        <div className="footer-main footer-seo">
          <div className="container footer-grid-extended">
            <section className="col jobs-qualification" aria-label="Jobs by Qualification">
              <h3>Jobs by Qualification</h3>
              <ul>
                {['10th Pass Jobs','12th Pass Jobs','ITI Jobs','Diploma Jobs','Graduate Jobs','Post Graduate Jobs','B.Tech Jobs','B.Ed Jobs','MBA Jobs','Engineering Jobs'].map((t)=> (
                  <li key={t}><Link to="/search">{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col jobs-state" aria-label="Jobs by State">
              <h3>Jobs by State</h3>
              <ul>
                {['Bihar Jobs','UP Jobs','Delhi Jobs','Rajasthan Jobs','MP Jobs','Jharkhand Jobs','Punjab Jobs','Haryana Jobs','Maharashtra Jobs','Gujarat Jobs','Tamil Nadu Jobs','Karnataka Jobs','West Bengal Jobs','Odisha Jobs','Chhattisgarh Jobs','All State Jobs'].map((t)=> (
                  <li key={t}><Link to="/search">{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col top-recruiters" aria-label="Top Recruiters">
              <h3>Top Recruiters</h3>
              <ul>
                {['SSC','UPSC','Railway (RRB)','IBPS','SBI','RBI','BPSC','UPPSC','Indian Army','Indian Navy','Indian Air Force','DRDO','ISRO','BSF','CRPF','CISF','ITBP','NTA','UGC','AIIMS','ESIC'].map((t)=> (
                  <li key={t}><Link to="/search">{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col popular-exams" aria-label="Popular Exams">
              <h3>Popular Exams</h3>
              <ul>
                {['SSC CGL','SSC CHSL','SSC GD','SSC MTS','UPSC CSE','UPSC CDS','NDA','RRB NTPC','RRB Group D','IBPS PO','IBPS Clerk','SBI PO','CTET','REET','BPSC TRE','Bihar Police','UP Police'].map((t)=> (
                  <li key={t}><Link to="/search">{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col student-resources" aria-label="Student Resources">
              <h3>Student Resources</h3>
              <ul>
                {['Current Affairs','Exam Calendar','Previous Year Papers','Mock Tests','Cut Off','Answer Key','Syllabus','Exam Pattern','Preparation Tips','Study Material','Career Guidance','Interview Tips'].map((t)=> (
                  <li key={t}><Link to="/search">{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col important-pages" aria-label="Important Pages">
              <h3>Important Pages</h3>
              <ul>
                {['About Us','Contact Us','Privacy Policy','Disclaimer','Terms & Conditions','Editorial Policy','Fact Check Policy','DMCA','Sitemap','RSS Feed'].map((t)=> (
                  <li key={t}><Link to="/">{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col tools" aria-label="Tools">
              <h3>Tools</h3>
              <ul>
                {['Age Calculator','Percentage Calculator','CGPA Calculator','Typing Test','Mock Test','Resume Builder','Document Checker'].map((t)=> (
                  <li key={t}><Link to="/tools">{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col trending-searches" aria-label="Trending Searches">
              <h3>Trending Searches</h3>
              <ul>
                {['Latest Government Jobs','Government Jobs 2026','Sarkari Result','Free Job Alert','Latest Admit Card','Latest Results','Upcoming Exams','Online Form','Offline Form','Recruitment Notification'].map((t)=> (
                  <li key={t}><Link to="/search">{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col trust-badges" aria-label="Trust Badges">
              <h3>Trust &amp; Reliability</h3>
              <ul>
                {['Daily Updated','Verified Notifications','Mobile Friendly','Secure Website','Free Job Alerts','Fast Loading','Trusted by Students'].map((t)=> (
                  <li key={t} className="badge">✔ {t}</li>
                ))}
              </ul>
            </section>

            <section className="col newsletter" aria-label="Newsletter">
              <h3>Get Daily Government Job Alerts</h3>
              <form onSubmit={(e)=>{e.preventDefault(); /* placeholder - no backend change */ setNewsletterEmail(''); alert('Subscribed: ' + (newsletterEmail||' (no email)')); }}>
                <input aria-label="Email" placeholder="Enter your email" value={newsletterEmail} onChange={(e)=>setNewsletterEmail(e.target.value)} />
                <button type="submit" className="btn btn-primary">Subscribe</button>
                <small className="privacy-text">We respect your privacy. No spam. Unsubscribe anytime.</small>
              </form>
            </section>

            <section className="col download-app" aria-label="Download App">
              <h3>Download App</h3>
              <p>Coming Soon</p>
              <div className="app-links">
                <button className="btn btn-outline">Android</button>
                <button className="btn btn-outline">iOS</button>
              </div>
              <div className="social-links">
                <a href="#" aria-label="Facebook">Facebook</a>
                <a href="#" aria-label="Instagram">Instagram</a>
                <a href="#" aria-label="Twitter">Twitter</a>
                <a href="#" aria-label="Telegram">Telegram</a>
                <a href="#" aria-label="YouTube">YouTube</a>
                <a href="#" aria-label="LinkedIn">LinkedIn</a>
                <a href="#" aria-label="GitHub">GitHub</a>
              </div>
            </section>
          </div>
        </div>

        <div className="footer-seo-copy container">
          <h2>Find Latest Sarkari Jobs &amp; Exam Updates</h2>
          <p>
            Sarkari Job Hub brings you the most trusted and up-to-date Sarkari Jobs and government
            exam information across India. We publish Latest Government Jobs, Admit Card notices,
            Results, Answer Keys and official Recruitment Notifications for SSC, UPSC, Railway,
            Bank Jobs and State Government vacancies. Our free job alert keeps you informed about
            upcoming exams, online form deadlines, and important updates so you never miss an
            opportunity. Whether you're searching for central government jobs, state government
            roles, defense, teaching positions, or technical posts, find curated listings and
            helpful resources including previous year papers, syllabus, cut offs and mock tests.
            Stay organized with daily notifications, mobile-friendly pages and verified links to
            official portals. Start searching for Sarkari Jobs 2026, set alerts for your
            preferred categories, and prepare confidently with our study material and tips.
          </p>
        </div>

        <div className="footer-faq container" aria-label="FAQ">
          <h2>Frequently Asked Questions</h2>
          <div itemScope itemType="https://schema.org/FAQPage">
            {[
              {q:'What is Sarkari Job Hub?', a:'Sarkari Job Hub is a free portal that aggregates government job notifications, results, admit cards and helpful exam resources.'},
              {q:'How to apply online?', a:'Follow the official recruitment notification link provided in the post and complete the application on the recruiting authority website.'},
              {q:'How to download admit card?', a:'Open the admit card post and follow the official link. Enter required credentials on the official site to download the admit card.'},
              {q:'How to check result?', a:'Results are linked to official board pages. Click the result post and follow the provided official link.'},
              {q:'How often are jobs updated?', a:'We update the site daily as new notifications and official posts are published.'},
              {q:'Are notifications verified?', a:'We verify notifications against official sources before listing, but always cross-check on the issuing authority’s site.'},
              {q:'How can I receive free job alerts?', a:'Subscribe to our newsletter or follow our Telegram/WhatsApp channels for daily alerts.'},
              {q:'Is registration required?', a:'No registration is required to browse jobs; some official applications may require registration on the recruiting portal.'}
            ].map((item, idx)=> (
              <div key={idx} itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                <h3 itemProp="name">{item.q}</h3>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <div itemProp="text">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom container">
          <div className="footer-bottom-row">
            <div>© {new Date().getFullYear()} Sarkari Job Hub · Made with ❤️ in India</div>
            <div className="bottom-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/sitemap">Sitemap</Link>
              <button className="btn btn-sm" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Back To Top</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
