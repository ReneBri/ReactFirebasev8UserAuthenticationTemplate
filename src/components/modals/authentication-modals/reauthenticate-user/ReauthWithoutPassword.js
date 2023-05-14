// styles

// config

// hooks
import { useContext, useReducer, useState, useEffect, useCallback } from "react";
import { useValidateUserInput } from "../../../../hooks/authentication-hooks/useValidateUserInput";

// context
import { ModalContext } from "../../../../context/modalContext";

// components
import MessageModal from "../message-modal/MessageModal";


const initialEmailState = {
    value: '',
    isValid: null
}

const ReauthWithoutPassword = ({ message1, message2, buttonText, onSuccessfulCompletion, deleteUserState, successModalMessage, email }) => {

    // Must import these functions first, so that they can be used inside the reducer function. We use the state from this this timebecause there is only one user input
    const { validateEmail, userInputErrorMessage } = useValidateUserInput();

    // Must import this inside of the component as it uses functions from the useValidateUserInput() hook
    const reduceEmailState = (state, action) => {
        switch (action.type){
            case 'CHANGE_EMAIL_VALUE':
                return { value: action.payload, isValid: validateEmail(action.payload) };
            case 'CHECKK_EMAIL_IS_VALID':
                return { ...state, isValid: validateEmail(state.value) };
            default:
                return state;
        }
    }

    // Input form state
    const [emailState, dispatchEmailState] = useReducer(reduceEmailState, initialEmailState);

    // Set custom error incase entered email does not match the saved user email
    const [matchingEmailError, setMatchingEmailError] = useState(null);

    // Only when clicked will the component show error messages
    const [reauthButtonClicked, setReauthButtonClicked] = useState(false);

    // To set modal state
    const { setModalState } = useContext(ModalContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Switches the reauthIsClicked state to show any user input errors
        setMatchingEmailError(null);
        if (!reauthButtonClicked){
            setReauthButtonClicked(true);
        }
        // Checks if the emailState is valid and if so checks if the emails match
        if(emailState.isValid){
            const emailsMatch = checkEmailsMatch();
            if(emailsMatch){
                await onSuccessfulCompletion();
                setModalState(<MessageModal message={successModalMessage} />);
            } else {
                setMatchingEmailError('Typed email does not match your saved email address.');
            }
        }
    }

    // We use useCallback here because this function would be re-created on every re-render. This in turn would trigger the useEffect that is dependent on it every re-render, which is not what we want. Instead this function will only be re-created when items in its dependency array change.
    const checkEmailsMatch = useCallback(() => {
        if(!deleteUserState.success){
            if(emailState.value.toLowerCase() === email){
                return true;
            }
            return false;
        }
    }, [deleteUserState.success, email, emailState.value])

    // Once reauth button is clicked this will make sure the error message only displays when the emails are not matching
    useEffect(() => {
        const checkEmail = checkEmailsMatch();
        if(!checkEmail){
            setMatchingEmailError('Typed email does not match your saved email address.');
        } else {
            setMatchingEmailError(null);
        }
    }, [checkEmailsMatch, emailState.value])


    return(
        <>
            <h3>{message1}</h3>
            <h4>{message2}</h4>
            <p>{`You are signed in as ${email}`}</p>

            <form onSubmit={handleSubmit}>

                <label>
                    <span>Email:</span>
                    <input 
                        type='text'
                        value={emailState.value}
                        onChange={(e) => dispatchEmailState({ 
                            type: 'CHANGE_EMAIL_VALUE', 
                            payload: e.target.value 
                        })} 
                        autoFocus
                        disabled={deleteUserState.isPending}
                    />
                </label>

                {!deleteUserState.isPending ? <button>{buttonText}</button> : <button disabled>Pending...</button>}
            </form>

            {deleteUserState.error ? (<p className='error'>{deleteUserState.error}</p>) : (<div></div>)}

            {reauthButtonClicked && userInputErrorMessage && ( <p className='error'>{userInputErrorMessage}</p> )}

            {matchingEmailError && !userInputErrorMessage && reauthButtonClicked && (<p className='error'>{matchingEmailError}</p>)}

        </>
    )
}

export default ReauthWithoutPassword;