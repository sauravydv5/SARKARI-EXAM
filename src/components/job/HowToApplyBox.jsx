import React from "react";
import { SectionHeader } from "./JobInfoTable";

const HowToApplyBox = ({ steps }) => (
  <div className="border border-[#8b1538] mt-4">
    <SectionHeader title="How to Fill Online Application Form" color="#8b1538" />
    <ol className="list-decimal pl-6 py-3 pr-3 space-y-1 text-[13.5px] text-gray-800">
      {steps.map((s) => (
        <li key={s.id}>{s.text}</li>
      ))}
    </ol>
  </div>
);

export default HowToApplyBox;
