// styles
import styles from './ChangePassword.module.css';
// config

// hooks
import { useState, useContext, useEffect, useReducer } from 'react';
import { useValidateUserInput } from '../../../../hooks/authentication-hooks/useValidateUserInput';
import { useCreatePasswordForExistingUser } from '../../../../hooks/authentication-hooks/useCreatePasswordForExistingUser';

// context
import { ModalContext } from '../../../../context/modalContext';
import { AuthContext } from '../../../../context/authContext';

// components
import MessageModal from '../../../../components/modals/authentication-modals/message-modal/MessageModal';


const initialStateOfPasswords = {
    passwordOne: '',
    passwordOneIsValid: false,
    passwordTwo: '',
    passwordTwoIsValid: false
}

const ChangePasswordCreatePassword = () => {

    // Import user input validation functions and state from useValidateUserInput()
    const { validatePasswordForSignup, validateMatchingPasswordForSignup, userInputErrorMessage } = useValidateUserInput();

    const reduceStateOfPasswords = (state, action) => {
        switch (action.type) {
            case 'CHANGE_PASSWORD_ONE_VALUE':
                    return { ...state, passwordOne: action.payload, passwordOneIsValid: validatePasswordForSignup(action.payload) };
            case 'CHANGE_PASSWORD_TWO_VALUE':
                    return { ...state, passwordTwo: action.payload, passwordTwoIsValid: validateMatchingPasswordForSignup(state.passwordOne, action.payload) };
            default: return { ...state };
        }
    }

    // State for user input
    const [stateOfPasswords, dispatchStateOfPasswords] = useReducer(reduceStateOfPasswords, initialStateOfPasswords);

    // Only once the submit button is clicked React show the user input error message
    const [createPasswordButtonIsClicked, setCreatePasswordButtonIsClicked] = useState(false);

    // Password creation hook
    const { createPasswordForExistingUser, createPasswordForExistingUserState } = useCreatePasswordForExistingUser();

    // Modal context to set modal
    const { setModalState } = useContext(ModalContext);

    // To update our AuthContext
    const { dispatchAuthState } = useContext(AuthContext);

    // Boolean for our form check. Only if form is valid can we submit out form
    const [formIsValid, setFormIsValid] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!createPasswordButtonIsClicked){
            setCreatePasswordButtonIsClicked(true);
        }
        if(formIsValid){
            await createPasswordForExistingUser(stateOfPasswords.passwordOne);
            dispatchAuthState({ type: 'CREATE_PASSWORD_FOR_EXISTING_USER' });
            setModalState(<MessageModal 
                message='Password Successfully Created :)'
            />)
        }  
    }
    
    useEffect(() => {
        if(stateOfPasswords.passwordOneIsValid && stateOfPasswords.passwordTwoIsValid){
            setFormIsValid(true);
        } else {
            setFormIsValid(false);
        }
    }, [stateOfPasswords.passwordOneIsValid, stateOfPasswords.passwordTwoIsValid])

    return (
        <div className={styles['create-password-wrapper']}>
            <p><b>It seems you have signed-up using Google Authentication.</b></p>
            <p>If you want to add password authentication, please create a password below.</p>

            <form onSubmit={handleSubmit}>

                <label>
                    <span>Password:</span>
                    <input
                        type='password'
                        id='password-one'
                        value={stateOfPasswords.passwordOne}
                        onChange={(e) => dispatchStateOfPasswords({ type: 'CHANGE_PASSWORD_ONE_VALUE', payload: e.target.value})}
                        disabled={createPasswordForExistingUserState.isPending}
                        autoFocus
                    />
                </label>

                <label>
                    <span>Confirm Password:</span>
                    <input
                        type='password'
                        id='password-two'
                        value={stateOfPasswords.passwordTwo}
                        onChange={(e) => dispatchStateOfPasswords({ type: 'CHANGE_PASSWORD_TWO_VALUE', payload: e.target.value})}
                        disabled={createPasswordForExistingUserState.isPending}
                    />
                </label>

                {createPasswordForExistingUserState.error && <p className='error'>{createPasswordForExistingUserState.error}</p>}

                {createPasswordButtonIsClicked && userInputErrorMessage && (<p className='error'>{userInputErrorMessage}</p>)}
                {createPasswordButtonIsClicked && !formIsValid ? (
                    <button disabled>Create Password</button> 
                    ) : ( 
                    <button disabled={createPasswordForExistingUserState.isPending}>Create Password</button>
                )}

            </form>
        </div>
    )
}

export default ChangePasswordCreatePassword;