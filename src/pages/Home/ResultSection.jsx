import { useEffect, useState } from "react";
import JobSection from "../../components/JobSection";
import resultService from "../../services/resultService";

const ResultSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await resultService.getAll();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return <JobSection title="Results" items={items} accent="blue" category="result" loading={loading} error={error} />;
};

export default ResultSection;
