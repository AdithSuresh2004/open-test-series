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
    <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
            ${
              canGoPrev
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white shadow-md border border-blue-600"
                : "bg-gray-300 text-gray-400 cursor-not-allowed border border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-700"
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
                className="bg-purple-500 hover:bg-purple-600 cursor-pointer text-white px-5 py-3 rounded-lg font-medium transition-all duration-200 border border-purple-500 dark:bg-purple-600 dark:border-purple-600 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <IoFlag className="w-4 h-4" />
                Mark for Review & Next
              </button>

              <button
                onClick={onSaveAndNext}
                className="bg-green-500 hover:bg-green-600 cursor-pointer text-white px-5 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-green-500 dark:bg-green-600 dark:border-green-600 flex items-center gap-2"
              >
                <IoSave className="w-4 h-4" />
                Save & Next
              </button>
            </>
          )}
        </div>

        {/* Submit Exam Button */}
        <div>
          <button
            onClick={onSubmit}
            className="bg-red-500 hover:bg-red-600 text-white cursor-pointer px-7 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg border border-red-500 dark:bg-red-600 dark:border-red-600 flex items-center gap-2"
          >
            <IoCheckmarkDone className="w-5 h-5" />
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
