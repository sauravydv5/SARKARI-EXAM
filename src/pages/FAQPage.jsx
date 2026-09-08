// FAQ Component with Schema
import { useEffect } from 'react';
import useSeo from '../hooks/useSeo';
import { generateFAQSchema } from '../utils/schemaGenerator';

const FAQS = [
  {
    question: 'What is Sarkari Job Hub?',
    answer: 'Sarkari Job Hub is an independent information website that organizes government job notifications, results, admit cards, answer keys, syllabi, admissions and exam guidance in one place.',
  },
  {
    question: 'How do I get latest job alerts?',
    answer: 'Browse the Latest Jobs section, use search by exam or qualification, and follow the available Telegram or WhatsApp channels for new update notifications.',
  },
  {
    question: 'Are these government job notifications official?',
    answer: 'Our summaries are prepared from public notices and official sources where available. The relevant recruiting authority notice is always final, so verify dates, eligibility, fees and instructions before applying.',
  },
  {
    question: 'How often is the content updated?',
    answer: 'The site is reviewed and updated regularly as new recruitment notices, corrections, exam dates, admit cards, answer keys and results are published.',
  },
  {
    question: 'Can I download admit cards from this portal?',
    answer: 'We provide download links to official admit cards from the respective recruitment boards. Click on the Admit Card section to find your exam\'s admit card download link.',
  },
  {
    question: 'Which government exams does Sarkari Job Hub cover?',
    answer: 'Coverage includes SSC, UPSC, Railway, banking, police, defence, teaching, healthcare, postal, insurance and state-level recruitment and admission updates.',
  },
  {
    question: 'Can I apply directly through Sarkari Job Hub?',
    answer: 'No. We provide information and links for convenience, but applications, payments, corrections and registrations must be completed on the official authority portal named in the notice.',
  },
  {
    question: 'What should I check before submitting an online form?',
    answer: 'Check the age cut-off date, qualification, reservation rules, photo and signature specifications, fee deadline, examination district choices and preview every field before final submission.',
  },
  {
    question: 'What documents are commonly needed for government applications?',
    answer: 'Requirements vary, but candidates commonly need a recent photograph, signature, identity proof, educational certificates, address details, category or disability certificates and payment information.',
  },
  {
    question: 'Where should I report a payment or login problem?',
    answer: 'Contact the recruitment authority through the helpdesk or contact details in its official notification. Sarkari Job Hub cannot access candidate accounts, reverse payments or change submitted forms.',
  },
  {
    question: 'How can I report an incorrect detail on a page?',
    answer: 'Use the Contact Us page and include the page URL, the incorrect detail and a link or reference to the official notice. Specific references help the editorial team review corrections quickly.',
  },
];

function setJsonLd(data, id = 'seo-jsonld') {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export default function FAQPage() {
  useEffect(() => {
    const schema = generateFAQSchema(FAQS);
    if (schema) setJsonLd(schema);
  }, []);

  useSeo({
    title: 'FAQ - Frequently Asked Questions about Sarkari Jobs',
    description:
      'Find practical answers about government jobs, online forms, official links, admit cards, results, documents and using Sarkari Job Hub.',
    url: 'https://sarkarijobhub.website/faq',
    keywords: 'FAQ, frequently asked questions, sarkari jobs, government jobs, help, support, how to',
  });

  return (
    <div className="faq-page">
      <div className="page-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about Sarkari Job Hub and government jobs.</p>
      </div>

      <div className="faq-container">
        {FAQS.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="faq-contact">
        <h2>Still have questions?</h2>
        <p>
          Email us at <strong>support@sarkarijobhub.website</strong>
        </p>
      </div>
    </div>
  );
}
