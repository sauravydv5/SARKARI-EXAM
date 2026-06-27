import { useEffect, useState } from "react";
import JobSection from "../../components/JobSection";
import latestJobService from "../../services/latestJobService";

const LatestJobsSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await latestJobService.getAll();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return <JobSection title="Latest Jobs" items={items} accent="red" category="latest-job" loading={loading} error={error} />;
};

export default LatestJobsSection;
