import React from "react";

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  sectionName,
  selected,
  onAnswer,
}) {
  const getOptionLetter = (index) => String.fromCharCode(97 + index);

  const optionsWithLetters = [];
  for (let i = 0; i < question.options.length; i++) {
    const option = question.options[i];
    optionsWithLetters.push(
      <label
        key={option.opt_id}
        className={`
          block p-4 rounded-lg border-2 cursor-pointer transition-all
          ${
            selected === option.opt_id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/70"
          }
        `}
      >
        <input
          type="radio"
          name={`question-${question.q_id}`}
          value={option.opt_id}
          checked={selected === option.opt_id}
          onChange={() => onAnswer(question.q_id, option.opt_id)}
          className="sr-only"
        />
        <div className="flex items-start">
          <div
            className={`
              flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-1
              ${
                selected === option.opt_id
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300 dark:border-gray-600"
              }
            `}
          >
            {selected === option.opt_id && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          {/* Display the option letter */}
          <span className="font-medium mr-2 text-gray-800 dark:text-gray-200">
            {getOptionLetter(i)})
          </span>
          <span className="text-gray-800 dark:text-gray-100 flex-1">
            {option.text}
          </span>
        </div>
      </label>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 h-full flex flex-col p-6 overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Question {questionNumber} of {totalQuestions}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {sectionName}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {/* Question Text */}
        <div className="mb-6">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {question.question_text}
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, i) => (
            <label
              key={option.opt_id}
              className={`
            block p-4 rounded-lg border-2 cursor-pointer transition-all
            ${
              selected === option.opt_id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40"
                : "border-gray-300 hover:border-blue-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/70"
            }
          `}
            >
              <input
                type="radio"
                name={`question-${question.q_id}`}
                value={option.opt_id}
                checked={selected === option.opt_id}
                onChange={() => onAnswer(question.q_id, option.opt_id)}
                className="sr-only"
              />
              <div className="flex items-start">
                <div
                  className={`
                flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-1
                ${
                  selected === option.opt_id
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                }
              `}
                >
                  {selected === option.opt_id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="font-medium mr-2 text-gray-800 dark:text-gray-200">
                  {String.fromCharCode(97 + i)}
                </span>
                <span className="text-gray-800 dark:text-gray-100 flex-1">
                  {option.text}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
