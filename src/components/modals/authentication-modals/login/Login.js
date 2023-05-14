// context
import { ModalContext } from '../../../../context/modalContext';

// config

// hooks
import { useState, useReducer, useEffect, useContext } from 'react';
import { useLoginWithEmailAndPassword } from '../../../../hooks/authentication-hooks/useLoginWithEmailAndPassword';
import { useValidateUserInput } from '../../../../hooks/authentication-hooks/useValidateUserInput';

// components
import ModalBackground from '../../../modals/modal-background/ModalBackground';
import ModalCard from '../../../modals/modal-card/ModalCard';
import ForgottenPassword from '../forgotten-password/ForgottenPassword';
import GoogleAuthenticationButton from '../google-authentication-button/GoogleAuthenticationButton';
import ModalCardDivider from '../../modal-card/ModalCardDivider';


const initialInputFormState = {
    email: '',
    emailIsValid: false,
    password: '',
    passwordIsValid: false
}


const Login = () => {

    // Must import these functions first, so that they can be used inside the reducer function
    const { validateEmail, validatePassword } = useValidateUserInput();

    // Must import this inside of the component as it uses functions from the useValidateUserInput() hook
    const inputFormReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_EMAIL_VALUE':
                    return { ...state, email: action.payload, emailIsValid: validateEmail(action.payload) };
            case 'CHANGE_PASSWORD_VALUE':
                    return { ...state, password: action.payload, passwordIsValid: validatePassword(action.payload) };
            case 'CHECK_EMAIL_IS_VALID':
                return { ...state, emailIsValid: validateEmail(state.email) };
            case 'CHECK_PASSWORD_IS_VALID':
                return { ...state, passwordIsValid: validatePassword(state.password) };
            default: return { ...state };
        }
    }

    // Input form state
    const [inputFormState, dispatchInputFormState] = useReducer(inputFormReducer, initialInputFormState);

    // Custom component error messages
    const [inputErrorMessage, setInputErrorMessage] = useState(null);

    // Only when clicked will the component show error messages
    const [loginButtonClicked, setLoginButtonClicked] = useState(false)

    // To set modal state
    const { setModalState } = useContext(ModalContext);

    // Login with email and password state & function
    const { login, loginState } = useLoginWithEmailAndPassword();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loginButtonClicked){
            setLoginButtonClicked(true);
        }
        const formChecker = formIsValid();
        if(formChecker){
            await login(inputFormState.email, inputFormState.password);
        }
    }

    //  Closes the modal after a successful login
    useEffect(() => {
        if(loginState.success){
            setModalState(null);
        }
    }, [loginState.success, setModalState])


    // When dealing with the multi line form input, to send error message to the user we cannot use the supplied userInputErrorState which comes from the hook itself. We must use a custom error message.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const formIsValid = () => {
            if(!inputFormState.emailIsValid){
                setInputErrorMessage('Email address is invalid.');
                return false;
            } else if(!inputFormState.passwordIsValid){
                setInputErrorMessage('Please enter a password.');
                return false;
            }else{
                setInputErrorMessage(null);
                return true;
            }
    }

    // Checks form is valid and throws custom error messages to the user depending on the input
    useEffect(() => {
            formIsValid();
    }, [inputFormState, formIsValid])

    return (
        <>
            <ModalBackground />
            <ModalCard>

                <h3>Login with Email & Password</h3>
                <form onSubmit={handleSubmit}>

                    <label>
                        <span>Email:</span>
                        <input 
                            type='text'
                            value={inputFormState.email}
                            onChange={(e) => dispatchInputFormState({ 
                                type: 'CHANGE_EMAIL_VALUE', 
                                payload: e.target.value 
                            })}  
                            autoFocus
                        />
                    </label>

                    <label>
                        <span>Password:</span>
                        <input 
                            type='password'
                            value={inputFormState.passwordOne}
                            onChange={(e) => dispatchInputFormState({ 
                                type: 'CHANGE_PASSWORD_VALUE', 
                                payload: e.target.value 
                            })} 
                        />
                    </label>
                    
                    {!loginState.isPending ? <button>Login!</button> : <button disabled>Logging in...</button>}

                </form>

                {loginState.error ? ( <p className='error'>{loginState.error}</p> ) : (<div></div>)}

                {/* {loginButtonClicked && inputErrorMessage && ( <p className='error'>{inputErrorMessage}</p> )} */}

                {loginButtonClicked && inputErrorMessage && ( <p className='error'>{inputErrorMessage}</p> )}

                <ModalCardDivider />

                <GoogleAuthenticationButton />

                <button onClick={() => setModalState(<ForgottenPassword />)}>Forgotten your password?</button>

            </ModalCard>
    
        </>
    )
}

export default Login;