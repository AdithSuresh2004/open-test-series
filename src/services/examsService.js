import { getJSON } from '@/api/http';

export async function getExamsManifest() {
  try {
    return await getJSON('/exams/exams_manifest.json');
  } catch {
    return { exams: [] };
  }
}

export async function getExamById(examId) {
  try {
    const manifest = await getExamsManifest();

    const allExams = [
      ...(manifest.full_tests || []),
      ...(manifest.topic_tests || []),
      ...(manifest.subject_tests || [])
    ];

    const examEntry = allExams.find((exam) => exam.exam_id === examId);
    if (!examEntry) {
      throw new Error(
        `Exam "${examId}" not found in manifest. Make sure it exists in full_tests, topic_tests, or subject_tests.`
      );
    }

    if (examEntry.file) {
      return await getJSON(examEntry.file);
    } else {
      throw new Error(
        `Exam "${examId}" entry exists in manifest but no file path is specified.`
      );
    }
  } catch (err) {
    throw new Error(`Failed to load exam "${examId}": ${err.message}`);
  }
}

export async function saveAttempt(attempt) {
  try {
    const attempts = JSON.parse(localStorage.getItem('exam_attempts') || '[]');
    attempts.push(attempt);
    localStorage.setItem('exam_attempts', JSON.stringify(attempts));

    return attempt;
  } catch (err) {
    console.error('Failed to save attempt', err);
    throw err;
  }
}
