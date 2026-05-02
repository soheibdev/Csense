import styles from './Learning.module.css';
import Wingg from '../components/ui/Wing';
import VideoPlayer from '../components/ui/VideoPlayer';
import Button from '../components/ui/Button';
import TopBar from '../components/ui/TopBar';
import Sidebar from '../components/ui/Sidebar';
import PageTransition from '../components/ui/PageTransition';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import Video from '../assets/test.mp4';

export default function PasswordSecurity() {
    const [quizEnabled, setQuizEnabled] = useState(false);
    const navigate = useNavigate();
    const setCurrentModule = useAppStore((s) => s.setCurrentModule);

    const handleTakeQuiz = () => {
        setCurrentModule('quiz3');
        navigate('/quiz/3');
    };

    return (
        <PageTransition>
            <div className={styles.appShell}>
                <Sidebar />
                <div className={styles.mainArea}>
                    <TopBar />
                    <div className={styles.content}>
                        <p style={{ fontSize: "14px", fontWeight: "400", color: "#757575" }}>Topics  •  Password Security  </p>
                        <p style={{ fontSize: "32px", fontWeight: "700", color: "#212121" }}>Password Security</p>
                        <p style={{ fontSize: "16px", fontWeight: "400", color: "#212121" }}>Password security is a broad term for manipulating or influencing people to gain access to their personal information, systems, or facilities.</p>
                        <div className={styles.area}>
                            <VideoPlayer videoUrl={Video} onVideoEnd={() => setQuizEnabled(true)} />
                            <Button 
                                disabled={!quizEnabled} 
                                onClick={handleTakeQuiz}
                                style={{
                                    width:"203px", height:"54px", borderRadius:"121px", fontSize:"16px", fontWeight:"600", color:"#F3F3F3", marginTop:"24px",
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
