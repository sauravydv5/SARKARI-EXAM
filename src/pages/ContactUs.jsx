import { useState } from 'react';
import useSeo from '../hooks/useSeo';

export default function ContactUs() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/.netlify/functions/send-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Could not send your message.');

      form.reset();
      setStatus({ type: 'success', message: 'Your query has been sent successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not send your message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  useSeo({
    title: 'Contact Us',
    description: 'Contact Sarkari Job Hub for corrections, feedback, questions, and website support.',
    url: 'https://sarkarijobhub.website/contact',
    keywords: 'contact Sarkari Job Hub, government job website support, correction request',
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-700">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-700 dark:text-red-300">Sarkari Job Hub Support</p>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Contact Us</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">Send a clear message about a correction, broken link, missing update, or question about using the website.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <section aria-labelledby="support-heading" className="space-y-5 text-base leading-8 text-slate-700 dark:text-slate-300">
          <h2 id="support-heading" className="text-2xl font-bold text-slate-900 dark:text-white">How we can help</h2>
          <p>Our support channel is intended for website feedback and editorial corrections. If a recruitment board changes a date, withdraws a vacancy, or publishes a revised notice, tell us which page is affected and include the official source whenever possible. A precise report helps us check the issue quickly.</p>
          <p>We can explain where an official link appears on our site, but we cannot accept an application, change a candidate's form, issue an admit card, alter a result, or guarantee selection. Those matters belong to the recruiting organization. Please contact that organization directly for account, payment, examination, or document-verification problems.</p>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
            <h3 className="font-bold text-red-900 dark:text-red-200">Support email</h3>
            <p className="mt-2 text-red-900 dark:text-red-100">support@sarkarijobhub.website</p>
            <p className="mt-2 text-sm leading-6 text-red-800 dark:text-red-200">Please do not send passwords, one-time passwords, payment card details, Aadhaar numbers, or other sensitive documents by email.</p>
          </div>
          <p>Messages are reviewed during normal support hours. Include the page title or URL, a short description of the problem, and the date you noticed it. We may ask one follow-up question if the report does not identify the relevant examination or recruitment.</p>
          <h2 className="pt-2 text-2xl font-bold text-slate-900 dark:text-white">Before you write</h2>
          <p>A useful message contains enough context for someone who did not see the issue firsthand. Mention the recruiting body, examination or post name, state if relevant, and whether the problem concerns a date, eligibility statement, vacancy figure, link, or spelling error. If you are reporting a changed deadline, include the title of the official notice and its publication date. Do not send a full application or identity document just to demonstrate a correction.</p>
          <p>For questions about a specific result, admit card, examination centre, payment reversal, login failure, or application status, the issuing authority is the correct first point of contact. We can link readers to that authority's portal, but we cannot access its candidate database or resolve an account issue from this website.</p>
          <p>Feedback about clarity is also welcome. Tell us which paragraph was difficult to understand and what a reader would need to know next. We use specific suggestions to improve headings, date labels, official-link placement, and the distinction between confirmed information and an expected update.</p>
        </section>

        <section aria-labelledby="form-heading" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 id="form-heading" className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Send a message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Name</label>
              <input id="contact-name" name="name" type="text" required autoComplete="name" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email address</label>
              <input id="contact-email" name="email" type="email" required autoComplete="email" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Subject</label>
              <input id="contact-subject" name="subject" type="text" required maxLength="160" autoComplete="off" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Message</label>
              <textarea id="contact-message" name="message" required maxLength="5000" rows="7" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </div>
            <input name="website" type="text" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hidden" />
            {status.message && <p role="status" className={status.type === 'success' ? 'text-sm font-semibold text-emerald-700' : 'text-sm font-semibold text-red-700'}>{status.message}</p>}
            <button type="submit" disabled={submitting} className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Sending…' : 'Send message'}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
