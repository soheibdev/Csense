import styles from './BadgeCard.module.css';
import { BADGE_DEFS } from '../../store/useAppStore';

/**
 * BadgeCard — displays a single badge (locked or unlocked).
 *
 * Props:
 *   badgeId  — key from BADGE_DEFS
 *   unlocked — boolean
 *   animate  — if true, plays unlock animation
 */
export default function BadgeCard({ badgeId, unlocked = false, animate = false }) {
    const def = BADGE_DEFS[badgeId];
    if (!def) return null;

    return (
        <div className={`${styles.badge} ${unlocked ? styles.unlocked : styles.locked} ${animate ? styles.animateIn : ''}`}>
            <div className={styles.iconWrapper}>
                <span className={styles.icon}>{def.icon}</span>
                {unlocked && <div className={styles.glowRing} />}
            </div>
            <p className={styles.name}>{def.name}</p>
            <p className={styles.desc}>{def.description}</p>
            {!unlocked && (
                <div className={styles.lockOverlay}>
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                        <rect x="3" y="7" width="10" height="7" rx="1.5"/>
                        <path d="M5 7 V5 A3 3 0 0 1 11 5 V7"/>
                    </svg>
                </div>
            )}
        </div>
    );
}
