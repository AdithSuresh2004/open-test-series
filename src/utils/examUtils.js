import { calculateResults } from "./scoring";
import { saveAttempt } from "../services/examsService";

export const finalizeAttempt = (exam, answers, elapsed, status, position = null) => {
  const calculatedResults = calculateResults(exam, answers);
  
  const attempt = {
    attempt_id: `attempt_${Date.now()}`,
    exam_id: exam.exam_id,
    username: "guest",
    timestamp: new Date().toISOString(),
    status: status,
    responses: Object.entries(answers).map(([qId, optId]) => ({
      q_id: qId,
      selected_opt_id: optId,
    })),
    score: {
      total: calculatedResults.totalScore,
      per_section: calculatedResults.sectionScores,
    },
    time_taken: elapsed,
  };

  if (position) {
    attempt.current_position = position;
  }

  saveAttempt(attempt);

  return { results: calculatedResults, attempt };
};