// Fix in calculateResults
export function calculateResults(exam, answers) {
    if (!exam) return { totalScore: 0, sectionScores: {} };

    let totalScore = 0;
    const sectionScores = {};

    (exam.sections || []).forEach(section => {
        let sectionScore = 0;
        (section.questions || []).forEach(question => {
            const selected = answers?.[question.q_id];
            if (selected !== undefined && selected !== null) { // fix: include 0 as valid option
                const isCorrect = selected === question.correct_opt_id;
                const marks = Number(question.marks || 0);
                const negativeRaw = Number(question.negative_marks || 0);
                const penalty = Math.abs(negativeRaw); // ensure subtraction uses magnitude
                sectionScore += isCorrect ? marks : -penalty;
            }
        });
        sectionScores[section.section_id] = sectionScore;
        totalScore += sectionScore;
    });

    return { totalScore, sectionScores };
};
