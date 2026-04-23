import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Style from './Login.module.css'
import logo from '../assets/logo.svg'
import Wingg from '../components/ui/Wing'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useAppStore from "../store/useAppStore"
import apiService from "../services/apiService"

export default function Login() {
    const navigate = useNavigate();
    const setAuth = useAppStore((state) => state.setAuth);

    const [inputData, setinputData] = useState({
        email: "",
        pass: ""
    })
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    function handelemailchange(e) {
        setinputData({
            ...inputData,
            email: e.target.value
        })
    }
    function handelpasschange(e) {
        setinputData({
            ...inputData,
            pass: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiService.login(inputData.email, inputData.pass);
            
            if (data.success) {
                const { user, accessToken, refreshToken } = data.data;
                setAuth(user, accessToken, refreshToken);
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/dashboard");
            } else {
                setError(data.message || "Invalid email or password");
            }
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={Style['login-page']}>
            <>
                <img className={Style['logo']} src={logo} alt="Logo" />
            </>
            <div className={Style['login-form']}>
                <h1>Sign in</h1>
                {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
                <div className={Style['input-group']}>
                    <Input className={Style['input-email']} type="email" placeholder="name@company.co" label="Email Address" value={inputData.email} onChange={handelemailchange} />
                </div>
                <div className={Style['input-group']}>
                    <Input className={Style['input-pass']} type="password" placeholder="••••••••••••••••••••••" label="Password" value={inputData.pass} onChange={handelpasschange} />
                </div>
                <Button className={Style['btn-login']} name={isLoading ? "Signing in..." : "Sign in"} onClick={handleSubmit} disabled={isLoading} />
            </div>
            <Wingg />
        </div>
    )
}