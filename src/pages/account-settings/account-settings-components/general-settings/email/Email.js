// styles
import styles from '../../../AccountSettings.module.css';

// config
import firebaseAuth from '../../../../../config/firebaseConfig';

// context
import { AuthContext } from '../../../../../context/authContext';
import { ModalContext } from '../../../../../context/modalContext';

// hooks
import { useContext, useReducer } from 'react';
import { useValidateUserInput } from '../../../../../hooks/authentication-hooks/useValidateUserInput';
import { useChangeEmail } from '../../../../../hooks/authentication-hooks/useChangeEmail';

// components
import ReauthenticateUser from '../../../../../components/modals/authentication-modals/reauthenticate-user/ReauthenticateUser';


const Email = ({ infoToChange, setInfoToChange, email }) => {

    // Use AuthContext
    const { user, dispatchAuthState } = useContext(AuthContext);

    // To set the modal state
    const { setModalState } = useContext(ModalContext)

    const { updateFirebaseEmail, unverifyEmail, resendEmailVerification, changeEmailError } = useChangeEmail();

    // Validate the newly chosen display name
    const { validateEmail, userInputErrorMessage } = useValidateUserInput();

    // Reducer for the user input
    const reduceEnteredEmail = (state, action) => {
        switch(action.type){
            case 'UPDATE_ENTERED_EMAIL':
                return { value: action.payload, isValid: validateEmail(action.payload) };
            default:
                return { ...state };
        }
    }

    // State for the display name shown on the page which is linked to the input field
    const [enteredEmailState, dispatchEnteredEmail] = useReducer(reduceEnteredEmail, { 
        value: email, 
        isValid: true
    });

    const handleUpdateEmail = async () => {
        await updateFirebaseEmail(enteredEmailState.value);
        await unverifyEmail();
        resendEmailVerification();
        setInfoToChange(null);
        dispatchAuthState({ 
            type: 'UPDATE_EMAIL', 
            payload: enteredEmailState.value
        });   
    }



    // Triggered when clicking the save button
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(enteredEmailState.value === email){
            setInfoToChange(null);
            return;
        }
        if(enteredEmailState.isValid){
            setModalState(<ReauthenticateUser 
                message1={`Are you sure you want to change your email to ${enteredEmailState.value}?`} 
                message2={`Enter your password to continue.`} 
                buttonText="Let's go!"
                onSuccessfulCompletion={handleUpdateEmail} 
                successModalMessage='Please check your inbox for a new verification email.'
                email={user.user.email}
            />);
        }
    }


    return (
        <>
            {infoToChange !== 'email' ? (
                <div className={styles['info-wrapper']}>
                    <div className={styles['info-label-wrapper']}>
                        <label htmlFor='user-email'>Email:</label>
                        <p id='user-email'>{email}</p>
                    </div>
                    {user.hasPassword ? (
                        <div className={styles['button-wrapper']}>
                            <button 
                                onClick={() => setInfoToChange('email')}
                                >Edit
                            </button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ) : ( 
                <>
                    <form className={styles['info-wrapper']}>
                        <div className={styles['info-label-wrapper']}>
                            <label htmlFor='email'>Email:</label>
                            <input 
                                id='email'
                                type='email'
                                value={enteredEmailState.value}
                                onChange={(e) => dispatchEnteredEmail({ 
                                type: 'UPDATE_ENTERED_EMAIL', 
                                payload: e.target.value 
                                })} 
                                autoFocus
                            />
                        </div>
                        <div className={styles['button-wrapper']}>
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={(e) => {
                                e.preventDefault();
                                dispatchEnteredEmail({ 
                                type: 'UPDATE_ENTERED_EMAIL', 
                                payload: email 
                                });
                                setInfoToChange(null)}
                                }
                                >Cancel
                            </button>
                        </div>
                    </form>

                    {userInputErrorMessage && (<p className='error'>{userInputErrorMessage}</p>)}

                    {changeEmailError && (<p className='error'>{changeEmailError}</p>)}
                </>
            )}
        </>
    )
}

export default Email;