// styles

// config
import firebaseAuth from '../../config/firebaseConfig';

// context
import { AuthContext } from '../../context/authContext';

// hooks
import { useReducer, useContext, useState, useEffect  } from 'react';

// components


const initialSignupState = {
    isPending: null,
    error: null,
    success: null
}

const reduceSignupState = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_SIGNUP':
            return { isPending: true, error: null, success: null };
        case 'SIGNUP_COMPLETE':
            return { isPending: true, error: null, success: true };
        case 'SIGNUP_ERROR':
            return { isPending: false, error: action.payload, success: false };
        default: 
            return state;
    }
}

export const useSignupWithEmailAndPassword = () => {

    const [signupState, dispatchSignupState] = useReducer(reduceSignupState, initialSignupState);

    // Saftey measure for unmounting. setIsCancelled is used in the useEffect clean-up function below
    const [isCancelled, setIsCancelled] = useState(false);

    // This is so we can update the React state
    const { dispatchAuthState } = useContext(AuthContext);

    // Main exported function we use for signup
    const signupWithEmailAndPassword = async (email, password, firstName) => {

        setIsCancelled(false);

        dispatchSignupState({type: 'ATTEMPT_SIGNUP'});
    
        try{
            // Create user in Firebase database
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);

            // Once created update the users profile displayName value
            await firebaseAuth.currentUser.updateProfile({
                displayName: firstName
            });
            // Send email verification where user MUST confirm their email address
            await firebaseAuth.currentUser.sendEmailVerification();

            // Re-update state and authContext only if still mounted
            if(!isCancelled){
                dispatchAuthState({ type: 'SIGNUP', payload: userCredential.user });
                dispatchSignupState({type: 'SIGNUP_COMPLETE'});
            }
            
        }catch(err){
            // Re-update state only if still mounted
            if(!isCancelled){
                dispatchSignupState({type: 'SIGNUP_ERROR', payload: err.message});
            }
            
        }
        
    }
    // Clean-up function for unmounting
    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    // Return object
    return { signupState, signupWithEmailAndPassword }
}