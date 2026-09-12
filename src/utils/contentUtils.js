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
  'see details',
  'n/a',
  'na',
  'soon',
  'see official notice',
  'see official notification',
  'check official notice',
  'check official notification',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'as published in notification',
  'as per notification',
  '',
  'as per official notice',
  'as per notice',
  'as published in official notification',
  'as published in the official notification',
  'as mentioned in the official notification',
  'official notice',
  'official notification',
  'result to be announced',
  'result: to be announced',
  'to be announced',
  'before exam',
  'notified soon',
  'will be notified later',
  'to be released later',
  'to be updated soon',
];

function normalizeGenericText(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasValue(value) {
  if (value === 0) return true;
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  if (!text) return false;
  const lowered = normalizeGenericText(text);
  if (/^(?:n\/a|na)\b|^to be announced\b|^as per notification\b|^see official not(?:ice|ification)\b|^check official not(?:ice|ification)\b|\b(?:see|check) official not(?:ice|ification)\b|\bas (?:published|mentioned) in (?:the )?official notification\b/i.test(lowered)) return false;
  return !GENERIC_PLACEHOLDER_VALUES.some((placeholder) => normalizeGenericText(placeholder) === lowered);
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

export function isPostExpired(post = {}) {
  const status = String(post.statusNote || post.status || '').trim().toLowerCase();
  if (/closed|expired|over|withdrawn|cancelled/.test(status)) return true;

  const dates = post.importantDates || {};
  const rawLastDate = String(dates.lastDate || '').trim();
  if (!rawLastDate) return false;

  const parsed = Date.parse(rawLastDate);
  if (!Number.isNaN(parsed)) {
    const last = new Date(parsed);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return last < today;
  }
  return false;
}

export function detectContentType(post = {}) {
  const title = String(post.title || post.postName || '').trim().toLowerCase();
  const rawType = String(post.postType || '').trim().toLowerCase();
  const cat = String(post.category || '').trim().toLowerCase();
  const content = String(post.content || '').trim().toLowerCase();
  const linksText = Object.keys(post.links || {}).join(' ').trim().toLowerCase();

  if (rawType === 'result' || cat === 'result') {
    return 'result';
  }

  if (/exam city|city slip|exam city slip|city details|city intimation|exam centre/.test(title) || /exam city|city slip|city details|city intimation/.test(content)) {
    return 'exam-city-slip';
  }

  if (rawType === 'admit_card' || cat === 'admit-card' || /admit card|hall ticket/.test(title) || /admit card|hall ticket/.test(content)) {
    return 'admit-card';
  }

  if (rawType === 'result' || cat === 'result' || /result|merit list|scorecard/.test(title) || /result|merit list|scorecard/.test(content)) {
    return 'result';
  }

  if (rawType === 'answer_key' || cat === 'answer-key' || /answer key|objection/.test(title) || /answer key|objection/.test(content)) {
    return 'answer-key';
  }

  if (rawType === 'syllabus' || cat === 'syllabus' || /syllabus|exam pattern/.test(title)) {
    return 'syllabus';
  }

  if (rawType === 'certificate' || cat === 'certificate' || /certificate|e-certificate/.test(title) || /certificate|e-certificate/.test(content)) {
    return 'certificate';
  }

  if (rawType === 'admission' || cat === 'admission' || /admission|counselling|seat allotment|allotment/.test(title)) {
    return 'admission';
  }

  if (rawType === 'notification' || cat === 'latest-job' || cat === 'important' || /notification|recruitment|vacancy|online form/.test(title)) {
    return 'recruitment';
  }

  if (/exam date|exam schedule/.test(title) || /exam date|schedule/.test(content)) {
    return 'exam-date';
  }

  if (/correction|form correction/.test(title) || /correction/.test(content)) {
    return 'correction';
  }

  if (/cut off|cutoff|cut-off/.test(title) || /cut off|cutoff/.test(content)) {
    return 'cut-off';
  }

  return 'other';
}

export function inferUserIntent(post = {}, type = 'other') {
  const title = String(post.title || '').trim();
  const short = String(post.shortDescription || '').trim();
  if (type === 'exam-city-slip') return 'Explain the exam-city slip status and the city-check process with official links.';
  if (type === 'admit-card') return 'Explain who can download the admit card and what to verify before the exam.';
  if (type === 'result') return 'Explain the result status, official link, and next official action.';
  if (type === 'answer-key') return 'Explain the answer-key release and objection window, if any.';
  if (type === 'syllabus') return 'Explain the syllabus and exam pattern where the source provides it.';
  if (type === 'admission') return 'Explain the admission, counselling, or reporting step when data is specific.';
  if (type === 'recruitment') return 'Explain the recruitment notice, vacancy, qualification, and dates when data is specific.';
  if (type === 'exam-date') return 'Explain the exam date or schedule release without inventing an exact earlier date.';
  if (type === 'correction') return 'Explain the correction process and correction window correctly.';
  if (type === 'cut-off') return 'Explain the cutoff or qualifying reference correctly.';
  if (type === 'certificate') return 'Explain the certificate, e-certificate, or verification notice.';
  return title || short ? 'Explain the official update factually and omit generic filler.' : 'Explain the official update factually.';
}

export function buildDynamicArticle(post = {}, context = {}) {
  const type = detectContentType(post);
  const intent = inferUserIntent(post, type);
  const dates = post.importantDates || {};
  const links = post.links || {};
  const org = String(post.organization || '').trim();
  const postName = String(post.postName || post.title || '').trim();
  const qualification = text(post.qualification);
  const ageLimit = text(post.ageLimit);
  const vacancyDetails = text(post.vacancyDetails);
  const totalVacancies = Number(post.totalVacancies) > 0 ? `${Number(post.totalVacancies).toLocaleString('en-IN')} posts` : '';
  const applicationFee = text(post.applicationFee);
  const selectionProcess = text(post.selectionProcess);
  const salary = text(post.salary);
  const documentsRequired = text(post.documentsRequired);
  const howToApply = text(post.howToApply);
  const lastDate = text(dates.lastDate);
  const examDate = text(dates.examDate);
  const resultDate = text(dates.resultDate);
  const sectionMap = [];

  const add = (heading, body) => {
    if (!String(body || '').trim()) return;
    sectionMap.push({ heading, body });
  };

  const rows = [];

  if (isPostExpired(post)) {
    const talk = [
      'Application Status: Closed',
      lastDate ? `Last date: ${lastDate}` : '',
      'Candidates who already applied can check their admit card/result here.',
      Array.isArray(links.serviceLinks) && links.serviceLinks.length ? `Related official pages are available through the service link list.` : '',
    ].filter(Boolean);
    add('Application Status: Closed', talk.join('\n'));
  }

  if (type === 'exam-city-slip') {
    add('City Status', text(post.statusNote || post.status));
    add('City Slip Date', text(dates.examCityDate || dates.admitCardDate));
    add('Exam Date', examDate);
    const cityLink = links.examCity || links.examCityNotice || links.officialNotification || links.officialWebsite;
    add('How to Check Exam City', cityLink ? `Open the official city-slip page and verify the centre detail and city code before travelling.` : 'Use the authority portal to check the city slip when the link is available.');
    add('Exam City Instructions', text(post.documentsRequired || post.statusNote));
  } else if (type === 'admit-card') {
    add('Status', text(post.statusNote || post.status));
    add('Exam Date', examDate);
    if (links.downloadAdmitCard || links.admitCardNotice || links.examCity || links.officialNotification || links.officialWebsite) add('Download Process', 'Use the official admit-card link, enter the required login details, and download the hall ticket.');
    add('Reporting / Centre', text(post.reportingTime || post.examCentre || post.examCenter));
    add('Documents', documentsRequired);
    add('Instructions', text(post.instructions || post.statusNote));
  } else if (type === 'result') {
    add('Result Status', text(post.statusNote || post.status));
    add('Result Date', resultDate);
    if (links.checkResult || links.result || links.officialWebsite) add('How to Check Result', 'Open the result link, enter the required details, and verify the roll number or scorecard before saving it.');
    add('Marks / Scorecard', text(post.marks || post.scorecardDetails) || (links.scoreCard ? 'Download the scorecard from the official links below.' : ''));
    add('Cut-off / Next Stage', text(post.cutoffDetails || selectionProcess));
  } else if (type === 'answer-key') {
    add('Status', text(post.statusNote || post.status));
    add('Release Date', text(dates.answerKeyDate || dates.finalAnswerKeyDate));
    add('Objection', text(post.objectionDetails || dates.objectionLastDate));
    if (links.answerKey || links.finalAnswerKey || links.answerKeyNotice) add('How to Download', 'Open the official answer-key link and download the question-wise response sheet.');
    if (links.objection || post.objectionProcess) add('How to Raise Objection', text(post.objectionProcess, 'Use the official objection link and submit the response within the notified window.'));
  } else if (type === 'syllabus') {
    add('Exam Pattern', text(post.examPattern));
    add('Syllabus', text(post.syllabus || post.syllabusDetails));
  } else if (type === 'recruitment') {
    add('Vacancy', vacancyDetails || totalVacancies);
    const dateText = [dates.startDate ? `Start date: ${dates.startDate}` : '', lastDate ? `Last date: ${lastDate}` : '', examDate ? `Exam date: ${examDate}` : ''].filter(Boolean).join('\n');
    add('Dates', dateText);
    add('Eligibility', qualification);
    add('Age', ageLimit);
    add('Fee', applicationFee);
    add('Selection', selectionProcess);
    add('Salary', salary);
    add('Apply Process', howToApply);
    add('Documents', documentsRequired);
  } else if (type === 'admission') {
    rows.push(['Exam / Post', post.postName || post.title]);
    rows.push(['Admission / Counselling Status', post.statusNote || post.status || '']);
    rows.push(['Authority', org]);
    add('Admission / Counselling Details', rows.map(([label, value]) => value ? `${label}: ${value}` : '').filter(Boolean).join('\n'));
  } else if (type === 'correction') {
    rows.push(['Exam / Post', post.postName || post.title]);
    rows.push(['Correction Window', post.statusNote || post.status || '']);
    rows.push(['Authority', org]);
    add('Correction Notice', rows.map(([label, value]) => value ? `${label}: ${value}` : '').filter(Boolean).join('\n'));
  } else if (type === 'exam-date') {
    rows.push(['Exam / Post', post.postName || post.title]);
    rows.push(['Exam Date', dates.examDate || '']);
    rows.push(['Authority', org]);
    add('Exam Date Details', rows.map(([label, value]) => value ? `${label}: ${value}` : '').filter(Boolean).join('\n'));
  } else if (type === 'cut-off') {
    rows.push(['Exam / Post', post.postName || post.title]);
    rows.push(['Cut Off Reference', post.cutoffDetails || post.shortDescription || '']);
    rows.push(['Authority', org]);
    add('Cut Off Details', rows.map(([label, value]) => value ? `${label}: ${value}` : '').filter(Boolean).join('\n'));
  } else {
    add('Official Update', post.shortDescription || post.content || '');
  }

  return {
    type,
    intent,
    title: String(post.title || '').trim(),
    intro: String(post.shortDescription || post.content || '').trim(),
    sections: sectionMap,
    faqItems: Array.isArray(post.faqs) ? post.faqs.filter((faq) => faq?.question && faq?.answer).slice(0, 5) : [],
  };
}

export function buildPostGuide(post = {}, categoryLabel = 'Government Jobs') {
  const title = text(post.title, 'This update');
  const org = text(post.organization, 'the issuing organisation');
  const department = text(post.department);
  const postName = text(post.postName);
  const qualification = text(post.qualification);
  const ageLimit = text(post.ageLimit);
  const vacancyDetails = text(post.vacancyDetails);
  const shortDescription = text(post.shortDescription);
  const vacancies =
    Number(post.totalVacancies) > 0 ? `${Number(post.totalVacancies).toLocaleString('en-IN')} posts` : '';
  const dates = post.importantDates || {};
  const startDate = text(dates.startDate);
  const lastDate = text(dates.lastDate);
  const examDate = text(dates.examDate);
  const resultDate = text(dates.resultDate);

  const overviewParts = [
    org ? `${title} is published by ${org}${department ? `, ${department}` : ''}.` : `${title}.`,
    postName ? `Post / exam: ${postName}.` : '',
    vacancies ? `Vacancy listed: ${vacancies}.` : vacancyDetails ? `Vacancy details: ${vacancyDetails}.` : '',
    qualification ? `Educational Qualification: ${qualification}.` : '',
    ageLimit ? `Age Limit: ${ageLimit}.` : '',
    lastDate ? `Last date listed: ${lastDate}.` : startDate ? `Application start date listed: ${startDate}.` : '',
    examDate ? `Exam date listed: ${examDate}.` : '',
    resultDate ? `Result date listed: ${resultDate}.` : '',
    shortDescription && shortDescription !== title ? shortDescription : '',
  ];

  const overview = joinSentences(overviewParts.filter(Boolean));

  const sections = [];

  const faqItems = Array.isArray(post.faqs) && post.faqs.length > 0
    ? post.faqs
      .filter((item) => item && String(item.question || '').trim() && String(item.answer || '').trim())
      .slice(0, 5)
      .map((item) => ({ question: String(item.question).trim(), answer: String(item.answer).trim() }))
    : [];

  const keyPoints = [];

  return {
    overview,
    categoryLabel,
    sections,
    faqItems,
    keyPoints,
    nextStep: '',
    actionLabel: '',
    timeline: [
      startDate ? { label: 'Apply / start', value: startDate } : null,
      lastDate ? { label: 'Last date', value: lastDate } : null,
      examDate ? { label: 'Exam', value: examDate } : null,
      resultDate ? { label: 'Result', value: resultDate } : null,
    ].filter(Boolean),
  };
}
