import { useEffect, useState } from "react";
import JobSection from "../../components/JobSection";
import admitCardService from "../../services/admitCardService";

const AdmitCardSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await admitCardService.getAll();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return <JobSection title="Admit Cards" items={items} accent="green" category="admit-card" loading={loading} error={error} />;
};

export default AdmitCardSection;
