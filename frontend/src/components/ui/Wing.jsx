import wing from '../../assets/logo-wing.svg'
import Style from './Wing.module.css'
export default function Wingg(){
    return(
        <div className={Style['wing-logo']}>
            <img src={wing} alt="wing" />
       </div>
    )
}