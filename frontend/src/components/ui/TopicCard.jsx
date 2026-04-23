import styles from './TopicCard.module.css';

const TopicCard = ({ topic }) => {
  const { title, description, status, progress, unlockMessage } = topic;

  const badgeClass =
    status === 'complete'   ? styles.badgeComplete   :
    status === 'inprogress' ? styles.badgeInprogress :
    styles.badgeLocked;

  return (
    <div className={`${styles.card} ${status === 'locked' ? styles.cardLocked : ''}`}>

      {/* Top row */}
      <div className={styles.cardTop}>
        <div className={styles.iconBox}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            stroke={status === 'locked' ? '#94a3b8' : '#2563eb'}
            strokeWidth="1.5">
            {status === 'complete' && (
              <><circle cx="7" cy="7" r="5"/><path d="M4.5 7 L6.5 9 L9.5 5"/></>
            )}
            {status === 'inprogress' && (
              <><circle cx="7" cy="7" r="5"/><path d="M7 4 L7 7 L9 9"/></>
            )}
            {status === 'locked' && (
              <><rect x="3" y="6" width="8" height="6" rx="1"/>
              <path d="M5 6 V4 A2 2 0 0 1 9 4 V6"/></>
            )}
          </svg>
        </div>
        <span className={`${styles.badge} ${badgeClass}`}>
          {status === 'complete'   && 'Complete'}
          {status === 'inprogress' && 'In Progress'}
          {status === 'locked'     && 'Locked'}
        </span>
      </div>

      {/* Title */}
      <h3 className={`${styles.title} ${status === 'locked' ? styles.titleDimmed : ''}`}>
        {title}
      </h3>

      {/* Description */}
      <p className={styles.desc}>{description}</p>

      {/* In Progress */}
      {status === 'inprogress' && (
        <>
          <div className={styles.progressSection}>
            <span className={styles.progressLabel}>{progress}% Progress</span>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }}/>
            </div>
          </div>
          <button className={styles.btnResume}>Resume Session</button>
        </>
      )}

      {/* Complete */}
      {status === 'complete' && (
        <button className={styles.btnRevisit}>REVISIT →</button>
      )}

      {/* Locked */}
      {status === 'locked' && (
        <p className={styles.lockMsg}>{unlockMessage}</p>
      )}
    </div>
  );
};

export default TopicCard;