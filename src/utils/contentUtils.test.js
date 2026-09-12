import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDynamicArticle, buildPostGuide, buildReadingTime, dedupeFacts, detectContentType, toSlug } from './contentUtils.js';

test('toSlug formats titles into stable URL slugs', () => {
  assert.equal(toSlug('SSC CGL Preparation Strategy 2026'), 'ssc-cgl-preparation-strategy-2026');
  assert.equal(toSlug('  UPSC Civil Services  '), 'upsc-civil-services');
});

test('buildReadingTime returns a rounded estimate', () => {
  assert.equal(buildReadingTime('word '.repeat(1200)), '7 min read');
  assert.equal(buildReadingTime('word '.repeat(400)), '2 min read');
});

test('buildPostGuide creates structured guidance for job detail pages', () => {
  const guide = buildPostGuide({
    title: 'SSC CGL 2026 Notification',
    qualification: 'Graduate',
    ageLimit: '18 to 30 years',
    salary: 'Level 7 pay matrix',
    totalVacancies: 12000,
    selectionProcess: 'Computer-based test and document verification',
    shortDescription: 'Recruitment for multi-tasking staff',
  }, 'Latest Jobs');

  assert.equal(guide.sections.length, 0);
  assert.equal(guide.faqItems.length, 0);
  assert.match(guide.overview, /SSC CGL 2026 Notification/i);
});

test('buildPostGuide avoids placeholder wording when specific vacancy and eligibility data is present', () => {
  const guide = buildPostGuide({
    title: 'Bihar Police CSBC Constable GD Result 2026',
    organization: 'CSBC Bihar',
    postName: 'Constable (General Duty)',
    totalVacancies: 19838,
    qualification: '12th Pass',
    ageLimit: '18 to 25 years',
    applicationFee: '₹ 400 to ₹ 700',
    selectionProcess: 'Written exam, physical test and document verification',
    shortDescription: 'Bihar Police recruitment result and next-stage details.',
    importantDates: {
      resultDate: '12 September 2026',
      examDate: '21 August 2026',
      lastDate: '12 August 2026',
    },
  }, 'Results');

  assert.match(guide.overview, /19,838|19838/i);
  assert.match(guide.overview, /12th Pass/i);
  assert.doesNotMatch(guide.overview, /\|\|/i);
});

test('buildPostGuide avoids generic filler overview copy and department-style action sentences', () => {
  const guide = buildPostGuide({
    title: 'UPSSSC Excise Constable Exam City 2026',
    organization: 'UPSSSC',
    department: 'Uttar Pradesh Subordinate Service Selection Commission',
    postName: 'Excise Constable',
    shortDescription: 'Exam city details have been published for the written examination.',
    importantDates: {
      examCityDate: '22 September 2026',
      examDate: '10 October 2026',
    },
  }, 'Admit Card');

  assert.doesNotMatch(guide.overview, /use this page to understand the notice in plain language/i);
  assert.doesNotMatch(guide.overview, /recruiting department|department behind|department usually defines|current affairs|revision|previous year papers/i);
});

test('buildPostGuide omits notice placeholders as unavailable data', () => {
  const guide = buildPostGuide({
    title: 'Example Result 2026',
    organization: 'Example Authority',
    totalVacancies: 'See official notice',
    qualification: 'Check official notification',
    ageLimit: 'As published in the official notification',
    shortDescription: 'Result update with confirmed result date.',
  }, 'Results');

  assert.doesNotMatch(guide.overview, /see official notice|check official notification|as published in the official notification/i);
});

test('detectContentType keeps result pages as results when historical exam-city text is present', () => {
  assert.equal(detectContentType({
    category: 'result',
    title: 'UPSSSC Lekhpal Mains Result 2026',
    content: 'The exam city details were published before the examination.',
  }), 'result');
});

