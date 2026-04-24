import styles from './Topics.module.css';
import TopicCard from '../components/ui/TopicCard';
import logo from '../assets/logo.svg';
import Wingg from '../components/ui/Wing';

const topicsData = [
  {
    id: 1,
    title: 'What is CSense',
    description: "Introduction to CSense, the company's cybersecurity awareness platform, and explains why it exists.",
    status: 'complete',
    progress: 100,
  },
  {
    id: 2,
    title: 'Social Engineering',
    description: 'Master the psychological triggers used in pretexting, baiting, and tailgating within a physical office environment.',
    status: 'inprogress',
    progress: 65,
  },
  {
    id: 3,
    title: 'Password Security',
    description: 'Encryption standards, multi-factor authentication ecosystems, and password strength.',
    status: 'locked',
    unlockMessage: 'Complete "Social Engineering" to unlock',
  },
];

const Topics = () => {
  return (
    <div className={styles.appShell}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <img src={logo} alt="CSense" className={styles.logoImg} />
        </div>
        <nav className={styles.nav}>
          <div className={styles.navItem}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="1" width="6" height="6" rx="1"/>
              <rect x="9" y="1" width="6" height="6" rx="1"/>
              <rect x="1" y="9" width="6" height="6" rx="1"/>
              <rect x="9" y="9" width="6" height="6" rx="1"/>
            </svg>
            Dashboard
          </div>
          <div className={`${styles.navItem} ${styles.navActive}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="1.5">
              <path d="M2 13 L8 2 L14 13"/>
              <path d="M5 9 L11 9"/>
            </svg>
            Topics
          </div>
          <div className={styles.navItem}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="6" r="3"/>
              <path d="M2 14 C2 11 5 9 8 9 C11 9 14 11 14 14"/>
            </svg>
            Profile
          </div>
        </nav>
      </aside>

      {/* ── Main area ── */}
      <div className={styles.mainArea}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarRight}>
            <button className={styles.iconBtn}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <path d="M9 2 C6 2 4 4.5 4 7 L4 10 L2 12 L16 12 L14 10 L14 7 C14 4.5 12 2 9 2Z"/>
                <path d="M7 12 C7 13.1 7.9 14 9 14 C10.1 14 11 13.1 11 12"/>
              </svg>
            </button>
            <div className={styles.avatar}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                stroke="#2563eb" strokeWidth="1.5">
                <circle cx="9" cy="6" r="3"/>
                <path d="M3 16 C3 12.5 5.5 10 9 10 C12.5 10 15 12.5 15 16"/>
              </svg>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          <h1 className={styles.pageTitle}>Topics</h1>
          <div className={styles.cardsRow}>
            {topicsData.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </main>

        {/* Wing watermark — wrapped to control size */}
        <div className={styles.wingWrapper}>
          <Wingg />
        </div>
      </div>
    </div>
  );
};

export default Topics;