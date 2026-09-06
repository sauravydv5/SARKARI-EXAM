import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading">Loading…</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="latest-jobs"
              element={
                <CategoryPage
                  category="latest-job"
                  title="Latest Jobs"
                  description="Latest government job notifications and online forms."
                />
              }
            />
            <Route
              path="results"
              element={
                <CategoryPage
                  category="result"
                  title="Results"
                  description="Check Sarkari exam and board results."
                />
              }
            />
            <Route
              path="admit-cards"
              element={
                <CategoryPage
                  category="admit-card"
                  title="Admit Cards"
                  description="Download exam admit cards and city intimation slips."
                />
              }
            />
            <Route
              path="answer-keys"
              element={
                <CategoryPage
                  category="answer-key"
                  title="Answer Keys"
                  description="Official and tentative answer keys."
                />
              }
            />
            <Route
              path="syllabus"
              element={
                <CategoryPage
                  category="syllabus"
                  title="Syllabus"
                  description="Exam syllabus and pattern details."
                />
              }
            />
            <Route
              path="admission"
              element={
                <CategoryPage
                  category="admission"
                  title="Admission"
                  description="College and entrance admission updates."
                />
              }
            />
            <Route
              path="important"
              element={
                <CategoryPage
                  category="important"
                  title="Documents"
                  description="Scholarships, exam calendars, certificates and useful government services."
                />
              }
            />
            <Route
              path="certificates"
              element={
                <CategoryPage
                  category="certificate"
                  title="Certificates"
                  description="Income, caste and other certificates."
                />
              }
            />
            <Route path="search" element={<SearchPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="disclaimer" element={<Disclaimer />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogDetailPage />} />
            <Route path=":slug" element={<PolicyPage />} />
            <Route path="post/:slug" element={<PostDetail />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
