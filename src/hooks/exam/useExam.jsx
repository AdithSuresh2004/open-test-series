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

  // Load exam data on component mount
  useEffect(() => {
    const loadExam = async () => {
      try {
        setLoading(true);
        const examData = await getExamById(examId);
        setExam(examData);
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
    if (exam && !loading) {
      start();
    }
  }, [exam, loading, start]);

  // Handle time expiry
  useEffect(() => {
    if (exam && !loading && !submitted && isTimeExpired) {
      handleSubmit();
    }
  }, [exam, loading, submitted, isTimeExpired]);

  const handleSubmit = useCallback(() => {
    if (!exam) return;
    const finalResults = finalizeAttempt(exam, answers, elapsed, "completed", null);
    setResults(finalResults.results);
    stop();
    setSubmitted(true);
    setShowSubmitModal(false);
  }, [exam, answers, elapsed, stop]);

  const saveProgressAndExit = useCallback(() => {
    if (Object.keys(answers).length > 0 && exam) {
      finalizeAttempt(exam, answers, elapsed, "incomplete", {
        section: currentSection,
        question: currentQuestion,
      });
    }
    navigate("/");
  }, [answers, exam, elapsed, currentSection, currentQuestion, navigate]);

  const handleSaveAndNext = useCallback(() => {
    const currentQId = currentQuestionData?.q_id;
    if (currentQId && answers.hasOwnProperty(currentQId)) {
      setMarkedForReview((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentQId);
        return newSet;
      });
    }
    goToNextQuestion();
  }, [answers, currentQuestionData, goToNextQuestion]);

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