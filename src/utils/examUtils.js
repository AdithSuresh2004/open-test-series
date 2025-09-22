import { calculateResults } from "./scoring";
import { saveAttempt } from "../services/examsService";

// Simple, stable hash for strings (djb2)
function hash32(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  // force unsigned 32-bit then to base36 for compactness
  return (h >>> 0).toString(36);
}

export function slugify(s = "") {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function computeExamUid(meta = {}) {
  const base = meta.exam_id || slugify(meta.exam_name || "exam");
  const salt = meta.file || meta.path || meta.category || "";
  return `${base}__${hash32(salt)}`;
}

export function ensureExamUid(meta = {}) {
  if (!meta) return meta;
  if (!meta.uid) meta.uid = computeExamUid(meta);
  return meta;
}

export function encodeId(id) {
  return encodeURIComponent(id);
}

export function decodeId(id) {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

export function generateAttemptId(examUid) {
  const ts = Date.now().toString(36);
  const rnd =
    (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID().split("-")[0]
      : Math.random().toString(36).slice(2, 10);
  return `att_${slugify(examUid)}_${ts}_${rnd}`;
}

export const finalizeAttempt = (exam, answers, elapsed, status, position = null) => {
  const calculatedResults = calculateResults(exam, answers);
  
  const attempt = {
    attempt_id: generateAttemptId(ensureExamUid(exam).uid),
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