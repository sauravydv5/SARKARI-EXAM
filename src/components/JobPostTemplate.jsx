const DEFAULT_FAQS = [
  {
    question: 'Who can apply for this recruitment?',
    answer: 'Candidates who meet the educational qualification, age limit, nationality conditions, and any post-specific requirements in the official notification can apply. Always check the post-wise eligibility before submitting the form.',
  },
  {
    question: 'What documents are usually needed?',
    answer: 'Applicants commonly need an identity document, educational certificates, a recent photograph, a signature, and category or disability certificates where applicable. The official notification controls the accepted formats and sizes.',
  },
  {
    question: 'How can I check the application status?',
    answer: 'Open the official recruitment portal, sign in with the registration details provided during application, and use its application-status or candidate-login option. This template does not replace the authority portal.',
  },
  {
    question: 'Where will the admit card or result be published?',
    answer: 'The recruiting organization normally publishes admit cards, answer keys, results, and cutoffs on its official website or candidate portal. Use the official link supplied in this post and verify the notice date.',
  },
  {
    question: 'Can the dates or vacancies change?',
    answer: 'Yes. A recruiting authority may revise dates, vacancies, eligibility rules, or instructions through a corrigendum or fresh notice. Check the latest official update before taking action.',
  },
];

const EMPTY_VALUE = 'As mentioned in the official notification';

function valueOrFallback(value, fallback = EMPTY_VALUE) {
  if (value === 0) return '0';
  if (value === null || value === undefined || String(value).trim() === '') return fallback;
  return String(value);
}

function renderCategoryBreakdown(breakdown) {
  if (Array.isArray(breakdown)) {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {breakdown.map((item, index) => (
          <li key={`${item.category || item.label || index}-${index}`}>
            {typeof item === 'object' ? `${item.category || item.label}: ${valueOrFallback(item.posts ?? item.total)}` : item}
          </li>
        ))}
      </ul>
    );
  }

  if (breakdown && typeof breakdown === 'object') {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {Object.entries(breakdown).map(([category, posts]) => (
          <li key={category}>{category}: {valueOrFallback(posts)}</li>
        ))}
      </ul>
    );
  }

  return valueOrFallback(breakdown);
}

