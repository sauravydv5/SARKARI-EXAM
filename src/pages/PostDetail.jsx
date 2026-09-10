import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, categoryMeta, formatDate } from '../api';
import { sanitizeHtml } from '../utils/sanitize';
import useSeo from '../hooks/useSeo';
import {
  buildPostGuide,
  dedupeFacts,
  isStaleLowValuePost,
} from '../utils/contentUtils';
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

  const normalized = s.toLowerCase().replace(/\s+/g, ' ');
  const genericPlaceholders = [
    'see details',
    'as published in the official notification',
    'as published in official notification',
    'see official notice',
    'see official notification',
    'check official notice',
    'check official notification',
    'as mentioned in the official notification',
    'as published in official notification',
    'as published in the official notification',
    'as per notification',
    'as per official notification',
    'as per official notice',
    'official notice',
    'official notification',
    'result: to be announced',
    'to be announced',
  ];

  if (genericPlaceholders.includes(normalized)) return fallback;
  return s;
}

function hasUsefulContent(value) {
  const plain = String(value || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
  if (!plain) return false;
  return !/^(introduction|recruitment overview|about department|preparation tips|career advice|read the full notification carefully|check eligibility, fee, dates and instructions|always confirm on the official website before applying)\.?$/i.test(plain);
}

function splitPostContent(content, skipHeadings = []) {
  const sanitized = sanitizeHtml(content);
  if (!sanitized || typeof DOMParser === 'undefined') {
    return { introHtml: sanitized, sections: [] };
  }

  const parsed = new DOMParser().parseFromString(`<div>${sanitized}</div>`, 'text/html');
  const source = parsed.body.firstElementChild;
  const intro = [];
  const sections = [];
  let currentSection = null;
  let skippingDates = false;

  Array.from(source?.childNodes || []).forEach((node) => {
    if (node.nodeType === 1 && !hasUsefulContent(node.textContent)) return;
    const isHeading = node.nodeType === 1 && /^(H2|H3|H4)$/.test(node.tagName);

    if (isHeading) {
      const title = node.textContent.trim();
      const normalizedTitle = title.toLowerCase();
      skippingDates = normalizedTitle.includes('important dates')
        || skipHeadings.some((heading) => normalizedTitle.includes(heading));
      currentSection = null;

      if (!skippingDates) {
        currentSection = { title, body: [] };
        sections.push(currentSection);
      }
      return;
    }

    if (skippingDates) return;

    const html = node.nodeType === 3 ? node.textContent : node.outerHTML;
    if (currentSection) currentSection.body.push(html);
    else intro.push(html);
  });

  return {
    introHtml: intro.join(''),
    sections: sections.map((section) => ({ ...section, bodyHtml: section.body.join('') })),
  };
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

function OfficialValue({ value, href }) {
  const displayValue = val(value);
  if (displayValue) return displayValue;
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="pd-table-link">
      Verify exact value in official notification ↗
    </a>
  ) : 'Not stated in the available record';
}

function NoticeImageButton({ image, onOpen }) {
  if (!image) return null;
  return (
    <tr>
      <th>Short Notice</th>
      <td>
        <button type="button" className="pd-table-link pd-image-button" onClick={onOpen}>
          🖼️ View Short Notice
        </button>
      </td>
    </tr>
  );
}

function QuickInfo({ post, dates, postType }) {
  if (['recruitment', 'notification', 'admission'].includes(postType)) return null;

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
            : [['Total Posts', post.totalVacancies > 0 ? post.totalVacancies.toLocaleString('en-IN') : null], ['Authority', post.organization]];

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

function renderCanonicalFactValue(label, value, fallback = SOON) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return fallback;
  }
  return String(value).trim();
}

function summarizeRecruitmentFacts(post) {
  const values = [
    { key: 'organization', value: renderCanonicalFactValue('Authority', post.organization) },
    { key: 'totalVacancy', value: post.totalVacancies > 0 ? `${post.totalVacancies.toLocaleString('en-IN')} Posts` : renderCanonicalFactValue('Total vacancy', post.vacancyDetails, '') },
    { key: 'qualification', value: renderCanonicalFactValue('Qualification', post.qualification, '') },
    { key: 'ageLimit', value: renderCanonicalFactValue('Age limit', post.ageLimit, '') },
    { key: 'applicationFee', value: renderCanonicalFactValue('Application fee', post.applicationFee, '') },
    { key: 'selectionProcess', value: renderCanonicalFactValue('Selection process', post.selectionProcess, '') },
    { key: 'documentsRequired', value: renderCanonicalFactValue('Documents required', post.documentsRequired, '') },
  ].filter((item) => item.value && String(item.value).trim());

  return dedupeFacts(values);
}

