import React from "react";

const Pill = ({ children, color }) => (
  <span
    className="inline-block text-white text-[11px] font-bold uppercase px-2 py-0.5 rounded-sm"
    style={{ background: color }}
  >
    {children}
  </span>
);

const JobTitleBlock = ({ title, postDate, shortInfo }) => (
  <div className="border border-[#cc0000] bg-white dark:bg-slate-900 dark:text-slate-100">
    <div className="bg-[#cc0000] text-white text-center py-2 px-3 font-extrabold text-[16px] md:text-[18px] uppercase">
      SarkariJobsHub    </div>
    <div className="text-center py-3 px-4">
      <h1 className="text-[#1a3a8a] text-[18px] md:text-[22px] font-extrabold leading-snug break-words">{title}</h1>
      <p className="text-[12.5px] text-gray-600 mt-1">
        Post Date: <span className="font-semibold">{postDate}</span>
      </p>
      <p className="text-[12.5px] text-gray-700 mt-2 max-w-3xl mx-auto break-words">{shortInfo}</p>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        <Pill color="#cc0000">Notification</Pill>
        <Pill color="#1a3a8a">Online Form</Pill>
        <Pill color="#0f7a3a">Government</Pill>
      </div>
    </div>
  </div>
);

export default JobTitleBlock;
