import React from 'react';

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
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
                : "border-gray-300"
            }
          `}
          >
            {selected === option.opt_id && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          {/* Display the option letter */}
          <span className="font-medium mr-2 text-gray-800">
            {getOptionLetter(i)})
          </span>
          <span className="text-gray-800 flex-1">{option.text}</span>
        </div>
      </label>
    );
  }

  return (
    <div className="bg-white h-full flex flex-col p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">
          Question {questionNumber} of {totalQuestions}
        </h3>
        <span className="text-sm text-gray-500">{sectionName}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {/* Question Text */}
        <div className="mb-6">
          <p className="text-gray-800 leading-relaxed">
            {question.question_text}
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {optionsWithLetters}
        </div>
      </div>
    </div>
  );
}