import React from "react";
import { FaReact } from "react-icons/fa";

export default function ExamResults({ results, exam, onReturn }) {
  if (!results || !exam) {
    return null;
  }

  const percentage = Math.round(
    Math.max(0, (results.totalScore / exam.total_marks) * 100)
  );

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 text-center max-w-2xl w-full">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaReact className="text-white text-5xl animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Exam Submitted!
          </h2>
          <p className="text-gray-300">
            Your responses have been recorded successfully.
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Your Results</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-400">
                {results.totalScore}
              </p>
              <p className="text-sm text-gray-300">Your Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">
                {exam.total_marks}
              </p>
              <p className="text-sm text-gray-300">Maximum Marks</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">{percentage}% Score</p>
          </div>
        </div>

        {/* Section-wise score breakdown */}
        <div className="text-left mt-6">
          <h4 className="text-md font-semibold text-white mb-2">
            Score Per Section:
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {Object.entries(results.sectionScores).map(([sectionId, score]) => (
              <li key={sectionId} className="flex justify-between items-center">
                <span>
                  {
                    exam.sections.find((s) => s.section_id === sectionId)
                      ?.section_name
                  }
                  :
                </span>
                <span className="font-medium text-blue-400">
                  {score} /{" "}
                  {
                    exam.sections.find((s) => s.section_id === sectionId)
                      ?.max_marks
                  }
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onReturn}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all cursor-pointer duration-200 font-medium shadow-lg"
          >
            Back to Home
          </button>
          <button
            onClick={() => null} // Placeholder for future analysis functionality
            className="bg-gray-600 hover:bg-gray-700 cursor-pointer text-white px-6 py-3 
            rounded-lg transition-all duration-200 font-medium shadow-lg"
          >
            Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
