import React from "react";

const Header = ({ moduleLabel, searchValue, onSearchChange, onRefresh, onAddNew }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Data Manager</h1>
        <p className="mt-2 text-sm text-slate-500">Current selected module: <span className="font-semibold text-slate-900">{moduleLabel}</span></p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search within module"
          className="w-full min-w-[240px] rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
        />
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={onAddNew}
          className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Add New
        </button>
      </div>
    </div>
  );
};

export default Header;
