import Style from './Button.module.css';
export default function Button({name, onClick, style, className}){
   return(
        <button className={Style['global-button'] + ' ' + className} onClick={onClick} style={style}>{name}</button>
   );
}