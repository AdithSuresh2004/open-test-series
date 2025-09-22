import { Clock, FileText, Target, Award, Book } from "lucide-react";
import { Link } from "react-router-dom";

const getDifficultyColor = (strength) =>
  ({
    easy: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    hard: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  }[strength] || "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400");

const getTestTypeConfig = (type) =>
  ({
    full_tests: {
      color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      icon: FileText,
      label: "Mock Test"
    },
    subject_tests: {
      color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      icon: Book,
      label: "Subject Test"
    },
    topic_tests: {
      color: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      icon: Target,
      label: "Topic Test"
    },
  }[type] || {
    color: "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
    icon: FileText,
    label: "Test"
  });

export default function TestCard({ test, isListView = false }) {
  const testTypeConfig = getTestTypeConfig(test.type);
  const TestIcon = testTypeConfig.icon;

  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${
        isListView 
          ? "flex flex-col sm:flex-row p-4 gap-4" 
          : "p-4 flex flex-col h-full"
      }`}
    >
      {/* Header */}
      <div className={`${isListView ? "flex-1" : "flex-1"}`}>
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
              test.exam_strength
            )}`}
          >
            {test.exam_strength || "Normal"}
          </span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${testTypeConfig.color}`}
          >
            <TestIcon className="w-3 h-3 mr-1" />
            {testTypeConfig.label}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-lg leading-tight">
          {test.exam_name}
        </h3>

        {test.category && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {test.category}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{test.duration_minutes} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{test.total_questions} qns</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{test.total_marks} marks</span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2 mb-4">
          {test.subjects && test.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {test.subjects.slice(0, 3).map((subject, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                >
                  {subject}
                </span>
              ))}
              {test.subjects.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded">
                  +{test.subjects.length - 3}
                </span>
              )}
            </div>
          )}

          {(test.topic || (test.topics && test.topics.length > 0)) && (
            <div className="flex flex-wrap gap-1">
              {test.topic && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                  {test.topic}
                </span>
              )}
              {test.topics && test.topics.slice(0, 3).map((topic, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                >
                  {topic}
                </span>
              ))}
              {test.topics && test.topics.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded">
                  +{test.topics.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="mt-auto">
        <Link
          to={`/exam/${test.exam_id}`}
          className={`block bg-blue-600 text-white text-center py-2 px-4 rounded font-medium text-sm ${
            isListView ? "sm:w-32" : "w-full"
          }`}
        >
          Start Test
        </Link>
      </div>
    </div>
  );
}