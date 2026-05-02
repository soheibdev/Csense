import styles from './Welcome.module.css';
import Wingg from '../components/ui/Wing';
import Gif from '../assets/welcom.gif';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';


export default function Welcome() {
    const navigate = useNavigate();

    return (
        <PageTransition>
            <div className={styles.welcomePage}>
                <div className={styles.welcomeBox}>
                    <img src={Gif} alt="welcome animation" width="700"></img>
                    <p className={styles.message}>Know the threats. Own the response. Stay safe.</p>
                </div>
                <Button
                    name="Get Started"
                    onClick={() => navigate('/login')}
                    style={{ width: "250px", height: "60px", borderRadius: "121px", fontSize: "20px", fontWeight: "700", color: "#F3F3F3" }}
                />
                <Wingg />
            </div>
        </PageTransition>
    );
}