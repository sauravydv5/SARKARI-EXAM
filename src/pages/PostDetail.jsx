import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, categoryMeta, formatDate } from '../api';
import { sanitizeHtml } from '../utils/sanitize';
import useSeo from '../hooks/useSeo';
import { buildPostGuide, isStaleLowValuePost } from '../utils/contentUtils';
import {
  generateJobPostingSchema,
  generateArticleSchema,
  generateFAQSchema,
} from '../utils/schemaGenerator';

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

const SOON = '';

function val(v, fallback = SOON) {
  if (v === 0) return '0';
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  if (!s || s === '—' || s === '-') return fallback;
  return s;
}

function TableRow({ label, children, highlight }) {
  if (children === null || children === undefined || (typeof children === 'string' && !children.trim())) return null;
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

function QuickInfo({ post, dates, postType }) {
  const values = postType === 'result'
    ? [['Exam / Post', post.postName], ['Result Status', post.statusNote || post.status], ['Result Date', dates.resultDate], ['Exam Date', dates.examDate], ['Authority', post.organization]]
    : postType === 'admit_card'
      ? [['Exam / Post', post.postName], ['Release Date', dates.admitCardDate], ['Exam Date', dates.examDate], ['Authority', post.organization]]
      : postType === 'answer_key'
        ? [['Exam / Post', post.postName], ['Answer Key Status', post.statusNote || post.status], ['Release Date', dates.answerKeyDate || dates.resultDate], ['Exam Date', dates.examDate], ['Authority', post.organization]]
        : postType === 'syllabus'
          ? [['Exam / Post', post.postName], ['Exam Pattern', post.examPattern], ['Total Questions', post.totalQuestions], ['Total Marks', post.totalMarks], ['Duration', post.duration]]
          : postType === 'certificate'
            ? [['Certificate', post.postName || post.title], ['Status', post.statusNote || post.status], ['Authority', post.organization]]
            : [['Total Posts', post.totalVacancies > 0 ? post.totalVacancies.toLocaleString('en-IN') : null], ['Last Date', dates.lastDate], ['Qualification', post.qualification], ['Authority', post.organization]];

  const available = values.filter(([, value]) => value !== null && value !== undefined && String(value).trim());
  if (!available.length) return null;
  return (
    <div className="pd-stats pd-stats-full">
      {available.map(([label, value], index) => (
        <div className={`pd-stat ${['red', 'amber', 'blue', 'green', 'purple'][index % 5]}`} key={label}>
          <div><span className="pd-stat-label">{label}</span><strong className="pd-stat-value pd-stat-clamp">{value}</strong></div>
        </div>
      ))}
    </div>
  );
}

function DateTable({ dates }) {
  const rows = [
    ['Notification / Advt. Date', dates.notificationDate],
    ['Application Begin', dates.startDate],
    ['Last Date for Apply Online', dates.lastDate],
    ['Last Date for Fee Payment', dates.feePaymentLastDate],
    ['Fee Adjustment / Correction Last Date', dates.correctionDate],
    ['Admit Card Available', dates.admitCardDate],
    ['Examination Date', dates.examDate],
    ['Result Declared', dates.resultDate],
  ].filter(([, value]) => value !== null && value !== undefined && String(value).trim());
  if (!rows.length) return null;
  return <div className="pd-table-wrap"><table className="pd-full-table"><tbody>{rows.map(([label, value]) => <TableRow key={label} label={label}>{value}</TableRow>)}</tbody></table></div>;
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

  const cat = categoryMeta(post?.category);
  const dates = post?.importantDates || {};
  const links = post?.links || {};
  const icon = CATEGORY_ICONS[post?.category] || '📌';
  const postType = post?.postType || 'notification';
  const isRecruitment = postType === 'recruitment';
  const isResult = postType === 'result';
  const isAdmitCard = postType === 'admit_card';
  const isAnswerKey = postType === 'answer_key';
  const isSyllabus = postType === 'syllabus';
  const isCertificate = postType === 'certificate';
  const isAdmission = postType === 'admission';
  const isNotification = postType === 'notification';
  const pageTitle = post?.title || 'Sarkari Job Hub';
  const keywordList = [
    cat.label,
    post?.organization,
    post?.postName,
    post?.department,
    ...(post?.tags || []),
  ].filter(Boolean);

  const postKeywords = [
    'sarkari job',
    'government job',
    'job alert',
    cat.label?.toLowerCase(),
    post?.postName?.toLowerCase(),
    ...keywordList,
  ]
    .filter(Boolean)
    .slice(0, 15)
    .join(', ');

  const stalePage = post ? isStaleLowValuePost(post) : false;

  useSeo({
    title: pageTitle,
    description:
      post?.shortDescription ||
      (post
        ? `${pageTitle} from ${post.organization || 'the recruiting organization'}: eligibility, important dates, application details, selection process and official links.`
        : 'Latest government job updates, results, admit cards and answer keys.'),
    url: `https://sarkarijobhub.website/post/${post?.slug || ''}`,
    image: post?.image && post.image !== '/uploads/images/placeholder.svg' ? post.image : '/logo.png',
    keywords: postKeywords,
    noIndex: stalePage,
    schemaType: 'Article',
    schemaData: {
      headline: pageTitle,
      image: post?.image || '/logo.png',
      articleSection: cat.label || 'Government Jobs',
      datePublished: post?.publishedAt || new Date().toISOString(),
      dateModified: post?.updatedAt || post?.publishedAt || new Date().toISOString(),
      author: { '@type': 'Organization', name: 'Sarkari Job Hub Editorial Team' },
      publisher: {
        '@type': 'Organization',
        name: 'Sarkari Job Hub',
      },
    },
  });

  // Inject detailed JSON-LD for JobPosting / Article and FAQ to strengthen trust signals
  function setJsonLd(data, id = 'seo-jsonld') {
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  useEffect(() => {
    if (!post) return;
    const currentFaqItems = buildPostGuide(post, categoryMeta(post.category).label).faqItems;
    // Only valid, current vacancy records return JobPosting schema.
    const jobSchema = generateJobPostingSchema(post);
    if (jobSchema) setJsonLd(jobSchema, 'jobposting-jsonld');

    // Article schema with publisher logo and author details
    const articleSchema = generateArticleSchema({
      headline: post.title,
      description: post?.shortDescription || post?.title,
      image: post?.image || '/logo.png',
      datePublished: post?.publishedAt,
      dateModified: post?.updatedAt || post?.publishedAt,
      url: `https://sarkarijobhub.website/post/${post?.slug}`,
      author: { name: 'Sarkari Job Hub Editorial Team' },
    });
    if (articleSchema) setJsonLd(articleSchema, 'article-jsonld');

    // FAQ schema for generated FAQ items
    if (currentFaqItems && currentFaqItems.length > 0) {
      const faqSchema = generateFAQSchema(currentFaqItems);
      if (faqSchema) setJsonLd(faqSchema, 'faq-jsonld');
    }
  }, [post]);

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

  const vacanciesText = post.totalVacancies > 0
    ? `${post.totalVacancies.toLocaleString('en-IN')} Posts`
    : post.vacancyDetails;

  const howSteps = (post.howToApply || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const docList = (post.documentsRequired || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const primaryAction = isResult
    ? ['checkResult', 'Check Result']
    : isAdmitCard
      ? ['downloadAdmitCard', 'Download Admit Card']
      : isAnswerKey
        ? ['answerKey', 'Download Answer Key']
        : isSyllabus
          ? ['downloadSyllabus', 'Download Syllabus']
          : isCertificate
            ? ['downloadCertificate', 'Download Certificate']
            : ['applyOnline', 'Apply Online'];
  const primaryHref = links[primaryAction[0]] || links.applyOnline || links.officialWebsite;
  const primaryLabel = primaryHref ? primaryAction[1] : 'Official Link';

  const guide = buildPostGuide(post, cat.label);
  const guideIntro = guide.overview;
  const faqItems = guide.faqItems;

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
              {post.isNew && <span className="pd-featured-badge">🆕 New</span>}
              {post.statusNote && <span className="pd-featured-badge">{post.statusNote}</span>}
              {post.views > 0 && <span className="pd-views-badge">👁 {post.views} views</span>}
            </div>
            <h1 className="pd-title">{post.title}</h1>
            <p className="pd-org">
              <span className="pd-org-icon">🏛</span>
              {val(post.organization, 'Government Organization')}
              {post.department ? ` · ${post.department}` : ''}
            </p>
            {post.image && post.image !== '/uploads/images/placeholder.svg' && (
              <img
                src={post.image}
                alt={`${pageTitle} official ${cat.label.toLowerCase()} image`}
                className="mt-4 max-h-64 w-full rounded-xl object-cover"
                width="960"
                height="360"
                loading="eager"
              />
            )}
            <p className="pd-summary">
              {val(
                post.shortDescription,
                `${post.title} – complete details, dates, fee, eligibility and apply links below.`
              )}
            </p>
            <div className="pd-meta-chips">
              <span className="pd-chip">📅 Published {formatDate(post.publishedAt)}</span>
              <span className="pd-chip">🕒 Updated {formatDate(post.lastUpdated || post.updatedAt || post.publishedAt)}</span>
              <span className="pd-chip">✍️ Author: Sarkari Job Hub Editorial Team</span>
              {post.lastVerified && <span className="pd-chip">✓ Verified {formatDate(post.lastVerified)}</span>}
              {post.sourceUrl && <span className="pd-chip">Source: Official Website</span>}
              <span className="pd-chip">📖 Read time: {Math.max(3, Math.ceil((post.content?.split(/\s+/).length || 600) / 180))} min</span>
            </div>
          </header>

          {/* Quick info strip — always 5 cards with values */}
          <QuickInfo post={post} dates={dates} postType={postType} />

          {(isRecruitment || isAdmission || isNotification || isResult || isAdmitCard || isAnswerKey) && (
            <section className="pd-section pd-dates-priority">
              <div className="pd-section-head">
                <h2>📅 Important Dates</h2>
              </div>
              <DateTable dates={dates} />
            </section>
          )}

          {isResult && (
            <section className="pd-section">
              <div className="pd-section-head"><h2>📊 Result Overview</h2></div>
              <div className="pd-content">
                <p>{val(post.shortDescription, `${post.title} result update from ${val(post.organization)}.`)}</p>
                <ul className="guide-list">
                  {(post.statusNote || post.status) && <li><strong>Result status:</strong> {post.statusNote || post.status}</li>}
                  {dates.resultDate && <li><strong>Result date:</strong> {dates.resultDate}</li>}
                  {dates.examDate && <li><strong>Exam date:</strong> {dates.examDate}</li>}
                </ul>
              </div>
            </section>
          )}

          {(isRecruitment || isAdmission || isNotification) && <section className="pd-section pd-intro-compact">
            <div className="pd-section-head">
              <h2>🧭 Introduction</h2>
            </div>
            <div className="pd-content">
              <p>{val(post.shortDescription, `${post.title} notification details, eligibility, fee and official links are given below.`)}</p>
            </div>
          </section>}

          {(isRecruitment || isAdmission) && (
            <section className="pd-section pd-eligibility-section">
              <div className="pd-section-head">
                <h2>Eligibility, Fee &amp; Selection</h2>
              </div>
              <div className="pd-focus-grid">
                <article className="pd-focus-card pd-focus-eligibility">
                  <span className="pd-focus-kicker">01 · Eligibility</span>
                  <h3>Who can apply?</h3>
                  <p>{val(post.ageLimit, 'Check the official notification for age rules.')}</p>
                  <p className="pd-focus-note">{val(post.qualification, 'Check the official notification for qualification.')}</p>
                </article>
                <article className="pd-focus-card pd-focus-fee">
                  <span className="pd-focus-kicker">02 · Application Fee</span>
                  <h3>Fee structure</h3>
                  <p>{val(post.applicationFee, 'Check the official notification for category-wise fee.')}</p>
                  <p className="pd-focus-note">Pay only through the recruiting organisation&apos;s official payment gateway.</p>
                </article>
                <article className="pd-focus-card pd-focus-selection">
                  <span className="pd-focus-kicker">03 · Selection</span>
                  <h3>Stages of recruitment</h3>
                  <p>{val(post.selectionProcess, 'Selection stages are given in the official notification.')}</p>
                  <p className="pd-focus-note">The authority may require document verification, skill, physical or medical tests.</p>
                </article>
              </div>
              <div className="pd-doc-strip">
                <strong>Documents to keep ready</strong>
                <span>{val(post.documentsRequired, 'Photo, signature, identity proof and educational certificates.')}</span>
              </div>
            </section>
          )}

          {(isResult || isAdmitCard || isAnswerKey || isSyllabus || isCertificate) && (
            <section className="pd-section">
              <div className="pd-section-head"><h2>{isResult ? '✅ How to Check Result' : isAdmitCard ? '🎫 How to Download Admit Card' : isAnswerKey ? '🔑 How to Download Answer Key' : isSyllabus ? '📘 Syllabus Overview' : '📜 Certificate Download Process'}</h2></div>
              <div className="pd-content">
                <p>{isResult ? 'Open the official result notice or scorecard link, sign in with the required credentials, and verify your roll number before saving the result.' : isAdmitCard ? 'Use the official admit-card or exam-city link and check the reporting time, centre details and required identity proof.' : isAnswerKey ? 'Download the official answer key or response sheet, compare the question-paper series and note the objection deadline.' : isSyllabus ? 'Use the official syllabus and exam-pattern information to plan subjects, marks and preparation topics.' : isCertificate ? 'Open the official service portal, confirm the required credentials and download the certificate only after checking the displayed details.' : guideIntro}</p>
                {howSteps.length > 0 && <ol className="pd-steps">{howSteps.map((step, i) => <li key={i}><span className="pd-step-num">{i + 1}</span><div><strong>{step.replace(/^\d+\.\s*/, '')}</strong></div></li>)}</ol>}
              </div>
            </section>
          )}

          {/* ===== FULL INFO TABLE ===== */}
          {(isRecruitment || isAdmission || isNotification) && <section className="pd-section">
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
          </section>}

          {/* Application Fee */}
          {(isRecruitment || isAdmission) && <section className="pd-section">
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
          </section>}

          {/* Age Limit */}
          {isRecruitment && <section className="pd-section">
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
          </section>}

          {/* Vacancy + Eligibility */}
          {(isRecruitment || isAdmission) && <section className="pd-section">
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
          </section>}

          {/* Documents */}
          {(isRecruitment || isAdmission || isAdmitCard || isAnswerKey || isCertificate) && <section className="pd-section">
            <div className="pd-section-head">
              <h2>📁 Documents Required</h2>
            </div>
            {docList.length > 0 ? (
              <ul className="pd-doc-list">
                {docList.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : null}
          </section>
          }

          {/* How to apply */}
          {isRecruitment || isAdmission ? <section className="pd-section">
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
          : null}
          {/* About / description */}
          <section className="pd-section">
            <div className="pd-section-head">
              <h2>📖 About This {isResult ? 'Result' : isAdmitCard ? 'Admit Card' : isAnswerKey ? 'Answer Key' : isSyllabus ? 'Syllabus' : isCertificate ? 'Certificate' : 'Update'}</h2>
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

          {isResult ? <section className="pd-section">
            <div className="pd-section-head">
              <h2>🧭 What After Result?</h2>
            </div>
            <div className="pd-content">
              <ul className="guide-list">
                <li>Download and keep the result or scorecard PDF for the next stage.</li>
                <li>Read the authority's notice for cut-off, merit-list and document-verification instructions.</li>
                <li>Use the related updates below to find the next admit card, answer key or recruitment notice when available.</li>
              </ul>
            </div>
          </section>
          : null}

          <section className="pd-section">
            <div className="pd-section-head">
              <h2>❓ Frequently Asked Questions</h2>
            </div>
            <div className="pd-content">
              {faqItems.map((item) => (
                <div key={item.question} className="faq-block">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
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
                  <LinkRow label={primaryLabel} href={primaryHref} text="Open Official Link" />
                  {links.writtenResult && <LinkRow label="Download Written Result" href={links.writtenResult} text="Open Written Result" />}
                  {links.answerKey && <LinkRow label="Download Answer Key" href={links.answerKey} text="Open Answer Key" />}
                  {links.downloadAdmitCard && <LinkRow label="Download Admit Card" href={links.downloadAdmitCard} text="Open Admit Card" />}
                  {links.examCity && <LinkRow label="Exam City Details" href={links.examCity} text="Open City Details" />}
                  {links.examSchedule && <LinkRow label="Exam Schedule Notice" href={links.examSchedule} text="Open Schedule" />}
                  {links.finalAnswerKey && <LinkRow label="Download Final Answer Key" href={links.finalAnswerKey} text="Open Final Key" />}
                  {(links.officialNotification || links.importantLink) && <LinkRow label="Notification" href={links.officialNotification || links.importantLink} text="Download Notification" />}
                  {links.officialWebsite && <LinkRow label="Official Website" href={links.officialWebsite} text="Visit Website" />}
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
              {primaryHref && (
                <a href={primaryHref} target="_blank" rel="noopener noreferrer">
                  🚀 {primaryLabel}
                </a>
              )}
              {links.writtenResult && <a href={links.writtenResult} target="_blank" rel="noopener noreferrer">📄 Written Result</a>}
              {links.answerKey && <a href={links.answerKey} target="_blank" rel="noopener noreferrer">🔑 Answer Key</a>}
              {links.downloadAdmitCard && <a href={links.downloadAdmitCard} target="_blank" rel="noopener noreferrer">🎫 Admit Card</a>}
              {links.examCity && <a href={links.examCity} target="_blank" rel="noopener noreferrer">📍 Exam City</a>}
              {links.examSchedule && <a href={links.examSchedule} target="_blank" rel="noopener noreferrer">📅 Exam Schedule</a>}
              {links.finalAnswerKey && <a href={links.finalAnswerKey} target="_blank" rel="noopener noreferrer">✅ Final Answer Key</a>}
              {(links.officialNotification || links.importantLink) && (
                <a href={links.officialNotification || links.importantLink} target="_blank" rel="noopener noreferrer">
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
