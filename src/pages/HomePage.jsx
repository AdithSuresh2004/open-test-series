import { useState, useEffect } from "react";
import { getExamsManifest } from "@/services/examsService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import ExamGrid from "../components/ui/ExamGrid";

export default function HomePage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const manifest = await getExamsManifest();
      setExams(manifest?.full_tests || []);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} onRetry={loadExams} />;

  if (!exams.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Available Exams
        </h1>
        <p className="text-gray-600">
          Select an exam to begin your practice session
        </p>
      </header>
      <ExamGrid exams={exams} />
    </div>
  );
}
