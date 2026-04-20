import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

function HomePage() {
  const navigate = useNavigate();
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    // Example: call Electron main process via the secure bridge
    if (window.electronAPI?.getAppVersion) {
      window.electronAPI.getAppVersion().then(setAppVersion);
    }
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          <span className={styles.accent}>C</span>Sense
        </h1>
        <p className={styles.subtitle}>
          Cybersecurity Awareness Platform
        </p>
        <p className={styles.description}>
          Empower your team with interactive security training modules,
          real-world simulations, and actionable insights.
        </p>
      </div>
    </main>
  );
}
export default HomePage