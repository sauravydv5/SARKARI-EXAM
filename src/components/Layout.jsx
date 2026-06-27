import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { Facebook, Moon, Search, Sun, Twitter, Youtube } from "lucide-react";
import HeroLogo from "../assets/hero.png";
import Marquee from "./Marquee";

const categories = [
  { slug: "latest-job", label: "LATEST JOB" },
  { slug: "result", label: "RESULT" },
  { slug: "admit-card", label: "ADMIT CARD" },
  { slug: "answer-key", label: "ANSWER KEY" },
  { slug: "syllabus", label: "SYLLABUS" },
  { slug: "admission", label: "ADMISSION" },
  { slug: "certificate", label: "CERTIFICATE VERIFICATION" },
  { slug: "important", label: "IMPORTANT" },
];

export default function Layout() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [theme, setTheme] = useState(() => window.localStorage.getItem("theme") || "light");
  const [currentDateTime, setCurrentDateTime] = useState(() => {
    const now = new Date();
    return now.toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  });

  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || "1111";
const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmed = query.trim();

    // Secret Code
    if (trimmed === ADMIN_SECRET) {
      sessionStorage.setItem("admin_access", "true");
      navigate("/data-manager");
      return;
    }

    // Normal Search
    navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
  };

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-slate-200 bg-white py-0.5 text-[10px] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-1 px-3">
          <span className="font-medium">{currentDateTime}</span>
          <div className="flex flex-wrap items-center gap-1">
            <span className="hidden sm:inline">Follow us:</span>
            <a href="#" aria-label="Facebook" className="rounded-full border border-slate-300 bg-[#f8fafc] p-1.5 text-slate-800 transition hover:bg-slate-100">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="rounded-full border border-slate-300 bg-[#f8fafc] p-1.5 text-slate-800 transition hover:bg-slate-100">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="YouTube" className="rounded-full border border-slate-300 bg-[#f8fafc] p-1.5 text-slate-800 transition hover:bg-slate-100">
              <Youtube className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              className="ml-2 inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full px-2 sm:px-4 py-1">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-5 px-3 sm:px-4 py-2 sm:py-3">
            <Link to="/" className="shrink-0 hover:opacity-90 transition">
              <img src={HeroLogo} alt="SarkariJobsHub" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" />
            </Link>
            <Link to="/" className="flex-1 text-center sm:text-left min-w-0 no-underline cursor-pointer hover:opacity-90 transition">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold leading-tight break-words">
                <span className="text-[#0F172A]">Sarkari</span>
                <span className="text-red-600">Jobs</span>
                <span className="text-[#0F172A]">Hub</span>
                <p className="mt-1 text-sm sm:text-base md:text-base font-semibold text-slate-600">
                  India&apos;s No.1 Government Jobs Website. Find latest Government Jobs, Online Forms, Results, Admit Cards, Answer Keys, Syllabus & more — all in one place.
                </p>
              </h1>
            </Link>
            <div className="w-full sm:w-auto sm:flex-shrink-0 md:w-[320px] lg:w-[360px]">
              <form onSubmit={handleSearch} className="flex w-full overflow-hidden rounded-full border border-gray-300 bg-white shadow-sm transition focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Job..."
                  className="flex-1 border-none bg-transparent px-4 py-2.5 text-sm text-slate-700 outline-none"
                />

                <button
                  className="flex items-center gap-2 bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
                  type="submit"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </form>
            </div>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
        </div>
      </div>

      <div className="bg-[#cc0000] text-white">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-1 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
          <Link to="/" className="rounded px-2 py-1 transition hover:bg-white/10">HOME</Link>
          {categories.map((item) => (
            <Link key={item.slug} to={`/category/${item.slug}`} className="rounded px-2 py-1 transition hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white text-[#922626] dark:text-slate-100">
        <div className="mx-auto max-w-[1100px] px-4 py-1">
          <Marquee />
        </div>
      </div>

      <Outlet />

      <footer className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-[1100px] px-4 py-10">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">SarkariJobsHub – Smart Government Job Alerts</p>
              <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">
                SarkariJobsHub brings the latest Government Jobs, Admit Cards, Results, Answer Keys, Admissions, and Exam alerts together in one clean, easy-to-use portal.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">✅ Latest Government Job Notifications</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">✅ Admit Card and Result Updates</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">✅ Official Form Links & Exam Alerts</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">✅ Syllabus, Answer Keys & Cutoffs</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">✅ Mobile-friendly access for aspirants</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">✅ Free verified updates every day</p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-slate-50 p-6 shadow-sm dark:bg-slate-950">
                <p className="text-xl font-semibold text-slate-900 dark:text-white">Why SarkariJobsHub?</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Verified government notifications, fast search, clean navigation, and simple access to all major job categories.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-6 shadow-sm dark:bg-slate-950">
                <p className="text-xl font-semibold text-slate-900 dark:text-white">How it helps you</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Use the search bar or category menu to find the latest alerts, admit cards, results, answer keys and syllabus updates fast.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] bg-gradient-to-r from-red-600 to-red-700 p-8 text-center text-white shadow-2xl shadow-red-700/20">
              <p className="text-2xl font-bold">Stay Updated with SarkariJobsHub</p>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6">
                Your trusted destination for Government Jobs, Results, Admit Cards, Admissions, Scholarships, and Competitive Exam notifications.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/10">
          <div className="mx-auto max-w-[1100px] px-4 py-8 lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="space-y-3">
              <p className="text-xl font-bold text-slate-900 dark:text-white">SarkariJobsHub</p>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                Your one-stop destination for the latest Government Jobs, Online Forms, Results, Admit Cards, Answer Keys, Syllabus and Government Exam Updates in India.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-900 dark:text-white">Quick Links</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="https://sarkarijobhub.website/category/latest-job" className="hover:text-red-600">Latest Jobs</a></li>
                <li><a href="https://sarkarijobhub.website/category/result" className="hover:text-red-600">Results</a></li>
                <li><a href="https://sarkarijobhub.website/category/admit-card" className="hover:text-red-600">Admit Card</a></li>
                <li><a href="https://sarkarijobhub.website/category/answer-key" className="hover:text-red-600">Answer Key</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-900 dark:text-white">Other</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="https://sarkarijobhub.website/category/syllabus" className="hover:text-red-600">Syllabus</a></li>
                <li><a href="https://sarkarijobhub.website/category/admission" className="hover:text-red-600">Admission</a></li>
                <li><a href="https://sarkarijobhub.website/category/certificate" className="hover:text-red-600">Certificate Verification</a></li>
                <li><a href="https://sarkarijobhub.website/category/important" className="hover:text-red-600">Important</a></li>
              </ul>
            </div>
          </div>

          <div className="mx-auto max-w-[1100px] px-4 pb-8 text-center text-sm text-white bg-slate-950 rounded-t-3xl">
            <p className="font-semibold text-lg text-white">SarkariJobsHub</p>
            <p className="mt-2 max-w-2xl mx-auto leading-6 text-slate-300">
              Your one-stop destination for the latest Government Jobs, Online Forms, Results, Admit Cards, Answer Keys, Syllabus and Government Exam Updates in India.
            </p>
            <p className="mt-4 text-xs text-slate-400">
              © 2026 SarkariJobsHub • Original content. All trademarks belong to their respective owners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
