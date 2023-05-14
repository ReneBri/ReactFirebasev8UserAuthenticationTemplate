// styles

// config
import firebaseAuth from '../../config/firebaseConfig';

// context
import { AuthContext } from '../../context/authContext';

// hooks
import { useEffect, useState, useReducer, useContext} from 'react'

// components

const initialDeleteUserState = {
    isPending: false,
    error: null,
    success: null
}

const reduceDeleteUserState = (state, action) => {
    switch(action.type){
        case 'ATTEMPT_DELETE_USER':
            return {isPending: true, error: false, success: null};
        case 'DELETE_USER_COMPLETE':
            return {isPending: false, error: false, success: true};
        case 'DELETE_USER_ERROR':
            return {isPending: false, error: action.payload, success: false};
        default:
            return state;
    }
}

export const useDeleteUser = () => {

    const [deleteUserState, dispatchDeleteUserState] = useReducer(reduceDeleteUserState, initialDeleteUserState);

    // Saftey measure for unmounting. setIsCancelled is used in the useEffect clean-up function below
    const [isCancelled, setIsCancelled] = useState(false);

    // So we can update the AuthState
    const { dispatchAuthState } = useContext(AuthContext);

    // Main exported function
    const deleteUser = async () => {

        setIsCancelled(false);

        dispatchDeleteUserState({ type: 'ATTEMPT_DELETE_USER' });

        try {
            // Deletes current user from the Firebase authentication database
            await firebaseAuth.currentUser.delete();
            if(!isCancelled){
                dispatchDeleteUserState({ type: 'DELETE_USER_COMPLETE' });
                dispatchAuthState({ type: 'DELETE_USER' });
            }
        }
        catch(err){
            if(!isCancelled){
                dispatchDeleteUserState({type: 'DELETE_USER_ERROR', payload: err.message });
            }
        }
        
    }

    // Clean-up function
    useEffect(() => {return () => setIsCancelled(true)});

    return { deleteUser, deleteUserState };
}


