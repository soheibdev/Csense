import Input  from "../components/ui/Input"
import Button from "../components/ui/Button"
import Style from  './Login.module.css'
import logo from '../assets/logo.svg'
import Wingg from '../components/ui/Wing'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login(){
    const [inputData , setinputData]=useState({
        email:"",
        pass:""
    })
    const navigate = useNavigate()

    function handelemailchange(e){
        setinputData({
            ...inputData,
           email:e.target.value
        })
    }
    function handelpasschange(e){
        setinputData({
            ...inputData,
           pass:e.target.value
        })
    }
    function handelsubmit(){
        navigate('/topics')
    }
    return(
    <div className={Style['login-page']}>
            <>
              <img className={Style['logo']} src={logo} alt="Logo" />
            </>
        <div className={Style['login-form']}>
            <h1>Sign in</h1>
            <div className={Style['input-group']}>
                <Input className={Style['input-email']} type="email" placeholder="name@company.co" label="Email Address" value={inputData.email} onChange={handelemailchange}/>
            </div>
            <div className={Style['input-group']}>
                <Input className={Style['input-pass']}  type="password" placeholder="••••••••••••••••••••••" label="Password" value={inputData.pass} onChange={handelpasschange}/>
            </div>
              <Button className={Style['btn-login']} name="Sign in" onClick={handelsubmit}/>
        </div>
        <Wingg/>
    </div>
    )
}