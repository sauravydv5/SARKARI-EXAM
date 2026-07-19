import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, categoryMeta, formatDate } from '../api';
import { sanitizeHtml } from '../utils/sanitize';

const CATEGORY_ICONS = {
  'latest-job': '💼',
  result: '📊',
  'admit-card': '🎫',
  'answer-key': '🔑',
  syllabus: '📘',
  admission: '🎓',
  important: '⭐',
  certificate: '📜',
};

const SOON = 'Update Soon';

function val(v, fallback = SOON) {
  if (v === 0) return '0';
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  if (!s || s === '—' || s === '-') return fallback;
  return s;
}

function TableRow({ label, children, highlight }) {
  return (
    <tr className={highlight ? 'pd-tr-hot' : ''}>
      <th>{label}</th>
      <td>{children}</td>
    </tr>
  );
}

function LinkRow({ label, href, text }) {
  return (
    <tr>
      <th>{label}</th>
      <td>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="pd-table-link">
            {text || 'Click Here'}
          </a>
        ) : (
          <span className="pd-muted">{SOON}</span>
        )}
      </td>
    </tr>
  );
}

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    window.scrollTo(0, 0);
    (async () => {
      try {
        const res = await api.getPost(slug);
        if (cancelled) return;
        setPost(res.data);
        setRelated(res.related || []);
        setError('');
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setPost(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="pd-loading-card">
        <div className="loading">Loading full notification details…</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="error-box">
        {error || 'Post not found'}
        <div style={{ marginTop: 12 }}>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const cat = categoryMeta(post.category);
  const dates = post.importantDates || {};
  const links = post.links || {};
  const icon = CATEGORY_ICONS[post.category] || '📌';

  const vacanciesText =
    post.totalVacancies > 0
      ? `${post.totalVacancies.toLocaleString('en-IN')} Posts`
      : post.vacancyDetails
        ? val(post.vacancyDetails)
        : SOON;

  const primaryHref =
    links.applyOnline || links.checkResult || links.downloadAdmitCard || links.answerKey;
  const primaryLabel = links.applyOnline
    ? 'Apply Online'
    : links.checkResult
      ? 'Check Result'
      : links.downloadAdmitCard
        ? 'Download Admit Card'
        : links.answerKey
          ? 'Answer Key'
          : 'Official Link';

  const howSteps = (post.howToApply || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const docList = (post.documentsRequired || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="pd-page">
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="pd-bc-sep">/</span>
        <Link to={cat.path}>{cat.label}</Link>
        <span className="pd-bc-sep">/</span>
        <span className="pd-bc-current">{post.title}</span>
      </nav>

      <div className="pd-layout">
        <div className="pd-main">
          {/* Title block */}
          <header className="pd-hero">
            <div className="pd-hero-top">
              <span className="pd-cat-badge">
                {icon} {cat.label}
              </span>
              {post.isFeatured && <span className="pd-featured-badge">★ Featured</span>}
              <span className="pd-views-badge">👁 {post.views || 0} views</span>
            </div>
            <h1 className="pd-title">{post.title}</h1>
            <p className="pd-org">
              <span className="pd-org-icon">🏛</span>
              {val(post.organization, 'Government Organization')}
              {post.department ? ` · ${post.department}` : ''}
            </p>
            <p className="pd-summary">
              {val(
                post.shortDescription,
                `${post.title} – complete details, dates, fee, eligibility and apply links below.`
              )}
            </p>
            <div className="pd-meta-chips">
              <span className="pd-chip">📅 {formatDate(post.publishedAt)}</span>
              <span className="pd-chip">📋 {val(post.postName, cat.label)}</span>
              {post.tags?.length > 0 &&
                post.tags.slice(0, 3).map((t) => (
                  <span key={t} className="pd-chip">
                    #{t}
                  </span>
                ))}
            </div>
          </header>

          {/* Quick info strip — always 5 cards with values */}
          <div className="pd-stats pd-stats-full">
            <div className="pd-stat red">
              <span className="pd-stat-icon">👥</span>
              <div>
                <span className="pd-stat-label">Total Post</span>
                <strong className="pd-stat-value">
                  {post.totalVacancies > 0
                    ? post.totalVacancies.toLocaleString('en-IN')
                    : 'See Details'}
                </strong>
              </div>
            </div>
            <div className="pd-stat amber">
              <span className="pd-stat-icon">⏰</span>
              <div>
                <span className="pd-stat-label">Last Date</span>
                <strong className="pd-stat-value">{val(dates.lastDate)}</strong>
              </div>
            </div>
            <div className="pd-stat blue">
              <span className="pd-stat-icon">📝</span>
              <div>
                <span className="pd-stat-label">Exam Date</span>
                <strong className="pd-stat-value">{val(dates.examDate)}</strong>
              </div>
            </div>
            <div className="pd-stat green">
              <span className="pd-stat-icon">🏆</span>
              <div>
                <span className="pd-stat-label">Result Date</span>
                <strong className="pd-stat-value">{val(dates.resultDate)}</strong>
              </div>
            </div>
            <div className="pd-stat purple">
              <span className="pd-stat-icon">🎓</span>
              <div>
                <span className="pd-stat-label">Qualification</span>
                <strong className="pd-stat-value pd-stat-clamp">
                  {val(post.qualification)}
                </strong>
              </div>
            </div>
          </div>

          {/* ===== FULL INFO TABLE ===== */}
          <section className="pd-section">
            <div className="pd-section-head">
              <h2>📋 {post.title} – Complete Information</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table">
                <tbody>
                  <TableRow label="Name of Post / Exam">{val(post.postName || post.title)}</TableRow>
                  <TableRow label="Post Date / Published">{formatDate(post.publishedAt)}</TableRow>
                  <TableRow label="Category / Section">{cat.label}</TableRow>
                  <TableRow label="Recruitment Board / Authority">
                    {val(post.organization)}
                  </TableRow>
                  <TableRow label="Department">{val(post.department, '—')}</TableRow>
                  <TableRow label="Total Vacancy / Posts" highlight>
                    {vacanciesText}
                  </TableRow>
                  <TableRow label="Vacancy Details">{val(post.vacancyDetails)}</TableRow>
                  <TableRow label="Qualification / Eligibility" highlight>
                    {val(post.qualification)}
                  </TableRow>
                  <TableRow label="Age Limit">{val(post.ageLimit)}</TableRow>
                  <TableRow label="Application Fee" highlight>
                    {val(post.applicationFee)}
                  </TableRow>
                  <TableRow label="Pay Scale / Salary">{val(post.salary)}</TableRow>
                  <TableRow label="Selection Process">{val(post.selectionProcess)}</TableRow>
                  <TableRow label="Notification Date">{val(dates.notificationDate)}</TableRow>
                  <TableRow label="Online Apply Start Date">{val(dates.startDate)}</TableRow>
                  <TableRow label="Last Date for Apply Online" highlight>
                    {val(dates.lastDate)}
                  </TableRow>
                  <TableRow label="Admit Card Date">{val(dates.admitCardDate)}</TableRow>
                  <TableRow label="Exam Date">{val(dates.examDate)}</TableRow>
                  <TableRow label="Result Date">{val(dates.resultDate)}</TableRow>
                </tbody>
              </table>
            </div>
          </section>

          {/* Important Dates table */}
          <section className="pd-section">
            <div className="pd-section-head">
              <h2>📅 Important Dates</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table">
                <tbody>
                  <TableRow label="Notification / Advt. Date">{val(dates.notificationDate)}</TableRow>
                  <TableRow label="Application Begin">{val(dates.startDate)}</TableRow>
                  <TableRow label="Last Date for Apply Online" highlight>
                    {val(dates.lastDate)}
                  </TableRow>
                  <TableRow label="Last Date for Fee Payment">{val(dates.lastDate)}</TableRow>
                  <TableRow label="Admit Card Available">{val(dates.admitCardDate)}</TableRow>
                  <TableRow label="Examination Date">{val(dates.examDate)}</TableRow>
                  <TableRow label="Result Declared">{val(dates.resultDate)}</TableRow>
                </tbody>
              </table>
            </div>
          </section>

          {/* Application Fee */}
          <section className="pd-section">
            <div className="pd-section-head">
              <h2>💳 Application Fee</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table">
                <tbody>
                  <TableRow label="Fee Details" highlight>
                    {val(post.applicationFee)}
                  </TableRow>
                  <TableRow label="Payment Mode">
                    Debit Card / Credit Card / Net Banking / UPI (as per official portal)
                  </TableRow>
                </tbody>
              </table>
            </div>
          </section>

          {/* Age Limit */}
          <section className="pd-section">
            <div className="pd-section-head">
              <h2>⏳ Age Limit</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table">
                <tbody>
                  <TableRow label="Age Limit Details" highlight>
                    {val(post.ageLimit)}
                  </TableRow>
                  <TableRow label="Age Relaxation">
                    Extra age relaxation for SC / ST / OBC / PwBD / Ex-Servicemen as per Government
                    rules (see official notification).
                  </TableRow>
                </tbody>
              </table>
            </div>
          </section>

          {/* Vacancy + Eligibility */}
          <section className="pd-section">
            <div className="pd-section-head">
              <h2>👥 Vacancy &amp; Eligibility Details</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table">
                <tbody>
                  <TableRow label="Total Post" highlight>
                    {post.totalVacancies > 0
                      ? post.totalVacancies.toLocaleString('en-IN')
                      : val(post.vacancyDetails, 'As per notification')}
                  </TableRow>
                  <TableRow label="Vacancy Information">{val(post.vacancyDetails)}</TableRow>
                  <TableRow label="Educational Qualification" highlight>
                    {val(post.qualification)}
                  </TableRow>
                  <TableRow label="Pay Scale / Salary">{val(post.salary)}</TableRow>
                  <TableRow label="Selection Process">{val(post.selectionProcess)}</TableRow>
                </tbody>
              </table>
            </div>
          </section>

          {/* Documents */}
          <section className="pd-section">
            <div className="pd-section-head">
              <h2>📁 Documents Required</h2>
            </div>
            {docList.length > 0 ? (
              <ul className="pd-doc-list">
                {docList.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : (
              <div className="pd-content">
                <p>{SOON} — check official notification for document list.</p>
              </div>
            )}
          </section>

          {/* How to apply */}
          <section className="pd-section">
            <div className="pd-section-head">
              <h2>✅ How to Fill Online Form</h2>
            </div>
            {howSteps.length > 0 ? (
              <ol className="pd-steps">
                {howSteps.map((step, i) => {
                  const text = step.replace(/^\d+\.\s*/, '');
                  return (
                    <li key={i}>
                      <span className="pd-step-num">{i + 1}</span>
                      <div>
                        <strong>{text}</strong>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <ol className="pd-steps">
                <li>
                  <span className="pd-step-num">1</span>
                  <div>
                    <strong>Read the full notification carefully</strong>
                    <p>Check eligibility, fee, dates and instructions.</p>
                  </div>
                </li>
                <li>
                  <span className="pd-step-num">2</span>
                  <div>
                    <strong>Click Apply Online / official link</strong>
                    <p>Use the Important Links section below.</p>
                  </div>
                </li>
                <li>
                  <span className="pd-step-num">3</span>
                  <div>
                    <strong>Fill form, upload documents, pay fee</strong>
                    <p>Submit and print the confirmation page.</p>
                  </div>
                </li>
              </ol>
            )}
          </section>

          {/* About / description */}
          <section className="pd-section">
            <div className="pd-section-head">
              <h2>📖 About This Recruitment / Update</h2>
            </div>
            <div className="pd-content content-html">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
              ) : (
                <p>
                  {val(post.shortDescription)} Full details are given in the tables above. Always
                  confirm on the official website before applying.
                </p>
              )}
            </div>
          </section>

          {/* Important Links — classic table */}
          <section className="pd-section pd-links-section">
            <div className="pd-section-head">
              <h2>🔗 Important Links</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table pd-links-table">
                <tbody>
                  <LinkRow label="Apply Online" href={links.applyOnline} text="Click Here" />
                  <LinkRow label="Check Result" href={links.checkResult} text="Click Here" />
                  <LinkRow
                    label="Download Admit Card"
                    href={links.downloadAdmitCard}
                    text="Click Here"
                  />
                  <LinkRow label="Download Answer Key" href={links.answerKey} text="Click Here" />
                  <LinkRow
                    label="Download Notification"
                    href={links.officialNotification}
                    text="Click Here"
                  />
                  <LinkRow
                    label="Official Website"
                    href={links.officialWebsite}
                    text="Click Here"
                  />
                </tbody>
              </table>
            </div>
            {primaryHref && (
              <div className="pd-big-cta-wrap">
                <a
                  href={primaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-big-cta"
                >
                  {primaryLabel} ↗
                </a>
              </div>
            )}
          </section>

          <div className="pd-disclaimer">
            <strong>⚠️ Disclaimer:</strong> Some information is for demo / educational purposes.
            Please verify every detail (dates, fee, vacancy, eligibility) on the official government
            website before applying.
          </div>
        </div>

        {/* Sidebar */}
        <aside className="pd-sidebar">
          <div className="pd-side-card pd-side-actions">
            <div className="pd-side-title">Quick Actions</div>
            {primaryHref && (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-cta"
              >
                <span className="pd-cta-label">{primaryLabel}</span>
                <span className="pd-cta-sub">Official portal ↗</span>
              </a>
            )}
            <div className="pd-side-links">
              {links.applyOnline && (
                <a href={links.applyOnline} target="_blank" rel="noopener noreferrer">
                  🚀 Apply Online
                </a>
              )}
              {links.checkResult && (
                <a href={links.checkResult} target="_blank" rel="noopener noreferrer">
                  📊 Check Result
                </a>
              )}
              {links.downloadAdmitCard && (
                <a href={links.downloadAdmitCard} target="_blank" rel="noopener noreferrer">
                  🎫 Admit Card
                </a>
              )}
              {links.answerKey && (
                <a href={links.answerKey} target="_blank" rel="noopener noreferrer">
                  🔑 Answer Key
                </a>
              )}
              {links.officialNotification && (
                <a href={links.officialNotification} target="_blank" rel="noopener noreferrer">
                  📄 Notification
                </a>
              )}
              {links.officialWebsite && (
                <a href={links.officialWebsite} target="_blank" rel="noopener noreferrer">
                  🌐 Official Website
                </a>
              )}
            </div>
          </div>

          <div className="pd-side-card">
            <div className="pd-side-title">Key Information</div>
            <ul className="pd-side-dates">
              <li>
                <span>Posts</span>
                <strong>
                  {post.totalVacancies > 0
                    ? post.totalVacancies.toLocaleString('en-IN')
                    : 'See table'}
                </strong>
              </li>
              <li>
                <span>Start</span>
                <strong>{val(dates.startDate)}</strong>
              </li>
              <li className="urgent">
                <span>Last Date</span>
                <strong>{val(dates.lastDate)}</strong>
              </li>
              <li>
                <span>Exam</span>
                <strong>{val(dates.examDate)}</strong>
              </li>
              <li>
                <span>Result</span>
                <strong>{val(dates.resultDate)}</strong>
              </li>
              <li>
                <span>Admit Card</span>
                <strong>{val(dates.admitCardDate)}</strong>
              </li>
            </ul>
          </div>

          <div className="pd-side-card">
            <div className="pd-side-title">At a Glance</div>
            <ul className="pd-side-dates pd-glance">
              <li>
                <span>Board</span>
                <strong>{val(post.organization, '—')}</strong>
              </li>
              <li>
                <span>Qualification</span>
                <strong>{val(post.qualification)}</strong>
              </li>
              <li>
                <span>Age</span>
                <strong>{val(post.ageLimit)}</strong>
              </li>
              <li>
                <span>Fee</span>
                <strong>{val(post.applicationFee)}</strong>
              </li>
            </ul>
          </div>

          <div className="pd-side-card">
            <div className="pd-side-title">Browse Categories</div>
            <div className="pd-side-cats">
              {['latest-job', 'result', 'admit-card', 'answer-key', 'syllabus', 'admission'].map(
                (key) => {
                  const m = categoryMeta(key);
                  return (
                    <Link key={key} to={m.path} className="pd-side-cat">
                      <span>{CATEGORY_ICONS[key]}</span>
                      {m.label}
                    </Link>
                  );
                }
              )}
            </div>
          </div>

          {related.length > 0 && (
            <div className="pd-side-card">
              <div className="pd-side-title">Related Updates</div>
              <ul className="pd-related">
                {related.map((r) => (
                  <li key={r._id || r.slug}>
                    <Link to={`/post/${r.slug}`}>
                      <strong>{r.title}</strong>
                      <span>
                        {r.organization || cat.label}
                        {r.publishedAt ? ` · ${formatDate(r.publishedAt)}` : ''}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
