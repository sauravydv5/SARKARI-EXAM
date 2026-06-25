import React from "react";

const Pill = ({ children, color }) => (
  <span
    className="inline-block text-white text-[11px] font-bold uppercase px-2 py-0.5 rounded-sm"
    style={{ background: color }}
  >
    {children}
  </span>
);

const JobTitleBlock = ({ title, postDate, shortInfo, links, id }) => (
  <div className="border border-[#cc0000] bg-white dark:bg-slate-900 dark:text-slate-100">
    <div className="bg-[#cc0000] text-white text-left py-2 px-3 font-extrabold text-[16px] md:text-[18px] uppercase">SarkariJobsHub</div>
    <div className="py-3 px-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[#1a3a8a] text-[18px] md:text-[22px] font-extrabold leading-snug break-words">{title}</h1>
          <p className="text-[12.5px] text-gray-600 mt-1">
            <span className="font-semibold">{postDate}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {links?.downloadNotification && (
            <a href={links.downloadNotification} className="flex items-center gap-2 px-3 py-2 rounded-sm text-white text-[13px] font-semibold bg-[#1a3a8a] hover:bg-[#142b69]">
              Download Notification
            </a>
          )}
          {links?.officialWebsite && (
            <a href={links.officialWebsite} className="flex items-center gap-2 px-3 py-2 rounded-sm text-white text-[13px] font-semibold bg-[#0e7490] hover:bg-[#0a586f]">
              Official Site
            </a>
          )}
        </div>
      </div>

      <p className="text-[12.5px] text-gray-700 mt-2 max-w-3xl break-words">{shortInfo}</p>
      <div className="flex flex-wrap justify-start gap-2 mt-3">
        <Pill color="#cc0000">Notification</Pill>
        <Pill color="#1a3a8a">Online Form</Pill>
        <Pill color="#0f7a3a">Government</Pill>
      </div>
    </div>
  </div>
);

export default JobTitleBlock;
