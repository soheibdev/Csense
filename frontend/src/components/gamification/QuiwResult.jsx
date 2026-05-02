import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import LoadingSpinner from '../ui/LoadingSpinner';
import Sidebar from '../ui/Sidebar';
import TopBar from '../ui/TopBar';
import Wingg from '../ui/Wing';
import PageTransition from '../ui/PageTransition';
import styles from '../../pages/Quiz.module.css';

export default function QuiwResult({ percentage, passed, score, total, quizKey, nextRoute, breadcrumb }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // Attempt to update points and module status if available in the store
    const addPoints = useAppStore(state => state.addPoints);
    const awardBadge = useAppStore(state => state.awardBadge);
    const completeModule = useAppStore(state => state.completeModule);

    React.useEffect(() => {
        if (passed) {
            if (addPoints) addPoints(150);
            if (awardBadge) awardBadge(quizKey);
            if (completeModule) completeModule(quizKey);
        }
    }, [passed, quizKey, addPoints, awardBadge, completeModule]);

    const handleNext = () => {
        if (passed) {
            setIsLoading(true);
            setTimeout(() => {
                navigate(nextRoute);
            }, 1000);
        } else {
            // Retry quiz by reloading the component/page
            window.location.reload();
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="Loading next module..." />;
    }

    const displayBreadcrumb = breadcrumb.replace('  •  Quiz Result', '');

    return (
        <PageTransition>
            <div className={styles.appShell}>
                <Sidebar />
                <div className={styles.mainArea}>
                    <TopBar />
                    <div className={styles.content}>
                        <p style={{ fontSize: "14px", fontWeight: "400", color: "#757575", marginBottom: '24px' }}>
                            {displayBreadcrumb}
                        </p>
                        
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                            {/* Left Card: Main Quiz Result */}
                            <div style={{ flex: 1, backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#212121', margin: 0 }}>
                                        Quiz Complete!
                                    </h2>
                                    <div style={{ 
                                        display: 'flex', alignItems: 'center', gap: '6px', 
                                        backgroundColor: passed ? '#E8F5E9' : '#FFEBEE', 
                                        padding: '8px 16px', borderRadius: '24px', 
                                        color: passed ? '#2E7D32' : '#C62828', 
                                        fontWeight: '600', fontSize: '14px' 
                                    }}>
                                        {passed ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                        )}
                                        {percentage}% - {passed ? 'Passed' : 'Failed'}
                                    </div>
                                </div>
                                
                                <p style={{ fontSize: '16px', color: '#444', marginBottom: '64px', maxWidth: '80%' }}>
                                    {passed 
                                        ? "You have successfully completed your first assessment on the platform." 
                                        : "You didn't reach the required 70% to pass this module. Review the materials and try again to improve your score."}
                                </p>

                                <div style={{ marginBottom: '48px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '14px', color: '#444' }}>Accuracy Score</span>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#212121' }}>{percentage}%</span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#E0E0E0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                                        <div style={{ height: '100%', backgroundColor: passed ? '#1976D2' : '#D32F2F', width: `${percentage}%`, borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9E9E9E' }}>
                                        <span>0%</span>
                                        <span>Minumum Pass: 70%</span>
                                        <span>100%</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                                    <button 
                                        onClick={() => window.location.reload()} 
                                        style={{ 
                                            backgroundColor: '#fff', border: '1px solid #1976D2', color: '#1976D2', 
                                            padding: '0 32px', height: '48px', borderRadius: '24px', 
                                            fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                                        }}>
                                        Review Answers
                                    </button>
                                    <button 
                                        onClick={handleNext} 
                                        style={{ 
                                            backgroundColor: '#1976D2', border: 'none', color: '#fff', 
                                            padding: '0 32px', height: '48px', borderRadius: '24px', 
                                            fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                                        }}>
                                        {passed ? "Next Topic" : "Retry Quiz"}
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: XP and Badges */}
                            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {/* XP Card */}
                                <div style={{ backgroundColor: '#fff', padding: '40px 24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '14px', color: '#757575', marginBottom: '16px', margin: 0 }}>XP Earned</p>
                                    <p style={{ fontSize: '28px', fontWeight: '700', color: passed ? '#2E7D32' : '#757575', margin: 0 }}>
                                        {passed ? '+150' : '+0'} XP
                                    </p>
                                </div>
                                
                                {/* Badge Card */}
                                <div style={{ backgroundColor: '#fff', padding: '40px 24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ fontSize: '14px', color: '#9E9E9E', margin: 0, lineHeight: '1.5' }}>
                                        No badges set for<br/>this module
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Wingg />
                </div>
            </div>
        </PageTransition>
    );
}
