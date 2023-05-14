// styles
import styles from './ModalBackground.module.css';

// config

// context
import { ModalContext } from '../../../context/modalContext';

// hooks
import { useContext } from 'react';

// components


const ModalBackground = ({ children }) => {

    const { setModalState } = useContext(ModalContext);

    return (
        <div 
            className={styles.modalBackground}
            onClick={() => setModalState(null)}
        >
            {children}
        </div>
    )
}

export default ModalBackground;