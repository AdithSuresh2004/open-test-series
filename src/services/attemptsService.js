import { generateAttemptId } from "../utils/examUtils";

const STORAGE_KEY = "ots_attempts_v1";

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { attempts: {} };
  } catch {
    return { attempts: {} };
  }
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors for now
  }
}

export function getAttempt(attemptId) {
  const s = loadStore();
  return s.attempts[attemptId] || null;
}

export function listAttemptsByExam(examUid) {
  const s = loadStore();
  return Object.values(s.attempts).filter((a) => a.examUid === examUid);
}

export function createAttempt(examUid, snapshot = {}) {
  const s = loadStore();
  const id = generateAttemptId(examUid);
  const now = new Date().toISOString();
  const attempt = {
    id,
    examUid,
    status: "in_progress", // in_progress | submitted
    startedAt: now,
    updatedAt: now,
    elapsedSeconds: 0,
    section: null,
    answers: {}, // { [qId]: optId | string[] }
    reviewFlags: {}, // { [qId]: boolean }
    meta: {
      exam_id: snapshot.exam_id,
      exam_name: snapshot.exam_name,
      duration_minutes: snapshot.duration_minutes,
      total_questions: snapshot.total_questions,
      total_marks: snapshot.total_marks,
      exam_strength: snapshot.exam_strength,
    },
  };
  s.attempts[id] = attempt;
  saveStore(s);
  return attempt;
}

export function updateAttempt(attemptId, patch) {
  const s = loadStore();
  const current = s.attempts[attemptId];
  if (!current) return null;
  const updated = {
    ...current,
    ...patch,
    // merge nested
    answers: { ...current.answers, ...(patch.answers || {}) },
    reviewFlags: { ...current.reviewFlags, ...(patch.reviewFlags || {}) },
    updatedAt: new Date().toISOString(),
  };
  s.attempts[attemptId] = updated;
  saveStore(s);
  return updated;
}

export function upsertAttempt(attempt) {
  const s = loadStore();
  s.attempts[attempt.id] = { ...attempt, updatedAt: new Date().toISOString() };
  saveStore(s);
  return s.attempts[attempt.id];
}

export function deleteAttempt(attemptId) {
  const s = loadStore();
  delete s.attempts[attemptId];
  saveStore(s);
}

export function clearAllAttempts() {
  saveStore({ attempts: {} });
}

// Additional utility functions for enhanced functionality

// Get attempt statistics for an exam
export function getAttemptStats(examUid) {
  const attempts = listAttemptsByExam(examUid);
  const completed = attempts.filter(a => a.status === 'submitted');
  
  if (attempts.length === 0) {
    return {
      total: 0,
      inProgress: 0,
      completed: 0,
      averageScore: 0,
      bestScore: 0,
      averageTime: 0
    };
  }
  
  return {
    total: attempts.length,
    inProgress: attempts.filter(a => a.status === 'in_progress').length,
    completed: completed.length,
    averageScore: completed.length > 0 
      ? completed.reduce((sum, a) => sum + (a.score || 0), 0) / completed.length 
      : 0,
    bestScore: completed.length > 0 
      ? Math.max(...completed.map(a => a.score || 0)) 
      : 0,
    averageTime: completed.length > 0
      ? completed.reduce((sum, a) => sum + (a.elapsedSeconds || 0), 0) / completed.length
      : 0
  };
}

// Calculate score for an attempt
export function calculateAttemptScore(attempt, examData = null) {
  if (!attempt || !attempt.answers) return 0;
  
  // Basic scoring: 1 point per correct answer
  // This can be enhanced based on your scoring logic
  let score = 0;
  const answers = attempt.answers;
  
  if (examData && examData.sections) {
    // If we have exam data, we can calculate actual score
    examData.sections.forEach(section => {
      section.questions.forEach(question => {
        const userAnswer = answers[question.q_id];
        if (userAnswer && question.correct_option === userAnswer) {
          score += question.marks || 1;
        }
      });
    });
  } else {
    // Fallback: just count answered questions
    score = Object.keys(answers).length;
  }
  
  return score;
}

// Mark attempt as submitted with score calculation
export function submitAttempt(attemptId, examData = null) {
  const attempt = getAttempt(attemptId);
  if (!attempt) return null;
  
  const score = calculateAttemptScore(attempt, examData);
  const totalQuestions = attempt.meta?.total_questions || 0;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  return updateAttempt(attemptId, {
    status: 'submitted',
    score,
    percentage,
    completedAt: new Date().toISOString()
  });
}

// Get recent attempts across all exams
export function getRecentAttempts(limit = 10) {
  const s = loadStore();
  return Object.values(s.attempts)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
}

// Clean up old attempts (keep only latest N per exam)
export function cleanupOldAttempts(maxAttemptsPerExam = 10) {
  const s = loadStore();
  const attempts = Object.values(s.attempts);
  const attemptsByExam = {};
  
  // Group by exam
  attempts.forEach(attempt => {
    if (!attemptsByExam[attempt.examUid]) {
      attemptsByExam[attempt.examUid] = [];
    }
    attemptsByExam[attempt.examUid].push(attempt);
  });
  
  // Keep only recent attempts for each exam
  const cleanedAttempts = {};
  Object.values(attemptsByExam).forEach(examAttempts => {
    const sorted = examAttempts.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    sorted.slice(0, maxAttemptsPerExam).forEach(attempt => {
      cleanedAttempts[attempt.id] = attempt;
    });
  });
  
  saveStore({ attempts: cleanedAttempts });
  return Object.keys(cleanedAttempts).length;
}

// Export attempts for backup
export function exportAttempts() {
  const s = loadStore();
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    attempts: s.attempts
  };
}

// Import attempts from backup
export function importAttempts(data) {
  if (!data || !data.attempts) {
    throw new Error('Invalid backup data');
  }
  
  const s = loadStore();
  
  // Merge with existing attempts (new ones take precedence)
  const merged = {
    attempts: {
      ...s.attempts,
      ...data.attempts
    }
  };
  
  saveStore(merged);
  return Object.keys(merged.attempts).length;
}

// Get exam attempt history with pagination
export function getAttemptHistory(examUid, page = 1, pageSize = 10) {
  const attempts = listAttemptsByExam(examUid)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    attempts: attempts.slice(startIndex, endIndex),
    pagination: {
      page,
      pageSize,
      total: attempts.length,
      totalPages: Math.ceil(attempts.length / pageSize),
      hasMore: endIndex < attempts.length
    }
  };
}