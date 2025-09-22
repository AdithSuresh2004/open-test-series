import React from "react";

export default function ExamResults({ results, exam, onReturn }) {
  if (!results || !exam) {
    return null;
  }

  const percentage = Math.round(
    Math.max(0, (results.totalScore / exam.total_marks) * 100)
  );

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-2xl w-full">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Exam Submitted!
          </h2>
          <p className="text-gray-600">
            Your responses have been recorded successfully.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Results</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {results.totalScore}
              </p>
              <p className="text-sm text-gray-600">Your Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {exam.total_marks}
              </p>
              <p className="text-sm text-gray-600">Maximum Marks</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{percentage}% Score</p>
          </div>
        </div>

        {/* Section-wise score breakdown */}
        <div className="text-left mt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            Score Per Section:
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {Object.entries(results.sectionScores).map(([sectionId, score]) => (
              <li key={sectionId} className="flex justify-between items-center">
                <span>
                  {
                    exam.sections.find((s) => s.section_id === sectionId)
                      ?.section_name
                  }
                  :
                </span>
                <span className="font-medium text-blue-600">
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

        <button
          onClick={onReturn}
          className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
