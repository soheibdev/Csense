import Style from './Button.module.css';
export default function Button({name, onClick, style, className, disabled}){
   return(
        <button 
           className={Style['global-button'] + ' ' + (className || '')} 
           onClick={onClick} 
           style={style}
           disabled={disabled}
        >
           {name}
        </button>
   );
}