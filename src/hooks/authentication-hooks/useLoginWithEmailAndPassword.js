// styles

// config
import firebaseAuth from '../../config/firebaseConfig';

// context
import { AuthContext } from '../../context/authContext';

// hooks
import { useEffect, useState, useReducer, useContext } from 'react'

// components


const initialLoginState = {
    isPending: null,
    error: null,
    success: null
}

const reduceLogin = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_LOGIN':
            return { isPending: true, error: null, success: null };
        case 'LOGIN_COMPLETE':
            return { isPending: false, error: null, success: true };
        case 'LOGIN_ERROR':
            return { isPending: false, error: action.payload, success: false };
        default: return state;
    }
}

export const useLoginWithEmailAndPassword = () => {

    const [loginState, dispatchLogin] = useReducer(reduceLogin, initialLoginState);

    // Saftey measure for unmounting. setIsCancelled is used in the useEffect clean-up function below
    const [isCancelled, setIsCancelled] = useState(false);

    // This is so we can update the React state
    const { dispatchAuthState } = useContext(AuthContext);

    // Main exported function we use for login
    const login = async (email, password) => {

        setIsCancelled(false);

        dispatchLogin({ type: 'ATTEMPT_LOGIN' });

        try {
            // Signin user to Firebase
            const userCredentials = await firebaseAuth.signInWithEmailAndPassword(email, password);

            // Re-update state and authContext only if still mounted
            if (!isCancelled) {
                dispatchAuthState({ type: 'LOGIN', payload: userCredentials.user });
                dispatchLogin({ type: 'LOGIN_COMPLETE' });
            }
        }
        catch (err) {
            // Re-update state and authContext only if still mounted
            if (!isCancelled){
                dispatchLogin({ type: 'LOGIN_ERROR', payload: err.message });
            }
        }
    }

    // Clean-up function for unmounting
    useEffect(() => {
        return () => {setIsCancelled(true)}
    }, [])

    // Return object
    return { login, loginState };
    
}