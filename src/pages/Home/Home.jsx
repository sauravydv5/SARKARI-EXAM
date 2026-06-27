import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AboutSection from "./AboutSection";
import LatestJobsSection from "./LatestJobsSection";
import ResultSection from "./ResultSection";
import AdmitCardSection from "./AdmitCardSection";
import AnswerKeySection from "./AnswerKeySection";
import SyllabusSection from "./SyllabusSection";
import AdmissionSection from "./AdmissionSection";
import ImportantSection from "./ImportantSection";
import CertificateSection from "./CertificateSection";
import RecentUpdatesSection from "./RecentUpdatesSection";
import latestJobService from "../../services/latestJobService";
import resultService from "../../services/resultService";
import admitCardService from "../../services/admitCardService";
import answerKeyService from "../../services/answerKeyService";
import syllabusService from "../../services/syllabusService";
import admissionService from "../../services/admissionService";
import importantService from "../../services/importantService";
import certificateService from "../../services/certificateService";

const Home = () => {
  const location = useLocation();
  const query = useMemo(
    () => new URLSearchParams(location.search).get("q") || "",
    [location.search]
  );

  const [latestJobs, setLatestJobs] = useState([]);
  const [results, setResults] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [answerKeys, setAnswerKeys] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [admission, setAdmission] = useState([]);
  const [important, setImportant] = useState([]);
  const [certificateVerification, setCertificateVerification] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [latest, resultItems, admit, answer, syllabusItems, admissionItems, importantItems, certificates] = await Promise.all([
        latestJobService.getAll(),
        resultService.getAll(),
        admitCardService.getAll(),
        answerKeyService.getAll(),
        syllabusService.getAll(),
        admissionService.getAll(),
        importantService.getAll(),
        certificateService.getAll(),
      ]);

      setLatestJobs(Array.isArray(latest) ? latest : []);
      setResults(Array.isArray(resultItems) ? resultItems : []);
      setAdmitCards(Array.isArray(admit) ? admit : []);
      setAnswerKeys(Array.isArray(answer) ? answer : []);
      setSyllabus(Array.isArray(syllabusItems) ? syllabusItems : []);
      setAdmission(Array.isArray(admissionItems) ? admissionItems : []);
      setImportant(Array.isArray(importantItems) ? importantItems : []);
      setCertificateVerification(Array.isArray(certificates) ? certificates : []);
    };

    loadData();
  }, []);

  const recentUpdates = useMemo(
    () =>
      [
        ...latestJobs,
        ...results,
        ...admitCards,
        ...answerKeys,
        ...syllabus,
        ...admission,
        ...important,
        ...certificateVerification,
      ]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 8),
    [admission, admitCards, answerKeys, certificateVerification, important, latestJobs, results, syllabus]
  );

  const allItems = useMemo(
    () => [
      ...latestJobs.map((item) => ({ ...item, category: "LATEST JOB", slug: item.slug || "latest-job" })),
      ...results.map((item) => ({ ...item, category: "RESULT", slug: item.slug || "result" })),
      ...admitCards.map((item) => ({ ...item, category: "ADMIT CARD", slug: item.slug || "admit-card" })),
      ...answerKeys.map((item) => ({ ...item, category: "ANSWER KEY", slug: item.slug || "answer-key" })),
      ...syllabus.map((item) => ({ ...item, category: "SYLLABUS", slug: item.slug || "syllabus" })),
      ...admission.map((item) => ({ ...item, category: "ADMISSION", slug: item.slug || "admission" })),
      ...important.map((item) => ({ ...item, category: "IMPORTANT", slug: item.slug || "important" })),
      ...certificateVerification.map((item) => ({ ...item, category: "CERTIFICATE VERIFICATION", slug: item.slug || "certificate" })),
    ],
    [admission, admitCards, answerKeys, certificateVerification, important, latestJobs, results, syllabus]
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
              <p className="text-sm text-slate-600">
                {filteredItems.length} result{filteredItems.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredItems.map((item) => (
                <Link
                  key={item.slug || item.id}
                  to={`/job/${item.slug || item.id}`}
                  state={{ title: item.title }}
                  className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#cc0000] hover:bg-[#fff7f6]"
                >
                  <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#cc0000]">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
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
          <RecentUpdatesSection recentUpdates={recentUpdates} />

          <div className="grid gap-4 lg:grid-cols-3">
            <LatestJobsSection />
            <ResultSection />
            <AdmitCardSection />
            <AnswerKeySection />
            <SyllabusSection />
            <AdmissionSection />
            <ImportantSection />
            <CertificateSection />
          </div>

          <AboutSection />
        </>
      )}
    </div>
  );
};

export default Home;
