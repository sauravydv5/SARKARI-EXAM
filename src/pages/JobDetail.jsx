import React, { useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getJobDetail } from "../mock";
import { ChevronRight, Calendar, IndianRupee } from "lucide-react";
import JobTitleBlock from "../components/job/JobTitleBlock";
import JobInfoTable from "../components/job/JobInfoTable";
import AgeLimitBox from "../components/job/AgeLimitBox";
import VacancyTable from "../components/job/VacancyTable";
import HowToApplyBox from "../components/job/HowToApplyBox";
import ActionLinks from "../components/job/ActionLinks";

const JobDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const title = location.state?.title;
  const job = useMemo(() => getJobDetail(id, title), [id, title]);

  return (
    <div className="max-w-[1100px] mx-auto px-3 py-4">
      <div className="flex items-center text-[12.5px] text-gray-600 mb-3 flex-wrap">
        <Link to="/" className="hover:text-[#cc0000]">Home</Link>
        <ChevronRight size={14} className="mx-1" />
        <Link to="/category/latest-job" className="hover:text-[#cc0000]">Latest Jobs</Link>
        <ChevronRight size={14} className="mx-1" />
        <span className="font-semibold text-gray-900 line-clamp-1">{job.title}</span>
      </div>

      <JobTitleBlock title={job.title} postDate={job.postDate} shortInfo={job.shortInfo} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <JobInfoTable title="Important Dates" color="#1a3a8a" rows={job.importantDates} Icon={Calendar} />
        <JobInfoTable title="Application Fee" color="#0f7a3a" rows={job.applicationFee} Icon={IndianRupee} />
      </div>

      <AgeLimitBox ageLimit={job.ageLimit} />
      <VacancyTable rows={job.vacancyDetails} />
      <ActionLinks links={job.links} />
      <HowToApplyBox steps={job.howToApply} />

      <div className="mt-4 p-3 border border-dashed border-gray-300 text-[12px] text-gray-600 bg-gray-50 rounded-sm">
        <strong>Disclaimer:</strong> This page is part of a demo clone and the data shown is mocked for illustrative purposes only.
      </div>
    </div>
  );
};

export default JobDetail;
