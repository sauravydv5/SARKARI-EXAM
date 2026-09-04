import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { api } from '../api';

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || '1111';
const CURRENT_YEAR = new Date().getFullYear();

const navItems = [
  { to: '/', label: 'Home', end: true, icon: '🏠' },
  { to: '/latest-jobs', label: 'Latest Jobs', icon: '💼' },
  { to: '/results', label: 'Results', icon: '📊' },
  { to: '/admit-cards', label: 'Admit Card', icon: '🎫' },
  { to: '/answer-keys', label: 'Answer Key', icon: '🔑' },
  { to: '/syllabus', label: 'Syllabus', icon: '📘' },
  { to: '/admission', label: 'Admission', icon: '🎓' },
  { to: '/important', label: 'Documents', icon: '📄' },
  { to: '/search', label: 'Search', icon: '🔎' },
];

const footerLink = (label, href) => ({ label, href });

const jobsByQualification = [
  footerLink('10th Pass Jobs', 'https://www.ncs.gov.in/'),
  footerLink('12th Pass Jobs', 'https://www.ncs.gov.in/'),
  footerLink('ITI Jobs', 'https://www.ncs.gov.in/'),
  footerLink('Diploma Jobs', 'https://www.ncs.gov.in/'),
  footerLink('Graduate Jobs', 'https://www.ncs.gov.in/'),
  footerLink('Post Graduate Jobs', 'https://www.ncs.gov.in/'),
  footerLink('B.Tech Jobs', 'https://www.ncs.gov.in/'),
  footerLink('B.Ed Jobs', 'https://www.ncs.gov.in/'),
  footerLink('MBA Jobs', 'https://www.ncs.gov.in/'),
  footerLink('Engineering Jobs', 'https://www.ncs.gov.in/'),
];

const jobsByState = [
  footerLink('Bihar Jobs', 'https://state.bihar.gov.in/'),
  footerLink('UP Jobs', 'https://sewayojan.up.nic.in/'),
  footerLink('Delhi Jobs', 'https://employment.delhi.gov.in/'),
  footerLink('Rajasthan Jobs', 'https://employment.livelihoods.rajasthan.gov.in/'),
  footerLink('MP Jobs', 'https://mprojgar.gov.in/'),
  footerLink('Jharkhand Jobs', 'https://rojgar.jharkhand.gov.in/'),
  footerLink('Punjab Jobs', 'https://pgrkam.com/'),
  footerLink('Haryana Jobs', 'https://hrex.gov.in/'),
  footerLink('Maharashtra Jobs', 'https://rojgar.mahaswayam.gov.in/'),
  footerLink('Gujarat Jobs', 'https://anubandham.gujarat.gov.in/'),
  footerLink('Tamil Nadu Jobs', 'https://www.tnvelaivalippu.gov.in/'),
  footerLink('Karnataka Jobs', 'https://skillconnect.kaushalkar.com/'),
  footerLink('West Bengal Jobs', 'https://www.wb.gov.in/'),
  footerLink('Odisha Jobs', 'https://www.ncs.gov.in/'),
  footerLink('Chhattisgarh Jobs', 'https://employment.cg.gov.in/'),
  footerLink('All State Jobs', 'https://www.ncs.gov.in/'),
];

const topRecruiters = [
  footerLink('SSC', 'https://ssc.gov.in/'),
  footerLink('UPSC', 'https://upsc.gov.in/'),
  footerLink('Railway (RRB)', 'https://www.rrbcdg.gov.in/'),
  footerLink('IBPS', 'https://www.ibps.in/'),
  footerLink('SBI', 'https://sbi.co.in/web/careers'),
  footerLink('RBI', 'https://opportunities.rbi.org.in/'),
  footerLink('BPSC', 'https://bpsc.bihar.gov.in/'),
  footerLink('UPPSC', 'https://uppsc.up.nic.in/'),
  footerLink('Indian Army', 'https://joinindianarmy.nic.in/'),
  footerLink('Indian Navy', 'https://www.joinindiannavy.gov.in/'),
  footerLink('Indian Air Force', 'https://agnipathvayu.cdac.in/'),
  footerLink('DRDO', 'https://www.drdo.gov.in/'),
  footerLink('ISRO', 'https://www.isro.gov.in/Careers.html'),
  footerLink('BSF', 'https://rectt.bsf.gov.in/'),
  footerLink('CRPF', 'https://rect.crpf.gov.in/'),
  footerLink('CISF', 'https://cisfrectt.cisf.gov.in/'),
  footerLink('ITBP', 'https://recruitment.itbpolice.nic.in/'),
  footerLink('NTA', 'https://www.nta.ac.in/'),
  footerLink('UGC', 'https://www.ugc.gov.in/'),
  footerLink('AIIMS', 'https://www.aiimsexams.ac.in/'),
  footerLink('ESIC', 'https://www.esic.gov.in/recruitments'),
];