function DateTable({ dates, href }) {
  const tier2Date = dates.tier2Date || dates.tierII || dates['tier-2'];
  const rows = [
    ['Notification / Advt. Date', dates.notificationDate],
    ['Application Begin', dates.startDate],
    ['Last Date for Apply Online', dates.lastDate],
    ['Re-open Apply Online', dates.reopenDate],
    ['Last Date for Fee Payment', dates.feePaymentLastDate],
    ['Fee Adjustment / Correction Last Date', dates.correctionDate],
    ['Exam City Details Available', dates.examCityDate],
    ['Admit Card Available', dates.admitCardDate],
    ['Examination Date', dates.examDate],
    ['Tier II Exam Date', tier2Date],
    ['Answer Key Available', dates.answerKeyDate],
    ['Final Answer Key Available', dates.finalAnswerKeyDate],
    ['OMR Sheet Available', dates.omrDate],
    ['Result Declared', dates.resultDate],
  ].filter(([, value]) => value !== null && value !== undefined && String(value).trim());
  if (!rows.length) return null;
  return <div className="pd-table-wrap"><table className="pd-full-table"><tbody>{rows.map(([label, value]) => <TableRow key={label} label={label}><OfficialValue value={value} href={href} /></TableRow>)}</tbody></table></div>;
}

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNoticeImage, setShowNoticeImage] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setShowNoticeImage(false);
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
  const hasImportantDates = Object.values(dates).some((value) => Boolean(val(value)));
  const hasRecruitmentFacts = Boolean(
    post?.totalVacancies > 0
      || val(post?.vacancyDetails)
      || val(post?.qualification)
      || val(post?.applicationFee)
      || val(post?.selectionProcess)
      || val(post?.ageLimit)
      || val(post?.salary)
  );
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
    schemaType: 'none',
    schemaData: {
      headline: pageTitle,
      image: post?.image || '/logo.png',
      articleSection: cat.label || 'Government Jobs',
      datePublished: post?.publishedAt,
      dateModified: post?.lastUpdated || post?.updatedAt || post?.publishedAt,
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
    if (jobSchema) {
      setJsonLd(jobSchema, 'jobposting-jsonld');
    } else {
      document.getElementById('jobposting-jsonld')?.remove();
    }

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
  const activationText = (dates.startDate || post?.publishedAt)
    ? `[Link will be Activate ${dates.startDate || formatDate(post?.publishedAt)}]`
    : '[Link will be Activate soon]';
  const primaryLabel = primaryHref ? primaryAction[1] : activationText;
  const heroPrimaryActionLabel = isResult
    ? 'Check Result'
    : isAdmitCard
      ? 'Download Admit Card'
      : isAnswerKey
        ? 'Download Answer Key'
        : isSyllabus
          ? 'Download Syllabus'
          : isCertificate
            ? 'Download Certificate'
            : 'Apply Online';

  const guide = buildPostGuide(post, cat.label);
  const guideIntro = guide.overview;
  const faqItems = guide.faqItems;
  const canonicalFacts = summarizeRecruitmentFacts(post);

  const importantLinkRows = [
    isResult && links.checkResult ? { key: 'checkResult', label: 'Check Result', href: links.checkResult, text: 'Check Result' } : null,
    links.applyOnline ? { key: 'applyOnline', label: 'Apply Online', href: links.applyOnline, text: 'Apply Now' } : null,
    links.writtenResult ? { key: 'writtenResult', label: 'Download Written Result', href: links.writtenResult, text: 'Open Written Result' } : null,
    links.answerKey ? { key: 'answerKey', label: 'Download Answer Key', href: links.answerKey, text: 'Open Answer Key' } : null,
    links.answerKeyNotice ? { key: 'answerKeyNotice', label: 'Answer Key Notice', href: links.answerKeyNotice, text: 'Open Notice' } : null,
    links.finalAnswerKey ? { key: 'finalAnswerKey', label: 'Download Final Answer Key', href: links.finalAnswerKey, text: 'Open Final Key' } : null,
    links.scoreCard ? { key: 'scoreCard', label: 'Download Score Card / Certificate', href: links.scoreCard, text: 'Open Score Card' } : null,
    links.omrSheet ? { key: 'omrSheet', label: 'Download OMR Sheet', href: links.omrSheet, text: 'Open OMR Sheet' } : null,
    links.downloadAdmitCard ? { key: 'downloadAdmitCard', label: 'Download Admit Card', href: links.downloadAdmitCard, text: 'Open Admit Card' } : null,
    links.admitCardNotice ? { key: 'admitCardNotice', label: 'Admit Card Notice', href: links.admitCardNotice, text: 'Open Notice' } : null,
    links.examCity ? { key: 'examCity', label: 'Exam City Details', href: links.examCity, text: 'Open City Details' } : null,
    links.examCityNotice ? { key: 'examCityNotice', label: 'Exam City Notice', href: links.examCityNotice, text: 'Open Notice' } : null,
    links.correctionForm ? { key: 'correctionForm', label: 'Correction Form', href: links.correctionForm, text: 'Open Correction Form' } : null,
    links.correctionNotice ? { key: 'correctionNotice', label: 'Correction Notice', href: links.correctionNotice, text: 'Open Notice' } : null,
    links.disqualifiedList ? { key: 'disqualifiedList', label: 'Disqualified List', href: links.disqualifiedList, text: 'Open List' } : null,
    links.examSchedule ? { key: 'examSchedule', label: 'Exam Schedule Notice', href: links.examSchedule, text: 'Open Schedule' } : null,
    links.downloadSyllabus ? { key: 'downloadSyllabus', label: 'Paper I & II Exam Syllabus', href: links.downloadSyllabus, text: 'Download Syllabus' } : null,
    links.notificationEnglish ? { key: 'notificationEnglish', label: 'Notification (English)', href: links.notificationEnglish, text: 'Download English PDF' } : null,
    links.notificationHindi ? { key: 'notificationHindi', label: 'Notification (Hindi)', href: links.notificationHindi, text: 'Download Hindi PDF' } : null,
    (links.officialNotification || links.importantLink) ? { key: 'notification', label: 'Notification', href: links.officialNotification || links.importantLink, text: 'Download Notification' } : null,
    links.registration ? { key: 'registration', label: 'खुद का पंजीकरण', href: links.registration, text: 'पंजीकरण करें' } : null,
    links.forgotPassword ? { key: 'forgotPassword', label: 'पासवर्ड भूल गए?', href: links.forgotPassword, text: 'पासवर्ड सहायता' } : null,
    links.applicationStatus ? { key: 'applicationStatus', label: 'आवेदन की स्थिति देखें', href: links.applicationStatus, text: 'स्थिति देखें' } : null,
    links.certificateDownload ? { key: 'certificateDownload', label: 'सर्टिफिकेट डाउनलोड करें', href: links.certificateDownload, text: 'डाउनलोड करें' } : null,
    links.eligibilityCheck ? { key: 'eligibilityCheck', label: 'अपनी पात्रता जानें', href: links.eligibilityCheck, text: 'पात्रता जांचें' } : null,
    links.residenceCertificate ? { key: 'residenceCertificate', label: 'आवासीय प्रमाण-पत्र', href: links.residenceCertificate, text: 'आवेदन करें' } : null,
    links.casteCertificate ? { key: 'casteCertificate', label: 'जाति प्रमाण-पत्र', href: links.casteCertificate, text: 'आवेदन करें' } : null,
    links.incomeCertificate ? { key: 'incomeCertificate', label: 'आय प्रमाण-पत्र', href: links.incomeCertificate, text: 'आवेदन करें' } : null,
    links.nclStateCertificate ? { key: 'nclStateCertificate', label: 'नॉन क्रीमी लेयर प्रमाण-पत्र (बिहार)', href: links.nclStateCertificate, text: 'आवेदन करें' } : null,
    links.nclCentralCertificate ? { key: 'nclCentralCertificate', label: 'नॉन क्रीमी लेयर प्रमाण-पत्र (केंद्र)', href: links.nclCentralCertificate, text: 'आवेदन करें' } : null,
    links.ewsCertificate ? { key: 'ewsCertificate', label: 'EWS आय और संपत्ति प्रमाण-पत्र', href: links.ewsCertificate, text: 'आवेदन करें' } : null,
    links.nclFormPdf ? { key: 'nclFormPdf', label: 'NCL Form VIII PDF', href: links.nclFormPdf, text: 'PDF डाउनलोड करें' } : null,
    links.formXIPdf ? { key: 'formXIPdf', label: 'Form XI PDF', href: links.formXIPdf, text: 'PDF डाउनलोड करें' } : null,
    ...(Array.isArray(links.serviceLinks) ? links.serviceLinks.map((service) => ({ key: `${service.label}-${service.href}`, label: service.label, href: service.href, text: service.text })) : []),
    links.brochure ? { key: 'brochure', label: 'Download Brochure', href: links.brochure, text: 'Open Brochure' } : null,
    links.officialWebsite ? { key: 'officialWebsite', label: 'Official Website', href: links.officialWebsite, text: 'Visit Website' } : null,
  ].filter(Boolean);

  const normalizeLinkKey = (value) => String(value || '').trim().toLowerCase();
  const dedupedImportantLinkRows = importantLinkRows.filter((row, index, arr) => {
    const key = `${normalizeLinkKey(row.label)}|${normalizeLinkKey(row.href)}`;
    return arr.findIndex((item) => `${normalizeLinkKey(item.label)}|${normalizeLinkKey(item.href)}` === key) === index;
  });

  const filteredImportantLinkRows = dedupedImportantLinkRows;

  const aboutLabel = isResult
    ? 'Result'
    : isAdmitCard
      ? 'Admit Card'
      : isAnswerKey
        ? 'Answer Key'
        : isSyllabus
          ? 'Syllabus'
          : isCertificate
            ? 'Certificate'
            : isAdmission
              ? 'Admission'
              : isRecruitment
                ? 'Job Update'
                : isNotification
                  ? 'Notification'
                  : 'Update';
  const contentSkipHeadings = ['important dates', 'important links'];
  if (isRecruitment || isAdmission) {
    contentSkipHeadings.push(
      'eligibility',
      'application fee',
      'age limit',
      'vacancy',
      'selection process',
      'how to fill online form'
    );
  }
  if (isAdmitCard) {
    contentSkipHeadings.push('how to download admit card', 'eligibility', 'application fee', 'age limit');
  }
  if (isResult) {
    contentSkipHeadings.push(
      'result overview',
      'how to check result',
      'application fee',
      'age limit',
      'vacancy details',
      'vacancy',
      'eligibility'
    );
  }
  if (isAnswerKey) contentSkipHeadings.push('how to download answer key');
  if (isSyllabus) contentSkipHeadings.push('syllabus overview');
  if (isCertificate) contentSkipHeadings.push('certificate download process');

  const aboutContent = splitPostContent(post.content, contentSkipHeadings);
  const usefulAboutIntro = hasUsefulContent(aboutContent.introHtml);
  const usefulAboutSections = aboutContent.sections.filter((section) => {
    const heading = String(section.title || '').trim();
    const body = String(section.bodyHtml || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (/^(introduction|recruitment overview|about department|preparation tips|career advice)$/i.test(heading)) return false;
    return hasUsefulContent(body);
  });

  const factMap = new Map(canonicalFacts.map((fact) => [fact.key, fact.value]));
  const uniqueFactValue = (key, fallback = SOON) => factMap.get(key) || fallback;

  return (
    <div className={`pd-page pd-template-${postType}`}>
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
            {post.image && post.image !== '/uploads/images/placeholder.svg' ? (
              <img
                src={post.image}
                alt={`${pageTitle} official ${cat.label.toLowerCase()} image`}
                className="mt-4 max-h-64 w-full rounded-xl object-cover"
                width="960"
                height="360"
                loading="eager"
              />
            ) : (
              <div className={`pd-category-visual pd-category-visual-${post.category}`} aria-label={`${cat.label} update`}>
                <span className="pd-category-visual-icon" aria-hidden="true">{icon}</span>
                <span>
                  <strong>{cat.label}</strong>
                  <small>Official update guide</small>
                </span>
              </div>
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
            {(isRecruitment || isResult || isAdmitCard || isAnswerKey || isSyllabus || isCertificate || isAdmission) && (
              <div className="pd-hero-apply-wrap">
                {primaryHref ? (
                  <a href={primaryHref} target="_blank" rel="noopener noreferrer" className="pd-hero-apply">
                    {heroPrimaryActionLabel} ↗
                  </a>
                ) : (
                  <span className="pd-hero-apply pd-hero-apply-disabled">{primaryLabel}</span>
                )}
              </div>
            )}
          </header>

          {/* Quick info strip — always 5 cards with values */}
          <QuickInfo post={post} dates={dates} postType={postType} />

          {hasImportantDates && (isRecruitment || isAdmission || isNotification || isResult || isAdmitCard || isAnswerKey) && (
            <section className="pd-section pd-dates-priority">
              <div className="pd-section-head">
                <h2>📅 Important Dates</h2>
              </div>
              <DateTable dates={dates} href={links.officialNotification || links.officialWebsite} />
            </section>
          )}

          {isResult && (hasUsefulContent(post.shortDescription) || val(post.statusNote || post.status) || val(dates.resultDate) || val(dates.examDate)) && (
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
          {(isRecruitment || isAdmission || isNotification) && hasRecruitmentFacts && <section className="pd-section">
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
                    {uniqueFactValue('totalVacancy', vacanciesText)}
                  </TableRow>
                  <TableRow label="Vacancy Details">{val(post.vacancyDetails)}</TableRow>
                  <TableRow label="Qualification / Eligibility" highlight>
                    {uniqueFactValue('qualification', val(post.qualification))}
                  </TableRow>
                  <TableRow label="Age Limit">{uniqueFactValue('ageLimit', val(post.ageLimit))}</TableRow>
                  <TableRow label="Application Fee" highlight>
                    {uniqueFactValue('applicationFee', val(post.applicationFee))}
                  </TableRow>
                  <TableRow label="Pay Scale / Salary">{val(post.salary)}</TableRow>
                  <TableRow label="Selection Process">{uniqueFactValue('selectionProcess', val(post.selectionProcess))}</TableRow>
                  <TableRow label="Application Begin Date">{val(dates.startDate)}</TableRow>
                  <TableRow label="Reference Link">{primaryHref ? 'Official portal link available in Important Links section' : 'Official link will be active as per notice'}</TableRow>
                </tbody>
              </table>
            </div>
          </section>}

          {/* Application Fee */}
          {(isRecruitment || isAdmission) && val(post.applicationFee) && <section className="pd-section">
            <div className="pd-section-head">
              <h2>💳 Application Fee</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table">
                <tbody>
                  <TableRow label="Fee Details" highlight>
                    {uniqueFactValue('applicationFee', val(post.applicationFee))}
                  </TableRow>
                  <TableRow label="Payment Mode">
                    Debit Card / Credit Card / Net Banking / UPI (as per official portal)
                  </TableRow>
                </tbody>
              </table>
            </div>
          </section>}

          {/* Age Limit */}
          {isRecruitment && val(post.ageLimit) && <section className="pd-section">
            <div className="pd-section-head">
              <h2>⏳ Age Limit</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table">
                <tbody>
                  <TableRow label="Age Limit Details" highlight>
                    {uniqueFactValue('ageLimit', val(post.ageLimit))}
                  </TableRow>
                </tbody>
              </table>
            </div>
          </section>}

          {/* Vacancy + Eligibility */}
          {(isRecruitment || isAdmission) && (post.totalVacancies > 0 || val(post.vacancyDetails) || val(post.qualification) || val(post.selectionProcess)) && <section className="pd-section">
            <div className="pd-section-head">
              <h2>👥 Vacancy &amp; Eligibility Details</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table">
                <tbody>
                  <TableRow label="Total Post" highlight>
                    {uniqueFactValue('totalVacancy', post.totalVacancies > 0 ? `${post.totalVacancies.toLocaleString('en-IN')} Posts` : val(post.vacancyDetails))}
                  </TableRow>
                  <TableRow label="Vacancy Information">{val(post.vacancyDetails)}</TableRow>
                  <TableRow label="Educational Qualification" highlight>
                    {uniqueFactValue('qualification', val(post.qualification))}
                  </TableRow>
                  <TableRow label="Pay Scale / Salary">{val(post.salary)}</TableRow>
                  <TableRow label="Selection Process">{uniqueFactValue('selectionProcess', val(post.selectionProcess))}</TableRow>
                </tbody>
              </table>
            </div>
          </section>}

          {isAdmitCard && <section className="pd-section pd-type-details">
              <div className="pd-section-head"><h2>🎫 Admit Card Details</h2></div>
              <div className="pd-table-wrap">
                <table className="pd-full-table">
                  <tbody>
                    <TableRow label="Exam / Post" highlight>{val(post.postName || post.title)}</TableRow>
                    <TableRow label="Admit Card / City Slip Date"><OfficialValue value={dates.admitCardDate} href={links.admitCardNotice || links.officialNotification || links.officialWebsite} /></TableRow>
                    <TableRow label="Exam Date"><OfficialValue value={dates.examDate} href={links.examSchedule || links.officialNotification || links.officialWebsite} /></TableRow>
                    <TableRow label="Authority">{val(post.organization)}</TableRow>
                    <TableRow label="Candidate Instructions"><OfficialValue value={post.documentsRequired} href={links.admitCardNotice || links.officialNotification || links.officialWebsite} /></TableRow>
                  </tbody>
                </table>
              </div>
          </section>}

          {isSyllabus && <section className="pd-section pd-type-details">
            <div className="pd-section-head"><h2>📘 Verified Syllabus Details</h2></div>
            <div className="pd-table-wrap">
              <table className="pd-full-table">
                <tbody>
                  <TableRow label="Exam / Post" highlight>{val(post.postName || post.title)}</TableRow>
                  <TableRow label="Exam Pattern"><OfficialValue value={post.examPattern} href={links.downloadSyllabus || links.officialNotification || links.officialWebsite} /></TableRow>
                  <TableRow label="Total Questions"><OfficialValue value={post.totalQuestions} href={links.downloadSyllabus || links.officialNotification || links.officialWebsite} /></TableRow>
                  <TableRow label="Total Marks"><OfficialValue value={post.totalMarks} href={links.downloadSyllabus || links.officialNotification || links.officialWebsite} /></TableRow>
                  <TableRow label="Duration"><OfficialValue value={post.duration} href={links.downloadSyllabus || links.officialNotification || links.officialWebsite} /></TableRow>
                  <TableRow label="Official Source">
                    <a href={links.downloadSyllabus || links.officialNotification || links.officialWebsite} target="_blank" rel="noopener noreferrer" className="pd-table-link">
                      Open official syllabus notification ↗
                    </a>
                  </TableRow>
                </tbody>
              </table>
            </div>
          </section>}

          {/* Important Links — directly below eligibility */}
          <section className="pd-section pd-links-section">
            <div className="pd-section-head">
              <h2>🔗 Important Links</h2>
            </div>
            <div className="pd-table-wrap">
              <table className="pd-full-table pd-links-table">
                <tbody>
                  <NoticeImageButton image={post.noticeImage} onOpen={() => setShowNoticeImage(true)} />
                  {filteredImportantLinkRows.map((row) => (
                    <LinkRow key={row.key} label={row.label} href={row.href} text={row.text} />
                  ))}
                </tbody>
              </table>
            </div>
            {(primaryHref || (isRecruitment || isAdmission || isNotification)) && (
              <div className="pd-big-cta-wrap">
                {primaryHref ? (
                  <a href={primaryHref} target="_blank" rel="noopener noreferrer" className="pd-big-cta">
                    {primaryLabel} ↗
                  </a>
                ) : (
                  <div className="pd-big-cta" style={{ pointerEvents: 'none', opacity: 0.9 }}>{primaryLabel}</div>
                )}
              </div>
            )}
          </section>

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
          {(isRecruitment || isAdmission) && howSteps.length > 0 && <section className="pd-section">
            <div className="pd-section-head">
              <h2>✅ How to Fill Online Form</h2>
            </div>
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
          </section>
          }

          {showNoticeImage && post.noticeImage && (
            <div className="pd-image-modal" role="dialog" aria-modal="true" aria-label="Short notice image">
              <button
                type="button"
                className="pd-image-modal-backdrop"
                aria-label="Close short notice"
                onClick={() => setShowNoticeImage(false)}
              />
              <div className="pd-image-modal-content">
                <div className="pd-image-modal-head">
                  <h2>{post.title}</h2>
                  <button type="button" className="pd-image-modal-close" onClick={() => setShowNoticeImage(false)} aria-label="Close short notice">×</button>
                </div>
                <img src={post.noticeImage} alt={`${post.title} short notice`} />
              </div>
            </div>
          )}

          {(usefulAboutIntro || usefulAboutSections.length > 0) && <section className="pd-section pd-about-section" aria-labelledby="about-content">
            <div className="pd-section-head">
              <h2 id="about-content">📖 About This {aboutLabel}</h2>
            </div>
            <div className="pd-content content-html">
              {usefulAboutIntro ? (
                <div dangerouslySetInnerHTML={{ __html: aboutContent.introHtml }} />
              ) : null}
            </div>
          </section>
          }

          {usefulAboutSections.map((section) => (
            <section className="pd-section pd-content-detail-section" key={section.title}>
              <div className="pd-section-head">
                <h2>{section.title}</h2>
              </div>
              <div className="pd-content content-html" dangerouslySetInnerHTML={{ __html: section.bodyHtml }} />
            </section>
          ))}

          {faqItems.length > 0 && (
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
          )}
        </div>

        {/* Sidebar */}
        <aside className="pd-sidebar">
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
