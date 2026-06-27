import React from "react";

const Pill = ({ children, color }) => (
  <span
    className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold text-white"
    style={{ background: color }}
  >
    {children}
  </span>
);

const JobTitleBlock = ({ title, postDate, details = [], category, qualification, links = {} }) => (
  <div className="border border-[#cc0000] bg-white dark:bg-slate-900 dark:text-slate-100">
    <div className="bg-[#cc0000] text-white text-left py-2 px-3 font-extrabold text-[16px] md:text-[18px] uppercase">SarkariJobsHub</div>
    <div className="py-3 px-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1">
          <h1 className="text-[#1a3a8a] text-[18px] md:text-[22px] font-extrabold leading-snug break-words">{title}</h1>
          {postDate && (
            <p className="text-[12.5px] text-gray-600 mt-1">
              <span className="font-semibold">{postDate}</span>
            </p>
          )}
          {details.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2 mt-4 text-[13px] text-gray-700">
              {details.map((detail) => (
                <div key={detail.id} className="flex gap-2">
                  <span className="font-semibold text-slate-900">{detail.label}:</span>
                  <span>{detail.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {links.notificationPdf && (
            <a
              href={links.notificationPdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1a3a8a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#142b69]"
            >
              Download Notification
            </a>
          )}
          {links.applyLink && (
            <a
              href={links.applyLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1a3a8a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#142b69]"
            >
              Apply Online
            </a>
          )}
          {links.officialWebsite && (
            <a
              href={links.officialWebsite}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#0e7490] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a586f]"
            >
              Official Site
            </a>
          )}
          {category && <Pill color="#0f7a3a">{category}</Pill>}
        </div>
      </div>

      {qualification && (
        <p className="text-[13px] text-gray-700 mt-4 max-w-3xl break-words">{qualification}</p>
      )}
    </div>
  </div>
);

export default JobTitleBlock;
