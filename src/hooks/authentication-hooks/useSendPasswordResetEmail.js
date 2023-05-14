// styles

// config
import firebaseAuth from '../../config/firebaseConfig';

// context

// hooks
import { useEffect, useState, useReducer} from 'react'

// components


const initialPasswordResetEmailState = {
    isPending: null,
    error: null,
    success: null
}

const reducePasswordResetEmail = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_PASSWORD_RESET_EMAIL':
            return { isPending: true, error: null, success: null };
        case 'PASSWORD_RESET_EMAIL_COMPLETE':
            return { isPending: false, error: null, success: true };
        case 'PASSWORD_RESET_EMAIL_ERROR':
            return { isPending: false, error: action.payload, success: false };
        default: return state;
    }
}

export const useSendPasswordResetEmail = () => {

    const [passwordResetEmailState, dispatchPasswordResetEmail] = useReducer(reducePasswordResetEmail, initialPasswordResetEmailState);

    // Saftey measure for unmounting. setIsCancelled is used in the useEffect clean-up function below
    const [isCancelled, setIsCancelled] = useState(false);

    // Main exported function we use for password reset
    const sendPasswordResetEmail = async (email) => {

        setIsCancelled(false);
        
        dispatchPasswordResetEmail({ type: 'ATTEMPT_PASSWORD_RESET_EMAIL' });

        try {
            // Send password reset email from Firebase
            await firebaseAuth.sendPasswordResetEmail(email);

            // Re-update state and authContext only if still mounted
            if (!isCancelled) {
                dispatchPasswordResetEmail({ type: 'PASSWORD_RESET_EMAIL_COMPLETE' });
            }
        }
        catch (err) {
            // Re-update state and authContext only if still mounted
            if (!isCancelled){
                dispatchPasswordResetEmail({ type: 'PASSWORD_RESET_EMAIL_ERROR', payload: err.message });
            }
        }
    }

    // Clean-up function for unmounting
    useEffect(() => {
        return () => {setIsCancelled(true)}
    }, [])

    // Return object
    return { sendPasswordResetEmail, passwordResetEmailState };
    
}