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

  assert.equal(guide.sections.length >= 5, true);
  assert.equal(guide.faqItems.length >= 4, true);
  assert.match(guide.overview, /SSC CGL 2026 Notification/i);
});
