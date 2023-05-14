// styles
import styles from './ModalCard.module.css';
import exitIcon from '../../../media/icons/close.svg';

// config

// context
import { useContext } from 'react';
import { ModalContext } from '../../../context/modalContext';

// hooks

// components


const ModalCard = ({ children }) => {

    const { setModalState } = useContext(ModalContext);

    return (
        <div className={styles.modalCard}>
            <img 
                className={styles.close}
                src={exitIcon}
                onClick={() => {setModalState(null)}} 
                alt='Exit the modal here'
            />
            {children}
        </div>
    )
}

export default ModalCard;