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

function hasValue(value) {
  if (value === 0) return true;
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  if (!text) return false;
  const lowered = text.toLowerCase();
  return ![
    '—',
    '-',
    'n/a',
    'na',
    'soon',
    'check official notification',
    'as mentioned in the official notification',
    'as per notification',
    'as per official notification',
  ].includes(lowered);
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

  const sections = [
    {
      id: 'what-this-notice-covers',
      title: 'What this notice covers',
      body: joinSentences([
        `${title} should be read as a structured briefing, not as a replacement for the PDF or portal page published by ${org}.`,
        vacancies ? `If you are counting competition, start with the listed figure of ${vacancies}${vacancyDetails ? ` (${vacancyDetails})` : ''}.` : vacancyDetails ? `Vacancy wording on this page: ${vacancyDetails}.` : 'If a vacancy total is not listed, treat the notice as an update until the official advertisement states a number.',
        qualification ? `Candidates who do not hold ${qualification} should stop and read the official eligibility clause before paying a fee.` : 'Confirm the exact qualification, subject combination, and cut-off date of the degree or certificate on the official notification.',
        `Sarkari Job Hub does not accept forms, fees, or documents for ${org}.`,
      ]),
    },
    {
      id: 'dates-and-action',
      title: 'Dates and the action required',
      body: joinSentences([
        notificationDate ? `The notification date currently shown is ${notificationDate}.` : '',
        startDate ? `Online activity, if listed, begins on ${startDate}.` : '',
        lastDate ? `The closing date currently shown is ${lastDate}. Treat a portal clock, not this summary, as the final cut-off.` : 'If a last date is not printed here, open the official notice before you assume the window is open.',
        examDate ? `The exam date currently shown is ${examDate}.` : '',
        admitCardDate ? `Admit-card or city information is listed as ${admitCardDate}.` : '',
        resultDate ? `The result date currently shown is ${resultDate}.` : '',
        `The practical next step is to ${copy.nextStep}.`,
      ]),
    },
    {
      id: 'eligibility-and-selection',
      title: 'Eligibility, fee and selection',
      body: joinSentences([
        ageLimit ? `Age limit currently listed: ${ageLimit}. Category-wise relaxation, if any, is controlled by the official advertisement, not by this page.` : 'Read the official age calculation date. A one-day difference can make a form invalid.',
        fee ? `Application fee currently listed: ${fee}. Pay only through the recruiting organisation's payment gateway.` : 'Fee rules are often different for category, gender, or ex-servicemen. Check the official table.',
        salary ? `Pay scale currently listed: ${salary}.` : '',
        selection ? `Selection process currently listed: ${selection}.` : `After the written stage, ${org} may still require document verification, a skill test, a physical test, or a medical examination.`,
        documents ? `Documents mentioned for this update: ${documents}.` : `Keep identity proof, educational certificates, photographs, and category documents ready in the format ${org} asks for.`,
      ]),
    },
    {
      id: 'how-to-use-this-page',
      title: 'How to use this page safely',
      body: joinSentences([
        `Open the official link in the Important Links section, confirm that the domain belongs to ${org}, and only then ${copy.action}.`,
        howSteps.length
          ? `Steps recorded from the notice: ${howSteps.slice(0, 5).join('; ')}.`
          : 'If the application or download steps are not listed, follow the instructions on the authority website rather than a forwarded message.',
        'Do not share one-time passwords, payment card details, or scanned identity documents with anyone who contacts you after you read this page.',
        'If a date, vacancy, or fee on this page disagrees with the official notice, the official notice wins. Use the Contact page to report the difference.',
      ]),
    },
  ];

  const fallbackFaqItems = [
    {
      question: `Who issued ${title}?`,
      answer: `${org}${department ? `, through ${department},` : ''} is the organisation named on this page. Confirm the same name on the official website before you apply, pay, or download ${copy.document}.`,
    },
    {
      question: qualification ? `What qualification is listed for ${title}?` : `Where should I check eligibility for ${title}?`,
      answer: qualification
        ? `This page currently lists the qualification as ${qualification}. Read the official notification for subject rules, equivalent degrees, and the date on which the qualification must be held.`
        : `This page does not replace the eligibility clause. Open the official notification from ${org} and check education, age, nationality, and category conditions there.`,
    },
    {
      question: lastDate ? `What last date is shown for ${title}?` : `Is a deadline listed for ${title}?`,
      answer: lastDate
        ? `The last date currently shown is ${lastDate}. Portals can close by server time, and a corrigendum can change the date. Check the live official page on the day you submit.`
        : `A closing date is not clearly listed on this summary. Do not assume the form is open. Check the official ${org} notice.`,
    },
    {
      question: vacancies ? `How many vacancies are listed in ${title}?` : `Does ${title} include a vacancy total?`,
      answer: vacancies
        ? `This summary currently lists ${vacancies}${vacancyDetails ? ` — ${vacancyDetails}` : ''}. Post-wise and category-wise numbers, if any, must be taken from the official advertisement.`
        : vacancyDetails
          ? `Vacancy wording currently shown: ${vacancyDetails}. Use the official notice for the legally relevant count.`
          : `A vacancy total is not listed here. Treat the page as an update until ${org} publishes a numbered advertisement.`,
    },
    {
      question: `How should I ${copy.action} for ${title}?`,
      answer: howSteps.length
        ? `${howSteps.join(' ')} Complete those steps on the official portal, not on a copy of this website.`
        : `Use the official link on this page, sign in with the registration details issued by ${org}, and follow the on-screen instructions for ${copy.document}.`,
    },
    {
      question: `Can I treat this page as the official ${copy.document}?`,
      answer: `No. Sarkari Job Hub is an independent information website. ${org} remains the only authority for applications, fees, admit cards, answer keys, results, and appointment decisions.`,
    },
  ];

  const faqItems = Array.isArray(post.faqs) && post.faqs.length > 0
    ? post.faqs
      .filter((item) => item && String(item.question || '').trim() && String(item.answer || '').trim())
      .slice(0, 5)
      .map((item) => ({ question: String(item.question).trim(), answer: String(item.answer).trim() }))
    : fallbackFaqItems.slice(0, 3);

  const keyPoints = [
    `Issuing body: ${org}`,
    postName ? `Post / exam: ${postName}` : `Category: ${categoryLabel}`,
    qualification ? `Qualification: ${qualification}` : null,
    ageLimit ? `Age limit: ${ageLimit}` : null,
    vacancies ? `Vacancies: ${vacancies}` : vacancyDetails ? `Vacancies: ${vacancyDetails}` : null,
    fee ? `Fee: ${fee}` : null,
    selection ? `Selection: ${selection}` : null,
    lastDate ? `Last date listed: ${lastDate}` : examDate ? `Exam date listed: ${examDate}` : resultDate ? `Result date listed: ${resultDate}` : null,
  ].filter(Boolean);

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
