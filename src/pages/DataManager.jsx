import { useEffect, useMemo, useState } from "react";
import Header from "../components/datamanager/Header";
import Sidebar from "../components/datamanager/Sidebar";
import DataTable from "../components/datamanager/DataTable";
import Modal from "../components/datamanager/Modal";
import LatestJobForm from "../components/datamanager/forms/LatestJobForm";
import ResultForm from "../components/datamanager/forms/ResultForm";
import AdmitCardForm from "../components/datamanager/forms/AdmitCardForm";
import AnswerKeyForm from "../components/datamanager/forms/AnswerKeyForm";
import SyllabusForm from "../components/datamanager/forms/SyllabusForm";
import AdmissionForm from "../components/datamanager/forms/AdmissionForm";
import CertificateForm from "../components/datamanager/forms/CertificateForm";
import ImportantForm from "../components/datamanager/forms/ImportantForm";
import latestJobService from "../services/latestJobService";
import resultService from "../services/resultService";
import admitCardService from "../services/admitCardService";
import answerKeyService from "../services/answerKeyService";
import syllabusService from "../services/syllabusService";
import admissionService from "../services/admissionService";
import certificateService from "../services/certificateService";
import importantService from "../services/importantService";

const sectionMap = {
  latestJobs: { label: "Latest Jobs", form: LatestJobForm },
  results: { label: "Results", form: ResultForm },
  admitCards: { label: "Admit Cards", form: AdmitCardForm },
  answerKeys: { label: "Answer Keys", form: AnswerKeyForm },
  syllabus: { label: "Syllabus", form: SyllabusForm },
  admissions: { label: "Admissions", form: AdmissionForm },
  certificates: { label: "Certificates", form: CertificateForm },
  important: { label: "Important", form: ImportantForm },
};

const defaultForm = {
  title: "",
  slug: "",
  organization: "",
  category: "",
  state: "",
  postDate: "",
  lastDate: "",
  examDate: "",
  vacancy: "",
  qualification: "",
  ageLimit: "",
  salary: "",
  officialWebsite: "",
  notificationPdf: "",
  applyLink: "",
  date: "",
  downloadUrl: "",
  status: "Live",
  isLatest: false,
};

function DataManager() {
  const [activeSection, setActiveSection] = useState("latestJobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsBySection, setItemsBySection] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState(defaultForm);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const sectionConfig = sectionMap[activeSection];
  const SectionForm = sectionConfig?.form;
  const sectionLabel = sectionConfig?.label || "Data";
  const sectionItems = itemsBySection[activeSection] ?? [];

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return sectionItems;
    const lowerQuery = searchQuery.toLowerCase();
    return sectionItems.filter((item) =>
      [item.title, item.status, item.date, item.slug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, sectionItems]);

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
    setSearchQuery("");
    setEditingItem(null);
    setFormValues(defaultForm);
    setFeedbackMessage("");
  };

  useEffect(() => {
    loadSectionItems(activeSection);
  }, [activeSection]);

  const handleOpenNew = () => {
    setEditingItem(null);
    setFormValues(defaultForm);
    setFeedbackMessage("");
    setModalVisible(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormValues({ ...defaultForm, ...item });
    setFeedbackMessage("");
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDeleteItem = async (item) => {
    const service = getService();
    if (!service) {
      setFeedbackMessage("No service available for this section.");
      return;
    }

    setSaving(true);
    setFeedbackMessage("");
    try {
      const itemId = item._id || item.id;
      if (!itemId) throw new Error("Missing item id.");
      await service.delete(itemId);
      await loadSectionItems(activeSection);
      setFeedbackMessage(`Removed “${item.title || item.slug}” from ${sectionLabel}.`);
    } catch (err) {
      setFeedbackMessage(err?.response?.data?.message || err?.message || "Delete failed.");
    } finally {
      setSaving(false);
    }
  };

  const getService = () => {
    switch (activeSection) {
      case "latestJobs":
        return latestJobService;
      case "results":
        return resultService;
      case "admitCards":
        return admitCardService;
      case "answerKeys":
        return answerKeyService;
      case "syllabus":
        return syllabusService;
      case "admissions":
        return admissionService;
      case "certificates":
        return certificateService;
      case "important":
        return importantService;
      default:
        return null;
    }
  };

  const getValidationError = () => {
    if (!formValues.title?.trim()) return "Title is required.";
    return null;
  };

  const loadSectionItems = async (sectionKey) => {
    const service = getService();
    if (!service) return;

    setLoading(true);
    try {
      const data = await service.getAll();
      setItemsBySection((prev) => ({ ...prev, [sectionKey]: Array.isArray(data) ? data : [] }));
    } catch (err) {
      setFeedbackMessage(err?.response?.data?.message || err?.message || "Unable to load records from backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const validationError = getValidationError();
    if (validationError) {
      setFeedbackMessage(validationError);
      return;
    }

    const service = getService();
    if (!service) {
      setFeedbackMessage("No service available for this section.");
      return;
    }

    setSaving(true);
    setFeedbackMessage("");

    try {
      const payload = { ...formValues };
      if (editingItem) {
        const itemId = editingItem._id || editingItem.id;
        if (!itemId) throw new Error("Missing item id for update.");
        delete payload._id;
        delete payload.id;
        await service.update(itemId, payload);
        setFeedbackMessage("Record updated successfully.");
      } else {
        await service.create(payload);
        setFeedbackMessage("Record saved successfully.");
      }

      setModalVisible(false);
      setEditingItem(null);
      setFormValues(defaultForm);
      await loadSectionItems(activeSection);
    } catch (err) {
      setFeedbackMessage(err?.response?.data?.message || err?.message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Data Manager</h1>
          <p className="mt-2 text-sm text-slate-500">Use the sidebar to switch sections and manage sample records locally.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <Sidebar activeModule={activeSection} onSelect={handleSelectSection} />

          <main className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Header
                moduleLabel={sectionLabel}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onRefresh={() => loadSectionItems(activeSection)}
                onAddNew={handleOpenNew}
              />

              <DataTable items={filteredItems} loading={loading} onEdit={handleOpenEdit} onDelete={handleDeleteItem} />
            </div>
          </main>
        </div>
      </div>

      <Modal
        visible={modalVisible}
        title={editingItem ? `Edit ${sectionLabel}` : `New ${sectionLabel} record`}
        onClose={handleCloseModal}
        footer={
          <div className="flex flex-col gap-3 rounded-3xl bg-white px-0 pb-0 pt-0 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {SectionForm ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <SectionForm form={formValues} onChange={handleFormChange} />
            </div>
          ) : (
            <p className="text-sm text-slate-600">No form available for this section.</p>
          )}

          {feedbackMessage && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {feedbackMessage}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DataManager;
