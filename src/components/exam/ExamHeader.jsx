import React from "react";
import { FaExpandArrowsAlt, FaArrowLeft } from "react-icons/fa";
import ThemeToggle from "../ui/ThemeToggle";

export default function ExamHeader({ exam, timeRemaining, onBack }) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return "text-red-600";
    if (timeRemaining <= 900) return "text-yellow-600";
    return "text-green-600";
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 p-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Exam Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {exam.exam_name}
          </h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700 dark:text-gray-400 items-center">
            <span>{exam.duration_minutes} mins</span>
            <span>{exam.total_marks} Marks</span>
            <span className="capitalize">{exam.exam_strength}</span>
          </div>
        </div>

        {/* Timer + Actions */}
        <div className="flex items-center gap-3 mt-3 md:mt-0 text-gray-800 dark:text-gray-200">
          <p className="font-medium">Time:</p>
          <div className={`text-lg font-mono font-bold ${getTimeColor()}`}>
            {formatTime(timeRemaining)}
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-md border cursor-pointer border-gray-200 hover:bg-gray-50 text-gray-700
                 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-200"
          >
            <FaExpandArrowsAlt className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <button
            onClick={onBack}
            className="p-2 rounded-md border cursor-pointer border-gray-200 hover:bg-gray-50 text-gray-700
                 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-200"
          >
            <FaArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
