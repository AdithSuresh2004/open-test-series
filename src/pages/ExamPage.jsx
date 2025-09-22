import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import ExamHeader from "../components/exam/ExamHeader";
import QuestionCard from "../components/exam/QuestionCard";
import QuestionNavigator from "../components/exam/QuestionNavigator";
import ExamNavigation from "../components/exam/ExamNavigation";
import SubmissionModal from "../components/modals/SubmissionModal";
import ExitConfirmationModal from "../components/modals/ExitConfirmationModal";
import ExamResults from "../components/exam/ExamResults";
import { useExam } from "../hooks/exam/useExam";

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const {
    exam,
    loading,
    error,
    answers,
    markedForReview,
    showSubmitModal,
    showExitModal,
    submitted,
    results,
    timeRemaining,
    currentSection,
    currentQuestion,
    totalQuestions,
    currentQuestionData,
    setAnswers,
    navigateToQuestion,
    goToPrevQuestion,
    handleSubmit,
    saveProgressAndExit,
    handleSaveAndNext,
    handleMarkForReview,
    setShowSubmitModal,
    setShowExitModal,
  } = useExam(examId, navigate);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error} onRetry={() => navigate("/")} />;
  if (!exam)
    return (
      <ErrorMessage message="Exam not found" onRetry={() => navigate("/")} />
    );

  if (submitted && results) {
    return (
      <ExamResults
        results={results}
        exam={exam}
        onReturn={() => navigate("/")}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <ExamHeader
        exam={exam}
        timeRemaining={timeRemaining}
        onBack={() => setShowExitModal(true)}
      />

      <div className="flex flex-1 overflow-hidden border-t dark:border-gray-700">
        <div className="flex-1 bg-white border-r overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          {currentQuestionData && (
            <QuestionCard
              question={currentQuestionData}
              questionNumber={currentQuestion + 1}
              totalQuestions={exam.sections[currentSection].questions.length}
              sectionName={exam.sections[currentSection].section_name}
              selected={answers[currentQuestionData.q_id]}
              onAnswer={(qId, optId) =>
                setAnswers((prev) => ({ ...prev, [qId]: optId }))
              }
            />
          )}
        </div>

        <div className="w-64 bg-white overflow-y-auto dark:bg-gray-800">
          <QuestionNavigator
            sections={exam.sections}
            currentSection={currentSection}
            currentQuestion={currentQuestion}
            answers={answers}
            markedForReview={markedForReview}
            totalQuestions={totalQuestions}
            onNavigate={navigateToQuestion}
          />
        </div>
      </div>

      <div className="bg-white border-t dark:bg-gray-800 dark:border-gray-700">
        <ExamNavigation
          canGoPrev={currentSection > 0 || currentQuestion > 0}
          canGoNext={
            currentSection < exam.sections.length - 1 ||
            currentQuestion < exam.sections[currentSection].questions.length - 1
          }
          onPrev={goToPrevQuestion}
          onMarkForReview={handleMarkForReview}
          onSaveAndNext={handleSaveAndNext}
          onSubmit={() => setShowSubmitModal(true)}
        />
      </div>

      {showSubmitModal && (
        <SubmissionModal
          answeredCount={Object.keys(answers).length}
          totalQuestions={totalQuestions}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}
      {showExitModal && (
        <ExitConfirmationModal
          hasAnswers={Object.keys(answers).length > 0}
          onSaveAndExit={saveProgressAndExit}
          onExitWithoutSaving={() => navigate("/")}
          onCancel={() => setShowExitModal(false)}
        />
      )}
    </div>
  );
}