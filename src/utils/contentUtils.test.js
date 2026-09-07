import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPostGuide, buildReadingTime, toSlug } from './contentUtils.js';

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

  assert.equal(guide.sections.length >= 4, true);
  assert.equal(guide.faqItems.length >= 4, true);
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
  assert.doesNotMatch(guide.overview, /see official notice|check official notification|as published in the official notification/i);
});
