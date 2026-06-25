import React from "react";

const SectionHeader = ({ title, color }) => (
  <div
    className="text-white text-center py-1.5 px-2 font-bold text-[14px] uppercase tracking-wide"
    style={{ background: color }}
  >
    {title}
  </div>
);

const JobInfoTable = ({ title, color, rows, Icon }) => {
  return (
    <div className="border" style={{ borderColor: color }}>
      <SectionHeader title={title} color={color} />
      <table className="w-full text-[13px]">
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} className="border-b border-dashed">
              <td className="px-3 py-1.5 font-semibold text-gray-700 w-1/2">
                {Icon && <Icon size={12} className="inline mr-1" style={{ color }} />}
                {d.label}
              </td>
              <td className="px-3 py-1.5 text-gray-800">{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { SectionHeader };
export default JobInfoTable;
