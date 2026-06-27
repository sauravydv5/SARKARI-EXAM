import React from "react";

const AnswerKeyForm = ({ form, onChange }) => (
  <div className="space-y-4">
    {[
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "date", label: "Answer Key Date", type: "date" },
      { name: "downloadUrl", label: "Download URL", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["Draft", "Live", "Closed"] },
      { name: "isLatest", label: "Mark Latest", type: "checkbox" },
    ].map((field) => (
      <div key={field.name}>
        {field.type !== "checkbox" ? (
          <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
        ) : null}
        {field.type === "select" ? (
          <select
            value={form[field.name] || ""}
            onChange={(event) => onChange(field.name, event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
          >
            <option value="">Select status</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === "checkbox" ? (
          <label className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={Boolean(form[field.name])}
              onChange={(event) => onChange(field.name, event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-slate-700">{field.label}</span>
          </label>
        ) : (
          <input
            type={field.type}
            value={form[field.name] || ""}
            onChange={(event) => onChange(field.name, event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        )}
      </div>
    ))}
  </div>
);

export default AnswerKeyForm;
