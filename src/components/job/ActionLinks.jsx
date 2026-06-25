import React from "react";
import { ExternalLink, Download, FileText } from "lucide-react";
import { SectionHeader } from "./JobInfoTable";

const Row = ({ title, url, lastDate, color = "bg-red-700", icon }) => (
  <tr className="border border-gray-300">
    <td className="px-4 py-3 font-semibold w-[45%]">{title}</td>

    <td className="px-4 py-3 text-center w-[25%]">
      {lastDate || "-"}
    </td>

    <td className="px-4 py-3 text-center">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${color} inline-flex items-center gap-2 px-4 py-2 rounded text-white text-sm font-semibold hover:opacity-90`}
      >
        {icon}
        Click Here
      </a>
    </td>
  </tr>
);

export default function ActionLinks({ links }) {
  return (
    <div className="mt-5 border-2 border-red-700 bg-white">
      <SectionHeader
        title="Some Useful Important Links"
        color="#cc0000"
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">

          <thead className="bg-red-700 text-white">
            <tr>
              <th className="py-3">Action</th>
              <th>Last Date</th>
              <th>Link</th>
            </tr>
          </thead>

          <tbody>

            <Row
              title="Apply Online"
              url={links.applyOnline || "#"}
              lastDate={links.applyLastDate || "-"}
              color="bg-red-700"
              icon={<FileText size={15} />}
            />

            {links.downloadAdmit && (
              <Row
                title="Download Admit Card"
                url={links.downloadAdmit}
                lastDate={links.admitDate}
                color="bg-purple-700"
                icon={<Download size={15} />}
              />
            )}

            {links.downloadResult && (
              <Row
                title="Download Result"
                url={links.downloadResult}
                lastDate={links.resultDate}
                color="bg-green-700"
                icon={<Download size={15} />}
              />
            )}

            {links.downloadAdmit && (
              <Row
                title="Download Admit Card"
                url={links.downloadAdmit}
                lastDate={links.admitDate}
                color="bg-purple-700"
                icon={<Download size={15} />}
              />
            )}

            {links.downloadAnswerKey && (
              <Row
                title="Download Answer Key"
                url={links.downloadAnswerKey}
                lastDate={links.answerKeyDate}
                color="bg-orange-600"
                icon={<Download size={15} />}
              />
            )}

            {links.downloadSyllabus && (
              <Row
                title="Download Syllabus"
                url={links.downloadSyllabus}
                lastDate={links.syllabusDate}
                color="bg-teal-700"
                icon={<Download size={15} />}
              />
            )}

            {links.downloadAdmission && (
              <Row
                title="Download Admission"
                url={links.downloadAdmission}
                lastDate={links.admissionDate}
                color="bg-violet-700"
                icon={<Download size={15} />}
              />
            )}

            {links.downloadNotification && (
              <Row
                title="Download Notification"
                url={links.downloadNotification}
                lastDate="-"
                color="bg-blue-700"
                icon={<Download size={15} />}
              />
            )}

            {links.officialWebsite && (
              <Row
                title="Official Website"
                url={links.officialWebsite}
                lastDate="-"
                color="bg-cyan-700"
                icon={<ExternalLink size={15} />}
              />
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}
