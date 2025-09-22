import { useState, useCallback } from 'react';

export function useExamNavigation(exam) {
    const [currentSection, setCurrentSection] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const totalQuestions = exam?.sections.reduce((acc, section) => acc + section.questions.length, 0) || 0;

    const navigateToQuestion = useCallback((sectionIndex, questionIndex) => {
        setCurrentSection(sectionIndex);
        setCurrentQuestion(questionIndex);
    }, []);

    const goToNextQuestion = useCallback(() => {
        if (!exam) return;
        const currentSectionQuestions = exam.sections[currentSection].questions.length;
        if (currentQuestion < currentSectionQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else if (currentSection < exam.sections.length - 1) {
            setCurrentSection(prev => prev + 1);
            setCurrentQuestion(0);
        }
    }, [exam, currentSection, currentQuestion]);

    const goToPrevQuestion = useCallback(() => {
        if (!exam) return;
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        } else if (currentSection > 0) {
            setCurrentSection(prev => prev - 1);
            setCurrentQuestion(exam.sections[currentSection - 1].questions.length - 1);
        }
    }, [exam, currentSection, currentQuestion]);

    return {
        currentSection,
        currentQuestion,
        totalQuestions,
        navigateToQuestion,
        goToNextQuestion,
        goToPrevQuestion,
    };
}