import React from "react";

const EmptyState = ({ message }) => (
  <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
    {message || "No Records Found"}
  </div>
);

export default EmptyState;
