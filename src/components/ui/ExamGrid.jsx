import { Link } from "react-router-dom";
import { FaClock, FaQuestionCircle, FaStar, FaFileAlt } from "react-icons/fa";

export default function ExamGrid({ exams }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => (
        <Link
          key={exam.exam_id}
          to={`/exams/${encodeURIComponent(exam.exam_id)}`}
          className="group relative flex flex-col justify-between bg-white border border-gray-200 
          rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-blue-300
          dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-600 dark:shadow-black/20"
        >
          <span
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
              exam.exam_strength === "easy"
                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                : exam.exam_strength === "medium"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
                : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
            }`}
          >
            {exam.exam_strength.charAt(0).toUpperCase() +
              exam.exam_strength.slice(1)}
          </span>

          <div className="flex items-center mb-4">
            <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 dark:bg-blue-900/40 dark:group-hover:bg-blue-900/60">
              <FaFileAlt className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors truncate dark:text-gray-100 dark:group-hover:text-blue-300">
            {exam.exam_name}
          </h3>

          <div className="flex flex-col text-gray-600 text-sm gap-2 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <FaClock className="text-blue-400 w-4 h-4 flex-shrink-0" />
              <span>{exam.duration_minutes} mins</span>
            </div>
            <div className="flex items-center gap-2">
              <FaQuestionCircle className="text-green-400 w-4 h-4 flex-shrink-0" />
              <span>{exam.total_questions} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400 w-4 h-4 flex-shrink-0" />
              <span>{exam.total_marks} Marks</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
