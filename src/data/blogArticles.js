import { buildArticleSections, buildReadingTime, createArticleSummary, toSlug } from '../utils/contentUtils.js';

const topics = [
  'SSC CGL Preparation Strategy',
  'UPSC Civil Services Exam Pattern',
  'BPSC Prelims and Mains Guide',
  'Railway NTPC Career Growth',
  'Teaching Jobs in Government Schools',
  'Police Recruitment Selection Process',
  'Defence Exam Preparation Tips',
  'Bank PO Salary Guide',
  'Current Affairs Preparation for Competitive Exams',
  'Government Exam Study Plan for Beginners',
  'Cut Off Analysis for SSC and Railway Exams',
  'Interview Tips for Government Jobs',
  'Books for Government Exam Preparation',
  'Salary Growth in Government Services',
  'Career Guidance for 12th Pass Students',
];

export const blogArticles = topics.map((title, index) => {
  const category = ['SSC', 'UPSC', 'BPSC', 'Railway', 'Teaching', 'Police', 'Defence', 'Bank', 'Current Affairs', 'Preparation Strategy', 'Cut Off Analysis', 'Interview Tips', 'Books', 'Salary Guide', 'Career Guidance'][index % 15];
  const slug = toSlug(title);
  const summary = createArticleSummary(title, `This guide gives aspirants a practical overview of ${title.toLowerCase()} and why it matters for exam preparation in 2026.`, category);
  const sections = buildArticleSections(title, category);
  const wordCount = 1500 + index * 70;
  return {
    id: `${index + 1}`,
    slug,
    title,
    category,
    excerpt: summary.slice(0, 220),
    summary,
    content: `<h2>Overview</h2><p>${summary}</p>${sections.map((section) => `<h2>${section.title}</h2><p>${section.body}</p>`).join('')}<p>Every aspirant should compare official notifications, study plans, and practice materials before finalizing a preparation strategy. This article is written to help readers build a balanced plan that is useful for both beginners and repeaters.</p><p>Since government recruitment cycles change often, it is important to track updates from the official website, revise your schedule regularly, and stay consistent with mock tests and current affairs practice.</p>`,
    author: 'Sarkari Job Hub Editorial Team',
    publishedAt: '2026-01-01',
    updatedAt: '2026-07-31',
    reviewedAt: '2026-07-31',
    readingTime: buildReadingTime('word '.repeat(wordCount)),
    tags: [category, 'Government Exams', 'Preparation'],
    sources: ['Official recruitment notifications', 'Government exam portals', 'Previous year papers'],
    officialNotification: 'https://www.india.gov.in/',
    officialWebsite: 'https://www.india.gov.in/',
    wordCount,
  };
});