function DataTable({ caption, headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-bold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {rows.map((row, index) => (
            <tr key={`${row[0] || index}-${index}`} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/70">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top leading-6 text-slate-700 dark:text-slate-300">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function JobPostTemplate({
  title = 'Government Job / Result Update',
  organization = '',
  postType = 'Government Recruitment',
  shortOverview = '',
  importantDates = {},
  vacancyDetails = {},
  eligibility = {},
  selectionProcess = [],
  howToApply = [],
  previousYearCutoff = [],
  faqs = DEFAULT_FAQS,
  officialLink = '',
  officialLinkLabel = 'Visit Official Website',
}) {
  const dateRows = [
    ['Notification date', importantDates.notificationDate],
    ['Application start date', importantDates.applicationStart || importantDates.startDate],
    ['Application end date', importantDates.applicationEnd || importantDates.lastDate],
    ['Exam date', importantDates.examDate],
    ['Result date', importantDates.resultDate],
  ];
  const vacancyRows = Array.isArray(vacancyDetails.posts)
    ? vacancyDetails.posts.map((post) => [post.postName || post.name, valueOrFallback(post.totalPosts ?? post.total), renderCategoryBreakdown(post.categoryWise)])
    : [[
        valueOrFallback(vacancyDetails.postName || vacancyDetails.name),
        valueOrFallback(vacancyDetails.totalPosts ?? vacancyDetails.total),
        renderCategoryBreakdown(vacancyDetails.categoryWise || vacancyDetails.categoryBreakdown),
      ]];
  const selectionSteps = Array.isArray(selectionProcess) ? selectionProcess : [];
  const applicationSteps = Array.isArray(howToApply) ? howToApply : [];
  const cutoffRows = Array.isArray(previousYearCutoff)
    ? previousYearCutoff.map((row) => [row.year, row.category, valueOrFallback(row.cutoff ?? row.marks)])
    : [];
  const faqItems = faqs?.length ? faqs : DEFAULT_FAQS;

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 text-slate-800 dark:text-slate-200 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-2xl bg-gradient-to-br from-red-800 to-red-600 px-6 py-8 text-white shadow-lg sm:px-10">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-100">{postType}</p>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
        {organization && <p className="mt-3 text-red-50">Published by {organization}</p>}
      </header>

      <section aria-labelledby="short-overview" className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h2 id="short-overview" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">1. Short Overview</h2>
        <p className="leading-8">{valueOrFallback(shortOverview, 'Read the official notice for the latest details about this update.')}</p>
      </section>

      <section aria-labelledby="important-dates" className="mb-8">
        <h2 id="important-dates" className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">2. Important Dates</h2>
        <DataTable
          caption="Important dates for this government job or result update"
          headers={['Event', 'Date']}
          rows={dateRows.map(([event, date]) => [event, valueOrFallback(date)])}
        />
      </section>

      <section aria-labelledby="vacancy-details" className="mb-8">
        <h2 id="vacancy-details" className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">3. Vacancy Details</h2>
        <DataTable caption="Post and vacancy details" headers={['Post name', 'Total posts', 'Category-wise breakdown']} rows={vacancyRows} />
      </section>

      <section aria-labelledby="eligibility-criteria" className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h2 id="eligibility-criteria" className="mb-5 text-2xl font-bold text-slate-900 dark:text-white">4. Eligibility Criteria</h2>
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="font-bold text-red-700 dark:text-red-300">Education qualification</dt>
            <dd className="mt-1 leading-7">{valueOrFallback(eligibility.educationQualification || eligibility.qualification)}</dd>
          </div>
          <div>
            <dt className="font-bold text-red-700 dark:text-red-300">Age limit</dt>
            <dd className="mt-1 leading-7">{valueOrFallback(eligibility.ageLimit)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-bold text-red-700 dark:text-red-300">Age relaxation and other rules</dt>
            <dd className="mt-1 leading-7">{valueOrFallback(eligibility.ageRelaxation || eligibility.relaxationRules)}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="selection-process" className="mb-8">
        <h2 id="selection-process" className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">5. Selection Process</h2>
        <ol className="space-y-4">
          {selectionSteps.map((step, index) => {
            const name = typeof step === 'object' ? step.stage || step.title : step;
            const explanation = typeof step === 'object' ? step.description || step.details : '';
            return (
              <li key={`${name}-${index}`} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-700 font-bold text-white">{index + 1}</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{name}</h3>
                  <p className="mt-1 leading-7 text-slate-600 dark:text-slate-300">{explanation || 'Candidates who qualify this stage move forward according to the official recruitment rules.'}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="apply-or-result" className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h2 id="apply-or-result" className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">6. How to Check Result / Apply</h2>
        <ol className="list-decimal space-y-3 pl-6 leading-7 marker:font-bold marker:text-red-700">
          {applicationSteps.map((step, index) => (
            <li key={`${step}-${index}`}>{typeof step === 'object' ? <><strong>{step.title}</strong>{step.description && `: ${step.description}`}</> : step}</li>
          ))}
        </ol>
      </section>

      {cutoffRows.length > 0 && (
        <section aria-labelledby="previous-cutoff" className="mb-8">
          <h2 id="previous-cutoff" className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">7. Previous Year Cutoff</h2>
          <DataTable caption="Previous year cutoff marks" headers={['Year', 'Category', 'Cutoff']} rows={cutoffRows} />
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Previous cutoffs are provided for reference only. They can vary with vacancies, difficulty, normalization, category, and candidate performance.</p>
        </section>
      )}

      <section aria-labelledby="faqs" className="mb-8">
        <h2 id="faqs" className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">8. FAQs</h2>
        <div className="space-y-3">
          {faqItems.map((faq, index) => (
            <details key={`${faq.question}-${index}`} className="group rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 marker:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-white">
                <span className="flex items-center justify-between gap-4">{faq.question}<span aria-hidden="true" className="text-xl text-red-700 transition-transform group-open:rotate-45">+</span></span>
              </summary>
              <p className="border-t border-slate-200 px-5 py-4 leading-7 text-slate-600 dark:border-slate-700 dark:text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {officialLink && (
        <section aria-labelledby="official-link" className="rounded-xl bg-slate-900 p-6 text-center dark:bg-slate-800 sm:p-8">
          <h2 id="official-link" className="mb-4 text-2xl font-bold text-white">9. Official Link</h2>
          <a href={officialLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-red-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-slate-900">
            {officialLinkLabel}
          </a>
          <p className="mt-4 text-sm leading-6 text-slate-300">Verify the latest notification and complete applications or result checks only on the official portal.</p>
        </section>
      )}
    </article>
  );
}
