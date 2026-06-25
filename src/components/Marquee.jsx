import React from "react";

const Marquee = () => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#111827] px-4 py-3 text-white">
    <div className="flex items-center gap-4">
      <span className="shrink-0 rounded-full bg-[#cc0000] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em]">LATEST NEWS</span>
      <div className="min-w-0 overflow-hidden">
        <div className="animate-marquee inline-flex items-center gap-8 whitespace-nowrap">
          <span className="text-sm">Naukri in All Sarkari Exam, Govt Jobs in India, Sarkari Exam, UPSC, SSC, IBPS, Railway, Bank, Indian Army, Indian Navy, Police, UPPSC, BPSC, MPPSC and Other State Govt.</span>
          <span className="text-sm">Naukri in All Sarkari Exam, Govt Jobs in India, Sarkari Exam, UPSC, SSC, IBPS, Railway, Bank, Indian Army, Indian Navy, Police, UPPSC, BPSC, MPPSC and Other State Govt.</span>
        </div>
      </div>
    </div>
  </div>
);

export default Marquee;
