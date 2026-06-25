import React from "react";
import { SectionHeader } from "./JobInfoTable";

const AgeLimitBox = ({ ageLimit }) => (
  <div className="border border-[#d97706] mt-4">
    <SectionHeader title={`Age Limit (as on ${ageLimit.asOn})`} color="#d97706" />
    <div className="p-3 text-[13.5px] text-gray-800 grid grid-cols-1 md:grid-cols-3 gap-2">
      <div>
        <span className="font-semibold">Minimum Age:</span> {ageLimit.min}
      </div>
      <div>
        <span className="font-semibold">Maximum Age:</span> {ageLimit.max}
      </div>
      <div className="text-gray-600 italic md:col-span-1">{ageLimit.note}</div>
    </div>
  </div>
);

export default AgeLimitBox;