test('buildDynamicArticle does not add generic template sections without a type-specific source block', () => {
  const article = buildDynamicArticle({
    title: 'UPSC EPFO APFC Online Form 2026',
    postName: 'APFC / EPFO',
    organization: 'UPSC',
    postType: 'recruitment',
    shortDescription: 'Recruitment update for APFC / EPFO posts through UPSC.',
  }, {});

  assert.equal(article.type, 'recruitment');
  assert.doesNotMatch(article.sections.map((section) => section.heading).join(' '), /Preparation Tips|Recruitment Overview|About Department|Generic Eligibility|Generic Selection Process|Generic Documents|Generic FAQ|Complete Information|Who should apply|Important mistake to avoid|What happens next/i);
});

test('buildDynamicArticle keeps sections that are specific to the article type', () => {
  const article = buildDynamicArticle({
    title: 'UPSSSC Lekhpal Mains Result 2026',
    category: 'result',
    postName: 'Lekhpal',
    organization: 'UPSSSC',
    statusNote: 'Released',
    importantDates: { resultDate: '11 September 2026' },
    links: { checkResult: 'https://example.com/result' },
  }, {});

  assert.ok(article.sections.some((section) => section.heading === 'Result Status'));
  assert.doesNotMatch(article.sections.map((section) => section.heading).join(' '), /Preparation Tips|About Department|Complete Information/i);
});

test('buildDynamicArticle orders admit-card sections by candidate workflow and skips unavailable sections', () => {
  const article = buildDynamicArticle({
    title: 'Example Admit Card 2026',
    category: 'admit-card',
    statusNote: 'Released',
    importantDates: { examDate: '20 September 2026', admitCardDate: '15 September 2026' },
    documentsRequired: 'Printed admit card and photo ID',
    links: { downloadAdmitCard: 'https://example.com/admit-card', officialWebsite: 'https://example.com' },
  }, {});

  assert.deepEqual(article.sections.map((section) => section.heading), [
    'Status',
    'Exam Date',
    'Download Process',
    'Documents',
    'Instructions',
  ]);
});

test('buildDynamicArticle turns expired recruitment source facts into a closed-application editorial section with internal next-stage advice', () => {
  const article = buildDynamicArticle({
    title: 'UPSC EPFO APFC Online Form 2026',
    postName: 'APFC / EPFO',
    organization: 'UPSC',
    postType: 'recruitment',
    statusNote: 'Closed',
    importantDates: {
      lastDate: '15 September 2026',
      examDate: '20 October 2026',
      resultDate: 'December 2026',
    },
    links: {
      officialNotification: 'https://example.com/notice',
      officialWebsite: 'https://example.com',
    },
  }, {});

  assert.ok(article.sections.some((section) => section.heading === 'Application Status: Closed'));
  const closed = article.sections.find((section) => section.heading === 'Application Status: Closed');
  assert.match(closed.body, /Last date: 15 September 2026/i);
  assert.match(closed.body, /admit card\/result/i);
});

test('buildPostGuide renders only up to five valid source FAQs', () => {
  const guide = buildPostGuide({
    title: 'Example Update',
    faqs: [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' },
      { question: 'Q3', answer: 'A3' },
      { question: 'Q4', answer: 'A4' },
      { question: 'Q5', answer: 'A5' },
      { question: 'Q6', answer: 'A6' },
      { question: '', answer: 'invalid' },
    ],
  });

  assert.deepEqual(guide.faqItems.map((faq) => faq.question), ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']);
});

test('dedupeFacts suppresses duplicate recruitment facts across sections while keeping unique entries', () => {
  const items = [
    { key: 'totalVacancy', value: '225 Posts' },
    { key: 'totalVacancy', value: '225 vacancies' },
    { key: 'qualification', value: 'Graduation' },
    { key: 'qualification', value: 'Graduation required' },
    { key: 'ageLimit', value: '18 to 30 years' },
    { key: 'selectionProcess', value: 'Written exam + interview' },
    { key: 'selectionProcess', value: 'Written exam + interview' },
    { key: 'documentsRequired', value: 'Photo, signatures, educational certificate' },
  ];

  const unique = dedupeFacts(items);

  assert.deepEqual(unique.map((item) => item.key), [
    'totalVacancy',
    'qualification',
    'ageLimit',
    'selectionProcess',
    'documentsRequired',
  ]);
});
