import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '@store/useAppStore';
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAppStore();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.greeting}>
            Welcome back, <span className={styles.accent}>{user?.name ?? 'Agent'}</span>
          </p>
        </div>
        <button
          id="btn-back-home"
          className={styles.backBtn}
          onClick={() => navigate('/')}
        >
          ← Home
        </button>
      </header>

      <section className={styles.statsRow}>
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      <section className={styles.content}>
        <div className={styles.placeholder}>
          <p>Your modules and reports will appear here.</p>
        </div>
      </section>
    </main>
  );
}
export default DashboardPage;
