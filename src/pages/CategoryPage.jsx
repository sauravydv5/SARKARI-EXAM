import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import latestJobService from "../services/latestJobService";
import resultService from "../services/resultService";
import admitCardService from "../services/admitCardService";
import answerKeyService from "../services/answerKeyService";
import syllabusService from "../services/syllabusService";
import admissionService from "../services/admissionService";
import importantService from "../services/importantService";
import certificateService from "../services/certificateService";

const categoryMap = {
  "latest-job": { title: "Latest Jobs", color: "#cc0000", fetcher: latestJobService.getAll },
  result: { title: "Result", color: "#1a3a8a", fetcher: resultService.getAll },
  "admit-card": { title: "Admit Card", color: "#0f7a3a", fetcher: admitCardService.getAll },
  "answer-key": { title: "Answer Key", color: "#d97706", fetcher: answerKeyService.getAll },
  syllabus: { title: "Syllabus", color: "#0e7490", fetcher: syllabusService.getAll },
  admission: { title: "Admission", color: "#6d28d9", fetcher: admissionService.getAll },
  important: { title: "Important", color: "#8b1538", fetcher: importantService.getAll },
  certificate: { title: "Certificate Verification", color: "#1a3a8a", fetcher: certificateService.getAll },
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
          to={`/job/${item.slug || item.id}`}
          state={navState}
          className="text-[14px] text-[#0033cc] hover:text-[#cc0000] hover:underline"
        >
          <span className="text-gray-600 mr-2">{index + 1}.</span>
          {item.title}
          {item.isLatest && (
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
    </li>
  );
};

const CategoryPage = () => {
  const { category } = useParams();
  const info = useMemo(() => categoryMap[category] || categoryMap["latest-job"], [category]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      const data = await info.fetcher();
      setItems(Array.isArray(data) ? data : []);
    };

    loadItems();
  }, [info]);

  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
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
            {items.map((item, i) => (
              <CategoryRow key={item.id} item={item} index={i} category={category} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
