import { useState, useEffect, useCallback } from "react";
import { getExamById } from "../../services/examsService";
import { useExamNavigation } from "./useExamNavigation";
import { useExamTimer } from "./useExamTimer";
import { finalizeAttempt } from "../../utils/examUtils";

export function useExam(examId, navigate) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  const {
    currentSection,
    currentQuestion,
    totalQuestions,
    navigateToQuestion,
    goToNextQuestion,
    goToPrevQuestion,
  } = useExamNavigation(exam);

  const { timeRemaining, elapsed, isTimeExpired, start, stop } = useExamTimer(
    exam?.duration_minutes ? exam.duration_minutes * 60 : 10
  );

  const currentQuestionData = exam?.sections[currentSection]?.questions[currentQuestion];

  // Load exam data
  useEffect(() => {
    const loadExam = async () => {
      try {
        setLoading(true);
        const data = await getExamById(examId);
        setExam(data);
      } catch (err) {
        setError(err.message || "Failed to load exam");
      } finally {
        setLoading(false);
      }
    };
    loadExam();
  }, [examId]);

  // Start timer once exam data is loaded
  useEffect(() => {
    if (exam && !loading) start();
  }, [exam, loading, start]);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (exam && !loading && !submitted && isTimeExpired) handleSubmit();
  }, [exam, loading, submitted, isTimeExpired]);

  // ----------------------
  // Callback Functions
  // ----------------------

  // Submit exam
  const handleSubmit = useCallback(() => {
    if (!exam) return;

    // Combine answered + marked-for-review questions
    const finalAnswers = { ...answers };
    markedForReview.forEach((qId) => {
      if (!finalAnswers[qId]) finalAnswers[qId] = "marked-for-review";
    });

    const finalResults = finalizeAttempt(exam, finalAnswers, elapsed, "completed", null);
    setResults(finalResults.results);
    stop();
    setSubmitted(true);
    setShowSubmitModal(false);
  }, [exam, answers, markedForReview, elapsed, stop]);

  // Save progress and exit
  const saveProgressAndExit = useCallback(() => {
    if (exam && Object.keys(answers).length > 0) {
      finalizeAttempt(exam, answers, elapsed, "incomplete", {
        section: currentSection,
        question: currentQuestion,
      });
    }
    navigate("/");
  }, [exam, answers, elapsed, currentSection, currentQuestion, navigate]);

  // Save current answer and go next
  const handleSaveAndNext = useCallback(() => {
    const currentQId = currentQuestionData?.q_id;

    // If current question is answered, remove from marked-for-review
    if (currentQId && answers.hasOwnProperty(currentQId)) {
      setMarkedForReview((prev) => {
        const updated = new Set(prev);
        updated.delete(currentQId);
        return updated;
      });
    }

    goToNextQuestion();
  }, [answers, currentQuestionData, goToNextQuestion]);

  // Mark current question for review and go next
  const handleMarkForReview = useCallback(() => {
    const currentQId = currentQuestionData?.q_id;
    if (currentQId) {
      setMarkedForReview((prev) => new Set(prev).add(currentQId));
    }
    goToNextQuestion();
  }, [currentQuestionData, goToNextQuestion]);

  return {
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
    elapsed,
    currentSection,
    currentQuestion,
    totalQuestions,
    currentQuestionData,
    setAnswers,
    navigateToQuestion,
    goToNextQuestion,
    goToPrevQuestion,
    handleSubmit,
    saveProgressAndExit,
    handleSaveAndNext,
    handleMarkForReview,
    setShowSubmitModal,
    setShowExitModal,
  };
}
