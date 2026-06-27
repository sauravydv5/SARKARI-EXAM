import React from "react";

const DataTable = ({ items, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading records...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
        No Records Found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-4 text-left font-semibold">Title</th>
            <th className="px-4 py-4 text-left font-semibold">Date</th>
            <th className="px-4 py-4 text-left font-semibold">Status</th>
            <th className="px-4 py-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {items.map((item) => (
            <tr key={item._id || item.id} className="hover:bg-slate-50">
              <td className="px-4 py-4">{item.title || item.slug || "–"}</td>
              <td className="px-4 py-4">{item.date ? new Date(item.date).toLocaleDateString() : item.postDate ? new Date(item.postDate).toLocaleDateString() : "–"}</td>
              <td className="px-4 py-4">{item.status || "Draft"}</td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
