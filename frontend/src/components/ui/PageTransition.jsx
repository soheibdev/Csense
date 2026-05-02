import { useEffect, useState } from 'react';
import styles from './PageTransition.module.css';

/**
 * PageTransition — wraps page content with a fade-in animation.
 */
export default function PageTransition({ children }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger fade-in on mount
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${styles.wrapper} ${visible ? styles.visible : ''}`}>
            {children}
        </div>
    );
}
