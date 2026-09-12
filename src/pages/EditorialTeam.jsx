import useSeo from '../hooks/useSeo';
import { Link } from 'react-router-dom';

export default function EditorialTeamPage() {
  useSeo({
    title: 'Editorial Team',
    description: 'Learn how Sarkari Job Hub verifies official government job, result, admit-card, answer-key, syllabus and admission information.',
    url: 'https://sarkarijobhub.website/editorial-team',
    keywords: 'Sarkari Job Hub editorial process, source verification, official sources, correction policy',
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-2xl bg-gradient-to-br from-red-800 to-red-600 px-6 py-10 text-white shadow-lg sm:px-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-100">Sarkari Job Hub</p>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">Editorial Team & Verification Process</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-red-50">
          Sarkari Job Hub publishes clear public information about government jobs and exam updates by using official source material and a transparent editorial process.
        </p>
      </header>

      <div className="space-y-8 text-base leading-8 text-slate-700 dark:text-slate-300">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Editorial process</h2>
          <p>
            Every update begins with an official recruitment notice, vacancy announcement, result, admit-card page, answer-key page, exam schedule, syllabus PDF, or official authority website. Our team checks the source, collects the relevant facts, and writes the page in a consistent, readable way. We organize the information around the facts that matter most to a candidate: organization, post or exam name, vacancy, qualification, age, fees, dates, documents, selection process and official links.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Source verification</h2>
          <p>
            Sarkari Job Hub uses official sources as the first authority. A source may be the official notification PDF, the recruitment board website, the result portal, the syllabus PDF, the admit-card page, or the application website. We compare the source title, body text, dates, fee details, age limit, post name, qualification, and service link before placing the update on the website. If a detail is not confirmed, we avoid adding a stronger claim than the notice supports.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Correction and update process</h2>
          <p>
            When an official authority changes a vacancy count, deadline, exam date, eligibility, fee, correction window, admit-card link, answer-key page, or result date, the affected page is corrected or archived. If a user reports a broken link or a date mismatch, we review the linked source and update the article where the official material clearly supports the change. We also keep a visible difference between a confirmed official notice and a provisional update.
          </p>
          <p className="mt-4">
            Readers can send a correction using the <Link to="/contact" className="text-red-700 underline">Contact Us</Link> page with the page URL and official reference. We review correction messages and update information only when a credible source supports the claim.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">What we do not do</h2>
          <p>
            Sarkari Job Hub is not an official government portal. The site does not accept applications, process payments, issue admit cards, publish final selections, or decide results. We summarize and organize official information and point readers back to the proper authority portal before they apply, pay fees, or report an exam-related issue.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-red-600 bg-slate-50 p-6 dark:bg-slate-800 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Trust standard</h2>
          <p>
            The goal of the editorial process is simple: publish official information in a clean format, make the source visible, explain the next step clearly, and keep correction or update history honest. Every page should help a candidate understand the notice without misrepresenting the authority or replacing the official website.
          </p>
        </section>
      </div>
    </main>
  );
}
