import { Clock, FileText, Target, Award, Book } from "lucide-react";
import { Link } from "react-router-dom";

const getDifficultyColor = (strength) =>
  ({
    Easy: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    Medium:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    Hard: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  }[strength] ||
  "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400");

const getTestTypeConfig = (type) =>
  ({
    full_tests: {
      color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      icon: FileText,
      label: "Mock Test",
    },
    subject_tests: {
      color:
        "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      icon: Book,
      label: "Subject Test",
    },
    topic_tests: {
      color:
        "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      icon: Target,
      label: "Topic Test",
    },
  }[type] || {
    color: "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
    icon: FileText,
    label: "Test",
  });

export default function TestCard({ test }) {
  const testTypeConfig = getTestTypeConfig(test.type);
  const TestIcon = testTypeConfig.icon;
  const subjects = test.subjects || (test.subject ? [test.subject] : []);
  const topics = test.topics || (test.topic ? [test.topic] : []);

  // Combine subjects and topics for a unified tag display
  const allTags = [
    ...subjects.map(subject => ({ text: subject, type: 'subject' })),
    ...topics.map(topic => ({ text: topic, type: 'topic' }))
  ];

  const maxVisibleTags = 3;
  const visibleTags = allTags.slice(0, maxVisibleTags);
  const remainingCount = allTags.length - maxVisibleTags;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg 
    hover:shadow-md transition-shadow duration-200 p-4 flex flex-col h-72">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3 h-6">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
            test.exam_strength
          )}`}
        >
          {test.exam_strength || "Normal"}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${testTypeConfig.color}`}
        >
          <TestIcon className="w-3 h-3 mr-1.5" />
          {testTypeConfig.label}
        </span>
      </div>

      {/* Title - Fixed height with truncation */}
      <div className="h-7 mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight truncate">
          {test.exam_name}
        </h3>
      </div>

      {/* Category - Fixed height */}
      <div className="h-5 mb-3">
        {test.category && (
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {test.category}
          </p>
        )}
      </div>

      {/* Stats - Fixed height but always visible */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{test.duration_minutes} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{test.total_questions} ques</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{test.total_marks} marks</span>
          </div>
        </div>
      </div>

      {/* Tags - Fixed height with controlled overflow */}
      <div className="h-16 mb-4 overflow-hidden">
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag, idx) => (
              <span
                key={`${tag.type}-${idx}`}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md whitespace-nowrap inline-block"
              >
                {tag.text}
              </span>
            ))}
            {remainingCount > 0 && (
              <span 
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md inline-block"
                title={`${remainingCount} more: ${allTags.slice(maxVisibleTags).map(tag => tag.text).join(', ')}`}
              >
                +{remainingCount} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Button - Always at bottom */}
      <div className="mt-auto">
        <Link
          to={`/exam/${encodeURIComponent(test.uid || test.exam_id)}`}
          className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg py-2.5 px-4 transition-colors duration-200"
        >
          Start Test
        </Link>
      </div>
    </div>
  );
}