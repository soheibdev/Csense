import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className={styles.container}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.desc}>The route you're looking for doesn't exist.</p>
      <button id="btn-go-home" className={styles.btn} onClick={() => navigate('/')}>
        Go Home
      </button>
    </main>
  );
}

export default NotFoundPage;
