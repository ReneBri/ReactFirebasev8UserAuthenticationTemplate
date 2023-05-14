// styles & icons
import googleIcon from '../../../../media/icons/googleIcon.svg';
import styles from './GoogleAuthenticationButton.module.css';

// config
import firebaseAuth, { provider } from '../../../../config/firebaseConfig';

// hooks
import { useContext } from 'react';

// context
import { ModalContext } from '../../../../context/modalContext';


const GoogleAuthenticationButton = ({ login }) => {

    const { setModalState } = useContext(ModalContext);

    // I have no idea how this updates the state once it logs the user in.
    // I have not set it to do so and there is no useEffect set.
    const handleLoginWithGoogle = async () => {
        try{
            await firebaseAuth.signInWithPopup(provider);
            setModalState(null);
        }
        catch(err){
            // setInputErrorMessage(err.message);
        }
    }

    const handleKeyDown = async (e) => {
        if(e.key === 'Enter'){
            handleLoginWithGoogle();
        }
    }

    return (
        <div 
            className={styles['google-authentication-button']}
            role='button'
            tabIndex='0'
            onClick={handleLoginWithGoogle}
            onKeyDown={handleKeyDown}
        >
            <img 
                className={styles['google-icon']}
                src={googleIcon} 
                alt='google icon' 
                width='50'
            />
            <p><strong>Click here to continue using your Google account.</strong> </p>
        </div>
    )
}

export default GoogleAuthenticationButton;