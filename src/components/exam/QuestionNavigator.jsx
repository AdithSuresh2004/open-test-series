import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";

export default function QuestionNavigator({
  sections,
  currentSection,
  currentQuestion,
  onNavigate,
  answers = {},
  markedForReview = new Set(),
}) {
  const [visibleSectionIndex, setVisibleSectionIndex] =
    useState(currentSection);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setVisibleSectionIndex(currentSection);
  }, [currentSection]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSectionData = sections[visibleSectionIndex];

  const handleSectionChange = (sectionIndex) => {
    setVisibleSectionIndex(sectionIndex);
    setIsDropdownOpen(false);
  };

  const getQuestionStatus = (question, qIndex) => {
    const qId = question.q_id;
    const isAnswered = answers.hasOwnProperty(qId);
    const isCurrent =
      visibleSectionIndex === currentSection && qIndex === currentQuestion;
    const isMarked = markedForReview.has(qId);

    if (isCurrent) return "bg-blue-600 text-white shadow";
    if (isMarked)
      return "bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200";
    if (isAnswered)
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
    return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div className="bg-white dark:bg-gray-800 h-full w-full border-l border-gray-300 dark:border-gray-700 flex flex-col">
      {/* Header with Dropdown */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 text-center font-semibold text-gray-900 dark:text-gray-200">
        <div className="relative w-full" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm 
              hover:border-gray-400 dark:hover:border-gray-500 flex items-center justify-between transition"
          >
            <span className="truncate pr-2">
              {sections[visibleSectionIndex]?.section_name}
            </span>
            <IoChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {sections.map((section, sIndex) => (
                <button
                  key={section.section_id}
                  onClick={() => handleSectionChange(sIndex)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors rounded-sm
                    ${
                      sIndex === visibleSectionIndex
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium"
                        : "text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                >
                  {section.section_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Question Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-5 gap-3">
          {currentSectionData?.questions.map((question, qIndex) => (
            <button
              key={question.q_id}
              onClick={() => onNavigate(visibleSectionIndex, qIndex)}
              className={`w-9 h-9 text-sm rounded-md flex items-center justify-center font-medium transition-all ${getQuestionStatus(
                question,
                qIndex
              )}`}
            >
              {qIndex + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
