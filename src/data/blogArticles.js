import { buildReadingTime, countWords, toSlug } from '../utils/contentUtils.js';

function article({ title, category, excerpt, publishedAt, updatedAt, tags, content }) {
  const text = content.replace(/<[^>]+>/g, ' ');
  return {
    id: toSlug(title),
    slug: toSlug(title),
    title,
    category,
    excerpt,
    summary: excerpt,
    content,
    author: 'Sarkari Job Hub Editorial Team',
    publishedAt,
    updatedAt,
    reviewedAt: updatedAt,
    readingTime: buildReadingTime(text),
    wordCount: countWords(text),
    tags,
    sources: [
      'Official recruitment advertisements and corrigenda',
      'Commission and board candidate instructions',
      'Public examination notices linked from our update pages',
    ],
  };
}

export const blogArticles = [
  article({
    title: 'How to Read a Government Job Notification Without Missing the Fine Print',
    category: 'Application Guide',
    excerpt:
      'A government advertisement is a legal document. This guide shows the order in which to read vacancies, eligibility, dates, fees, and instructions so a form is not rejected later.',
    publishedAt: '2026-03-12',
    updatedAt: '2026-08-28',
    tags: ['Notification', 'Eligibility', 'Application'],
    content: `
<h2>Start with the issuing body, not the headline</h2>
<p>Job lists often shorten a title to “SSC CGL Online Form” or “Police Constable Bharti”. The document that matters is the advertisement issued by a named commission, board, court, bank, or department. Write down that name, the advertisement number, and the date of publication before you look at the vacancy count. If two bodies recruit for similar posts in the same month, mixing up their portals is a common reason candidates upload the right documents to the wrong login.</p>
<p>On Sarkari Job Hub, the organisation field on each update is there for this reason. Open the official notification from that organisation and keep it beside the summary. If a sentence on our page is shorter than the clause in the PDF, follow the PDF.</p>
<h2>Read eligibility as a set of dates, not as a degree name</h2>
<p>Graduation, 10+2, or ITI is only the first filter. Most notices also fix a date on which the qualification must be held, a minimum percentage, a required subject combination, and whether a final-year student may apply. Age is calculated from a stated date, not from the day you fill the form. Category, ex-servicemen, PwBD, and departmental candidate rules sit in separate tables. Skipping those tables is how people pay a fee for a post they cannot hold.</p>
<p>If you are close to an upper age limit, read the closing date of the age calculation and the relaxation clause twice. A corrigendum can change either without changing the vacancy total.</p>
<h2>Vacancies, fees and selection are three different decisions</h2>
<p>A large vacancy total does not mean the post is easy. It tells you how many appointments the body hopes to make, not how many people will sit the exam. Fee tables are usually split by category and gender; some posts are exempt. Selection may include a computer-based test, a descriptive paper, a physical standard, a skill test, document verification, and a medical examination. Prepare for the first stage you cannot skip, but keep documents ready for the last stage you might reach.</p>
<h2>A working method for the rest of the PDF</h2>
<ol>
<li>Highlight the last date for the form, the last date for the fee, and any separate date for a correction window.</li>
<li>Note the photograph, signature, and certificate size rules. Portals reject files that are too large or too small even when the content is correct.</li>
<li>Read the centre, language, and scribe rules if they apply to you.</li>
<li>Save the advertisement number with your application printout. You will need it if the body publishes a corrigendum.</li>
</ol>
<p>Treat every “to be notified later” line as unfinished business. Do not invent a date because a coaching message or a social-media post supplied one. When the official body publishes the missing date, our update page should move with it; until then, the honest status is that the date is not public.</p>
`,
  }),
  article({
    title: 'How to Verify Official Recruitment Links and Avoid Fake Job Offers',
    category: 'Safety',
    excerpt:
      'Fake portals copy logos and ask for OTPs or extra fees. This article explains how to confirm that a recruitment link belongs to the real organisation before you type personal data.',
    publishedAt: '2026-04-02',
    updatedAt: '2026-08-20',
    tags: ['Safety', 'Official website', 'Fraud'],
    content: `
<h2>The only safe place to apply is the organisation’s own domain</h2>
<p>A genuine recruitment form sits on a website controlled by the commission, board, court, bank, or ministry named in the advertisement. The domain is usually a government or organisation domain that you can match against the “official website” line in the PDF. Sarkari Job Hub links out to that site. We do not host application forms, collect examination fees, or send joining letters.</p>
<p>If a page asks you to pay through a personal UPI ID, a messaging app, or a private “facilitation centre” that is not named in the notice, stop. Recruiting bodies take fees through the payment gateway attached to their own portal.</p>
<h2>Checks that take less than a minute</h2>
<ul>
<li>Compare the organisation name on the login page with the name in the advertisement header.</li>
<li>Look at the browser address before you type a password. Extra words, extra hyphens, or a different ending are warning signs.</li>
<li>Do not share one-time passwords sent by a bank, Aadhaar, or the recruitment portal with anyone who calls or messages you.</li>
<li>Ignore offers of an “inside vacancy”, a paid admit card, or a guaranteed selection. Those are not how public recruitment works.</li>
</ul>
<h2>What to do if you already entered details on a doubtful page</h2>
<p>Change the password on the real recruitment portal if you had one. If you typed a bank or UPI PIN, contact the bank. If you uploaded identity documents, monitor those IDs and report misuse through the official channels those agencies provide. Then complete any genuine application only on the domain printed in the advertisement.</p>
<p>When you report a bad link to us through the Contact page, include the URL you saw and the advertisement you were trying to follow. We can correct a summary on this website. We cannot recover money from a fraudster or influence a commission’s decision.</p>
`,
  }),
  article({
    title: 'Documents You Should Keep Ready Before a Government Job Form Opens',
    category: 'Documents',
    excerpt:
      'Most rejected applications fail on photographs, signatures, or certificates that were prepared on the last day. Build a small, reusable file kit before the next notification.',
    publishedAt: '2026-02-18',
    updatedAt: '2026-07-30',
    tags: ['Documents', 'Application', 'Checklist'],
    content: `
<h2>A reusable kit beats a last-night scan</h2>
<p>Every advertisement has its own pixel and kilobyte rules, but the same documents appear again and again. If you scan them once, keep both colour and black-and-white versions, and store the originals in one envelope, you can resize files in minutes instead of visiting a café when the portal is already slow.</p>
<h2>Identity and photographs</h2>
<p>Keep a current photograph on a plain background and a signature on white paper, both saved as JPG or JPEG unless a notice asks for PNG. Name the files simply, without Hindi characters or extra dots, because some older portals fail on unusual file names. The photo ID you will carry to the exam should show the same name spelling as your educational certificates. If a court or gazette has changed your name, keep that order with the kit.</p>
<h2>Education and category</h2>
<p>Scan mark sheets and certificates for every level the posts you target may ask: 10th for date of birth, 12th or ITI, diploma, graduation, and post-graduation. Add the category, EWS, PwBD, or ex-servicemen certificate only if you will claim that benefit, and check its validity date. An expired income certificate is a frequent reason EWS claims fail at document verification even after a candidate has cleared the written exam.</p>
<h2>Experience, domicile and extras</h2>
<p>Some posts ask for a domicile or residence certificate, a computer-course certificate, a driving licence, or an experience letter on letterhead. Do not invent these on the form. If you do not have them, apply only to posts that do not require them, or obtain the document from the issuing authority before you submit.</p>
<p>When a portal asks for a live photograph or a handwritten declaration, follow that instruction even if you already uploaded a scanned photo. Boards use those extra steps to reduce impersonation. Fighting the portal usually wastes the last hour of the window.</p>
`,
  }),
  article({
    title: 'How to Download an Admit Card and What to Check Before Exam Day',
    category: 'Admit Card',
    excerpt:
      'City slips and hall tickets are different files. This guide covers the download, the fields that must match your application, and the practical checks for the morning of the exam.',
    publishedAt: '2026-05-06',
    updatedAt: '2026-08-22',
    tags: ['Admit card', 'Exam day', 'City intimation'],
    content: `
<h2>City intimation is not always the hall ticket</h2>
<p>Many commissions first publish an exam city or a travelling intimation, then the full admit card with the centre address and shift. A city slip helps you book a train. It does not replace the hall ticket at the gate. Read the heading of the notice on Sarkari Job Hub and the file name on the official portal before you stop looking.</p>
<h2>Download only from the candidate login</h2>
<p>Use the registration number, roll number, or password issued when you applied. If you have forgotten the password, reset it on the same official portal. Third-party pages that promise a download without login are not a safe source. After the file opens, save a PDF and print at least one clear copy. Do not depend on a phone battery at the centre unless the official instructions say a digital copy is enough.</p>
<h2>A short checklist on the printout</h2>
<ul>
<li>Name, photograph, and signature match the application.</li>
<li>Roll number and application number are readable.</li>
<li>Date, shift, reporting time, and gate-closing time are on the front or back page.</li>
<li>Centre address is complete enough to locate on a map the day before.</li>
<li>The list of allowed items and banned items is on the instructions page.</li>
</ul>
<p>If a photograph is missing or a name is wrong, use the official helpdesk or correction process named in the notice. Messaging a private website cannot change the attendance sheet at the centre.</p>
<h2>The day before the exam</h2>
<p>Keep the admit card, the photo ID named in the instructions, and spare photographs if the notice asks for them, in one folder. Read the reporting time as a hard limit. Centres in large cities often sit far from the railway station; a city name on the intimation slip is not the same as the building you must reach. Eat and travel plans should be built around the gate-closing time, not the start of the paper.</p>
`,
  }),
  article({
    title: 'How to Check a Sarkari Result and What Happens After You Qualify',
    category: 'Results',
    excerpt:
      'A result notice is a list or a scorecard, not a joining letter. Learn how to read merit lists, cut-offs, and the stages that usually follow a written exam.',
    publishedAt: '2026-01-20',
    updatedAt: '2026-08-15',
    tags: ['Result', 'Merit list', 'Document verification'],
    content: `
<h2>Match the examination before you log in</h2>
<p>Result weeks are noisy. Board exams, constable tests, apprentice lists, and combined-graduate papers can appear on the same day. Confirm the organisation, the post, and the year on the Sarkari Job Hub summary, then open only that official result link. Typing your roll number into the wrong login can show a blank page or, worse, someone else’s data if the form is poorly built.</p>
<h2>Scorecard, PDF list, and login result are not the same format</h2>
<p>Some bodies publish a searchable login. Others upload a PDF of roll numbers. Others release a cut-off table first and the scorecard a few days later. If the notice says “result PDF”, do not wait for a login that will never appear. Search the PDF with your roll number, then read the footnote for the next stage.</p>
<p>Normalised marks, raw marks, and final merit can differ. Where a commission uses multi-shift exams, the published score is usually the normalised one. Arguing from a memory of the unofficial answer key does not change that figure. The objection window, if any, closed at the answer-key stage.</p>
<h2>Qualification is a door, not a job</h2>
<p>Written-exam qualification typically leads to document verification, a physical standard or efficiency test, a skill test, counselling, or a medical examination. Note those dates from the same official PDF that carried the result. Carry originals and self-attested copies in the order the board asks. A missing caste or domicile certificate at this stage can erase a written-exam rank.</p>
<p>If your number is missing, read the official note on withheld results, court cases, or biometric mismatch before you assume a portal error. Raise a representation only through the channel the board names, and keep a copy of what you send.</p>
`,
  }),
  article({
    title: 'Answer Keys and Objection Windows: How Scoring Actually Works',
    category: 'Answer Key',
    excerpt:
      'Provisional keys, objections, dropped questions, and final keys follow a sequence. This explainer shows what a candidate can still change and what is already closed.',
    publishedAt: '2026-03-28',
    updatedAt: '2026-08-18',
    tags: ['Answer key', 'Objection', 'Scoring'],
    content: `
<h2>Provisional is a draft for challenge, not the result</h2>
<p>After a computer-based test, many commissions upload a provisional answer key and, sometimes, a copy of the candidate’s response sheet. This is the moment to compare questions, booklet codes, and shifts. It is not the moment to calculate a final rank. The board may still drop a question, change a key, or apply normalisation.</p>
<h2>Objections need evidence, not a group message</h2>
<p>If an objection window is open, the notice will state the fee per question, the format, and the last time. Attach the source the board asks for: a standard textbook, an official Act, or a government publication. Screenshots of a coaching video are rarely accepted. Pay the fee only on the official gateway. Keep the acknowledgement number until the final key is out.</p>
<p>When the window closes, late emails to the commission or to this website do not enter the record. A popular social-media thread is not an official challenge.</p>
<h2>Reading the final key</h2>
<p>The final key is the one used for scoring. If a question is dropped, the notice usually explains how marks are redistributed or whether the paper is scored out of the remaining questions. If a key changes, every candidate in that shift is scored on the revised key, not only the person who objected.</p>
<p>Use the Sarkari Job Hub answer-key page to find the right official link and to see whether the file is provisional or final. Then do the comparison on the commission’s portal. That is the only comparison that can change a mark.</p>
`,
  }),
  article({
    title: 'Age Limit and Relaxation Rules in Central and State Exams',
    category: 'Eligibility',
    excerpt:
      'Age is calculated from a date in the advertisement, and relaxation depends on the rules of that recruiting body. Here is a practical way to check whether you are inside the window.',
    publishedAt: '2026-02-04',
    updatedAt: '2026-07-21',
    tags: ['Age limit', 'Reservation', 'Eligibility'],
    content: `
<h2>The calculation date is part of the rule</h2>
<p>Notices do not ask “how old are you today”. They ask whether you have reached a minimum age and have not crossed a maximum age on a stated date, often 1 January or the last date of application. Two candidates born a day apart can receive opposite answers. Write the calculation date next to your date of birth before you pay a fee.</p>
<h2>Relaxation is not automatic everywhere</h2>
<p>Central and state bodies follow different tables. OBC (non-creamy layer), SC, ST, PwBD, ex-servicemen, widows, departmental candidates, and sports persons may receive extra years, but only if that advertisement includes them and you hold a valid certificate. An OBC creamy-layer candidate cannot borrow the OBC age table. A state domicile rule may apply to a state commission and not to a Union body.</p>
<p>Some posts also have a post-wise age cap that is tighter than the general table. Read the post table, not only the first paragraph of the notice.</p>
<h2>Certificates must still be valid at verification</h2>
<p>Clearing a written exam with a claimed relaxation is not enough if the certificate is expired, issued by the wrong authority, or does not match the name on the application. Renew EWS and OBC NCL certificates according to the date the board asks for, which is often the financial year of application or of verification.</p>
<p>If this site’s summary shows a short age line such as “18 to 30 years”, treat it as a pointer. Open the official table for category-wise years, service relaxation, and the calculation date. That table is the one a document-verification board will use.</p>
`,
  }),
  article({
    title: 'One-Time Registration: Why SSC, UPSSSC and Police Boards Ask for It',
    category: 'Registration',
    excerpt:
      'OTR is a profile, not a job application. Completing it early prevents a last-day failure when a notification opens and the profile still needs documents.',
    publishedAt: '2026-01-08',
    updatedAt: '2026-08-05',
    tags: ['OTR', 'SSC', 'UPSSSC'],
    content: `
<h2>OTR stores identity so later forms can reuse it</h2>
<p>Staff Selection Commission, several state commissions, and some police boards ask candidates to create a one-time registration or permanent profile. That profile holds name, date of birth, photograph, signature, education, and contact details. When a specific advertisement opens, you log in to that profile and apply for that post. Skipping OTR until the last date of a popular form is a common way to miss the window when the photo upload fails.</p>
<h2>Spell the name as the board will see it for years</h2>
<p>Use the spelling on your 10th certificate unless the board’s OTR instructions say otherwise. A later mismatch with an admit card or a joining letter is painful to correct. Mobile number and email should be ones you will still use in two years; many boards send password resets and city slips only to those contacts.</p>
<h2>OTR is not consent to every future vacancy</h2>
<p>Registering does not apply you to CGL, GD, Constable, or PET. Each advertisement still needs its own form, fee, and post preference. Some boards allow limited edits to OTR; others freeze photograph and date of birth. Read that board’s OTR notice before you submit.</p>
<p>On Sarkari Job Hub, OTR and profile links sit under Documents / Important updates, separate from Latest Jobs, so they are not mistaken for a vacancy. Complete the profile on the official domain, then return to the job list when an advertisement you want is actually open.</p>
`,
  }),
  article({
    title: 'Common Online Form Mistakes That Get Government Applications Rejected',
    category: 'Application Guide',
    excerpt:
      'Wrong category, unreadable photos, unpaid fees, and mismatched names cause more rejections than a difficult syllabus. These are the errors to prevent before you click submit.',
    publishedAt: '2026-04-18',
    updatedAt: '2026-08-12',
    tags: ['Application', 'Mistakes', 'Form filling'],
    content: `
<h2>Category and post preference are not cosmetic</h2>
<p>Selecting a reserved category without a valid certificate, or selecting a post whose qualification you do not hold, can survive the fee payment and fail at scrutiny. Portals rarely warn you in plain language. Read the post code and the eligibility line together. If you are unsure about an equivalent degree, the safe action is to follow the exact wording of the advertisement or to skip that post code.</p>
<h2>Photographs and signatures still fail more forms than people expect</h2>
<p>A selfie with a busy background, a signature that touches the edge of the box, or a file that is 20 kilobytes over the limit will bounce. Crop and compress before the last hour. Preview the uploaded image inside the portal; a successful “upload” can still show a black box.</p>
<h2>Fee payment is complete only when the portal says so</h2>
<p>A bank SMS is not always enough. Return to the application, confirm that the payment status is successful, and print the confirmation page. If the amount left your account but the portal shows failure, use that portal’s recovery or grievance option with the transaction ID. Do not pay a second time until the notice says you should.</p>
<h2>Name, date of birth and gender must match the ID you will carry</h2>
<p>Admit cards are checked against photo ID. A nickname, a missing surname, or a different date of birth is enough for a centre to refuse entry. If a parent’s name field is mandatory, copy it from the same certificate you will show at verification.</p>
<p>After submit, download the application print even if you think you will remember the number. Boards ask for it when a city slip will not open, when a correction window appears, or when a result is withheld for a data issue.</p>
`,
  }),
  article({
    title: 'How Cut-Off Marks Work in SSC, Railway and Police Exams',
    category: 'Cut Off',
    excerpt:
      'Cut-offs are produced after vacancies, difficulty, and category rules are applied. Previous-year numbers are a planning tool, not a promise for the next cycle.',
    publishedAt: '2026-05-22',
    updatedAt: '2026-08-25',
    tags: ['Cut off', 'SSC', 'Railway', 'Police'],
    content: `
<h2>A cut-off is a line drawn after the exam, not before it</h2>
<p>Bodies publish cut-offs when they publish a result or a shortlist. The line depends on vacancies, the number of candidates, paper difficulty, normalisation across shifts, and reservation rules. A previous-year cut-off is useful for deciding whether a mock-test score is in a serious range. It is not a guarantee that the same mark will qualify next year.</p>
<h2>Category, post, and state lines can all exist together</h2>
<p>SSC combined exams often have different cut-offs for different posts and for different categories. Railway recruitment can vary by region. Police constable exams may publish district or category lists. Always read the table header. Comparing a general-category all-India line with an OBC state-cadre line is how rumours start.</p>
<h2>Normalisation changes raw scores</h2>
<p>When a paper is held in several shifts, commissions often convert raw marks to a normalised score. Your memory of “I got 92 right” may not match the published figure. The published figure is the one used for the cut-off. Unofficial keys cannot reverse normalisation.</p>
<p>On result pages, Sarkari Job Hub records the date and the official link. We do not invent a predicted cut-off to fill empty space. If a previous-year table is shown on a recruitment summary, it is labelled as history. Use it to plan practice, then wait for the board’s PDF for the cycle you actually sat.</p>
`,
  }),
  article({
    title: 'Building a Study Plan When You Are Preparing for More Than One Exam',
    category: 'Preparation',
    excerpt:
      'SSC, state commissions, railways, and banks share a core of reasoning, quantitative aptitude, language, and current affairs. A single weekly plan can cover that core without pretending every paper is identical.',
    publishedAt: '2026-03-05',
    updatedAt: '2026-08-08',
    tags: ['Study plan', 'Preparation', 'Mock tests'],
    content: `
<h2>Find the overlap, then protect the unique papers</h2>
<p>A candidate targeting SSC CGL, a state PCS prelims, and a bank clerk paper does not need three unrelated lives. Quantitative aptitude, reasoning, and a language paper overlap. Current affairs overlap if you keep one monthly notebook. What does not overlap is the state-specific GK, the descriptive language paper, the physical test, or a professional-knowledge paper. Put overlap work on weekdays and unique papers on a fixed weekend slot so they are not postponed forever.</p>
<h2>A week that survives a job or a college timetable</h2>
<p>Two focused hours on a working day beat an eight-hour plan you will abandon. A practical pattern is: one quantitative set, one reasoning set, one language or comprehension piece, and 20 minutes of current affairs. On the weekend, add a full mock in the pattern of the nearest exam, then a long revision of the errors from that mock. Physical preparation, if a police or defence post is in your list, needs its own daylight slot; it cannot be stored in a PDF.</p>
<h2>Mocks are for diagnosis, not for a daily rank on a leaderboard</h2>
<p>Take a mock in exam conditions, including the same negative marking. Write down the topics you missed. The next week’s practice should start with those topics. Chasing a stranger’s mock percentile without reading the official pattern of your actual advertisement wastes the only resource you cannot buy: attention.</p>
<p>Use syllabus pages on this site to list the papers for each advertisement you have applied to. Then keep the official PDFs in one folder. When a pattern changes, change the weekend mock, not the entire weekday core.</p>
`,
  }),
  article({
    title: 'After the Written Exam: Physical Tests, Document Verification and Medicals',
    category: 'Selection Process',
    excerpt:
      'A written score is only one gate. This article explains PST, PET, typing or skill tests, document verification, and medical examinations in the order most recruitments use them.',
    publishedAt: '2026-06-10',
    updatedAt: '2026-08-29',
    tags: ['PET', 'Document verification', 'Medical', 'Skill test'],
    content: `
<h2>Know which extra stage your post actually has</h2>
<p>A tax assistant, a constable, a junior engineer, and a court stenographer do not share the same second stage. Police and capf posts usually add physical standard and efficiency tests. Ministerial posts may add typing. Technical posts may add a trade test. Almost every post adds document verification. Medical rules are strictest where the job is physical or safety-critical. Read the selection-process line on the advertisement, then train for that line rather than for a generic “government exam” story.</p>
<h2>Physical standard is a measurement; physical efficiency is a performance</h2>
<p>Height, chest, and vision are measured against a table. Running, long jump, or a beam test is a performance with a time or a distance. Failing either can end the process even with a high written rank. If you are targeting those posts, start measured practice months before the result, not after the call letter. Wear the shoes you will use on the test ground at least once in training.</p>
<h2>Document verification is a comparison, not a conversation</h2>
<p>The board compares your originals with the data you typed. Name, date of birth, category, qualification date, and photograph must match. Carry the originals, a set of self-attested copies, and extra photographs in the order the call letter lists. A missing page of a mark sheet is enough to mark you absent. Do not argue from a screenshot of this website; the board will not treat it as a record.</p>
<h2>Medical examinations follow the force or department’s own circular</h2>
<p>Colour vision, hearing, knock knees, tattoos, and surgery history are assessed against that circular, not against a social-media list. If you have a known condition, read the official medical standard before you pay for a long physical-training programme. Appeals, where they exist, have a short window and a named medical board.</p>
<p>When Sarkari Job Hub publishes a result or admit-card update for a later stage, use it to find the official call-letter link. Then follow that letter. The letter is the document that will be checked at the gate.</p>
`,
  }),
];
