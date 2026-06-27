import { useEffect, useState } from "react";
import JobSection from "../../components/JobSection";
import answerKeyService from "../../services/answerKeyService";

const AnswerKeySection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await answerKeyService.getAll();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return <JobSection title="Answer Keys" items={items} accent="orange" category="answer-key" loading={loading} error={error} />;
};

export default AnswerKeySection;
