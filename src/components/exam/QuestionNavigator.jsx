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
    
    if (isCurrent) return "bg-blue-600 text-white";
    if (isMarked) return "bg-red-200 red-800";
    if (isAnswered) return "bg-green-200 text-green-800";
    return "bg-gray-200 text-gray-600";
  };

  return (
    <div className="bg-white h-full w-full border-l border-gray-200 flex flex-col">
      {/* Header with Dropdown */}
      <div className="p-4 border-b border-gray-200 text-center font-semibold text-gray-800">
        <div className="relative w-full" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-2 text-sm rounded border border-gray-300 bg-white shadow-sm 
              hover:border-gray-400 flex items-center justify-between"
          >
            <span className="truncate pr-2">
              {sections[visibleSectionIndex]?.section_name}
            </span>
            <IoChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
              {sections.map((section, sIndex) => (
                <button
                  key={section.section_id}
                  onClick={() => handleSectionChange(sIndex)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                    sIndex === visibleSectionIndex
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
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
        <div className="grid grid-cols-5 gap-4">
          {currentSectionData?.questions.map((question, qIndex) => (
            <button
              key={question.q_id}
              onClick={() => onNavigate(visibleSectionIndex, qIndex)}
              className={`w-9 h-9 text-sm rounded-md flex items-center justify-center font-medium transition-colors ${getQuestionStatus(
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