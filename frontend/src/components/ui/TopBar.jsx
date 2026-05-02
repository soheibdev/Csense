import styles from "./TopBar.module.css";
export default function TopBar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarRight}>
        <button className={styles.iconBtn}>
          <svg className={styles.iconnotification} width="18" height="18" viewBox="0 0 18 18" fill="none"
            stroke="currentColor" strokeWidth="1.5">
            <path d="M9 2 C6 2 4 4.5 4 7 L4 10 L2 12 L16 12 L14 10 L14 7 C14 4.5 12 2 9 2Z" />
            <path d="M7 12 C7 13.1 7.9 14 9 14 C10.1 14 11 13.1 11 12" />
          </svg>
        </button>
        <div className={styles.avatar}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            stroke="#2563eb" strokeWidth="1.5">
            <circle cx="9" cy="6" r="3" />
            <path d="M3 16 C3 12.5 5.5 10 9 10 C12.5 10 15 12.5 15 16" />
          </svg>
        </div>
      </div>
    </header>
  )
}