export function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildReadingTime(text = '') {
  const count = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(count / 180));
  return `${minutes} min read`;
}

export function stripHtml(value = '') {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(value = '') {
  return stripHtml(value).split(/\s+/).filter(Boolean).length;
}

export function normalizeFactText(value = '') {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/(\.|,|;|:|\(|\)|\[|\]|\{|\}|\/|\+|=)/g, ' ')
    .replace(/\b(post|posts|vacancy|vacancies|seat|seats|candidate|candidates|applicant|applicants)\b/gi, ' ')
    .replace(/\b(qualification|required|eligible|eligibility|for|the|and|or)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function dedupeFacts(items = []) {
  const seen = new Set();
  const deduped = [];

  for (const item of items) {
    if (!item || item.value === null || item.value === undefined) continue;

    const rawText = String(item.value).trim();
    if (!rawText) continue;

    const normalized = normalizeFactText(rawText);
    if (!normalized) continue;

    const fingerprint = `${item.key || 'fact'}|${normalized}`;
    if (seen.has(fingerprint)) continue;

    seen.add(fingerprint);
    deduped.push(item);
  }

  return deduped;
}

const STALE_SLUG_PATTERNS = [
  'corona-vaccine',
  'har-ghar-tiranga',
  'sahara-refund',
  'up-election-2022',
  'up-ntse-online-form-2020',
  'up-learning-license',
  'up-mukhyamantri-fellowship',
  'up-teacher-transfer-online-form-2021',
  'up-scholarship-class-9-12-online-form-2020',
  'up-scholarship-online-form-2021',
  'up-scholarship-online-form-2022',
  'up-scholarship-online-form-2024',
  'upsssc-otr-registration-2021',
  'mpesb-profile-online-registration-2023',
  'aadhaar-services-download-update-pvc-2022',
  'hsrp-high-security-number-plate-2021',
  'e-shram-card-online-registration-2022',
  'up-family-id-ek-parivar-ek-pahchan-2023',
  'last-date-today-apply',
  'last-date-tomorrow-apply',
];

export function isStaleLowValuePost(post = {}) {
  const slug = String(post.slug || post.id || '').toLowerCase();
  const sourcePath = String(post.sourcePath || '').toLowerCase();
  if (sourcePath.includes(' copy.json') || sourcePath.includes('%20copy.json')) return true;
  return STALE_SLUG_PATTERNS.some((pattern) => slug.includes(pattern));
}

const GENERIC_PLACEHOLDER_VALUES = [
  '—',
  '-',
  'n/a',
  'na',
  'soon',
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

function hasValue(value) {
  if (value === 0) return true;
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  if (!text) return false;
  const lowered = text.toLowerCase().replace(/\s+/g, ' ');
  return !GENERIC_PLACEHOLDER_VALUES.includes(lowered);
}

function text(value, fallback = '') {
  return hasValue(value) ? String(value).trim() : fallback;
}

function joinSentences(parts) {
  return parts
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(' ');
}

function categoryCopy(category) {
  switch (category) {
    case 'result':
      return {
        action: 'check the result or merit list',
        document: 'scorecard, merit list, or next-stage call letter',
        nextStep: 'note the document-verification, physical test, or counselling date if the notice mentions a further stage',
      };
    case 'admit-card':
      return {
        action: 'download the admit card or exam-city details',
        document: 'admit card, city intimation slip, or interview letter',
        nextStep: 'print a clear copy, match the exam city and shift, and keep a photo ID that matches the application',
      };
    case 'answer-key':
      return {
        action: 'open the answer key or objection window',
        document: 'provisional or final answer key',
        nextStep: 'compare responses with the official key and use the objection window only if the notice still allows it',
      };
    case 'syllabus':
      return {
        action: 'map the syllabus against your study plan',
        document: 'syllabus and exam-pattern notice',
        nextStep: 'list the papers, marks, and qualifying stages before buying extra study material',
      };
    case 'admission':
      return {
        action: 'complete counselling, choice filling, or the admission form',
        document: 'admission form, allotment letter, or counselling notice',
        nextStep: 'keep academic certificates, photographs, and fee receipts ready for the reporting date',
      };
    case 'certificate':
      return {
        action: 'download or verify the e-certificate',
        document: 'e-certificate or result-verification letter',
        nextStep: 'save a PDF copy and confirm the roll number, name spelling, and issue year before using it in an application',
      };
    case 'important':
      return {
        action: 'complete the service, registration, or document request',
        document: 'service form, exam calendar, or certificate request',
        nextStep: 'use only the government portal named in the notice and keep the acknowledgement number',
      };
    default:
      return {
        action: 'decide whether to apply and gather the required documents',
        document: 'online application and official notification',
        nextStep: 'compare eligibility, fee, and last date with the official notification before submitting a form',
      };
  }
}

function buildFallbackFaqs() {
  return [];
}

export function buildPostGuide(post = {}, categoryLabel = 'Government Jobs') {
  const title = text(post.title, 'This update');
  const org = text(post.organization, 'the issuing organisation');
  const department = text(post.department);
  const postName = text(post.postName);
  const qualification = text(post.qualification);
  const ageLimit = text(post.ageLimit);
  const fee = text(post.applicationFee);
  const salary = text(post.salary);
  const selection = text(post.selectionProcess);
  const vacancyDetails = text(post.vacancyDetails);
  const documents = text(post.documentsRequired);
  const shortDescription = text(post.shortDescription);
  const vacancies =
    Number(post.totalVacancies) > 0 ? `${Number(post.totalVacancies).toLocaleString('en-IN')} posts` : '';
  const dates = post.importantDates || {};
  const startDate = text(dates.startDate);
  const lastDate = text(dates.lastDate);
  const examDate = text(dates.examDate);
  const resultDate = text(dates.resultDate);
  const admitCardDate = text(dates.admitCardDate);
  const notificationDate = text(dates.notificationDate);
  const copy = categoryCopy(post.category);
  const howSteps = String(post.howToApply || '')
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);

  const overview = joinSentences([
    `${title} is an independent summary of a public notice issued by ${org}${department ? ` (${department})` : ''}.`,
    postName ? `The named post or examination is ${postName}.` : '',
    vacancies ? `The vacancy figure currently listed on this page is ${vacancies}.` : vacancyDetails ? `Vacancy information currently listed: ${vacancyDetails}.` : '',
    qualification ? `The educational requirement shown here is ${qualification}.` : '',
    ageLimit ? `The age condition shown here is ${ageLimit}.` : '',
    lastDate ? `The last date currently listed is ${lastDate}.` : startDate ? `The application window currently listed begins on ${startDate}.` : '',
    examDate ? `The examination date currently listed is ${examDate}.` : '',
    resultDate ? `The result date currently listed is ${resultDate}.` : '',
    shortDescription && shortDescription !== title ? shortDescription : '',
    `Use this page to understand the notice in plain language, then ${copy.action} only on the official portal.`,
  ]);

  const sections = [];

  const faqItems = Array.isArray(post.faqs) && post.faqs.length > 0
    ? post.faqs
      .filter((item) => item && String(item.question || '').trim() && String(item.answer || '').trim())
      .slice(0, 5)
      .map((item) => ({ question: String(item.question).trim(), answer: String(item.answer).trim() }))
    : buildFallbackFaqs(post, categoryLabel);

  const keyPoints = [];

  return {
    overview,
    categoryLabel,
    sections,
    faqItems,
    keyPoints,
    nextStep: copy.nextStep,
    actionLabel: copy.action,
    timeline: [
      { label: 'Apply / start', value: startDate || 'Not listed on this summary' },
      { label: 'Last date', value: lastDate || 'Not listed on this summary' },
      { label: 'Exam', value: examDate || 'Not listed on this summary' },
      { label: 'Result', value: resultDate || 'Not listed on this summary' },
    ],
  };
}
