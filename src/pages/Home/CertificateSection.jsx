import { useEffect, useState } from "react";
import JobSection from "../../components/JobSection";
import certificateService from "../../services/certificateService";

const CertificateSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await certificateService.getAll();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return <JobSection title="Certificate Verification" items={items} accent="blue" category="certificate" loading={loading} error={error} />;
};

export default CertificateSection;
