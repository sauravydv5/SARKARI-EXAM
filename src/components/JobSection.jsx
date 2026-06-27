import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const COLORS = {
  red: { header: "bg-[#cc0000]", border: "border-[#cc0000]" },
  blue: { header: "bg-[#1a3a8a]", border: "border-[#1a3a8a]" },
  green: { header: "bg-[#0f7a3a]", border: "border-[#0f7a3a]" },
  orange: { header: "bg-[#d97706]", border: "border-[#d97706]" },
  teal: { header: "bg-[#0e7490]", border: "border-[#0e7490]" },
  purple: { header: "bg-[#6d28d9]", border: "border-[#6d28d9]" },
  maroon: { header: "bg-[#8b1538]", border: "border-[#8b1538]" },
};

  const NewBadge = () => (
  <span
    className="inline-block ml-1 px-1 text-[9px] font-extrabold leading-[14px] text-white bg-[#cc0000] rounded-sm align-middle animate-pulse"
    style={{ letterSpacing: "0.5px" }}
  >
    NEW
  </span>
);

const JobItem = ({ item }) => {
  const navState = useMemo(() => ({ title: item.title }), [item.title]);
  return (
    <li className="py-1.5">
      <Link
        to={`/job/${item.slug || item.id}`}
        state={navState}
        className="text-[13.5px] text-[#0033cc] hover:text-[#cc0000] hover:underline leading-snug"
      >
        {item.title}
        {item.isLatest && <NewBadge />}
      </Link>
    </li>
  );
};

const JobSection = ({ title, items, accent = "red", category = "latest-job", loading = false, error = null }) => {
  const c = COLORS[accent] || COLORS.red;
  return (
    <section className={`border ${c.border} bg-white shadow-sm dark:bg-slate-900`}>
      <div className={`${c.header} text-white text-center py-1.5 px-2 font-bold text-[15px] uppercase tracking-wide`}>
        {title}
      </div>
      <ul className="divide-y divide-dashed divide-gray-200 px-3 py-2 dark:divide-slate-700">
        {loading ? (
          <li className="py-3 text-center text-sm text-slate-600">Loading...</li>
        ) : error ? (
          <li className="py-3 text-center text-sm text-red-600">Failed to load data</li>
        ) : items.length === 0 ? (
          <li className="py-3 text-center text-sm text-slate-600">No items available</li>
          ) : (
          items.map((item) => <JobItem key={item.slug || item.id} item={item} />)
        )}
      </ul>
      <div className="text-right px-3 py-1.5 border-t border-gray-200 bg-[#fafafa]">
        <Link to={`/category/${category}`} className="text-[12px] text-[#cc0000] font-semibold hover:underline">
          View More »
        </Link>
      </div>
    </section>
  );
};

export default JobSection;
