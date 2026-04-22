
import Style from './Input.module.css'
export default function Input({value , onChange,placeholder,type,label,className}){
    return(
        <div  className={Style['input-group']}> 
             {label && <label>{label}</label>};
             <input  type={type} value={value} placeholder={placeholder} onChange={onChange} className={className} />
        </div>
        
    )
}