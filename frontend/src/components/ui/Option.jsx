import styles from './Option.module.css';
export default function Option({optionNum, description, isSelected, isCorrect, isWrong, onClick}){
    let optionStateClass = '';
    let numberStateClass = '';
    
    if (isCorrect) {
        optionStateClass = styles.correct;
        numberStateClass = styles.correctNumber;
    } else if (isWrong) {
        optionStateClass = styles.wrong;
        numberStateClass = styles.wrongNumber;
    } else if (isSelected) {
        optionStateClass = styles.selected;
        numberStateClass = styles.selectedNumber;
    }

    return(
        <div className={`${styles.option} ${optionStateClass}`} onClick={onClick}>
             <div className={`${styles.optionNumber} ${numberStateClass}`} >
                 <p className={styles.optionNumberText}>{optionNum}</p>
             </div>
             <p className={styles.description}>{description}</p>
        </div>
    )
}