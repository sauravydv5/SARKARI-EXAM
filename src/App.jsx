import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import PostDetail from './pages/PostDetail';
import SearchPage from './pages/SearchPage';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
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
                title="Important Links"
                description="Useful government services and documents."
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
          <Route path="post/:slug" element={<PostDetail />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
