import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
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
import { ChevronRight } from "lucide-react";

const categoryMap = {
  "latest-job": { title: "Latest Jobs", data: latestJobs, color: "#cc0000" },
  result: { title: "Result", data: results, color: "#1a3a8a" },
  "admit-card": { title: "Admit Card", data: admitCards, color: "#0f7a3a" },
  "answer-key": { title: "Answer Key", data: answerKeys, color: "#d97706" },
  syllabus: { title: "Syllabus", data: syllabus, color: "#0e7490" },
  admission: { title: "Admission", data: admission, color: "#6d28d9" },
  important: { title: "Important", data: important, color: "#8b1538" },
  certificate: { title: "Certificate Verification", data: certificateVerification, color: "#1a3a8a" },
};

const helpfulLinks = {
  result: [
    { label: "Download Result PDF", href: "https://example.com/ssc-cgl-tier2-result-download" },
    { label: "Result Updates", href: "https://ssc.nic.in" },
  ],
  "admit-card": [
    { label: "Download Admit Card", href: "https://example.com/ibps-po-admit-card" },
    { label: "Admit Card Help", href: "https://www.ibps.in" },
  ],
};

const CategoryRow = ({ item, index, category }) => {
  const navState = useMemo(() => ({ title: item.title }), [item.title]);
  const showDownload = category === "result" || category === "admit-card";
  const downloadLabel = category === "result" ? "Download Result" : "Download Admit Card";

  return (
    <li className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Link
          to={`/job/${item.id}`}
          state={navState}
          className="text-[14px] text-[#0033cc] hover:text-[#cc0000] hover:underline"
        >
          <span className="text-gray-600 mr-2">{index + 1}.</span>
          {item.title}
          {item.isNew && (
            <span className="ml-2 inline-block px-1 text-[9px] font-extrabold text-white bg-[#cc0000] rounded-sm align-middle animate-pulse">NEW</span>
          )}
        </Link>
        {showDownload && item.downloadUrl && (
          <a
            href={item.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-[#cc0000] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#a30000]"
          >
            {downloadLabel}
          </a>
        )}
      </div>
      <span className="text-[12px] text-gray-500">Updated: {item.date}</span>
    </li>
  );
};

const CategoryPage = () => {
  const { category } = useParams();
  const info = useMemo(() => categoryMap[category] || categoryMap["latest-job"], [category]);

  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Marquee />
      <div className="max-w-[1100px] mx-auto px-3 py-4">
        <div className="flex items-center text-[12.5px] text-gray-600 mb-3 dark:text-slate-300">
          <Link to="/" className="hover:text-[#cc0000]">Home</Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="font-semibold text-gray-900">{info.title}</span>
        </div>

        <div className="border bg-white shadow-sm dark:bg-slate-900" style={{ borderColor: info.color }}>
          <div className="text-white text-center py-2 px-3 font-bold text-[17px] uppercase tracking-wide" style={{ background: info.color }}>
            All {info.title}
          </div>

          {helpfulLinks[category] && (
            <div className="border-b border-dashed border-gray-200 px-4 py-4 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <h2 className="text-lg font-bold text-slate-900 mb-3 dark:text-slate-100">Some Useful Important Links</h2>
              <div className="flex flex-wrap gap-3">
                {helpfulLinks[category].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#cc0000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a30000]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <ul className="divide-y divide-dashed divide-gray-200 px-4 py-2 dark:divide-slate-700">
            {info.data.map((item, i) => (
              <CategoryRow key={item.id} item={item} index={i} category={category} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