const popularExams = [
  footerLink('SSC CGL', 'https://ssc.gov.in/'),
  footerLink('SSC CHSL', 'https://ssc.gov.in/'),
  footerLink('SSC GD', 'https://ssc.gov.in/'),
  footerLink('SSC MTS', 'https://ssc.gov.in/'),
  footerLink('UPSC CSE', 'https://upsc.gov.in/'),
  footerLink('UPSC CDS', 'https://upsc.gov.in/'),
  footerLink('NDA', 'https://upsc.gov.in/'),
  footerLink('RRB NTPC', 'https://www.rrbcdg.gov.in/'),
  footerLink('RRB Group D', 'https://www.rrbcdg.gov.in/'),
  footerLink('IBPS PO', 'https://www.ibps.in/'),
  footerLink('IBPS Clerk', 'https://www.ibps.in/'),
  footerLink('SBI PO', 'https://sbi.co.in/web/careers'),
  footerLink('CTET', 'https://ctet.nic.in/'),
  footerLink('REET', 'https://reet2024.co.in/'),
  footerLink('BPSC TRE', 'https://bpsc.bihar.gov.in/'),
  footerLink('Bihar Police', 'https://csbc.bihar.gov.in/'),
  footerLink('UP Police', 'https://uppbpb.gov.in/'),
];

function ExternalFooterLinks({ links }) {
  return links.map(({ label, href }) => (
    <li key={label}><a href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>
  ));
}

