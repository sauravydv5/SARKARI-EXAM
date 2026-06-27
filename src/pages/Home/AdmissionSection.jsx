import { useEffect, useState } from "react";
import JobSection from "../../components/JobSection";
import admissionService from "../../services/admissionService";

const AdmissionSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await admissionService.getAll();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return <JobSection title="Admissions" items={items} accent="purple" category="admission" loading={loading} error={error} />;
};

export default AdmissionSection;
