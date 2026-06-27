import React from "react";
import { ExternalLink, Download, FileText } from "lucide-react";
import { SectionHeader } from "./JobInfoTable";

const Row = ({ title, url, lastDate, color = "bg-red-700", icon }) => (
  <tr className="border border-gray-300">
    <td className="px-4 py-3 font-semibold w-[45%]">{title}</td>
    <td className="px-4 py-3 text-center w-[25%]">{lastDate || "-"}</td>
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

const downloadLabels = {
  latestJobs: null,
  result: "Download Result",
  admitCards: "Download Admit Card",
  answerKeys: "Download Answer Key",
  syllabus: "Download Syllabus",
  admissions: "Download Admission Notice",
  certificates: "Download Certificate",
  important: "Download Notice",
};

const ActionLinks = ({ record, moduleType }) => {
  const actions = [];
  const downloadLabel = downloadLabels[moduleType];
  const downloadUrl = record?.downloadUrl;

  if (record?.notificationPdf) {
    actions.push({
      id: "notification",
      title: moduleType === "important" ? "Download Notice" : "Download Notification",
      url: record.notificationPdf,
      color: "bg-blue-700",
      icon: <Download size={15} />,
    });
  }

  if (record?.applyLink) {
    actions.push({
      id: "apply",
      title: "Apply Online",
      url: record.applyLink,
      color: "bg-red-700",
      icon: <FileText size={15} />,
    });
  }

  if (record?.officialWebsite) {
    actions.push({
      id: "official",
      title: "Official Website",
      url: record.officialWebsite,
      color: "bg-cyan-700",
      icon: <ExternalLink size={15} />,
    });
  }

  if (downloadLabel && downloadUrl) {
    actions.push({
      id: "download",
      title: downloadLabel,
      url: downloadUrl,
      color: "bg-green-700",
      icon: <Download size={15} />,
    });
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 border-2 border-red-700 bg-white">
      <SectionHeader title="Some Useful Important Links" color="#cc0000" />
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
            {actions.map((action) => (
              <Row key={action.id} title={action.title} url={action.url} lastDate={action.lastDate || "-"} color={action.color} icon={action.icon} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActionLinks;
