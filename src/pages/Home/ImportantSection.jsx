import { useEffect, useState } from "react";
import JobSection from "../../components/JobSection";
import importantService from "../../services/importantService";

const ImportantSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await importantService.getAll();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return <JobSection title="Important" items={items} accent="maroon" category="important" loading={loading} error={error} />;
};

export default ImportantSection;
