import useSeo from '../hooks/useSeo';

export default function Disclaimer() {
  useSeo({
    title: 'Disclaimer',
    description: 'Important disclaimer explaining that Sarkari Job Hub is an independent information website and not an official government portal.',
    url: 'https://sarkarijobhub.website/disclaimer',
    keywords: 'Sarkari Job Hub disclaimer, unofficial government job website, verify official notification',
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/40 sm:p-9">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">Important information</p>
        <h1 className="text-3xl font-extrabold text-amber-950 dark:text-amber-100 sm:text-4xl">Disclaimer</h1>
        <p className="mt-4 text-base leading-8 text-amber-900 dark:text-amber-200">Please read this notice before relying on any recruitment, result, admit-card, or examination summary published on Sarkari Job Hub.</p>
      </header>

      <article className="space-y-8 text-base leading-8 text-slate-700 dark:text-slate-300">
        <section aria-labelledby="independent-heading" className="rounded-xl border-l-4 border-red-600 bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8">
          <h2 id="independent-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">1. Independent website</h2>
          <p>Sarkari Job Hub is an independent informational website. It is <strong>not an official government website</strong>, government department, recruitment board, examination authority, university, bank, or public-sector employer. We are not affiliated with, sponsored by, or authorized to speak on behalf of the Staff Selection Commission, Union Public Service Commission, Railway Recruitment Boards, state commissions, ministries, universities, or any other authority mentioned in our content.</p>
        </section>
        <section aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">2. How information is prepared</h2>
          <p>Our editors compile summaries from official notifications, notices, websites, press releases, and public examination material. We organize those details to make them easier to read and may add general explanations about eligibility, documents, application steps, or selection stages. A summary is not a replacement for the original notice. Official authorities can correct, extend, withdraw, or change information after a page has been published.</p>
        </section>
        <section aria-labelledby="verify-heading">
          <h2 id="verify-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">3. Verify before taking action</h2>
          <p>Always verify the latest details on the official portal before registering, paying a fee, choosing a post, travelling to an examination centre, downloading a document, or making a career decision. Check the original notification for the exact vacancy count, application deadline, time zone, age cut-off, qualification, reservation rule, fee, syllabus, exam pattern, document format, correction window, and selection conditions. Use only the official application and payment link. Do not treat a search result, advertisement, social-media post, or third-party message as proof of an official update.</p>
        </section>
        <section aria-labelledby="responsibility-heading">
          <h2 id="responsibility-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">4. No guarantee of outcome</h2>
          <p>Publishing a notification does not guarantee that an application will be accepted or that a candidate will receive an admit card, pass an examination, appear in a merit list, or receive an appointment. Sarkari Job Hub does not accept applications, process payments, issue certificates, conduct examinations, publish official results, or influence selection. Decisions about eligibility, shortlisting, evaluation, reservation, appointment, and document verification belong exclusively to the relevant authority.</p>
        </section>
        <section aria-labelledby="links-heading">
          <h2 id="links-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">5. Links, errors, and availability</h2>
          <p>We provide links to official portals for convenience, but external websites operate independently and may have different terms, security practices, or availability. We work to correct outdated links and factual errors when they are brought to our attention, but we cannot promise that every page will always be complete, current, uninterrupted, or error-free. A technical problem on an official portal should be reported to that portal's support team.</p>
        </section>
        <section aria-labelledby="acceptance-heading">
          <h2 id="acceptance-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">6. Using this website</h2>
          <p>By using Sarkari Job Hub, you understand that its content is provided for general information and educational guidance. You remain responsible for checking primary sources and making your own decisions. If you find a significant discrepancy, please contact us with the page URL and the official reference so our team can review the information.</p>
        </section>
      </article>
    </main>
  );
}
