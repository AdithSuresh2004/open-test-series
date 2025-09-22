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
          rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300"
        >
          <span
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
              exam.exam_strength === "easy"
                ? "bg-green-100 text-green-800"
                : exam.exam_strength === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {exam.exam_strength.charAt(0).toUpperCase() +
              exam.exam_strength.slice(1)}
          </span>

          <div className="flex items-center mb-4">
            <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
              <FaFileAlt className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors truncate">
            {exam.exam_name}
          </h3>

          <div className="flex flex-col text-gray-600 text-sm gap-2">
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
