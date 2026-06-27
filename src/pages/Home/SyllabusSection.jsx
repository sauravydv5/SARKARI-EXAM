import { useEffect, useState } from "react";
import JobSection from "../../components/JobSection";
import syllabusService from "../../services/syllabusService";

const SyllabusSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await syllabusService.getAll();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return <JobSection title="Syllabus" items={items} accent="teal" category="syllabus" loading={loading} error={error} />;
};

export default SyllabusSection;
