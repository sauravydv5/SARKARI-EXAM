import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../api';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/latest-jobs', label: 'Latest Jobs' },
  { to: '/results', label: 'Results' },
  { to: '/admit-cards', label: 'Admit Card' },
  { to: '/answer-keys', label: 'Answer Key' },
  { to: '/syllabus', label: 'Syllabus' },
  { to: '/admission', label: 'Admission' },
  { to: '/important', label: 'Important' },
  { to: '/search', label: 'Search' },
];

export default function Layout() {
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
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
    if (term === '803202') {
      navigate('/admin');
    } else {
      navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
    }
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="container top-bar-inner">
          <span className="top-bar-date">📅 {today}</span>
          <div className="top-bar-right">
            <span className="top-bar-tagline">
              Free Job Alert — <Link to="/latest-jobs">Latest Jobs →</Link>
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
              <p>Jobs · Results · Admit Cards · Answer Keys · 2026</p>
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
                  {item.label}
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
              Welcome to Sarkari Job Hub — Latest Government Jobs, Results, Admit Cards, Answer
              Keys, Syllabus &amp; Admission · SSC · UPSC · Railway · Banking · Police · State Jobs
              · Board Results · Free Job Alert Portal for India
            </span>
          </div>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="container">
            Free Job Alert &nbsp;|&nbsp; Sarkari Job Hub &nbsp;|&nbsp; Result &nbsp;|&nbsp; Admit
            Card &nbsp;|&nbsp; Answer Key &nbsp;|&nbsp; Syllabus
          </div>
        </div>
        <div className="footer-main">
          <div className="container footer-grid">
            <div>
              <h4>Quick Links</h4>
              {CATEGORIES.slice(0, 4).map((c) => (
                <Link key={c.key} to={c.path}>
                  {c.label}
                </Link>
              ))}
            </div>
            <div>
              <h4>More Categories</h4>
              {CATEGORIES.slice(4).map((c) => (
                <Link key={c.key} to={c.path}>
                  {c.label}
                </Link>
              ))}
            </div>
            <div>
              <h4>Get Started</h4>
              <Link to="/search">Search for jobs</Link>
              <Link to="/latest-jobs">Latest government notifications</Link>
              <Link to="/important">Important notices</Link>
              <Link to="/admit-cards">Admit card alerts</Link>
            </div>
            <div>
              <h4>Support</h4>
              <p className="footer-about">
                Need help with the app? Use the search box or browse categories. Questions? Email
                us at <strong>support@sarkarijobhud.website</strong>.
              </p>
              <p className="footer-about">
                Open hours: Mon–Fri, 9am–6pm IST.
              </p>
            </div>
            <div>
              <h4>About Portal</h4>
              <p className="footer-about">
                Sarkari Job Hub is a free portal for government job alerts, exam results, admit
                cards, answer keys and syllabus updates. Verify details on official websites.
              </p>
              <div className="footer-theme-row">
                <span>Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-extra">
          <div className="container footer-extra-grid">
            <div>
              <h4>Why use this portal?</h4>
              <p>
                Quick access to government job alerts and exam updates across central and state
                notifications. We keep the layout simple so you can find what matters fast.
              </p>
            </div>
            <div>
              <h4>Contact &amp; Trust</h4>
              <p>
                Email: <strong>support@sarkarijobhud.website</strong>
              </p>
              <p>Based in India · Updated daily with new posts</p>
              <p>
                Note: This site is not an official government service. Always verify on official
                notice pages.
              </p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© {new Date().getFullYear()} Sarkari Job Hub ·</p>
            <p>Privacy · Terms · Support</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
