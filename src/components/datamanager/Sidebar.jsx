import React from "react";

const modules = [
  { id: "latestJobs", label: "Latest Jobs" },
  { id: "results", label: "Results" },
  { id: "admitCards", label: "Admit Cards" },
  { id: "answerKeys", label: "Answer Keys" },
  { id: "syllabus", label: "Syllabus" },
  { id: "admissions", label: "Admissions" },
  { id: "certificates", label: "Certificates" },
  { id: "important", label: "Important" },
];

const Sidebar = ({ activeModule, onSelect }) => {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:w-72 lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold text-slate-900">Modules</h2>
      <div className="mt-4 space-y-2">
        {modules.map((module) => {
          const active = module.id === activeModule;
          return (
            <button
              key={module.id}
              type="button"
              onClick={() => onSelect(module.id)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {module.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
