import React, { useState } from 'react';
import styles from './Learning.module.css';
import Wingg from '../components/ui/Wing';
import VideoPlayer from '../components/ui/VideoPlayer';
import Button from '../components/ui/Button';
import TopBar from '../components/ui/TopBar';
import Sidebar from '../components/ui/Sidebar';
import PageTransition from '../components/ui/PageTransition';
import Video from '../assets/test.mp4';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

export default function WhatisScence() {
    const [quizEnabled, setQuizEnabled] = useState(false);
    const navigate = useNavigate();
    const setCurrentModule = useAppStore((s) => s.setCurrentModule);

    const handleTakeQuiz = () => {
        setCurrentModule('quiz1');
        navigate('/quiz/1');
    };

    return (
        <PageTransition>
            <div className={styles.appShell}>
                <Sidebar />
                <div className={styles.mainArea}>
                    <TopBar />
                    <div className={styles.content}>
                        <p style={{ fontSize: "14px", fontWeight: "400", color: "#757575" }}>Topics  •  What is CSense  </p>
                        <p style={{ fontSize: "32px", fontWeight: "700", color: "#212121" }}>What Is CSense</p>
                        <p style={{ fontSize: "16px", fontWeight: "400", color: "#212121" }}>Introduction to CSense, the company's cybersecurity awareness platform, and explains why it exists.</p>
                        <div className={styles.area}>
                            <VideoPlayer videoUrl={Video} onVideoEnd={() => setQuizEnabled(true)} />
                            <Button
                                disabled={!quizEnabled}
                                onClick={handleTakeQuiz}
                                style={{
                                    width: "203px", height: "54px", borderRadius: "121px", fontSize: "16px", fontWeight: "600", color: "#F3F3F3", marginTop: "24px",
                                    backgroundColor: quizEnabled ? "#1765DC" : "#A0A0A0",
                                    cursor: quizEnabled ? "pointer" : "not-allowed"
                                }}
                                name="Take Quiz"
                            />
                        </div>
                    </div>
                    <Wingg />
                </div>
            </div>
        </PageTransition>
    );
}
