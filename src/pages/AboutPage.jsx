// About Page with SEO optimization
import useSeo from '../hooks/useSeo';

export default function AboutPage() {
  useSeo({
    title: 'About Sarkari Job Hub - India\\'s Leading Government Job Portal',
    description:
      'Learn about Sarkari Job Hub - the most trusted source for latest government jobs, exam updates, admit cards and results. Join lakhs of job seekers in India.',
    url: 'https://sarkarijobhud.website/about',
    keywords:
      'about sarkari job hub, government job portal, job notification, sarkari jobs, government exam, job alerts',
  });

  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About Sarkari Job Hub</h1>
        <p>India\\'s Most Trusted Government Job Portal</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            Sarkari Job Hub is India\\'s leading and most trusted government job portal. Since our inception, we have been committed to helping job seekers across India find and apply for government jobs from various recruitment boards.
          </p>
          <p>
            We provide timely updates on job notifications, exam results, admit cards, answer keys, and syllabus for government exams like SSC, Railway, Banking, UPSC, Police, and many more.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            To make government job notifications easily accessible to every job seeker in India by providing accurate, timely, and comprehensive information about government job opportunities.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose Sarkari Job Hub?</h2>
          <ul>
            <li>
              <strong>Latest Updates:</strong> We update our portal daily with the latest job notifications and exam updates.
            </li>
            <li>
              <strong>Comprehensive Coverage:</strong> We cover all major government exam boards including SSC, Railway, Banking, UPSC, and state-level recruitments.
            </li>
            <li>
              <strong>Easy Navigation:</strong> Our portal is designed for easy browsing with category-wise organization of notifications.
            </li>
            <li>
              <strong>Reliable Information:</strong> All information is collected from official government websites.
            </li>
            <li>
              <strong>Free Service:</strong> Completely free - no hidden charges or premium membership required.
            </li>
            <li>
              <strong>Mobile Friendly:</strong> Access job notifications from any device, anywhere.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Government Exams We Cover</h2>
          <div className="exams-grid">
            <div className="exam-item">
              <h4>Central Government</h4>
              <ul>
                <li>SSC (Staff Selection Commission)</li>
                <li>Railway (RRB)</li>
                <li>UPSC (Union Public Service Commission)</li>
                <li>Banking (SBI, RBI, IBPS)</li>
                <li>Insurance (LIC, GIC)</li>
              </ul>
            </div>
            <div className="exam-item">
              <h4>State Government</h4>
              <ul>
                <li>State PSC (Public Service Commission)</li>
                <li>Police Recruitment</li>
                <li>Teacher Recruitment</li>
                <li>Revenue Department Jobs</li>
                <li>Other State Jobs</li>
              </ul>
            </div>
            <div className="exam-item">
              <h4>Education</h4>
              <ul>
                <li>NEET Results</li>
                <li>JEE Results</li>
                <li>Board Exams</li>
                <li>Admission Notifications</li>
                <li>Scholarship Updates</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Contact Us</h2>
          <p>
            Have questions or suggestions? We\\'d love to hear from you!
            <br />
            <strong>Email:</strong> support@sarkarijobhud.website
            <br />
            <strong>Hours:</strong> Monday to Friday, 9 AM to 6 PM IST
          </p>
        </section>

        <section className="about-section disclaimer">
          <h2>Disclaimer</h2>
          <p>
            Sarkari Job Hub is an independent portal and is not affiliated with any government department or recruitment board. We collect information from official sources and provide it for informational purposes only. Job seekers are advised to always verify information on official government websites before applying. We are not responsible for any discrepancies or changes made by official authorities.
          </p>
        </section>
      </div>
    </div>
  );
}
