// styles

// config
import firebaseAuth from '../../config/firebaseConfig';
import firebase from "firebase/app"; 
import "firebase/auth";

// context
import { AuthContext } from '../../context/authContext';

// hooks
import { useEffect, useState, useReducer, useContext } from 'react'

// components


const initialReauthState = {
    isPending: null,
    error: null,
    success: null
}

const reduceReauth = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_REAUTH':
            return { isPending: true, error: null, success: null };
        case 'REAUTH_COMPLETE':
            return { isPending: false, error: null, success: true };
        case 'REAUTH_ERROR':
            return { isPending: false, error: action.payload, success: false };
        default: return state;
    }
}

export const useReauthenticateUser = () => {

    const [reauthState, dispatchReauth] = useReducer(reduceReauth, initialReauthState);

    // Saftey measure for unmounting. setIsCancelled is used in the useEffect clean-up function below
    const [isCancelled, setIsCancelled] = useState(false);

    // This is so we can access the current users email
    const { user } = useContext(AuthContext);

    // Main exported function we use for login
    const reauthenticateUser = async (password) => {

        setIsCancelled(false);

        const credential = firebase.auth.EmailAuthProvider.credential(user.user.email, 
            password);
        
        dispatchReauth({ type: 'ATTEMPT_REAUTH' });

        try {
            // Send reauthentication token from Firebase
            await firebaseAuth.currentUser.reauthenticateWithCredential(credential);

            // Re-update state and authContext only if still mounted
            if (!isCancelled) {
                dispatchReauth({ type: 'REAUTH_COMPLETE' });
            }
        }
        catch (err) {
            // Re-update state and authContext only if still mounted
            if (!isCancelled){
                dispatchReauth({ type: 'REAUTH_ERROR', payload: err.message });
            }
        }
    }

    // Clean-up function for unmounting
    useEffect(() => {
        return () => {setIsCancelled(true)}
    }, [])

    // Return object
    return { reauthenticateUser, reauthState };
    
}