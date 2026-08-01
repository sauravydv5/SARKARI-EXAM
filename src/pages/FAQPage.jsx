// FAQ Component with Schema
import { useEffect } from 'react';
import useSeo from '../hooks/useSeo';
import { generateFAQSchema } from '../utils/schemaGenerator';

const FAQS = [
  {
    question: 'What is Sarkari Job Hub?',
    answer: 'Sarkari Job Hub is India\'s leading government job portal providing latest job notifications, exam results, admit cards, answer keys and syllabus updates for government jobs across SSC, Railway, Banking, UPSC and other recruitment boards.',
  },
  {
    question: 'How do I get latest job alerts?',
    answer: 'You can browse our Latest Jobs section, use the search functionality, or subscribe to job alerts for your preferred categories like SSC, Railway, Banking, etc.',
  },
  {
    question: 'Are these government job notifications official?',
    answer: 'Yes, all notifications on Sarkari Job Hub are collected from official government websites. However, we recommend always verifying details on the official government website before applying.',
  },
  {
    question: 'How often is the content updated?',
    answer: 'We update our portal daily with the latest job notifications, exam results, admit cards and other government job updates.',
  },
  {
    question: 'Can I download admit cards from this portal?',
    answer: 'We provide download links to official admit cards from the respective recruitment boards. Click on the Admit Card section to find your exam\'s admit card download link.',
  },
  {
    question: 'Which government exams does Sarkari Job Hub cover?',
    answer: 'We cover major government exams including SSC, Railway RRB, UPSC, Banking (SBI, RBI, IBPS), Staff Selection Commission, Postal Services, Insurance and many state-level government exams.',
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
      'Get answers to frequently asked questions about government jobs, admit cards, results, exam notifications and how to use Sarkari Job Hub portal.',
    url: 'https://sarkarijobhud.website/faq',
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
          Email us at <strong>support@sarkarijobhud.website</strong>
        </p>
      </div>
    </div>
  );
}
