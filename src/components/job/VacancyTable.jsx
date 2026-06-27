import React from "react";
import { Users } from "lucide-react";
import { SectionHeader } from "./JobInfoTable";

const VacancyTable = ({ rows }) => {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="border border-[#6d28d9] mt-4">
      <SectionHeader title="Vacancy Details (Total Post)" color="#6d28d9" />
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] min-w-full table-auto">
          <thead className="bg-[#f3eaff] text-[#3b1466]">
            <tr>
              <th className="px-3 py-2 text-left"><Users size={12} className="inline mr-1" />Post Name</th>
              <th className="px-3 py-2 text-center">Total Posts</th>
              <th className="px-3 py-2 text-left">Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b">
                <td className="px-3 py-2 font-semibold text-gray-800 break-words">{v.post}</td>
                <td className="px-3 py-2 text-center text-[#cc0000] font-bold">{v.total}</td>
                <td className="px-3 py-2 text-gray-700 break-words">{v.eligibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VacancyTable;
