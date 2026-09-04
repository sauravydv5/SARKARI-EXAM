import useSeo from '../hooks/useSeo';

export default function PrivacyPolicy() {
  useSeo({
    title: 'Privacy Policy',
    description: 'Read the Sarkari Job Hub privacy policy covering cookies, Google Analytics, Google AdSense, and contact information.',
    url: 'https://sarkarijobhub.website/privacy-policy',
    keywords: 'Sarkari Job Hub privacy policy, cookies, Google AdSense, Google Analytics',
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-700 dark:text-red-300">Sarkari Job Hub</p>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">This policy explains what information may be collected when you use sarkarijobhub.website and how it is used.</p>
      </header>

      <article className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 text-base leading-8 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:p-9">
        <section aria-labelledby="scope-heading">
          <h2 id="scope-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">1. Scope of this policy</h2>
          <p>Sarkari Job Hub is an informational website that publishes government job, result, admit-card, answer-key, syllabus, admission, and examination guidance. This policy applies to information collected through our pages, contact forms, analytics tools, and advertising services. By browsing the site, you acknowledge the practices described here. This policy does not control the privacy practices of government portals or any external website reached through one of our links.</p>
        </section>
        <section aria-labelledby="collect-heading">
          <h2 id="collect-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">2. Information we may collect</h2>
          <p>We may receive basic technical information such as an IP address, browser type, device category, operating system, referring page, pages viewed, approximate location, and the time of a visit. This information is generally collected in aggregated or pseudonymous form to understand site performance and readership. If you contact us, we may receive your name, email address, message, and any information you choose to include. We ask visitors not to submit passwords, one-time passwords, payment details, government identification numbers, or unnecessary personal records.</p>
        </section>
        <section aria-labelledby="cookies-heading">
          <h2 id="cookies-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">3. Cookies and local storage</h2>
          <p>Cookies are small text files stored by a browser. Sarkari Job Hub and its service providers may use cookies or similar technologies to remember preferences, measure traffic, maintain security, and understand which pages are useful. The site may also use browser storage for settings such as display preferences. You can delete or block cookies through your browser controls, although some features or preferences may not work as expected.</p>
        </section>
        <section aria-labelledby="analytics-heading">
          <h2 id="analytics-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">4. Google Analytics</h2>
          <p>We may use Google Analytics to measure visits, page engagement, device information, and broad audience patterns. Google Analytics can use cookies and may process information according to Google's own privacy terms. Analytics helps us identify broken pages, understand navigation, and improve editorial usefulness; it is not used by us to ask for sensitive identity documents. Where controls are available, visitors can manage cookies or use browser and Google privacy settings to limit analytics collection.</p>
        </section>
        <section aria-labelledby="ads-heading">
          <h2 id="ads-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">5. Google AdSense and third-party advertising</h2>
          <p>We may display advertisements through Google AdSense and other advertising partners. Third-party vendors, including Google, may use cookies to show ads based on a user's visit to this site or other websites. Advertising cookies may help measure an ad's performance and provide more relevant advertising. We do not control every cookie, tracker, privacy policy, or data practice used by an advertiser. You can review Google's advertising settings and your browser controls to manage personalized ads. An advertisement does not represent an endorsement by Sarkari Job Hub.</p>
        </section>
        <section aria-labelledby="use-heading">
          <h2 id="use-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">6. Use, sharing, and retention</h2>
          <p>We use collected information to operate the website, reply to messages, diagnose technical issues, prevent abuse, understand readership, and improve content. We do not sell contact information. We may share limited information with hosting, analytics, security, email, or advertising providers when necessary to provide those services, or when required by law. Contact messages are retained only as long as reasonably needed to respond, keep records, resolve disputes, or meet legal obligations.</p>
        </section>
        <section aria-labelledby="choices-heading">
          <h2 id="choices-heading" className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">7. Your choices and updates</h2>
          <p>You may choose not to submit information through the contact form and may manage cookies through your browser. You can request clarification about a message you sent by contacting support@sarkarijobhub.website. We may update this policy when the site, advertising, analytics, or legal requirements change. The revised version will be posted on this page with an updated effective date. Please check this page periodically.</p>
        </section>
      </article>
    </main>
  );
}
