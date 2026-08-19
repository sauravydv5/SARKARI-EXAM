import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('content');

const TITLE_UPDATES = [
  ['results/kvs-nvs-teaching-non-teaching-tier-ii-result-2026.json', 'KVS NVS Teaching & Non-Teaching Tier-II Result 2026 – Out'],
  ['results/upsssc-vdo-2023-supplementary-result.json', 'UPSSSC VDO 2023 Final Result'],
  ['results/rpsc-school-lecturer-pgt-teacher-result-2026.json', 'RPSC School Lecturer PGT Result 2026 – Updated'],
  ['results/uppsc-assistant-professor-gdc-result-2026.json', 'UPPSC Assistant Professor Result 2026 – Updated'],
  ['results/upsc-cpf-ac-2025-final-result.json', 'UPSC CAPF AC 2025 Final Marks'],
  ['jobs/mpesb-group-2-sub-group-4-patwari-online-form-2026.json', 'MPESB Group-2 Sub Group-4 Patwari Online Form 2026 – Date Extend'],
  ['jobs/rajasthan-safai-karamchari-online-form-2026.json', 'Rajasthan Safai Karmchari Online Form 2026 (24,752 posts) – Start'],
  ['jobs/rrb-junior-engineer-je-2026.json', 'RRB Junior Engineer JE Online Form 2026 – Start'],
  ['jobs/isro-icrb-assistant-various-post-online-form-2026.json', 'ISRO Assistant & Junior Personal Assistant Online Form 2026 – Date Extend'],
  ['admit-cards/bpsc-72-pre-exam-postponed-2026.json', 'Bihar BPSC 72 Pre New Exam Date 2026'],
  ['admit-cards/uppsc-computer-assistant-typing-test-exam-date-2026.json', 'UPPSC Computer Assistant Typing Test Admit Card 2026'],
  ['admit-cards/rssb-computer-instructor-exam-date-2026.json', 'RSSB Computer Instructor Exam City Details 2026'],
  ['admit-cards/bsnl-jto-exam-date-2026.json', 'BSNL Junior Telecom Officer JTO Exam City Details 2026 – Out'],
  ['answer-keys/dsssb-various-post-answer-key-2026.json', 'Delhi DSSSB July Answer Key 2026'],
];

const KIND = {
  result: {
    action: 'checkResult',
    steps: (title, site) =>
      `1. Visit ${site}\n2. Open the ${title} link or Results section\n3. Download the PDF or log in with roll number / registration ID\n4. Match your details and save a copy\n5. Follow the next-stage instructions in the official notice`,
    selection: 'Written / CBT (as applicable) → Result → Document Verification / next stage',
    documents: 'Roll number, registration number, date of birth and a valid photo ID',
  },
  'admit-card': {
    action: 'downloadAdmitCard',
    steps: (title, site) =>
      `1. Visit ${site}\n2. Open the ${title} / Admit Card / Exam City link\n3. Log in with registration number and password or date of birth\n4. Download and print the admit card or city slip\n5. Carry photo ID and the printed copy to the exam / PET venue`,
    selection: 'Online application → Admit card / exam city → Examination / PET',
    documents: 'Registration number, password or date of birth, photo ID and printed admit card',
  },
  'latest-job': {
    action: 'applyOnline',
    steps: (title, site) =>
      `1. Visit ${site}\n2. Open the latest advertisement for ${title}\n3. Register or log in and fill the application\n4. Upload photo, signature and required documents, then pay the fee if applicable\n5. Submit and print the confirmation page`,
    selection: 'Online application → Written exam / CBT / PET as notified → Document verification → Final merit',
    documents: 'Photo, signature, educational certificates, category certificate (if any) and valid photo ID',
  },
  'answer-key': {
    action: 'downloadAnswerKey',
    steps: (title, site) =>
      `1. Visit ${site}\n2. Open Answer Key / Response Sheet for ${title}\n3. Download the official key or log in to view your response sheet\n4. Compare answers and note the objection window\n5. Submit objections only through the official portal if allowed`,
    selection: 'Examination → Provisional answer key / objections → Final key → Result',
    documents: 'Application number, roll number and password used at the exam',
  },
  important: {
    action: 'importantLink',
    steps: (title, site) =>
      `1. Visit ${site}\n2. Open the service or notice related to ${title}\n3. Read eligibility and document list\n4. Apply, download or verify as instructed\n5. Save the acknowledgement or PDF`,
    selection: 'N/A — document / service update',
    documents: 'Aadhaar, mobile number and supporting certificates as asked on the portal',
  },
  admission: {
    action: 'applyOnline',
    steps: (title, site) =>
      `1. Visit ${site}\n2. Open ${title}\n3. Register with a valid mobile and email\n4. Fill choices or the application and upload documents\n5. Pay the fee if required and print the confirmation`,
    selection: 'Online form / counselling registration → Choice filling (if any) → Allotment / exam',
    documents: 'Photo, signature, educational documents, category certificate and photo ID',
  },
};

