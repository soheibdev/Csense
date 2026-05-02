import styles from './LoadingSpinner.module.css';
import Gif from '../../assets/spinner.gif';

/**
 * LoadingSpinner — full-screen GIF-based loader.
 *
 * Usage:
 *   <LoadingSpinner />
 *   <LoadingSpinner message="Loading quiz…" />
 */
export default function LoadingSpinner({ message }) {
    return (
        <div className={styles.loadingContainer}>
            <img className={styles.spinner} src={Gif} alt="loading spinner" />
            {message && <p className={styles.loadingMessage}>{message}</p>}
        </div>
    );
}