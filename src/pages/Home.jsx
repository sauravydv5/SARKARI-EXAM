import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Moon, Sun, Twitter, Youtube } from "lucide-react";
import HeroLogo from "../assets/hero.png";
import JobSection from "../components/JobSection";
import Marquee from "../components/Marquee";
import {
  latestJobs,
  results,
  admitCards,
  answerKeys,
  syllabus,
  admission,
  important,
  certificateVerification,
} from "../mock";

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

const recentUpdates = [
  ...latestJobs,
  ...results,
  ...admitCards,
  ...answerKeys,
  ...syllabus,
  ...admission,
  ...important,
  ...certificateVerification,
].slice(0, 8);

const Home = () => {
  const [query, setQuery] = useState("");
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

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const allItems = useMemo(
    () => [
      ...latestJobs.map((item) => ({ ...item, category: "LATEST JOB", slug: "latest-job" })),
      ...results.map((item) => ({ ...item, category: "RESULT", slug: "result" })),
      ...admitCards.map((item) => ({ ...item, category: "ADMIT CARD", slug: "admit-card" })),
      ...answerKeys.map((item) => ({ ...item, category: "ANSWER KEY", slug: "answer-key" })),
      ...syllabus.map((item) => ({ ...item, category: "SYLLABUS", slug: "syllabus" })),
      ...admission.map((item) => ({ ...item, category: "ADMISSION", slug: "admission" })),
      ...important.map((item) => ({ ...item, category: "IMPORTANT", slug: "important" })),
      ...certificateVerification.map((item) => ({ ...item, category: "CERTIFICATE VERIFICATION", slug: "certificate" })),
    ],
    []
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.date?.toLowerCase().includes(lower)
    );
  }, [allItems, query]);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-slate-200 bg-white py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4">
          <span className="font-semibold">{currentDateTime}</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden sm:inline">Follow us:</span>
            <a href="#" aria-label="Facebook" className="rounded-full border border-slate-300 bg-[#f8fafc] p-2 text-slate-800 transition hover:bg-slate-100">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="rounded-full border border-slate-300 bg-[#f8fafc] p-2 text-slate-800 transition hover:bg-slate-100">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="YouTube" className="rounded-full border border-slate-300 bg-[#f8fafc] p-2 text-slate-800 transition hover:bg-slate-100">
              <Youtube className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              className="ml-2 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full px-2 sm:px-4 py-2 sm:py-3">
        <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-md sm:shadow-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 md:gap-6 px-3 sm:px-6 py-3 sm:py-4">
            <div className="shrink-0">
              <img src={HeroLogo} alt="SarkariJobsHub" className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain" />
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight break-words">
                <span className="text-[#0F172A]">Sarkari</span>
                <span className="text-red-600">Jobs</span>
                <span className="text-[#0F172A]">Hub</span>
              </h1>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-slate-700">
                India&apos;s No.1 Government Jobs Website
              </p>
            </div>
            <div className="w-full sm:w-auto sm:flex-shrink-0 md:w-[350px] lg:w-[450px]">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Job..."
                  className="w-full rounded-full border border-gray-300 bg-white py-2 sm:py-2.5 md:py-3 pl-4 sm:pl-6 pr-14 sm:pr-20 text-xs sm:text-sm md:text-base outline-none shadow-sm sm:shadow-md focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                />
                <button className="absolute right-0.5 sm:right-1 top-0.5 sm:top-1 h-9 sm:h-10 md:h-12 w-9 sm:w-10 md:w-12 rounded-full bg-red-600 text-white text-lg sm:text-xl hover:bg-red-700 transition flex items-center justify-center">
                  🔍
                </button>
              </div>
            </div>
          </div>
          <div className="h-0.5 sm:h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
        </div>
      </div>

      <div className="bg-[#cc0000] text-white">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em]">
          <Link to="/" className="rounded px-3 py-2 transition hover:bg-white/10">HOME</Link>
          {categories.map((item) => (
            <Link key={item.slug} to={`/category/${item.slug}`} className="rounded px-3 py-2 transition hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white text-[#922626] dark:text-slate-100">
        <div className="mx-auto max-w-[1100px] px-4 py-3">
          <Marquee />
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">
          <h1 className="text-3xl font-bold text-[#801314] dark:text-[#f8fafc]">Welcome to SarkariJobsHub</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#4a3728]">
            India&apos;s No.1 Government Jobs Website. Find latest Government Jobs, Online Forms, Results, Admit Cards, Answer Keys, Syllabus & more — all in one place.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-6">
        {query.trim() ? (
          <div>
            <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Search results for "{query}"</h2>
                <p className="text-sm text-slate-600">{filteredItems.length} result{filteredItems.length === 1 ? "" : "s"} found</p>
              </div>
            </div>
            {filteredItems.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/job/${item.id}`}
                    state={{ title: item.title }}
                    className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#cc0000] hover:bg-[#fff7f6]"
                  >
                    <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#cc0000]">{item.category}</div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">Updated: {item.date}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                No results matched your search. Try another keyword.
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-3xl overflow-hidden border border-[#7f1d1d] bg-white shadow-sm text-left">
              <div className="bg-[#7f1d1d] px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white text-center">
                🔥 RECENT UPDATES
              </div>
              <div className="relative divide-y divide-dashed divide-slate-200 px-5 py-4 pb-16">
                {recentUpdates.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm text-slate-700">
                    <span className="min-w-0 grow text-blue-700 hover:text-[#cc0000] hover:underline">
                      <Link to={`/job/${item.id}`} state={{ title: item.title }}>{item.title}</Link>
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      <span>{item.date}</span>
                      {item.isNew && (
                        <span className="rounded bg-[#cc0000] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">NEW</span>
                      )}
                    </div>
                  </div>
                ))}
                <Link
                  to="/category/latest-job"
                  className="absolute right-5 bottom-5 rounded-full border border-[#fde68a] bg-[#fde68a]/10 px-3 py-1 text-xs font-semibold text-[#fde68a] transition hover:bg-[#fde68a] hover:text-white"
                >
                  View More »
                </Link>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <JobSection title="Latest Jobs" items={latestJobs} accent="red" category="latest-job" />
              <JobSection title="Results" items={results} accent="blue" category="result" />
              <JobSection title="Admit Cards" items={admitCards} accent="green" category="admit-card" />
              <JobSection title="Answer Keys" items={answerKeys} accent="orange" category="answer-key" />
              <JobSection title="Syllabus" items={syllabus} accent="teal" category="syllabus" />
              <JobSection title="Admission" items={admission} accent="purple" category="admission" />
              <JobSection title="Important" items={important} accent="maroon" category="important" />
              <JobSection title="Certificate Verification" items={certificateVerification} accent="blue" category="certificate" />
            </div>

            <div className="mt-6 rounded-3xl border border-[#f1d5d5] bg-white p-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <h2 className="mb-3 text-xl font-bold text-[#7f1d1d]">About SarkariJobsHub</h2>
              <p className="text-sm leading-7">
                SarkariJobsHub provides you all the latest information regarding Online Forms, Government Jobs, Results, Admit Cards, Answer Keys, Syllabus, Admissions and Government Exam alerts in various sectors such as Railway, Bank, SSC, Army, Navy, Police, UPPSC, BPSC, MPPSC and other Government Exam opportunities at one place. Get latest job notifications & updates daily.
              </p>
            </div>
          </>
        )}
      </div>

      <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-3xl font-bold text-center text-[#801314] dark:text-white mb-4">
              SarkariJobsHub – Smart Government Job Alerts
            </h2>
            <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
              SarkariJobsHub brings the latest Government Jobs, Admit Cards, Results, Answer Keys, Admissions, and Exam alerts together in one clean, easy-to-use portal.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                ✅ Latest Government Job Notifications
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                ✅ Admit Card and Result Updates
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                ✅ Official Form Links & Exam Alerts
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                ✅ Syllabus, Answer Keys & Cutoffs
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                ✅ Mobile-friendly access for aspirants
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                ✅ Free verified updates every day
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-[#801314] dark:text-white mb-2">Why SarkariJobsHub?</h3>
                <p className="leading-6 text-slate-700 dark:text-slate-300">
                  Verified government notifications, fast search, clean navigation, and simple access to all major job categories.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-[#801314] dark:text-white mb-2">How it helps you</h3>
                <p className="leading-6 text-slate-700 dark:text-slate-300">
                  Use the search bar or category menu to find the latest alerts, admit cards, results, answer keys and syllabus updates fast.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-r from-red-700 to-red-900 p-6 text-center text-white">
              <h3 className="text-2xl font-bold">Stay Updated with SarkariJobsHub</h3>
              <p className="mt-3 text-sm leading-6 text-red-100">
                Your trusted destination for Government Jobs, Results, Admit Cards, Admissions, Scholarships, and Competitive Exam notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-[1100px] px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1fr]">
            <div>
              <div className="text-2xl font-bold text-white">SarkariJobsHub</div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Your one-stop destination for the latest Government Jobs, Online Forms, Results, Admit Cards, Answer Keys, Syllabus and Government Exam Updates in India.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link to="/category/latest-job" className="hover:text-white">Latest Jobs</Link></li>
                <li><Link to="/category/result" className="hover:text-white">Results</Link></li>
                <li><Link to="/category/admit-card" className="hover:text-white">Admit Card</Link></li>
                <li><Link to="/category/answer-key" className="hover:text-white">Answer Key</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Other</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link to="/category/syllabus" className="hover:text-white">Syllabus</Link></li>
                <li><Link to="/category/admission" className="hover:text-white">Admission</Link></li>
                <li><Link to="/category/certificate" className="hover:text-white">Certificate Verification</Link></li>
                <li><Link to="/category/important" className="hover:text-white">Important</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 bg-slate-900 px-4 py-4 text-center text-sm text-slate-500">
          © 2026 SarkariJobsHub • For demonstration only. All trademarks belong to their respective owners.
        </div>
      </footer>
    </div>
  );
};

export default Home;
