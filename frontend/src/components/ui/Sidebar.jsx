import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import styles from './Slidebare.module.css';

const navItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1"/>
        <rect x="9" y="1" width="6" height="6" rx="1"/>
        <rect x="1" y="9" width="6" height="6" rx="1"/>
        <rect x="9" y="9" width="6" height="6" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'Topics',
    path: '/topics',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <path d="M2 13 L8 2 L14 13"/>
        <path d="M5 9 L11 9"/>
      </svg>
    ),
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="6" r="3"/>
        <path d="M2 14 C2 11 5 9 8 9 C11 9 14 11 14 14"/>
      </svg>
    ),
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <img src={logo} alt="CSense" className={styles.logoImg} />
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`${styles.navItem} ${location.pathname === item.path ? styles.navActive : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;