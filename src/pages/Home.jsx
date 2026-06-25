import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import JobSection from "../components/JobSection";
import {
  latestJobs,
  results,
  admitCards,
  answerKeys,
  syllabus,
  admission,
  important,
  certificateVerification,
} from "../data";

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
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search).get("q") || "", [location.search]);

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
    <div className="max-w-[1100px] mx-auto px-4 py-2.5">
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
          <div className="mb-1 rounded-3xl overflow-hidden border border-[#7f1d1d] bg-white shadow-sm text-left">
            <div className="bg-[#7f1d1d] px-2.5 py-0.75 text-[11px] font-bold uppercase tracking-[0.18em] text-white text-center">
              🔥 RECENT UPDATES
            </div>
            <div className="relative divide-y divide-dashed divide-slate-200 px-2.5 py-1.5 pb-6">
              {recentUpdates.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-[11px] leading-tight text-slate-700">
                  <span className="min-w-0 grow text-blue-700 hover:text-[#cc0000] hover:underline">
                    <Link to={`/job/${item.id}`} state={{ title: item.title }}>{item.title}</Link>
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <span>{item.date}</span>
                    {item.isNew && (
                      <span className="rounded bg-[#cc0000] px-1 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">NEW</span>
                    )}
                  </div>
                </div>
              ))}
              <Link
                to="/category/latest-job"
                className="absolute right-2 bottom-2 rounded-full border border-[#fde68a] bg-[#fde68a]/10 px-2.5 py-0.75 text-[10px] font-semibold text-[#fde68a] transition hover:bg-[#fde68a] hover:text-white"
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
  );
};

export default Home;
