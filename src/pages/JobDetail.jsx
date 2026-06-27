import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { ChevronRight, Calendar, IndianRupee } from "lucide-react";
import latestJobService from "../services/latestJobService";
import resultService from "../services/resultService";
import admitCardService from "../services/admitCardService";
import answerKeyService from "../services/answerKeyService";
import syllabusService from "../services/syllabusService";
import admissionService from "../services/admissionService";
import importantService from "../services/importantService";
import certificateService from "../services/certificateService";
import JobTitleBlock from "../components/job/JobTitleBlock";
import JobInfoTable from "../components/job/JobInfoTable";
import AgeLimitBox from "../components/job/AgeLimitBox";
import VacancyTable from "../components/job/VacancyTable";
import HowToApplyBox from "../components/job/HowToApplyBox";
import ActionLinks from "../components/job/ActionLinks";

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const buildApplicationFeeRows = (data) => {
  const rows = [];
  const source = data.applicationFee || data.application_fee || {};
  const getValue = (key) => {
    if (source && typeof source === "object" && source[key] != null && source[key] !== "") return source[key];
    return data[key] != null && data[key] !== "" ? data[key] : null;
  };

  const mapField = (key, label) => {
    const value = getValue(key);
    if (value != null && value !== "") {
      rows.push({ id: key, label, value });
    }
  };

  mapField("general", "General");
  mapField("obc", "OBC");
  mapField("ews", "EWS");
  mapField("scst", "SC/ST");
  mapField("female", "Female");
  mapField("ph", "PH");
  mapField("paymentMode", "Payment Mode");
  mapField("payment_mode", "Payment Mode");

  if (rows.length === 0) {
    const fallback = data.applicationFee || data.application_fee;
    if (typeof fallback === "string" && fallback.trim()) {
      rows.push({ id: "general", label: "General", value: fallback });
    }
  }

  return rows;
};

const buildSalaryRows = (data) => {
  const rows = [];
  const salary = data.salary || data.salaryRange || data.salary_range || data.salaryDetails;
  const payLevel = data.payLevel || data.pay_level;
  const payScale = data.payScale || data.pay_scale;
  const salaryRange = data.salaryRange || data.salary_range;

  if (salary != null && salary !== "") {
    rows.push({ id: "salary", label: "Salary", value: salary });
  }
  if (salaryRange != null && salaryRange !== "" && salaryRange !== salary) {
    rows.push({ id: "salaryRange", label: "Salary Range", value: salaryRange });
  }
  if (payLevel != null && payLevel !== "") {
    rows.push({ id: "payLevel", label: "Pay Level", value: payLevel });
  }
  if (payScale != null && payScale !== "") {
    rows.push({ id: "payScale", label: "Pay Scale", value: payScale });
  }

  return rows;
};

const parseAgeLimit = (value) => {
  if (!value) return null;
  const raw = String(value).trim();
  const rangeMatch = raw.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return { min: `${rangeMatch[1]} Years`, max: `${rangeMatch[2]} Years` };
  }
  if (typeof value === "object" && value !== null) {
    const min = value.min || value.minimum || value.minAge;
    const max = value.max || value.maximum || value.maxAge;
    if (min || max) {
      return {
        min: min ? `${min} Years` : null,
        max: max ? `${max} Years` : null,
      };
    }
  }
  return null;
};

const childModuleConfigs = [
  { moduleType: "result", service: resultService },
  { moduleType: "admitCards", service: admitCardService },
  { moduleType: "answerKeys", service: answerKeyService },
  { moduleType: "syllabus", service: syllabusService },
  { moduleType: "admissions", service: admissionService },
  { moduleType: "certificates", service: certificateService },
  { moduleType: "important", service: importantService },
];

const normalizeText = (value) => {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

const getTextSimilarity = (left, right) => {
  const leftTokens = new Set(normalizeText(left).split(/\s+/).filter(Boolean));
  const rightTokens = new Set(normalizeText(right).split(/\s+/).filter(Boolean));

  if (!leftTokens.size || !rightTokens.size) return 0;

  const overlap = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;

  return union === 0 ? 0 : overlap / union;
};

const findBestMatchingLatestJob = (childData, latestJobs) => {
  if (!Array.isArray(latestJobs) || latestJobs.length === 0) return null;

  const directSlug = childData?.jobSlug || childData?.latestJobSlug || childData?.masterJobSlug || childData?.masterSlug || childData?.recruitmentSlug;
  if (directSlug) {
    const directMatch = latestJobs.find((job) => normalizeText(job?.slug) === normalizeText(directSlug));
    if (directMatch) return directMatch;
  }

  let bestMatch = null;
  let bestScore = 0;

  latestJobs.forEach((job) => {
    const titleScore = getTextSimilarity(childData?.title, job?.title);
    const organizationScore = getTextSimilarity(childData?.organization, job?.organization);
    const slugScore = getTextSimilarity(childData?.slug, job?.slug);
    const score = titleScore * 0.65 + organizationScore * 0.2 + slugScore * 0.15;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = job;
    }
  });

  return bestScore >= 0.25 ? bestMatch : null;
};

const mergeJobData = (masterData, childData, moduleType) => {
  if (!masterData) return null;

  return {
    ...masterData,
    moduleType,
    notificationPdf: masterData.notificationPdf || null,
    applyLink: masterData.applyLink || null,
    officialWebsite: masterData.officialWebsite || null,
    downloadUrl: childData?.downloadUrl || masterData?.downloadUrl || null,
  };
};

const JobDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const title = location.state?.title;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const normalizedSlug = String(slug || "").trim();
        const childResults = await Promise.allSettled(
          childModuleConfigs.map(async ({ moduleType, service }) => {
            const data = await service.getBySlug(normalizedSlug);
            return data ? { moduleType, data } : null;
          })
        );

        const childEntry = childResults
          .map((result) => (result.status === "fulfilled" ? result.value : null))
          .find(Boolean);

        const moduleType = childEntry?.moduleType || "latestJobs";
        const childData = childEntry?.data || null;

        let masterData = null;

        if (moduleType === "latestJobs") {
          masterData = await latestJobService.getBySlug(normalizedSlug);
        } else {
          const latestJobs = await latestJobService.getAll();
          masterData = findBestMatchingLatestJob(childData, latestJobs);

          if (!masterData && normalizedSlug) {
            const directMaster = await latestJobService.getBySlug(normalizedSlug);
            if (directMaster) {
              masterData = directMaster;
            }
          }
        }

        if (!masterData) {
          setNotFound(true);
          setJob(null);
          return;
        }

        const data = mergeJobData(masterData, childData, moduleType);
        const mapped = { ...data, moduleType };

        mapped.postDate = formatDate(data.postDate);
        mapped.lastDate = formatDate(data.lastDate);
        mapped.examDate = formatDate(data.examDate);
        mapped.applyLastDate = formatDate(data.lastDate);

        mapped.links = {
          officialWebsite: data.officialWebsite || null,
          applyLink: data.applyLink || null,
          notificationPdf: data.notificationPdf || null,
          downloadUrl: data.downloadUrl || null,
        };

        mapped.importantDates = [];
        if (mapped.postDate) mapped.importantDates.push({ id: "p1", label: "Post Date", value: mapped.postDate });
        if (mapped.lastDate) mapped.importantDates.push({ id: "p2", label: "Last Date", value: mapped.lastDate });
        if (mapped.examDate) mapped.importantDates.push({ id: "p3", label: "Exam Date", value: mapped.examDate });

        const applicationFeeRows = buildApplicationFeeRows(data);
        mapped.applicationFee = applicationFeeRows.length
          ? applicationFeeRows
          : [{ id: "no-fee", label: "Application Fee Not Available", value: "" }];

        mapped.salaryRows = buildSalaryRows(data);
        mapped.ageLimit = parseAgeLimit(data.ageLimit || data.age_limit || data.age);

        mapped.vacancyDetails = [];
        if (data.vacancy || data.vacancy === 0) {
          mapped.vacancyDetails.push({
            id: "v1",
            post: data.title || "Post",
            total: data.vacancy,
            eligibility: data.qualification || "",
          });
        }

        mapped.details = [
          { id: "org", label: "Organization", value: data.organization },
          { id: "category", label: "Category", value: data.category },
          { id: "state", label: "State", value: data.state },
          { id: "qualification", label: "Qualification", value: data.qualification },
        ].filter((row) => row.value != null && String(row.value).trim() !== "");

        if (data.applyLink) {
          mapped.howToApply = [{ id: "h1", text: `Apply Online: ${data.applyLink}` }];
        } else {
          mapped.howToApply = [];
        }

        setJob(mapped);
      } catch (err) {
        setError(err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [slug]);

  return (
    <div className="max-w-[1100px] mx-auto px-3 py-4">
      <div className="flex items-center text-[12.5px] text-gray-600 mb-3 flex-wrap">
        <Link to="/" className="hover:text-[#cc0000]">Home</Link>
        <ChevronRight size={14} className="mx-1" />
        <Link to="/category/latest-job" className="hover:text-[#cc0000]">Latest Jobs</Link>
        <ChevronRight size={14} className="mx-1" />
        <span className="font-semibold text-gray-900 line-clamp-1">{job?.title || title || "Job Details"}</span>
      </div>

      {loading ? (
        <div className="p-4 text-center text-sm text-slate-600">Loading...</div>
      ) : notFound ? (
        <div className="p-4 text-center text-sm text-slate-600">Job Not Found</div>
      ) : error ? (
        <div className="p-4 text-center text-sm text-red-600">Failed to load job details</div>
      ) : job ? (
        <JobTitleBlock
          title={job.title}
          postDate={job.postDate}
          details={job.details}
          category={job.category}
          qualification={job.qualification}
          links={job.links}
          id={job.id}
        />
      ) : (
        <div className="p-4 text-center text-sm text-slate-600">Job details are unavailable</div>
      )}

      {job && (
        <>
          <div className="grid gap-4 xl:grid-cols-3 md:grid-cols-2 mt-4">
            <JobInfoTable title="Important Dates" color="#1a3a8a" rows={job.importantDates || []} Icon={Calendar} />
            <JobInfoTable title="Application Fee" color="#0f7a3a" rows={job.applicationFee || []} Icon={IndianRupee} />
            {job.salaryRows?.length > 0 && (
              <JobInfoTable title="Salary" color="#d97706" rows={job.salaryRows} Icon={IndianRupee} />
            )}
          </div>

          {job.ageLimit && <AgeLimitBox ageLimit={job.ageLimit} />}
          {job.vacancyDetails?.length > 0 && <VacancyTable rows={job.vacancyDetails} />}
          <ActionLinks record={job} moduleType={job.moduleType} />
          {job.howToApply && job.howToApply.length > 0 && <HowToApplyBox steps={job.howToApply} />}
        </>
      )}

      <div className="mt-4 p-3 border border-dashed border-gray-300 text-[12px] text-gray-600 bg-gray-50 rounded-sm">
        <strong>Official Notice:</strong> This page displays official recruitment-related information and links from verified sources.
      </div>
    </div>
  );
};

export default JobDetail;
