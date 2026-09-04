import useSeo from '../hooks/useSeo';

const focusAreas = [
  {
    title: 'Recruitment updates',
    text: 'We summarize new government job notifications, application windows, vacancies, qualifications, age rules, fees, and selection stages so readers can decide whether a notice deserves their time.',
  },
  {
    title: 'Exam progress',
    text: 'We organize admit cards, exam dates, answer keys, results, cut-offs, and related notices in clear categories so candidates can find the next useful update without searching several sites.',
  },
  {
    title: 'Practical guidance',
    text: 'Our explainers turn official instructions into readable checklists. They help candidates prepare documents, understand deadlines, and avoid common application mistakes.',
  },
];

export default function AboutUs() {
  useSeo({
    title: 'About Us',
    description: 'Learn how Sarkari Job Hub helps Indian candidates follow government job notifications, results, admit cards, and exam updates.',
    url: 'https://sarkarijobhub.website/about-us',
    keywords: 'about Sarkari Job Hub, government job updates, sarkari result portal',
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-2xl bg-gradient-to-br from-red-800 to-red-600 px-6 py-10 text-white shadow-lg sm:px-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-100">About Sarkari Job Hub</p>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">Clear government job information for people building a public-service career.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-red-50">Sarkari Job Hub is an independent information website for Indian job seekers who need timely, understandable, and carefully organized updates.</p>
      </header>

      <div className="space-y-8 text-base leading-8 text-slate-700 dark:text-slate-300">
        <section aria-labelledby="mission-heading" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 id="mission-heading" className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Our mission</h2>
          <p>Government recruitment information is often spread across commission websites, department notices, examination portals, and PDF documents. A candidate may have to compare a notification with a correction notice, remember several dates, and locate a separate admit-card or result link. Our mission is to make that process less confusing without pretending to replace the authority that issued the notice.</p>
          <p className="mt-4">We collect and organize information from official sources, explain the important parts in plain language, and direct readers back to the relevant official portal before they take action. The goal is not simply to publish more alerts. It is to help a candidate understand what an update means, what they need to check, and what should happen next.</p>
        </section>

        <section aria-labelledby="coverage-heading">
          <h2 id="coverage-heading" className="mb-5 text-2xl font-bold text-slate-900 dark:text-white">What we cover</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {focusAreas.map((area) => (
              <article key={area.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-3 text-lg font-bold text-red-700 dark:text-red-300">{area.title}</h3>
                <p>{area.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="editorial-heading" className="rounded-xl border-l-4 border-red-600 bg-slate-100 p-6 dark:bg-slate-800 sm:p-8">
          <h2 id="editorial-heading" className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Our editorial approach</h2>
          <p>Each update is written for a reader who may be checking a phone between work, study, or family responsibilities. We lead with the details that affect a decision: the recruiting organization, post or examination name, important dates, qualification, age limit, fee, selection process, and official links. When a detail is provisional, post-specific, or awaiting confirmation, we say so rather than presenting an estimate as a guarantee.</p>
          <p className="mt-4">Accuracy matters, but so does context. A date alone is not enough if an application also requires a registration step, a certificate format, or a separate fee deadline. We aim to include those practical distinctions and revise pages when an official authority issues a meaningful correction.</p>
        </section>

        <section aria-labelledby="reader-heading">
          <h2 id="reader-heading" className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">A useful starting point, not a government office</h2>
          <p>Sarkari Job Hub does not recruit candidates, accept applications, issue admit cards, publish results, or decide eligibility. We provide an easier route to information. Applications, payments, corrections, certificates, and complaints must always be completed through the official portal named in the relevant notice.</p>
          <p className="mt-4">We welcome corrections and specific feedback that can improve a page. For contact details, visit our Contact Us page. For the limits of our responsibility and the need to verify every notice, read the Disclaimer before relying on any summary.</p>
        </section>
      </div>
    </main>
  );
}