function html(item) {
  const site = item.official.replace(/^https?:\/\//, '');
  const kind = item.kind;
  if (kind === 'result') {
    return `<p><strong>${item.org}</strong> has published an update for <strong>${item.title}</strong>.</p><p>Use this page as a quick listing only. Open the official website, download the result PDF or scorecard, and confirm your roll number before treating the outcome as final.</p><h3>How to check</h3><ol><li>Go to <strong>${site}</strong></li><li>Open the Results / Latest notice section</li><li>Download the PDF or log in with your credentials</li><li>Read cut-off, next-stage and document-verification instructions if they are in the same notice</li></ol><p>NaukriMitra does not declare government results. The recruiting body website is the only authentic source.</p>`;
  }
  if (kind === 'admit-card') {
    return `<p><strong>${item.org}</strong> has issued an exam-city, schedule or admit-card related update for <strong>${item.title}</strong>.</p><p>Download the hall ticket or city intimation only from the official portal. Carry a printed copy and photo ID to the venue.</p><h3>How to download</h3><ol><li>Open <strong>${site}</strong></li><li>Use the Admit Card / Exam City login</li><li>Enter registration number and password or date of birth</li><li>Print the PDF and check shift, city and reporting time</li></ol>`;
  }
  if (kind === 'answer-key') {
    return `<p>The official answer key / OMR or response-sheet process for <strong>${item.title}</strong> is handled by <strong>${item.org}</strong>.</p><p>Match the question booklet series carefully. Raise objections only inside the official window and through the official portal.</p><h3>How to download</h3><ol><li>Visit <strong>${site}</strong></li><li>Open Answer Key / Response Sheet</li><li>Log in if the key is candidate-wise</li><li>Save the PDF and note the objection closing date</li></ol>`;
  }
  if (kind === 'latest-job') {
    const vacancy = item.vacancies ? ` Reported vacancies in public notices: <strong>${item.vacancies.toLocaleString('en-IN')}</strong> — confirm the count in the advertisement.` : '';
    return `<p><strong>${item.org}</strong> is accepting (or has reopened) online applications for <strong>${item.postName || item.title}</strong>.${vacancy}</p><p>Read the detailed advertisement for eligibility, fee, dates and district/post-wise vacancies before you submit the form.</p><h3>How to apply</h3><ol><li>Open <strong>${site}</strong></li><li>Complete registration / OTR if required</li><li>Fill the form, upload documents and pay the fee</li><li>Print the confirmation page</li></ol>`;
  }
  if (kind === 'admission') {
    return `<p><strong>${item.org}</strong> has an active form or counselling update for <strong>${item.title}</strong>.</p><p>Counselling schedules, mop-up rounds and last dates change quickly. Use the official counselling or board portal for choice filling and allotment.</p><h3>What to do</h3><ol><li>Visit <strong>${site}</strong></li><li>Register or log in</li><li>Fill the form or choices and upload documents</li><li>Pay the counselling / form fee if asked</li></ol>`;
  }
  return `<p><strong>${item.org}</strong> provides the official service or notice for <strong>${item.title}</strong>.</p><p>Use the government portal linked below for application, download, correction or verification. Keep Aadhaar and registered mobile ready.</p>`;
}

function build(item, index) {
  const meta = KIND[item.kind];
  const published = new Date(Date.UTC(2026, 7, 19, 12, 0, 0) - index * 60 * 1000).toISOString();
  const actionKey = meta.action;
  return {
    id: item.slug,
    slug: item.slug,
    category: item.category,
    title: item.title,
    organization: item.org,
    postName: item.postName || item.title,
    totalVacancies: item.vacancies || 0,
    vacancyDetails: item.vacancyDetails || item.postName || item.title,
    qualification: item.qualification || 'As published in the official notification',
    ageLimit: item.ageLimit || 'As published in the official notification',
    applicationFee: item.fee || 'As published in the official notification',
    selectionProcess: item.selection || meta.selection,
    documentsRequired: item.documents || meta.documents,
    howToApply: meta.steps(item.title, item.official),
    shortDescription: `${item.title}. Verify the latest notice on ${item.official.replace(/^https?:\/\//, '')} before you apply, download or treat a result as final.`,
    content: html(item),
    publishedAt: published,
    lastUpdated: '2026-08-19',
    sourceUrl: item.official,
    isFeatured: index < 8,
    isNew: true,
    importantDates: {
      notificationDate: 'See official notice',
      startDate: 'See official notice',
      lastDate: 'See official notice',
      examDate: 'See official notice',
      resultDate: item.kind === 'result' ? 'Released / updated — confirm on official site' : 'See official notice',
      admitCardDate: item.kind === 'admit-card' ? 'Released / updated — confirm on official site' : 'See official notice',
    },
    links: {
      [actionKey]: item.official,
      officialWebsite: item.official,
      officialNotification: item.official,
    },
    tags: item.tags || [],
    editorNotes: 'Independent listing for candidates. NaukriMitra is not a government website. Always open the official recruiting-body URL before paying a fee or relying on a result.',
    importantInstructions: 'Do not share login OTPs. Download PDFs only from the official domain. Dates and vacancy counts on aggregator sites can lag behind the notice.',
    faqs: [
      {
        question: `Where can I verify ${item.title}?`,
        answer: `Use the official website: ${item.official}. This page only points you there.`,
      },
      {
        question: 'Are the dates on this page final?',
        answer: 'No. Treat every date as a prompt to re-check the latest PDF or login dashboard on the official portal.',
      },
      {
        question: 'What should I keep ready?',
        answer: item.documents || meta.documents,
      },
    ],
    views: 1200 + index * 17,
  };
}

const NEW_POSTS = [
  // Results
  { folder: 'results', kind: 'result', category: 'result', slug: 'bihar-police-prohibition-constable-result-2026', title: 'Bihar Police Prohibition Constable Result 2026', org: 'Central Selection Board of Constable (CSBC), Bihar', postName: 'Prohibition Constable', official: 'https://csbc.bihar.gov.in', qualification: 'As per CSBC Prohibition Constable advertisement', tags: ['Bihar Police', 'CSBC', 'Prohibition Constable', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'bihar-police-csbc-constable-operator-result-2026', title: 'Bihar Police CSBC Constable Operator Result 2026 – Out', org: 'Central Selection Board of Constable (CSBC), Bihar', postName: 'Constable Operator', official: 'https://csbc.bihar.gov.in', tags: ['Bihar Police', 'CSBC', 'Operator', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'bihar-police-csbc-constable-gd-result-2026', title: 'Bihar Police CSBC Constable GD Result 2026 – Out', org: 'Central Selection Board of Constable (CSBC), Bihar', postName: 'Constable (General Duty)', official: 'https://csbc.bihar.gov.in', tags: ['Bihar Police', 'CSBC', 'Constable GD', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'ssc-chsl-2025-frta-result', title: 'SSC 10+2 CHSL 2025 FRTA Result – Out', org: 'Staff Selection Commission', postName: 'Combined Higher Secondary Level (CHSL) 10+2 – Final Result / Tier-wise FRTA', official: 'https://ssc.gov.in', qualification: '12th pass as per CHSL 2025 notice', tags: ['SSC', 'CHSL', 'FRTA', 'Result'] },
  { folder: 'answer-keys', kind: 'answer-key', category: 'answer-key', slug: 'nta-csir-ugc-net-june-answer-key-2026', title: 'NTA CSIR UGC NET June Answer Key 2026 – Out', org: 'National Testing Agency / CSIR', postName: 'Joint CSIR-UGC NET June 2026 – Answer Key', official: 'https://csirnet.nta.ac.in', qualification: 'Post-graduate / as per CSIR NET subject eligibility', tags: ['NTA', 'CSIR', 'UGC NET', 'Answer Key'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'rssb-forester-result-2026', title: 'RSSB Forester Result 2026', org: 'Rajasthan Staff Selection Board', postName: 'Forester', official: 'https://rsmssb.rajasthan.gov.in', tags: ['RSSB', 'Forester', 'Rajasthan', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'rssb-lab-assistant-result-2026', title: 'RSSB Lab Assistant Result 2026 – Out', org: 'Rajasthan Staff Selection Board', postName: 'Lab Assistant', official: 'https://rsmssb.rajasthan.gov.in', tags: ['RSSB', 'Lab Assistant', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'mpesb-van-rakshak-jail-prahari-result-2026', title: 'MPESB Van Rakshak / Jail Prahari Result 2026 – Out', org: 'Madhya Pradesh Employees Selection Board', postName: 'Van Rakshak / Jail Prahari', official: 'https://esb.mp.gov.in', tags: ['MPESB', 'Van Rakshak', 'Jail Prahari', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'ib-security-assistant-executive-final-result-2026', title: 'IB Security Assistant/ Executive Final Result 2026', org: 'Ministry of Home Affairs / Intelligence Bureau', postName: 'Security Assistant / Executive', official: 'https://www.mha.gov.in', qualification: 'Matriculation / as per IB SA/Executive advertisement', tags: ['IB', 'Security Assistant', 'MHA', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'delhi-hc-hjs-result-2026', title: 'Delhi High Court Higher Judicial Service HJS Result 2026', org: 'High Court of Delhi', postName: 'Delhi Higher Judicial Service', official: 'https://delhihighcourt.nic.in', qualification: 'As per Delhi Higher Judicial Service Rules', tags: ['Delhi High Court', 'HJS', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'bihar-vidhan-parishad-ldc-pa-final-result-2026', title: 'Bihar Vidhan Parishad LDC Pre / PA Final Result 2026', org: 'Bihar Vidhan Parishad', postName: 'Lower Division Clerk / Personal Assistant', official: 'https://www.biharvidhanparishad.gov.in', tags: ['Bihar Vidhan Parishad', 'LDC', 'PA', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'rssb-nhm-rajmes-final-result-2026', title: 'RSSB NHM & RajMES Final Result 2026 – Updated', org: 'Rajasthan Staff Selection Board', postName: 'NHM and RajMES various posts', official: 'https://rsmssb.rajasthan.gov.in', tags: ['RSSB', 'NHM', 'RajMES', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'rssb-jta-final-result-2026', title: 'RSSB Junior Technical Assistant JTA Final Result 2026', org: 'Rajasthan Staff Selection Board', postName: 'Junior Technical Assistant (JTA)', official: 'https://rsmssb.rajasthan.gov.in', tags: ['RSSB', 'JTA', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'rssb-ayush-officer-final-result-2026', title: 'RSSB Ayush Officer Final Result 2026 – Out', org: 'Rajasthan Staff Selection Board', postName: 'Ayush Officer', official: 'https://rsmssb.rajasthan.gov.in', tags: ['RSSB', 'Ayush', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'upsssc-auditor-assistant-accountant-2024-final-result', title: 'UPSSSC Auditor / Assistant Accountant 2024 Final Result', org: 'Uttar Pradesh Subordinate Services Selection Commission', postName: 'Auditor / Assistant Accountant (2024 cycle)', official: 'https://upsssc.gov.in', qualification: 'As per UPSSSC Auditor / Assistant Accountant 2024 advertisement', tags: ['UPSSSC', 'Auditor', 'Assistant Accountant', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'cbse-12th-compartment-result-2026', title: 'CBSE Board 12th Compartment Result 2026 – Out', org: 'Central Board of Secondary Education', postName: 'Class 12 Compartment / Supplementary Examination', official: 'https://cbseresults.nic.in', qualification: 'CBSE Class 12 compartment candidates', tags: ['CBSE', 'Class 12', 'Compartment', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'bpssc-si-prohibition-pre-result-2026', title: 'Bihar Police BPSSC SI Prohibition Pre Result 2026 – Out', org: 'Bihar Police Subordinate Services Commission', postName: 'Sub-Inspector (Prohibition) – Preliminary', official: 'https://bpssc.bihar.gov.in', tags: ['BPSSC', 'SI Prohibition', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'bpssc-havildar-instructor-result-2026', title: 'BPSSC Bihar Police Havildar Instructor Result 2026 – Out', org: 'Bihar Police Subordinate Services Commission', postName: 'Havildar Instructor', official: 'https://bpssc.bihar.gov.in', tags: ['BPSSC', 'Havildar Instructor', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'bpssc-asi-operation-pre-result-2026', title: 'Bihar Police BPSSC ASI (Operation) Pre Result 2026 – Out', org: 'Bihar Police Subordinate Services Commission', postName: 'ASI (Operation) – Preliminary', official: 'https://bpssc.bihar.gov.in', tags: ['BPSSC', 'ASI Operation', 'Result'] },
  { folder: 'results', kind: 'result', category: 'result', slug: 'hpsc-pgt-computer-science-final-result-2026', title: 'HPSC PGT Computer Science Final Result 2026', org: 'Haryana Public Service Commission', postName: 'Post Graduate Teacher – Computer Science', official: 'https://hpsc.gov.in', qualification: 'Post-graduate in Computer Science / as per HPSC PGT notice', tags: ['HPSC', 'PGT', 'Computer Science', 'Result'] },

  // Admit cards
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'nta-aiapget-admit-card-2026', title: 'NTA AIAPGET Admit Card 2026 – Out', org: 'National Testing Agency', postName: 'All India AYUSH Post Graduate Entrance Test (AIAPGET)', official: 'https://aiapget.nta.ac.in', qualification: 'BAMS / BUMS / BSMS / BHMS as per AIAPGET bulletin', tags: ['NTA', 'AIAPGET', 'Admit Card'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'nbems-group-a-b-c-exam-city-details-2026', title: 'NBEMS Group A, B & C Various Post Exam City Details 2026', org: 'National Board of Examinations in Medical Sciences', postName: 'Group A, B & C various posts – exam city', official: 'https://natboard.edu.in', tags: ['NBEMS', 'Exam City', 'Admit Card'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'up-home-guard-pet-date-notice-2026', title: 'UP Home Guard PET Date Notice 2026', org: 'Uttar Pradesh Police Recruitment and Promotion Board', postName: 'Home Guard – Physical Efficiency Test', official: 'https://uppbpb.gov.in', tags: ['UP Home Guard', 'PET', 'Admit Card'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'ibps-po-mt-xvi-pre-admit-card-2026', title: 'IBPS CRP PO MT XVI Pre Admit Card 2026', org: 'Institute of Banking Personnel Selection', postName: 'Probationary Officer / Management Trainee CRP-XVI – Preliminary', official: 'https://www.ibps.in', qualification: 'Graduation as per IBPS PO CRP-XVI notification', tags: ['IBPS', 'PO', 'Admit Card'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'bpsc-project-manager-pre-exam-date-2026', title: 'BPSC Project Manager Pre Exam Date 2026', org: 'Bihar Public Service Commission', postName: 'Project Manager – Preliminary exam date', official: 'https://www.bpsc.bih.nic.in', tags: ['BPSC', 'Project Manager', 'Exam Date'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'nta-ugc-net-june-re-exam-notice-2026', title: 'NTA UGC NET June Re-Exam Notice 2026', org: 'National Testing Agency', postName: 'UGC NET June – re-examination notice', official: 'https://ugcnet.nta.ac.in', qualification: 'Master’s degree / as per UGC NET bulletin', tags: ['NTA', 'UGC NET', 'Re-Exam'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'iaf-agniveer-vayu-musician-01-2027-admit-card', title: 'Indian Airforce Agniveer Vayu Musician Intake 01/2027 Admit Card', org: 'Indian Air Force', postName: 'Agniveer Vayu Musician – Intake 01/2027', official: 'https://agnipathvayu.cdac.in', qualification: 'As per Agniveer Vayu Musician intake notice', tags: ['Indian Air Force', 'Agniveer Vayu', 'Musician', 'Admit Card'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'upsc-cse-ias-mains-admit-card-2026', title: 'UPSC Civil Services IAS Mains Admit Card 2026 – Out', org: 'Union Public Service Commission', postName: 'Civil Services (Main) Examination', official: 'https://upsconline.nic.in', qualification: 'Candidates qualified in CSE Preliminary as per UPSC notice', tags: ['UPSC', 'IAS', 'Mains', 'Admit Card'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'upsssc-lower-pcs-exam-city-details-2026', title: 'UPSSSC Lower PCS Exam City Details 2026 – Out', org: 'Uttar Pradesh Subordinate Services Selection Commission', postName: 'Lower PCS – exam city', official: 'https://upsssc.gov.in', tags: ['UPSSSC', 'Lower PCS', 'Exam City'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'bhu-school-teacher-exam-date-2026', title: 'BHU School Teacher TGT, PGT, PRT, Principal Exam Date 2026', org: 'Banaras Hindu University', postName: 'School Teacher TGT / PGT / PRT / Principal', official: 'https://www.bhu.ac.in', tags: ['BHU', 'TGT', 'PGT', 'PRT', 'Exam Date'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'allahabad-hc-research-associates-admit-card-2026', title: 'Allahabad High Court Research Associates Admit Card 2026', org: 'High Court of Judicature at Allahabad', postName: 'Research Associates', official: 'https://www.allahabadhighcourt.in', qualification: 'Law graduate / as per High Court notice', tags: ['Allahabad High Court', 'Research Associate', 'Admit Card'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'sbi-am-dm-law-admit-card-2026', title: 'SBI Assistant Manager Law, Deputy Manager Law Admit Card 2026', org: 'State Bank of India', postName: 'Assistant Manager (Law) / Deputy Manager (Law)', official: 'https://sbi.co.in/web/careers', qualification: 'Law degree with experience as per SBI specialist cadre notice', tags: ['SBI', 'Law', 'Admit Card'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'upsc-cds-ii-exam-schedule-2026', title: 'UPSC CDS-II Exam Schedule 2026', org: 'Union Public Service Commission', postName: 'Combined Defence Services Examination (II)', official: 'https://upsc.gov.in', qualification: 'As per CDS-II notification (IMA / INA / AFA / OTA)', tags: ['UPSC', 'CDS', 'Exam Schedule'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'upsc-nda-ii-exam-schedule-2026', title: 'UPSC NDA II Exam Schedule 2026', org: 'Union Public Service Commission', postName: 'National Defence Academy & Naval Academy Examination (II)', official: 'https://upsc.gov.in', qualification: '12th pass / appearing as per NDA-II notification', tags: ['UPSC', 'NDA', 'Exam Schedule'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'ssc-stenographer-exam-date-2026', title: 'SSC Stenographer Exam Date 2026', org: 'Staff Selection Commission', postName: 'Stenographer Grade C & D', official: 'https://ssc.gov.in', qualification: '12th pass with stenography skill as per SSC notice', tags: ['SSC', 'Stenographer', 'Exam Date'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'ssc-jht-exam-date-2026', title: 'SSC Combined Hindi Translators JHT Exam Date 2026', org: 'Staff Selection Commission', postName: 'Junior Hindi Translator / Combined Hindi Translators', official: 'https://ssc.gov.in', qualification: 'Master’s in Hindi / English or as per JHT notification', tags: ['SSC', 'JHT', 'Exam Date'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'neet-pg-exam-city-details-2026', title: 'NEET PG Exam City Details 2026', org: 'National Board of Examinations in Medical Sciences', postName: 'NEET-PG – exam city intimation', official: 'https://natboard.edu.in', qualification: 'MBBS with internship as per NEET-PG information bulletin', tags: ['NEET PG', 'NBEMS', 'Exam City'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'uppsc-lt-grade-assistant-teacher-mains-admit-card-2026', title: 'UPPSC LT Grade Assistant Teacher Mains Admit Card 2026 – Updated', org: 'Uttar Pradesh Public Service Commission', postName: 'LT Grade Assistant Teacher – Mains', official: 'https://uppsc.up.nic.in', qualification: 'Graduation with B.Ed / as per LT Grade notice', tags: ['UPPSC', 'LT Grade', 'Admit Card'] },
  { folder: 'admit-cards', kind: 'admit-card', category: 'admit-card', slug: 'up-police-constable-dv-pst-admit-card-2026', title: 'UP Police Constable DV / PST Admit Card 2026 – Out', org: 'Uttar Pradesh Police Recruitment and Promotion Board', postName: 'Constable – Document Verification / Physical Standard Test', official: 'https://uppbpb.gov.in', tags: ['UP Police', 'Constable', 'DV', 'PST', 'Admit Card'] },

  // Jobs
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'rssb-junior-engineer-online-form-2026', title: 'RSSB Junior Engineer Online Form 2026', org: 'Rajasthan Staff Selection Board', postName: 'Junior Engineer', official: 'https://rsmssb.rajasthan.gov.in', qualification: 'Diploma / Degree in Engineering as per RSSB JE notice', tags: ['RSSB', 'Junior Engineer', 'Rajasthan'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'bank-of-baroda-lbo-online-form-2026', title: 'Bank Of Baroda LBO Online Form 2026 (2482 Posts)', org: 'Bank of Baroda', postName: 'Local Bank Officer (LBO)', official: 'https://www.bankofbaroda.in/career', vacancies: 2482, vacancyDetails: '2482 Local Bank Officer posts as stated in public notices — confirm in the advertisement', qualification: 'Graduation with local language / as per BOB LBO notice', tags: ['Bank of Baroda', 'LBO', 'Banking'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'mpesb-mspstet-online-form-2026', title: 'MPESB Primary and Secondary Teachers MSPSTET Online Form 2026', org: 'Madhya Pradesh Employees Selection Board', postName: 'MSPSTET – Primary and Secondary Teachers', official: 'https://esb.mp.gov.in', qualification: 'As per MP teacher eligibility / MSPSTET notification (D.El.Ed / B.Ed / TET as applicable)', tags: ['MPESB', 'MSPSTET', 'Teacher'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'mpesb-group-3-sub-engineer-online-form-2026', title: 'MPESB Group 3 Sub Engineer & Other Post Online Form 2026', org: 'Madhya Pradesh Employees Selection Board', postName: 'Group-3 Sub Engineer and other posts', official: 'https://esb.mp.gov.in', qualification: 'Diploma / ITI / as per Group-3 post-wise notice', tags: ['MPESB', 'Sub Engineer', 'Group 3'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'mp-high-court-assistant-grade-iii-online-form-2026', title: 'MP High Court Assistant Grade III Online Form 2026', org: 'High Court of Madhya Pradesh', postName: 'Assistant Grade-III', official: 'https://mphc.gov.in', qualification: 'Graduation / computer typing as per MP High Court notice', tags: ['MP High Court', 'Assistant Grade III'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'igcar-trade-apprentice-online-form-2026', title: 'IGCAR Trade Apprentice Online Form 2026', org: 'Indira Gandhi Centre for Atomic Research', postName: 'Trade Apprentice', official: 'https://www.igcar.gov.in', qualification: 'ITI in relevant trade as per Apprentices Act / IGCAR notice', tags: ['IGCAR', 'Apprentice', 'DAE'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'bihar-stet-online-form-2026', title: 'Bihar STET Online Form 2026 – Start', org: 'Bihar School Examination Board', postName: 'Bihar State Teacher Eligibility Test (STET)', official: 'https://www.bsebstet.com', qualification: 'Graduation / B.Ed / D.El.Ed as per STET paper (I or II)', tags: ['Bihar', 'STET', 'BSEB'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'sbi-junior-associates-clerk-online-form-2026', title: 'SBI Junior Associates Clerk Online Form 2026 (9124 Posts)', org: 'State Bank of India', postName: 'Junior Associates (Customer Support & Sales)', official: 'https://sbi.co.in/web/careers', vacancies: 9124, vacancyDetails: '9124 Junior Associate posts as stated in public notices — confirm in the advertisement', qualification: 'Graduation from a recognised university as per SBI JA notice', tags: ['SBI', 'Clerk', 'Junior Associate'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'upsssc-je-agriculture-online-form-2026', title: 'UPSSSC Junior Engineer JE (Agriculture) Online Form 2026', org: 'Uttar Pradesh Subordinate Services Selection Commission', postName: 'Junior Engineer (Agriculture)', official: 'https://upsssc.gov.in', qualification: 'Diploma / Degree in Agricultural Engineering as per UPSSSC JE (Agri) notice', tags: ['UPSSSC', 'JE Agriculture'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'upsssc-veterinary-pharmacist-online-form-2026', title: 'UPSSSC Veterinary Pharmacist Online Form 2026', org: 'Uttar Pradesh Subordinate Services Selection Commission', postName: 'Veterinary Pharmacist', official: 'https://upsssc.gov.in', qualification: 'Veterinary Pharmacist diploma / as per UPSSSC notice', tags: ['UPSSSC', 'Veterinary Pharmacist'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'gims-noida-staff-nurse-online-form-2026', title: 'GIMS Noida Staff Nurse Online Form 2026', org: 'Government Institute of Medical Sciences, Greater Noida', postName: 'Staff Nurse', official: 'https://gims.noida.gov.in', qualification: 'GNM / B.Sc Nursing with registration as per GIMS notice', tags: ['GIMS Noida', 'Staff Nurse'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'upsssc-livestock-extension-officer-online-form-2026', title: 'UPSSSC Livestock Extension Officer Online Form 2026', org: 'Uttar Pradesh Subordinate Services Selection Commission', postName: 'Livestock Extension Officer', official: 'https://upsssc.gov.in', qualification: 'Veterinary Science / as per UPSSSC LEO notice', tags: ['UPSSSC', 'Livestock Extension Officer'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'railway-icf-apprentice-online-form-2026', title: 'Railway ICF Apprentice Online Form 2026', org: 'Integral Coach Factory, Chennai / Indian Railways', postName: 'Trade Apprentice', official: 'https://www.rrbapply.gov.in', qualification: 'ITI in relevant trade as per ICF apprentice notification', tags: ['Railway', 'ICF', 'Apprentice'] },
  { folder: 'jobs', kind: 'latest-job', category: 'latest-job', slug: 'rcf-kapurthala-apprentice-online-form-2026', title: 'RCF Kapurthala Apprentice Online Form 2026', org: 'Rail Coach Factory, Kapurthala / Indian Railways', postName: 'Trade Apprentice', official: 'https://www.rrbapply.gov.in', qualification: 'ITI in relevant trade as per RCF Kapurthala apprentice notification', tags: ['Railway', 'RCF', 'Apprentice'] },

  // Answer keys
  { folder: 'answer-keys', kind: 'answer-key', category: 'answer-key', slug: 'bpsc-apo-answer-key-2026', title: 'Bihar BPSC APO Answer Key 2026', org: 'Bihar Public Service Commission', postName: 'Assistant Prosecution Officer – Answer Key', official: 'https://www.bpsc.bih.nic.in', qualification: 'Law degree as per BPSC APO advertisement', tags: ['BPSC', 'APO', 'Answer Key'] },
  { folder: 'answer-keys', kind: 'answer-key', category: 'answer-key', slug: 'upsssc-agta-group-c-answer-key-2026', title: 'UPSSSC Agriculture Technical Assistant Group-C Answer Key 2026 – Out', org: 'Uttar Pradesh Subordinate Services Selection Commission', postName: 'Agriculture Technical Assistant (Group-C)', official: 'https://upsssc.gov.in', tags: ['UPSSSC', 'AGTA', 'Answer Key'] },
  { folder: 'answer-keys', kind: 'answer-key', category: 'answer-key', slug: 'afcat-02-2026-answer-key', title: 'AFCAT 02/2026 Answer Key – Out', org: 'Indian Air Force', postName: 'Air Force Common Admission Test 02/2026', official: 'https://afcat.cdac.in', qualification: 'Graduation / as per AFCAT 02/2026 notification', tags: ['AFCAT', 'IAF', 'Answer Key'] },
  { folder: 'answer-keys', kind: 'answer-key', category: 'answer-key', slug: 'nta-icar-aieea-pg-phd-answer-key-2026', title: 'NTA ICAR AIEEA PG Ph.D Answer Key 2026', org: 'National Testing Agency / ICAR', postName: 'AIEEA PG / Ph.D', official: 'https://icar.nta.ac.in', qualification: 'Bachelor / Master’s as per ICAR AIEEA bulletin', tags: ['NTA', 'ICAR', 'AIEEA', 'Answer Key'] },

  // Documents
  { folder: 'important', kind: 'important', category: 'important', slug: 'delhi-laxmi-yojana-form-2026', title: 'Delhi Laxmi Yojana Form 2026', org: 'Government of NCT of Delhi / Department of Women and Child Development', postName: 'Mukhyamantri Mahila Samman / Laxmi Yojana related online form', official: 'https://edistrict.delhigovt.nic.in', qualification: 'Resident woman of Delhi as per scheme guidelines', tags: ['Delhi', 'Laxmi Yojana', 'Scheme'] },

  // Admission
  { folder: 'admission', kind: 'admission', category: 'admission', slug: 'up-deled-2026-online-counselling', title: 'UP DELEd 2026 Online Counselling', org: 'Exam Regulatory Authority, Uttar Pradesh', postName: 'Diploma in Elementary Education – online counselling', official: 'https://updeled.gov.in', qualification: 'As per UP DELEd 2026 counselling brochure', tags: ['UP DELEd', 'Counselling', 'Admission'] },
  { folder: 'admission', kind: 'admission', category: 'admission', slug: 'bihar-bseb-deled-2026-caf', title: 'Bihar BSEB DElEd 2026 Common Application Form', org: 'Bihar School Examination Board', postName: 'DElEd Common Application Form 2026', official: 'https://www.bsebodisha.ac.in'.replace('bsebodisha.ac.in', 'secondary.biharboardonline.com'), officialFix: true, tags: ['Bihar', 'BSEB', 'DElEd', 'Admission'] },
  { folder: 'admission', kind: 'admission', category: 'admission', slug: 'neet-ug-2026-online-counselling', title: 'NEET UG 2026 Online Counselling', org: 'Medical Counselling Committee / National Medical Commission', postName: 'NEET UG All India / state counselling', official: 'https://mcc.nic.in', qualification: 'NEET UG qualified as per MCC / state brochure', tags: ['NEET UG', 'MCC', 'Counselling'] },
  { folder: 'admission', kind: 'admission', category: 'admission', slug: 'up-polytechnic-jeecup-online-counseling-2025', title: 'UP Polytechnic JEECUP Online Counseling 2025', org: 'Joint Entrance Examination Council, Uttar Pradesh', postName: 'JEECUP Polytechnic counselling', official: 'https://jeecup.admissions.nic.in', qualification: 'As per JEECUP counselling brochure (10th / 12th / ITI streams)', tags: ['JEECUP', 'Polytechnic', 'UP', 'Counselling'] },
];

// Fix the accidental BSEB URL
const deled = NEW_POSTS.find((p) => p.slug === 'bihar-bseb-deled-2026-caf');
if (deled) {
  deled.official = 'https://www.biharboardonline.bihar.gov.in';
  delete deled.officialFix;
}

let created = 0;
let skipped = 0;
NEW_POSTS.forEach((item, index) => {
  const file = path.join(root, item.folder, `${item.slug}.json`);
  if (fs.existsSync(file)) {
    skipped += 1;
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(build(item, index), null, 2)}\n`);
  created += 1;
});

let updated = 0;
for (const [relative, title] of TITLE_UPDATES) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (json.title === title) continue;
  json.title = title;
  json.lastUpdated = json.lastUpdated || '2026-08-19';
  json.isNew = true;
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
  updated += 1;
}

console.log(JSON.stringify({ created, skipped, updated, newPosts: NEW_POSTS.length }, null, 2));
