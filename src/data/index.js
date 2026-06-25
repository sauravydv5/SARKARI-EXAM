import latestJobs from './latestJobs.json';
import results from './results.json';
import admitCards from './admitCards.json';
import answerKeys from './answerKeys.json';
import syllabus from './syllabus.json';
import admissions from './admissions.json';
import important from './important.json';
import certificates from './certificates.json';

export { latestJobs, results, admitCards, answerKeys, syllabus, important };
export const admission = admissions;
export const importantUpdates = important;
export const certificateVerification = certificates;

const commonImportantDates = [
	{ id: 'd1', label: 'Application Begin', value: '01/07/2025' },
	{ id: 'd2', label: 'Last Date for Apply Online', value: '30/07/2025' },
	{ id: 'd3', label: 'Exam Date', value: 'As per Schedule' },
];

const commonApplicationFee = [
	{ id: 'f1', label: 'General / OBC / EWS', value: '? 700/-' },
	{ id: 'f2', label: 'SC / ST / PH', value: '? 400/-' },
	{ id: 'f3', label: 'Payment Mode', value: 'Online via Debit Card, Credit Card, Net Banking, UPI' },
];

const commonAgeLimit = {
	asOn: '01/08/2025',
	min: '18 Years',
	max: '30 Years',
	note: 'Age relaxation as per government rules.',
};

const commonVacancyDetails = [
	{ id: 'v1', post: 'Junior Engineer (Civil)', total: 245, eligibility: 'B.E / B.Tech (Civil) or Diploma in Civil Engineering.' },
	{ id: 'v2', post: 'Junior Engineer (Electrical)', total: 180, eligibility: 'B.E / B.Tech (Electrical) or Diploma in Electrical Engineering.' },
];

const commonHowToApply = [
	{ id: 'h1', text: 'Read the notification carefully before applying online.' },
	{ id: 'h2', text: 'Check required documents and eligibility before submitting.' },
	{ id: 'h3', text: 'Review your application before final submission.' },
];

export const allJobs = [
	{
		id: 'latest-1',
		title: 'RRB Junior Engineer (Civil) 2025',
		postDate: '05 Jul 2025',
		shortInfo: 'Apply online for Railway JE Civil recruitment with multiple district vacancies.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: { downloadNotification: 'https://example.com/rrb-je-civil', officialWebsite: 'https://www.rrbcdg.gov.in' },
	},
	{
		id: 'latest-2',
		title: 'SSC CHSL 2025 Notification',
		postDate: '03 Jul 2025',
		shortInfo: 'Online application for SSC CHSL recruitment is now open.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: { downloadNotification: 'https://example.com/ssc-chsl', officialWebsite: 'https://ssc.nic.in' },
	},
	{
		id: 'latest-3',
		title: 'UPSC NDA 2025 Application Open',
		postDate: '01 Jul 2025',
		shortInfo: 'UPSC NDA recruitment notification has been published for 2025 intake.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: { downloadNotification: 'https://example.com/upsc-nda', officialWebsite: 'https://upsc.gov.in' },
	},
	{
		id: 'result-1',
		title: 'SSC CGL Tier 2 Result 2025',
		postDate: '02 Jul 2025',
		shortInfo: 'SSC CGL Tier 2 result has been released for the latest cycle.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: {
			downloadResult: 'https://example.com/ssc-cgl-tier2-result-download',
			resultDate: '02 Jul 2025',
			downloadNotification: 'https://example.com/ssc-cgl-result',
			officialWebsite: 'https://ssc.nic.in',
		},
	},
	{
		id: 'admit-1',
		title: 'IBPS PO Admit Card 2025',
		postDate: '30 Jun 2025',
		shortInfo: 'Download the IBPS PO admit card for the 2025 recruitment cycle.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: {
			downloadAdmit: 'https://example.com/ibps-po-admit-card',
			admitDate: '30 Jun 2025',
			downloadNotification: 'https://example.com/ibps-po-admit',
			officialWebsite: 'https://www.ibps.in',
		},
	},
	{
		id: 'answer-1',
		title: 'UPSC CDS Answer Key 2025',
		postDate: '29 Jun 2025',
		shortInfo: 'Official UPSC CDS answer key is now available for download.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: {
			downloadAnswerKey: 'https://example.com/upsc-cds-answer-key',
			answerKeyDate: '29 Jun 2025',
			downloadNotification: 'https://example.com/upsc-cds-answer',
			officialWebsite: 'https://upsc.gov.in',
		},
	},
	{
		id: 'syllabus-1',
		title: 'SSC CHSL Syllabus 2025',
		postDate: '27 Jun 2025',
		shortInfo: 'Updated SSC CHSL syllabus details are available for the upcoming exam.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: {
			downloadSyllabus: 'https://example.com/ssc-chsl-syllabus-download',
			syllabusDate: '27 Jun 2025',
			downloadNotification: 'https://example.com/ssc-chsl-syllabus',
			officialWebsite: 'https://ssc.nic.in',
		},
	},
	{
		id: 'admission-1',
		title: 'DU UG Admission 2025 Notification',
		postDate: '26 Jun 2025',
		shortInfo: 'Admissions for DU undergraduate programs have opened for 2025.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: {
			downloadAdmission: 'https://example.com/du-ug-admission-form',
			admissionDate: '26 Jun 2025',
			downloadNotification: 'https://example.com/du-admission',
			officialWebsite: 'https://www.du.ac.in',
		},
	},
	{
		id: 'important-1',
		title: 'GST Portal Update for Taxpayers',
		postDate: '25 Jun 2025',
		shortInfo: 'Important GST portal notice published for registered taxpayers.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: { downloadNotification: 'https://example.com/gst-update', officialWebsite: 'https://www.gst.gov.in' },
	},
	{
		id: 'certificate-1',
		title: 'MPSC Certificate Verification 2025',
		postDate: '24 Jun 2025',
		shortInfo: 'Certificate verification schedule for MPSC recruitment is available.',
		importantDates: commonImportantDates,
		applicationFee: commonApplicationFee,
		ageLimit: commonAgeLimit,
		vacancyDetails: commonVacancyDetails,
		howToApply: commonHowToApply,
		links: { downloadNotification: 'https://example.com/mpsc-certificate', officialWebsite: 'https://www.mpsc.gov.in' },
	},
];

export function getJobDetail(id, title) {
	const job = allJobs.find((item) => item.id === id || item.slug === id);
	if (job) return job;
	return {
		id,
		title: title || 'Notification details',
		postDate: 'TBD',
		shortInfo: 'No detailed mock data is available for this item',
		importantDates: [],
		applicationFee: [],
		ageLimit: { asOn: 'TBD', min: 'N/A', max: 'N/A', note: 'This is a placeholder.' },
		vacancyDetails: [],
		howToApply: [],
		links: { downloadNotification: '#', officialWebsite: '#' },
	};
}
