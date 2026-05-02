import { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';
import Sidebar from '../components/ui/Sidebar';
import Wingg from '../components/ui/Wing';
import useAppStore from '../store/useAppStore';
import apiService from '../services/apiService';
import TopBar from '../components/ui/TopBar';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const quizBadgeClass = (status, s) => {
    const map = { Passed: s.badgePassed, Failed: s.badgeFailed, 'Not Taken': s.badgeNotTaken };
    return map[status] || s.badgeNotTaken;
};
const statusBadgeClass = (status, s) => {
    const map = { complete: s.badgeComplete, inprogress: s.badgeInProgress, notstarted: s.badgeNotStarted };
    return map[status] || s.badgeNotStarted;
};
const statusLabel = (status) => {
    const map = { complete: 'Complete', inprogress: 'In Progress', notstarted: 'Not Started' };
    return map[status] || 'Not Started';
};
const getTier = (pts) => {
    if (pts >= 1400) return { label: 'Defender', color: '#7c3aed', bg: '#ede9fe' };
    if (pts >= 900) return { label: 'Guardian', color: '#0369a1', bg: '#e0f2fe' };
    if (pts >= 500) return { label: 'Practitioner', color: '#0d9488', bg: '#ccfbf1' };
    if (pts >= 200) return { label: 'Aware', color: '#d97706', bg: '#fef3c7' };
    return { label: 'Apprentice', color: '#dc2626', bg: '#fee2e2' };
};
const getRiskLevel = (score) => {
    if (score >= 75) return { label: 'High', color: '#dc2626', bg: '#fee2e2' };
    if (score >= 45) return { label: 'Medium', color: '#d97706', bg: '#fef3c7' };
    return { label: 'Low', color: '#16a34a', bg: '#d1fae5' };
};
const moduleBadgeMap = {
    'What is CSense': { icon: '🛡️', label: 'CSense Pioneer' },
    'Social Engineering': { icon: '🎭', label: 'Social Guardian' },
    'Password Security': { icon: '🔐', label: 'Key Keeper' },
    'Phishing': { icon: '🎣', label: 'Phish Spotter' },
    'Physical Security': { icon: '🏢', label: 'Site Sentinel' },
    'Safe Browsing & Email Conduct': { icon: '🌐', label: 'Web & Inbox Defender' },
    'Incident Response': { icon: '🚨', label: 'First Responder' },
};

/* ─────────────────────────────────────────────
   API → UI data mappers
───────────────────────────────────────────── */

// Map GET /admin/users response to the employee shape the UI expects
function mapApiUser(u) {
    return {
        id: u._id,
        name: u.name,
        email: u.email,
        module: '—',
        progress: 0,
        quizStatus: 'Not Taken',
        status: u.isActive ? 'inprogress' : 'notstarted',
        points: 0,
        risk: { knowledge: 0, behavioural: 0, simulation: 0, engagement: 0 },
        badges: [],
    };
}

// Map GET /admin/stats response to the stat cards shape the UI expects
function mapApiStats(apiStats) {
    const ov = apiStats?.overview || {};
    const qt = apiStats?.quizStats || {};
    return {
        totalEmployees: ov.totalUsers ?? 0,
        avgCompletion: ov.completionRate ?? 0,
        totalPassed: qt.passedAttempts ?? 0,
        inProgress: (ov.totalUsers ?? 0) - (ov.completedAllModules ?? 0),
    };
}

// Map moduleBreakdown from GET /admin/stats + module titles from GET /admin/modules
// moduleBreakdown has: { moduleNumber, totalUsers, completedUsers, completionRate }
// adminModules has: [{ _id, number, title, ... }]
function mapModuleBreakdown(moduleBreakdown, adminModules) {
    return moduleBreakdown.map((mb) => {
        const mod = adminModules.find((m) => m.number === mb.moduleNumber);
        const total = mb.totalUsers || 1;
        const completed = mb.completedUsers || 0;
        const inProgress = Math.max(0, total - completed);
        const notStarted = 0; // not returned by API, derive if needed
        return {
            id: mb.moduleNumber,
            name: mod?.title || `Module ${mb.moduleNumber}`,
            completed,
            inProgress,
            notStarted,
        };
    });
}

/* ─────────────────────────────────────────────
   Fallback / demo data (shown when API is down)
───────────────────────────────────────────── */
const DEFAULT_EMPLOYEES = [
    { id: 1, name: 'Alice Martin', email: 'alice@company.co', module: 'Social Engineering', progress: 80, quizStatus: 'Not Taken', status: 'inprogress', points: 620, risk: { knowledge: 72, behavioural: 68, simulation: 55, engagement: 80 }, badges: ['What is CSense', 'Password Security'] },
    { id: 2, name: 'Bob Chen', email: 'bob@company.co', module: 'Password Security', progress: 100, quizStatus: 'Passed', status: 'complete', points: 1450, risk: { knowledge: 95, behavioural: 90, simulation: 88, engagement: 95 }, badges: ['What is CSense', 'Password Security', 'Phishing'] },
    { id: 3, name: 'Sara Malik', email: 'sara@company.co', module: 'What is CSense', progress: 20, quizStatus: 'Not Taken', status: 'inprogress', points: 140, risk: { knowledge: 30, behavioural: 40, simulation: 70, engagement: 25 }, badges: [] },
    { id: 4, name: 'James Okoye', email: 'james@company.co', module: 'Phishing', progress: 55, quizStatus: 'Failed', status: 'inprogress', points: 390, risk: { knowledge: 45, behavioural: 50, simulation: 80, engagement: 55 }, badges: ['What is CSense'] },
    { id: 5, name: 'Lena Fischer', email: 'lena@company.co', module: 'Password Security', progress: 100, quizStatus: 'Passed', status: 'complete', points: 980, risk: { knowledge: 88, behavioural: 85, simulation: 72, engagement: 90 }, badges: ['What is CSense', 'Social Engineering', 'Password Security'] },
    { id: 6, name: 'Omar Khalil', email: 'omar@company.co', module: 'What is CSense', progress: 0, quizStatus: 'Not Taken', status: 'notstarted', points: 0, risk: { knowledge: 0, behavioural: 0, simulation: 0, engagement: 0 }, badges: [] },
];
const DEFAULT_MODULES = [
    { id: 1, name: 'What is CSense', completed: 18, inProgress: 4, notStarted: 2 },
    { id: 2, name: 'Social Engineering', completed: 12, inProgress: 8, notStarted: 4 },
    { id: 3, name: 'Password Security', completed: 9, inProgress: 6, notStarted: 9 },
    { id: 4, name: 'Phishing', completed: 6, inProgress: 5, notStarted: 13 },
    { id: 5, name: 'Physical Security', completed: 3, inProgress: 4, notStarted: 17 },
    { id: 6, name: 'Safe Browsing & Email Conduct', completed: 5, inProgress: 7, notStarted: 12 },
    { id: 7, name: 'Incident Response', completed: 2, inProgress: 3, notStarted: 19 },
];

/* ─────────────────────────────────────────────
   Create User Modal
───────────────────────────────────────────── */
const CreateUserModal = ({ onClose, onSave }) => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSave = async () => {
        if (!form.name || !form.email || !form.password) {
            setError('Name, email and password are required.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await apiService.createAdminUser({
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
            });
            onSave();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create user.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Create New User</h2>
                    <button className={styles.modalClose} onClick={onClose}>✕</button>
                </div>
                <div className={styles.modalBody}>
                    {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Full Name *</label>
                            <input className={styles.formInput} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jane Doe" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email Address *</label>
                            <input className={styles.formInput} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@company.co" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Password *</label>
                            <input className={styles.formInput} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 characters" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Role</label>
                            <select className={styles.formSelect} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                                <option value="user">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
                    <button className={styles.btnPrimary} onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Risk Profile Modal
───────────────────────────────────────────── */
const RiskProfileModal = ({ emp, onClose }) => {
    if (!emp) return null;
    const composite = Math.round(
        (100 - emp.risk.knowledge) * 0.3 + (100 - emp.risk.behavioural) * 0.25 +
        emp.risk.simulation * 0.3 + (100 - emp.risk.engagement) * 0.15
    );
    const risk = getRiskLevel(composite);
    const dims = [
        { label: 'Knowledge', weight: '30%', val: emp.risk.knowledge, color: '#2563eb' },
        { label: 'Behavioural', weight: '25%', val: emp.risk.behavioural, color: '#7c3aed' },
        { label: 'Simulation', weight: '30%', val: emp.risk.simulation, color: '#dc2626' },
        { label: 'Engagement', weight: '15%', val: emp.risk.engagement, color: '#0d9488' },
    ];
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Risk Profile — {emp.name}</h2>
                    <button className={styles.modalClose} onClick={onClose}>✕</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.riskSummaryRow}>
                        <div className={styles.riskScoreBig} style={{ background: risk.bg, color: risk.color }}>
                            <span className={styles.riskScoreNum}>{composite}</span>
                            <span className={styles.riskScoreLabel}>{risk.label} Risk</span>
                        </div>
                        <div className={styles.riskMeta}>
                            <p><strong>Email:</strong> {emp.email}</p>
                            <p><strong>Module:</strong> {emp.module}</p>
                            <p><strong>Quiz:</strong> {emp.quizStatus}</p>
                            <p><strong>Progress:</strong> {emp.progress}%</p>
                        </div>
                    </div>
                    <h3 className={styles.riskDimTitle}>Score Dimensions</h3>
                    <div className={styles.riskDimList}>
                        {dims.map(d => (
                            <div key={d.label} className={styles.riskDimRow}>
                                <div className={styles.riskDimMeta}>
                                    <span className={styles.riskDimName}>{d.label}</span>
                                    <span className={styles.riskDimWeight}>{d.weight} weight</span>
                                    <span className={styles.riskDimVal} style={{ color: d.color }}>{d.val}</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: `${d.val}%`, background: d.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.btnPrimary} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
const Dashboard = () => {
    const {
        user,
        adminStats, setAdminStats,
        employees: storeEmployees, setEmployees,
        moduleStats, setModuleStats,
        adminLoading, setAdminLoading,
        adminError, setAdminError,
        clearUser,
    } = useAppStore();

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [riskEmployee, setRiskEmployee] = useState(null);

    // ── Fetch all data on mount ──────────────────────────────────────────────
    const fetchData = async () => {
        setAdminLoading(true);
        setAdminError(null);
        try {
            // 🚨 MOCK DATA OVERRIDE: API calls disabled for frontend testing.
            // The dashboard now runs completely independently from the backend (except Create User).
            setAdminStats({ totalEmployees: 24, avgCompletion: 61, totalPassed: 14, inProgress: 8 });
            setModuleStats(DEFAULT_MODULES);
            setEmployees(DEFAULT_EMPLOYEES);

        } catch (err) {
            setAdminError(err.message);
        } finally {
            setAdminLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleLogout = async () => {
        try {
            await apiService.logout();
        } catch (_) {
            // ignore
        } finally {
            clearUser();
            navigate('/');
        }
    };

    // ── Data with fallbacks ──────────────────────────────────────────────────
    const stats = adminStats || { totalEmployees: 24, avgCompletion: 61, totalPassed: 14, inProgress: 8 };
    const empList = storeEmployees.length > 0 ? storeEmployees : DEFAULT_EMPLOYEES;
    const modList = moduleStats.length > 0 ? moduleStats : DEFAULT_MODULES;

    const handleUserCreated = () => { fetchData(); };

    if (adminLoading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    const scoreboard = [...empList].sort((a, b) => (b.points || 0) - (a.points || 0));
    const withRisk = empList.map(e => {
        const c = e.risk
            ? Math.round((100 - e.risk.knowledge) * 0.3 + (100 - e.risk.behavioural) * 0.25 + e.risk.simulation * 0.3 + (100 - e.risk.engagement) * 0.15)
            : 0;
        return { ...e, compositeRisk: c };
    });

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'employees', label: 'Employees' },
        { id: 'modules', label: 'Modules' },
        { id: 'risk', label: 'Risk Profiles' },
        { id: 'scoreboard', label: 'Scoreboard' },
        { id: 'badges', label: 'Badges' },
        { id: 'reports', label: 'Reports' },
    ];

    return (
        <div className={styles.appShell}>
            <Sidebar />

            <div className={styles.mainArea}>

                {/* Topbar */}
                <TopBar />

                <main className={styles.content}>
                    <div className={styles.pageTitleRow}>
                        <h1 className={styles.pageTitle}>Admin Dashboard</h1>
                        <button className={styles.btnPrimary} onClick={() => setShowCreateUser(true)}>
                            + Create User
                        </button>
                    </div>

                    {adminError && (
                        <p style={{ color: '#d97706', fontSize: 13, marginBottom: 12 }}>
                            ⚠ Could not reach server — showing preview data.
                        </p>
                    )}

                    {/* Tab Nav */}
                    <div className={styles.tabNav}>
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabBtnActive : ''}`}
                                onClick={() => setActiveTab(t.id)}
                            >{t.label}</button>
                        ))}
                    </div>

                    {/* ══ OVERVIEW ══ */}
                    {activeTab === 'overview' && (
                        <>
                            <div className={styles.statsRow}>
                                <div className={styles.statCard}>
                                    <span className={styles.statLabel}>Total Employees</span>
                                    <span className={styles.statValue}>{stats.totalEmployees}</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statLabel}>Avg Completion</span>
                                    <span className={styles.statValue}>{stats.avgCompletion}%</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statLabel}>Passed All Quizzes</span>
                                    <span className={`${styles.statValue} ${styles.statGreen}`}>{stats.totalPassed}</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statLabel}>In Progress</span>
                                    <span className={`${styles.statValue} ${styles.statBlue}`}>{stats.inProgress}</span>
                                </div>
                            </div>

                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Module Breakdown</h2>
                                <div className={styles.moduleGrid}>
                                    {modList.map((mod) => {
                                        const total = (mod.completed || 0) + (mod.inProgress || 0) + (mod.notStarted || 0) || 1;
                                        const pct = Math.round(((mod.completed || 0) / total) * 100);
                                        const badge = moduleBadgeMap[mod.name];
                                        return (
                                            <div key={mod.id} className={styles.moduleCard}>
                                                <div className={styles.moduleTop}>
                                                    <span className={styles.moduleName}>{badge?.icon} {mod.name}</span>
                                                    <span className={styles.modulePct}>{pct}%</span>
                                                </div>
                                                <div className={styles.progressTrack}>
                                                    <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                                                </div>
                                                <div className={styles.moduleStats}>
                                                    <span className={styles.modStatCompleted}>✓ {mod.completed || 0} completed</span>
                                                    <span className={styles.modStatProgress}>◑ {mod.inProgress || 0} in progress</span>
                                                    <span className={styles.modStatNotStarted}>= {mod.notStarted || 0} not started</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ══ EMPLOYEES ══ */}
                    {activeTab === 'employees' && (
                        <div className={styles.section}>
                            <div className={styles.sectionTitleRow}>
                                <h2 className={styles.sectionTitle}>Employee Progress</h2>
                                <button className={styles.btnPrimary} onClick={() => setShowCreateUser(true)}>+ Add Employee</button>
                            </div>
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Name</th><th>Email</th><th>Current Module</th>
                                            <th>Progress</th><th>Quiz</th><th>Status</th><th>Tier</th><th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {empList.map((emp) => {
                                            const tier = getTier(emp.points || 0);
                                            return (
                                                <tr key={emp.id}>
                                                    <td className={styles.empName}>{emp.name}</td>
                                                    <td className={styles.empEmail}>{emp.email}</td>
                                                    <td>{emp.module}</td>
                                                    <td>
                                                        <div className={styles.progressCell}>
                                                            <div className={styles.progressTrack}>
                                                                <div className={styles.progressFill} style={{ width: `${emp.progress}%` }} />
                                                            </div>
                                                            <span className={styles.progressPct}>{emp.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {emp.progress < 100
                                                            ? <span className={`${styles.badge} ${styles.badgeLocked}`}>🔒 Locked</span>
                                                            : <span className={`${styles.badge} ${quizBadgeClass(emp.quizStatus, styles)}`}>{emp.quizStatus}</span>
                                                        }
                                                    </td>
                                                    <td>
                                                        <span className={`${styles.badge} ${statusBadgeClass(emp.status, styles)}`}>{statusLabel(emp.status)}</span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.tierChip} style={{ background: tier.bg, color: tier.color }}>{tier.label}</span>
                                                    </td>
                                                    <td>
                                                        <button className={styles.linkBtn} onClick={() => setRiskEmployee(emp)}>View Risk</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ══ MODULES ══ */}
                    {activeTab === 'modules' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>All Modules</h2>
                            <div className={styles.moduleGrid}>
                                {modList.map((mod) => {
                                    const total = (mod.completed || 0) + (mod.inProgress || 0) + (mod.notStarted || 0) || 1;
                                    const pct = Math.round(((mod.completed || 0) / total) * 100);
                                    const badge = moduleBadgeMap[mod.name];
                                    return (
                                        <div key={mod.id} className={styles.moduleCard}>
                                            <div className={styles.moduleTop}>
                                                <span className={styles.moduleName}>{badge?.icon} {mod.name}</span>
                                                <span className={styles.modulePct}>{pct}%</span>
                                            </div>
                                            <div className={styles.progressTrack}>
                                                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                                            </div>
                                            <div className={styles.moduleStats}>
                                                <span className={styles.modStatCompleted}>✓ {mod.completed || 0} completed</span>
                                                <span className={styles.modStatProgress}>◑ {mod.inProgress || 0} in progress</span>
                                                <span className={styles.modStatNotStarted}>= {mod.notStarted || 0} not started</span>
                                            </div>
                                            {badge && <div className={styles.moduleBadgeHint}>🏅 Badge: <strong>{badge.label}</strong></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ══ RISK PROFILES ══ */}
                    {activeTab === 'risk' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Dynamic Risk Profiles</h2>
                            <p className={styles.sectionDesc}>
                                Each employee's risk score is a composite index weighted across four dimensions:
                                Knowledge (30%), Behavioural (25%), Simulation (30%), Engagement (15%).
                            </p>
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Employee</th><th>Knowledge</th><th>Behavioural</th>
                                            <th>Simulation</th><th>Engagement</th><th>Composite</th>
                                            <th>Risk Level</th><th>Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {withRisk.map(emp => {
                                            const risk = getRiskLevel(emp.compositeRisk);
                                            return (
                                                <tr key={emp.id}>
                                                    <td className={styles.empName}>{emp.name}</td>
                                                    <td>{emp.risk?.knowledge ?? '—'}</td>
                                                    <td>{emp.risk?.behavioural ?? '—'}</td>
                                                    <td>{emp.risk?.simulation ?? '—'}</td>
                                                    <td>{emp.risk?.engagement ?? '—'}</td>
                                                    <td><strong>{emp.compositeRisk}</strong></td>
                                                    <td>
                                                        <span className={styles.riskChip} style={{ background: risk.bg, color: risk.color }}>
                                                            {risk.label}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button className={styles.linkBtn} onClick={() => setRiskEmployee(emp)}>View Profile</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.govSection}>
                                <h3 className={styles.govTitle}>🚩 Governance Escalations</h3>
                                <p className={styles.sectionDesc}>Employees with High composite risk require documented administrative review.</p>
                                {withRisk.filter(e => e.compositeRisk >= 75).length === 0 ? (
                                    <div className={styles.govEmpty}>No high-risk employees at this time. ✓</div>
                                ) : (
                                    <div className={styles.govList}>
                                        {withRisk.filter(e => e.compositeRisk >= 75).map(e => (
                                            <div key={e.id} className={styles.govCard}>
                                                <div>
                                                    <strong>{e.name}</strong>
                                                    <span className={styles.govEmail}>{e.email}</span>
                                                </div>
                                                <span className={styles.riskChip} style={{ background: '#fee2e2', color: '#dc2626' }}>
                                                    Score: {e.compositeRisk} — High Risk
                                                </span>
                                                <button className={styles.btnSecondary}>Log Response</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ══ SCOREBOARD ══ */}
                    {activeTab === 'scoreboard' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Scoring Leaderboard</h2>
                            <div className={styles.tierLegend}>
                                {[
                                    { label: 'Apprentice', range: '0 – 199', color: '#dc2626', bg: '#fee2e2' },
                                    { label: 'Aware', range: '200 – 499', color: '#d97706', bg: '#fef3c7' },
                                    { label: 'Practitioner', range: '500 – 899', color: '#0d9488', bg: '#ccfbf1' },
                                    { label: 'Guardian', range: '900 – 1399', color: '#0369a1', bg: '#e0f2fe' },
                                    { label: 'Defender', range: '1400+', color: '#7c3aed', bg: '#ede9fe' },
                                ].map(t => (
                                    <span key={t.label} className={styles.tierLegendChip} style={{ background: t.bg, color: t.color }}>
                                        {t.label} <span className={styles.tierRange}>{t.range}</span>
                                    </span>
                                ))}
                            </div>
                            <div className={styles.tableWrap} style={{ marginTop: 16 }}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr><th>#</th><th>Employee</th><th>Points</th><th>Tier</th><th>Progress Bar</th></tr>
                                    </thead>
                                    <tbody>
                                        {scoreboard.map((emp, idx) => {
                                            const tier = getTier(emp.points || 0);
                                            const nextMax = emp.points >= 1400 ? 1400 : [200, 500, 900, 1400].find(x => x > (emp.points || 0));
                                            const pct = Math.min(100, Math.round(((emp.points || 0) / nextMax) * 100));
                                            return (
                                                <tr key={emp.id}>
                                                    <td style={{ fontWeight: 700, color: idx < 3 ? '#d97706' : '#64748b' }}>
                                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                                    </td>
                                                    <td className={styles.empName}>{emp.name}</td>
                                                    <td style={{ fontWeight: 700, color: tier.color }}>{emp.points || 0}</td>
                                                    <td><span className={styles.tierChip} style={{ background: tier.bg, color: tier.color }}>{tier.label}</span></td>
                                                    <td style={{ minWidth: 140 }}>
                                                        <div className={styles.progressCell}>
                                                            <div className={styles.progressTrack}>
                                                                <div className={styles.progressFill} style={{ width: `${pct}%`, background: tier.color }} />
                                                            </div>
                                                            <span className={styles.progressPct} style={{ color: tier.color }}>{pct}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ══ BADGES ══ */}
                    {activeTab === 'badges' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Badge Awards</h2>
                            <p className={styles.sectionDesc}>Badges are awarded automatically upon full completion of each module.</p>
                            <div className={styles.badgeOverviewGrid}>
                                {Object.entries(moduleBadgeMap).map(([mod, info]) => {
                                    const earners = empList.filter(e => e.badges?.includes(mod));
                                    return (
                                        <div key={mod} className={styles.badgeOverviewCard}>
                                            <div className={styles.badgeIcon}>{info.icon}</div>
                                            <div className={styles.badgeName}>{info.label}</div>
                                            <div className={styles.badgeMod}>{mod}</div>
                                            <div className={styles.badgeEarners}>
                                                {earners.length === 0
                                                    ? <span className={styles.badgeNone}>No earners yet</span>
                                                    : earners.map(e => <span key={e.id} className={styles.badgeEarnerChip}>{e.name}</span>)
                                                }
                                            </div>
                                            <div className={styles.badgeCount}>{earners.length} / {empList.length} earned</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <h2 className={styles.sectionTitle} style={{ marginTop: 32 }}>Per-Employee Badges</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead><tr><th>Employee</th><th>Badges Earned</th><th>Count</th></tr></thead>
                                    <tbody>
                                        {empList.map(emp => (
                                            <tr key={emp.id}>
                                                <td className={styles.empName}>{emp.name}</td>
                                                <td>
                                                    <div className={styles.badgeChipRow}>
                                                        {(emp.badges || []).length === 0
                                                            ? <span className={styles.badgeNone}>None yet</span>
                                                            : (emp.badges || []).map(b => {
                                                                const info = moduleBadgeMap[b];
                                                                return <span key={b} className={styles.badgeChip}>{info?.icon} {info?.label || b}</span>;
                                                            })
                                                        }
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 700, color: '#2563eb' }}>{(emp.badges || []).length}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ══ REPORTS ══ */}
                    {activeTab === 'reports' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Awareness Reports</h2>
                            <p className={styles.sectionDesc}>Organisational risk metrics and governance documentation.</p>
                            <div className={styles.reportGrid}>
                                {[
                                    { icon: '📊', title: 'Overall Completion Report', desc: 'Module-by-module completion rates across all employees.' },
                                    { icon: '⚠️', title: 'Risk Score Distribution', desc: 'Breakdown of composite risk levels across the organisation.' },
                                    { icon: '🎣', title: 'Phishing Simulation Report', desc: 'Click rates, credential submissions, and campaign outcomes.' },
                                    { icon: '🏅', title: 'Badge & Tier Summary', desc: 'Distribution of scoring tiers and awarded badges.' },
                                    { icon: '📋', title: 'Governance Escalation Log', desc: 'Documented responses to red-status risk events.' },
                                    { icon: '📈', title: 'Engagement Analytics', desc: 'Time-on-content, feedback response rates, and drop-off points.' },
                                ].map(r => (
                                    <div key={r.title} className={styles.reportCard}>
                                        <div className={styles.reportIcon}>{r.icon}</div>
                                        <div>
                                            <h3 className={styles.reportTitle}>{r.title}</h3>
                                            <p className={styles.reportDesc}>{r.desc}</p>
                                        </div>
                                        <button className={styles.btnSecondary}>Generate</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </div>

            <div className={styles.wingWrapper}><Wingg /></div>

            {showCreateUser && (
                <CreateUserModal onClose={() => setShowCreateUser(false)} onSave={handleUserCreated} />
            )}
            {riskEmployee && (
                <RiskProfileModal emp={riskEmployee} onClose={() => setRiskEmployee(null)} />
            )}
        </div>
    );
};

export default Dashboard;