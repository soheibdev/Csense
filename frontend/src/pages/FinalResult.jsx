import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './FinalResult.module.css';
import Sidebar from '../components/ui/Sidebar';
import TopBar from '../components/ui/TopBar';
import Wingg from '../components/ui/Wing';
import BadgeCard from '../components/gamification/BadgeCard';
import PageTransition from '../components/ui/PageTransition';
import useAppStore, { BADGE_DEFS, XP_REWARDS } from '../store/useAppStore';

import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function FinalResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const { score = 0, total = 15, percentage = 0, passed = false } = location.state || {};

    const xp = useAppStore((s) => s.xp);
    const badges = useAppStore((s) => s.badges);
    const addXP = useAppStore((s) => s.addXP);
    const unlockBadge = useAppStore((s) => s.unlockBadge);
    const setQuizScore = useAppStore((s) => s.setQuizScore);
    const setCurrentModule = useAppStore((s) => s.setCurrentModule);

    const [xpAwarded, setXpAwarded] = useState(0);
    const [isEnteringPC, setIsEnteringPC] = useState(false);

    useEffect(() => {
        if (passed) {
            const xpAmount = XP_REWARDS['final-quiz'] || 0;
            addXP(xpAmount);
            setXpAwarded(xpAmount);

            unlockBadge('csense-champion');
            setQuizScore('final-quiz', { score, total, percentage, passed });
            setCurrentModule('completed');
        }
    }, []);

    const allBadges = Object.keys(BADGE_DEFS);

    const handleRetryLearningPath = () => {
        useAppStore.getState().clearSession();
        setCurrentModule('what-is-csense');
        navigate('/what-is-csense');
    };

    const handleEnterPC = () => {
        setIsEnteringPC(true);
        // Infinite spinner — simulates system access
    };

    if (isEnteringPC) {
        return <LoadingSpinner message="Unlocking System..." />;
    }

    return (
        <PageTransition>
            <div className={styles.appShell}>
                <Sidebar />
                <div className={styles.mainArea}>
                    <TopBar />
                    <div className={styles.content}>
                        <p style={{ fontSize: "14px", fontWeight: "400", color: "#757575", marginBottom: "12px" }}>
                            Topics  •  Final Assessment  •  Results
                        </p>

                        {/* ── Hero Section ── */}
                        <div className={styles.heroCard}>
                            <div className={styles.heroIcon}>
                                {passed ? '🎉' : '📋'}
                            </div>
                            <h1 className={styles.heroTitle}>
                                {passed ? 'Congratulations!' : 'Assessment Complete'}
                            </h1>
                            <p className={styles.heroSubtitle}>
                                {passed
                                    ? 'You have successfully completed the Csense Security Training Program!'
                                    : 'You did not meet the passing requirement. Review the modules and try again.'
                                }
                            </p>
                            <div className={`${styles.scoreBadge} ${passed ? styles.scorePassed : styles.scoreFailed}`}>
                                <span className={styles.scoreNumber}>{percentage}%</span>
                                <span className={styles.scoreLabel}>{passed ? 'Passed' : 'Failed'}</span>
                            </div>
                        </div>

                        {/* ── Stats Row ── */}
                        <div className={styles.statsRow}>
                            <div className={styles.statCard}>
                                <span className={styles.statIcon}>⚡</span>
                                <div>
                                    <p className={styles.statValue}>{xp} XP</p>
                                    <p className={styles.statLabel}>Total XP Earned</p>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statIcon}>🎯</span>
                                <div>
                                    <p className={styles.statValue}>{score}/{total}</p>
                                    <p className={styles.statLabel}>Questions Correct</p>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statIcon}>🏅</span>
                                <div>
                                    <p className={styles.statValue}>{badges.length}/{allBadges.length}</p>
                                    <p className={styles.statLabel}>Badges Earned</p>
                                </div>
                            </div>
                            {passed && (
                                <div className={styles.statCard}>
                                    <span className={styles.statIcon}>✨</span>
                                    <div>
                                        <p className={styles.statValue}>+{xpAwarded} XP</p>
                                        <p className={styles.statLabel}>Final Bonus</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Badges Section ── */}
                        <div className={styles.badgesSection}>
                            <h2 className={styles.sectionTitle}>Your Badges</h2>
                            <div className={styles.badgesGrid}>
                                {allBadges.map((id) => (
                                    <BadgeCard
                                        key={id}
                                        badgeId={id}
                                        unlocked={badges.includes(id)}
                                        animate={id === 'csense-champion' && passed}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ── Actions ── */}
                        <div className={styles.actionsRow}>
                            {!passed ? (
                                <button className={styles.retryBtn} onClick={handleRetryLearningPath}>
                                    Restart Learning
                                </button>
                            ) : (
                                <button className={styles.finishBtn} onClick={handleEnterPC}>
                                    Enter PC
                                </button>
                            )}
                        </div>
                    </div>
                    <Wingg />
                </div>
            </div>
        </PageTransition>
    );
}
