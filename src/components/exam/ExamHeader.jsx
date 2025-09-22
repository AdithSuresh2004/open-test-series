import React from "react";
import {
  FaClock,
  FaStar,
  FaShieldAlt,
  FaExpandArrowsAlt,
  FaArrowLeft,
} from "react-icons/fa";

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
    <div className="bg-white shadow-sm border-b p-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{exam.exam_name}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 items-center">
            <div className="flex items-center gap-1">
              <span>{exam.duration_minutes} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{exam.total_marks} Marks</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="capitalize">{exam.exam_strength}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p>Time:</p>
          <div className={`text-lg font-mono font-bold ${getTimeColor()}`}>
            {formatTime(timeRemaining)}
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <FaExpandArrowsAlt className="h-4 w-4" />
          </button>
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded">
            <FaArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
