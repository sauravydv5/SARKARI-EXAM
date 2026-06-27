import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import JobDetail from "./pages/JobDetail";
import DataManager from "./pages/DataManager";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Category Pages */}
          <Route path="category/:category" element={<CategoryPage />} />

          <Route path="data-manager" element={<DataManager />} />

          {/* Job Details */}
          <Route path="job/:slug" element={<JobDetail />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="max-w-[1100px] mx-auto px-4 py-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Page not found
                </h2>
                <Link to="/" className="text-[#cc0000] hover:underline">
                  Back to home
                </Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;