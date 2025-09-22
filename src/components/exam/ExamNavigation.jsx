import {
  IoChevronBack,
  IoCheckmarkDone,
  IoFlag,
  IoSave,
} from "react-icons/io5";

export default function ExamNavigation({
  canGoPrev,
  canGoNext,
  onPrev,
  onSubmit,
  onMarkForReview,
  onSaveAndNext,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
            ${
              canGoPrev
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md border border-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
            }
          `}
        >
          <IoChevronBack className="w-4 h-4" />
          Previous
        </button>

        {/* Middle Actions */}
        <div className="flex gap-4">
          {canGoNext && (
            <>
              <button
                onClick={onMarkForReview}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-medium transition-all duration-200 border border-purple-600 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <IoFlag className="w-4 h-4" />
                Mark for Review & Next
              </button>

              <button
                onClick={onSaveAndNext}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-green-600 flex items-center gap-2"
              >
                <IoSave className="w-4 h-4" />
                Save & Next
              </button>
            </>
          )}
        </div>

        {/* Submit Exam Button */}
        <div className="ml-6">
          <button
            onClick={onSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg border border-red-600 flex items-center gap-2"
          >
            <IoCheckmarkDone className="w-5 h-5" />
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}