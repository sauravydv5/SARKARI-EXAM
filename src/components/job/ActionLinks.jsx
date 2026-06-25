import React, { useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import { SectionHeader } from "./JobInfoTable";

const ActionLinks = ({ links }) => {
  const [applied, setApplied] = useState(false);

  return (
    <div className="border-2 border-[#cc0000] mt-4 bg-[#fffaf0]">
      <SectionHeader title="Some Useful Important Links" color="#cc0000" />
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setApplied(true)}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-sm text-white text-[13.5px] font-semibold ${applied ? "bg-[#0f7a3a]" : "bg-[#cc0000] hover:bg-[#a30000]"}`}
        >
          <FileText size={14} />
          {applied ? "Application Submitted ✓" : "Apply Online"}
        </button>
        <a href={links.downloadNotification} className="flex items-center justify-center gap-2 px-3 py-2 rounded-sm text-white text-[13.5px] font-semibold bg-[#1a3a8a] hover:bg-[#142b69]">
          <Download size={14} /> Download Notification
        </a>
        <a href={links.officialWebsite} className="flex items-center justify-center gap-2 px-3 py-2 rounded-sm text-white text-[13.5px] font-semibold bg-[#0e7490] hover:bg-[#0a586f]">
          <ExternalLink size={14} /> Official Website
        </a>
      </div>
      {applied && (
        <p className="px-4 pb-3 text-[12.5px] text-[#0f7a3a]">Demo: your application has been recorded locally. (Frontend mock)</p>
      )}
    </div>
  );
};

export default ActionLinks;
