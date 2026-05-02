import { useState } from 'react';
import Wingg from '../components/ui/Wing';
import TopBar from '../components/ui/TopBar';
import Sidebar from '../components/ui/Sidebar';
import styles from './Quiz.module.css';
import Option from '../components/ui/Option';
import {quizzes} from '../components/quiz/quizzes';
import Button from '../components/ui/Button';
import QuizResult from '../components/gamification/QuiwResult';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageTransition from '../components/ui/PageTransition';
import useAppStore from '../store/useAppStore';

export default function Quiz2() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const setCurrentModule = useAppStore((s) => s.setCurrentModule);

    const questions = quizzes["social-engineering"];
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (index) => {
        if (!isAnswerRevealed) {
            setSelectedOption(index);
        }
    };

    const handleNext = () => {
        if (selectedOption !== null) {
            if (!isAnswerRevealed) {
                if (selectedOption === currentQuestion.correctAnswer) {
                    setScore(score + 1);
                }
                setIsAnswerRevealed(true);
            } else {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setSelectedOption(null);
                    setIsAnswerRevealed(false);
                } else {
                    setShowLoading(true);
                    setCurrentModule('result2');
                    setTimeout(() => {
                        setShowLoading(false);
                        setShowResult(true);
                    }, 1500);
                }
            }
        }
    };

    if (showLoading) {
        return <LoadingSpinner message="Calculating your results…" />;
    }

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;
        return (
            <QuizResult 
                percentage={percentage} 
                passed={passed}
                score={score}
                total={questions.length}
                quizKey="social-engineering"
                nextRoute="/password-security"
                breadcrumb="Topics  •  Social Engineering  •  Quiz Result"
            />
        );
    }

    const isWrongSelected = isAnswerRevealed && selectedOption !== currentQuestion.correctAnswer;

    return (
        <PageTransition>
            <div className={styles.appShell}>
                <Sidebar/>
                <div className={styles.mainArea}>
                    <TopBar/>
                    <div className={styles.content}>
                        <p style={{ fontSize: "14px", fontWeight: "400", color: "#757575" }}>Topics  •  Social Engineering  • Quiz  </p>
                        <p style={{ fontSize: "32px", fontWeight: "700", color: "#212121", marginTop: "16px" }}>{currentQuestion.question}</p>
                        <p style={{ fontSize: "16px", fontWeight: "400", color: "#212121", marginBottom: "32px" }}>Review the options below carefully before making your selection.</p>
                        <div className={styles.area}>
                            <div className={styles.optionsRow}>
                                <Option 
                                    optionNum="A" 
                                    description={currentQuestion.options[0]}
                                    isSelected={selectedOption === 0 && !isAnswerRevealed}
                                    isCorrect={isAnswerRevealed && currentQuestion.correctAnswer === 0}
                                    isWrong={isAnswerRevealed && selectedOption === 0 && selectedOption !== currentQuestion.correctAnswer}
                                    onClick={() => handleOptionClick(0)}
                                />
                                <Option 
                                    optionNum="B" 
                                    description={currentQuestion.options[1]}
                                    isSelected={selectedOption === 1 && !isAnswerRevealed}
                                    isCorrect={isAnswerRevealed && currentQuestion.correctAnswer === 1}
                                    isWrong={isAnswerRevealed && selectedOption === 1 && selectedOption !== currentQuestion.correctAnswer}
                                    onClick={() => handleOptionClick(1)}
                                />
                            </div>
                            <div className={styles.optionsRow}>
                                <Option 
                                    optionNum="C" 
                                    description={currentQuestion.options[2]}
                                    isSelected={selectedOption === 2 && !isAnswerRevealed}
                                    isCorrect={isAnswerRevealed && currentQuestion.correctAnswer === 2}
                                    isWrong={isAnswerRevealed && selectedOption === 2 && selectedOption !== currentQuestion.correctAnswer}
                                    onClick={() => handleOptionClick(2)}
                                />
                                <Option 
                                    optionNum="D" 
                                    description={currentQuestion.options[3]}
                                    isSelected={selectedOption === 3 && !isAnswerRevealed}
                                    isCorrect={isAnswerRevealed && currentQuestion.correctAnswer === 3}
                                    isWrong={isAnswerRevealed && selectedOption === 3 && selectedOption !== currentQuestion.correctAnswer}
                                    onClick={() => handleOptionClick(3)}
                                />
                            </div>

                            {isAnswerRevealed && (
                                <div className={`${styles.feedbackBanner} ${isWrongSelected ? styles.bannerWrong : styles.bannerCorrect}`}>
                                    <h3 className={styles.feedbackTitle}>{isWrongSelected ? "Wrong Answer!" : "Correct Answer!"}</h3>
                                    <p className={styles.feedbackDesc}>
                                        {isWrongSelected ? currentQuestion.explanation[selectedOption] : "That's the correct answer. Well done!"}
                                    </p>
                                </div>
                            )}

                            <div className={styles.actionRow}>
                                <Button 
                                    onClick={handleNext}
                                    style={{width: "auto",padding: "0 48px",height: "54px",borderRadius: "121px",fontSize: "16px",fontWeight: "600",color: "#F3F3F3",backgroundColor: selectedOption !== null ? "#1765DC" : "#A0A0A0",cursor: selectedOption !== null ? "pointer" : "not-allowed",border: "none"}} 
                                    name={!isAnswerRevealed ? "Check Answer" : (currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz")}
                                />
                            </div>
                        </div>
                    </div>

                    <Wingg />
                </div>
            </div>
        </PageTransition>
    );
}