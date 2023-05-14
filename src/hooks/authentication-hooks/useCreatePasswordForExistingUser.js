// styles

// config
import firebaseAuth from '../../config/firebaseConfig';

// context
import { AuthContext } from '../../context/authContext';

// hooks
import { useEffect, useState, useReducer, useContext} from 'react'

// components


const initialCreatePasswordState = {
    isPending: false,
    error: null,
    success: null
}

const reduceCreatePasswordState = (state, action) => {
    switch(action.type){
        case 'ATTEMPT_CREATE_PASSWORD':
            return {isPending: true, error: false, success: null};
        case 'CREATE_PASSWORD_COMPLETE':
            return {isPending: false, error: false, success: true};
        case 'CREATE_PASSWORD_ERROR':
            return {isPending: false, error: action.payload, success: false};
        default:
            return state;
    }
}

export const useCreatePasswordForExistingUser = () => {

    const [createPasswordForExistingUserState, dispatchCreatePasswordState] = useReducer(reduceCreatePasswordState, initialCreatePasswordState);

    // Saftey measure for unmounting. setIsCancelled is used in the useEffect clean-up function below
    const [isCancelled, setIsCancelled] = useState(false);

    // So we can update the AuthState
    const { dispatchAuthState } = useContext(AuthContext);

    // Main exported function
    const createPasswordForExistingUser = async (newPassword) => {

        setIsCancelled(false);

        dispatchCreatePasswordState({ type: 'ATTEMPT_CREATE_PASSWORD' });

        try {
            // Adds a new password to the user data in Firebase
            await firebaseAuth.currentUser.updatePassword(newPassword);
            if(!isCancelled){
                dispatchCreatePasswordState({ type: 'CREATE_PASSWORD_COMPLETE' });
                dispatchAuthState({ type: 'CREATE_PASSWORD_FOR_EXISTING_USER' });
            }
        }
        catch(err){
            if(!isCancelled){
                dispatchCreatePasswordState({type: 'CREATE_PASSWORD_ERROR', payload: err.message });
            }
        }
        
    }

    // Clean-up function
    useEffect(() => {
        return () => setIsCancelled(true);
    });

    return { createPasswordForExistingUser, createPasswordForExistingUserState };
}