export default function Layout() {
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    const { data } = api.getFeaturedPosts(8);
    setFeaturedPosts(Array.isArray(data) ? data : []);
  }, []);

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
              🔔 Daily exam updates — <Link to="/latest-jobs">SSC | Railway | Bank | UPSC →</Link>
            </span>
            <a
              href="https://whatsapp.com/channel/0029Vb9NzB6LikgCNJ40Zu0O"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
              aria-label="Join our WhatsApp channel for latest news updates"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.15 6.38 2.15 11.81c0 1.92.55 3.79 1.58 5.41L2 22l4.94-1.64a9.79 9.79 0 0 0 4.97 1.45h.01c5.46 0 9.89-4.38 9.89-9.81S17.5 2 12.04 2Zm0 17.9h-.01c-1.6 0-3.17-.43-4.54-1.24l-.33-.2-2.94.97 1-2.86-.21-.34A7.99 7.99 0 0 1 4.15 11.8c0-4.38 3.53-7.94 7.89-7.94 4.35 0 7.89 3.56 7.89 7.94 0 4.38-3.54 7.95-7.89 7.95Zm4.34-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.29-.74-1.77-.2-.46-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.17.86 2.31.98 2.47.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.57.18 1.1.16 1.51.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <a
              href="https://t.me/freepdfannotes"
              target="_blank"
              rel="noopener noreferrer"
              className="telegram-link"
              aria-label="Join our Telegram channel for free PDF notes and more updates"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.6 4.3 18.5 19c-.2 1-1 1.3-1.8.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.2 12.8l-4.7-1.5c-1-.3-1-1 .2-1.5L20 2.4c.8-.3 1.8.2 1.6 1.9Z"/>
              </svg>
              <span>Telegram</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <header className="site-header sticky top-0 z-40">
        <div className="container brand-row flex items-center justify-between gap-6">
          <Link to="/" className="brand flex items-center gap-4 no-underline">
            <img
              src="/logo.png"
              alt="Sarkari Jobs Hub logo"
              className="brand-logo-img rounded-md shadow-sm"
              width={72}
              height={72}
              decoding="async"
            />
            <div className="brand-text leading-tight">
              <h1 className="m-0 font-poppins text-[1.05rem] md:text-[1.2rem] font-extrabold">Sarkari Job Hub</h1>
              <p className="m-0 text-xs md:text-sm text-[--muted]">Sarkari Jobs | Government Exam Results | Admit Cards | Answer Keys | Notifications | {CURRENT_YEAR}</p>
            </div>
          </Link>

          <form className="header-search flex items-center ml-auto w-full max-w-sm" onSubmit={onSearch}>
            <label htmlFor="site-search" className="sr-only">Search</label>
            <input
              id="site-search"
              type="search"
              placeholder="Search SSC, Railway, NEET, Bank jobs..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search"
              className="flex-1 px-4 py-2 rounded-full bg-white/95 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button type="submit" className="ml-3 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold shadow-md hover:scale-[1.02] transition">Search</button>
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
          <ul id="main-nav-list" className={`flex flex-wrap items-center gap-2 ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition ${isActive ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md' : 'text-white/90 hover:bg-white/6'}`
                  }
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
          {menuOpen && featuredPosts.length > 0 && (
            <div className="mobile-featured-links" aria-label="Latest featured updates">
              <div className="mobile-featured-heading">Latest Updates</div>
              <div className="mobile-featured-grid">
                {featuredPosts.map((post) => (
                  <Link
                    key={post._id || post.slug || post.id}
                    to={`/post/${post.slug || post.id}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="marquee-bar">
        <div className="container">
          <span className="marquee-label">LIVE</span>
          <div className="marquee-track">
            <span>
              Welcome to Sarkari Job Hub — latest government jobs, exam guidance, admit cards, answer keys, syllabus and admissions for India · SSC · UPSC · Railway · Banking · Police · Teaching
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
          <div className="container">Sarkari Job Hub · Government Jobs · Results · Admit Cards · Answer Keys · Syllabus</div>
        </div>

        <div className="footer-main footer-seo">
          <div className="container footer-grid-extended">
            <section className="col jobs-qualification" aria-label="Jobs by Qualification">
              <h3>Jobs by Qualification</h3>
              <ul>
                <ExternalFooterLinks links={jobsByQualification} />
              </ul>
            </section>

            <section className="col jobs-state" aria-label="Jobs by State">
              <h3>Jobs by State</h3>
              <ul>
                <ExternalFooterLinks links={jobsByState} />
              </ul>
            </section>

            <section className="col top-recruiters" aria-label="Top Recruiters">
              <h3>Top Recruiters</h3>
              <ul>
                <ExternalFooterLinks links={topRecruiters} />
              </ul>
            </section>

            <section className="col popular-exams" aria-label="Popular Exams">
              <h3>Popular Exams</h3>
              <ul>
                <ExternalFooterLinks links={popularExams} />
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
                {[
                  ['About Us', '/about-us'],
                  ['Contact Us', '/contact'],
                  ['Privacy Policy', '/privacy-policy'],
                  ['Disclaimer', '/disclaimer'],
                  ['Terms & Conditions', '/terms'],
                  ['Editorial Policy', '/editorial-policy'],
                  ['Fact Check Policy', '/fact-checking-policy'],
                  ['DMCA', '/dmca'],
                  ['Sitemap', '/sitemap'],
                  ['RSS Feed', '/rss'],
                ].map(([t, to]) => (
                  <li key={t}><Link to={to}>{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col trending-searches" aria-label="Trending Searches">
              <h3>Trending Searches</h3>
              <ul>
                {['Latest Government Jobs',`Government Jobs ${CURRENT_YEAR}`,'Sarkari Result','Free Job Alert','Latest Admit Card','Latest Results','Upcoming Exams','Online Form','Offline Form','Recruitment Notification'].map((t)=> (
                  <li key={t}><Link to="/search">{t}</Link></li>
                ))}
              </ul>
            </section>

            <section className="col trust-badges" aria-label="Trust Badges">
              <h3>Information standards</h3>
              <ul>
                {['Independent informational website', 'Official source links shown on update pages', 'Corrections and feedback welcome', 'Read our editorial policy'].map((t)=> (
                  <li key={t} className="badge">✔ {t}</li>
                ))}
              </ul>
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
          <p className="footer-update-note">
            Due to some unavoidable circumstances, the website was not updated on time earlier, but from
            today onward, all forms, notifications, and exam updates will be refreshed daily to provide
            timely and consistent coverage. <span className="update-note-hindi">(Kuch zaroori wajahon se website pehle timely update nahi ho paayi, lekin ab se har chiz ki daily update hogi.)</span>
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
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/sitemap">Sitemap</Link>
              <Link to="/rss">RSS</Link>
              <button className="btn btn-sm" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Back To Top</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
