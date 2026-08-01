export function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildReadingTime(text = '') {
  const count = String(text || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(count / 180));
  return `${minutes} min read`;
}

export function createArticleSummary(title, description, category) {
  return [
    `Learn everything about ${title} with a practical, up-to-date guide for ${category} aspirants.`,
    description,
    'This article explains the exam pattern, eligibility, preparation strategy, and common mistakes to avoid while preparing.',
  ].join(' ');
}

export function buildArticleSections(title, category) {
  return [
    { id: 'overview', title: 'Overview', body: `${title} is one of the most searched ${category} preparation topics in India. This guide brings together the key facts, trends, and study approaches that matter most for aspirants.` },
    { id: 'eligibility', title: 'Eligibility & Requirements', body: `Before you apply or begin preparing for ${title}, understand the official eligibility conditions, age limits, qualifications, and document requirements that can affect your chances.` },
    { id: 'strategy', title: 'Preparation Strategy', body: `A strong preparation plan for ${title} should include topic-wise revision, regular mock tests, current affairs, and a balanced daily schedule.` },
    { id: 'resources', title: 'Resources & Tips', body: `Use reliable study material, previous year papers, mock tests, and official updates to prepare efficiently for ${title}.` },
  ];
}

export function buildPostGuide(post = {}, categoryLabel = 'Government Jobs') {
  const title = post.title || 'Government Recruitment Update';
  const overview = `${title} deserves careful study because the latest notice can change quickly and a small misunderstanding about eligibility or dates can cost a candidate a full cycle. This guide turns the official update into a practical study resource by explaining the recruitment summary, academic requirements, age conditions, selection flow, and the preparation approach in plain language so you can make calm, informed decisions.`;
  const sections = [
    {
      id: 'overview',
      title: 'Recruitment Overview',
      body: `${overview} Candidates should begin by reading the official notice, comparing the vacancy summary with their profile, and noting the dates, fees, and application steps before they spend time preparing. A clear understanding of the recruitment pattern helps reduce confusion and improves the chance of submitting a complete application on time.`,
    },
    {
      id: 'department',
      title: 'About Department',
      body: `The recruiting department behind ${title} usually defines the reporting structure, job responsibilities, and the nature of the work expected after selection. Even if the vacancy is attractive, aspirants should understand the department's role, job profile, and work environment because that affects both preparation and long-term career satisfaction.`,
    },
    {
      id: 'eligibility',
      title: 'Eligibility Explained',
      body: `The qualification requirement for ${title} is usually the first filter. Review the minimum education level, any preferred subject combination, age limit, and other conditions carefully before you start the application process. In many recruitments, aspirants lose important opportunities because they misread relaxed rules, document requirements, or the exact qualification standard mentioned in the notice.`,
    },
    {
      id: 'age',
      title: 'Age Limit Explained',
      body: `Age criteria matter because the same vacancy can have different upper age limits for general, OBC, SC, ST, or PwBD candidates. Read the age calculation method and the relaxation rules carefully, especially if your profile is close to the upper limit. Understanding this early prevents last-minute surprises when you are finally ready to apply.`,
    },
    {
      id: 'vacancy',
      title: 'Vacancy Details',
      body: `Vacancy information should be taken seriously because it often indicates the expected competition level, the number of posts by category, and the long-term selection strategy of the recruiting body. Aspirants should compare the number of openings with the total number of applications they expect, and then plan their preparation accordingly.`,
    },
    {
      id: 'selection',
      title: 'Selection Process',
      body: `Most government vacancies follow a structured process with written exams, skill tests, document verification, and interviews where applicable. Understanding this flow helps you prepare with the right priorities, avoid weak areas, and build a realistic timetable for the stages ahead.`,
    },
    {
      id: 'syllabus',
      title: 'Exam Pattern & Syllabus',
      body: `A strong preparation plan for ${title} should begin with the detailed syllabus and pattern, not with random study material. Build your schedule around the official pattern, important topics, and the weightage of sections so your effort stays focused and measurable.`,
    },
    {
      id: 'documents',
      title: 'Required Documents',
      body: `Keep identity proof, educational certificates, category documents, a recent photo, signature, and any experience records ready in both digital and printed form. A well-organized file saves time, prevents form errors, and reduces stress when the application window is open.`,
    },
    {
      id: 'preparation',
      title: 'Preparation Tips',
      body: `A practical study plan should cover current affairs, revision, previous year papers, mock tests, and the margin of error in your weak areas. Consistent practice matters more than cramming, and the best aspirants usually create a weekly rhythm that balances revision, practice, and rest.`,
    },
  ];

  const faqItems = [
    {
      question: `Who should apply for ${title}?`,
      answer: 'Candidates who meet the official educational qualification, age limit, and category requirements should review the detailed notice before applying.',
    },
    {
      question: `How should I prepare for ${title}?`,
      answer: 'Focus first on the syllabus, selection stages, and official instructions, then build a weekly schedule with revision and mock tests.',
    },
    {
      question: `What documents should I keep ready?`,
      answer: 'Keep scanned copies of your education certificates, ID proof, photo, signature, and category documents ready before the application window opens.',
    },
    {
      question: `Where should I verify the final details?`,
      answer: 'Always cross-check the latest notice, fee, and deadline on the official website because recruitment rules can change after publication.',
    },
    {
      question: `What is the most common mistake?`,
      answer: 'The most common mistake is rushing into application without checking the eligibility, age relaxation, and document format requirements carefully.',
    },
    {
      question: `How important is the official source?`,
      answer: 'The official source remains the final authority for deadlines, fees, and instructions, so cross-checking it is essential before submission.',
    },
  ];

  return {
    overview,
    categoryLabel,
    sections,
    faqItems,
    keyPoints: [
      `Category: ${categoryLabel}`,
      `Qualification: ${post.qualification || 'Check official notice'}`,
      `Age limit: ${post.ageLimit || 'Check official notice'}`,
      `Salary: ${post.salary || 'Check official notice'}`,
      `Vacancies: ${post.totalVacancies ? `${post.totalVacancies.toLocaleString('en-IN')} posts` : 'See official notice'}`,
      `Selection: ${post.selectionProcess || 'Check official notice'}`,
      `Documents: Keep your education, identity, category, and photo documents ready`,
    ],
    timeline: [
      { label: 'Apply', value: post.importantDates?.startDate || 'Check official notice' },
      { label: 'Last Date', value: post.importantDates?.lastDate || 'Check official notice' },
      { label: 'Exam', value: post.importantDates?.examDate || 'Check official notice' },
      { label: 'Result', value: post.importantDates?.resultDate || 'Check official notice' },
    ],
    eligibilityCards: [
      { title: 'Qualification', value: post.qualification || 'Check official notice' },
      { title: 'Age Limit', value: post.ageLimit || 'Check official notice' },
      { title: 'Salary', value: post.salary || 'Check official notice' },
    ],
    selectionSteps: [
      'Review the official notice and eligibility conditions',
      'Prepare documents and monitor the application deadline',
      'Study the syllabus and complete mock practice',
      'Track exam and result updates from the official source',
    ],
  };
}
