// styles

// config
import firebaseAuth from '../config/firebaseConfig';

// context

// hooks
import React, { useEffect, useReducer } from 'react';

// components


// Initialize the context
export const AuthContext = React.createContext();

// Function to check if user has signed up using password authorisation
const checkIfUserHasPassword = (user) => {
    if(user){
        var providers = user.providerData.map(providerDetails => providerDetails.providerId);
        return providers.includes('password');
    }
    return null;
}

// Manage the AuthState
const authStateReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_STATE_IS_READY':
            return { user: action.payload, authIsReady: true, hasPassword: checkIfUserHasPassword(action.payload) };
        case 'SIGNUP':
            return { ...state, user: action.payload, hasPassword: checkIfUserHasPassword(action.payload) };
        case 'LOGOUT':
            return { ...state, user: null, hasPassword: null }
        case 'LOGIN':
            return { ...state, user: action.payload, hasPassword: checkIfUserHasPassword(action.payload) };
        case 'UPDATE_DISPLAY_NAME':
            return { ...state, user: { ...state.user, displayName: action.payload } };
        case 'UPDATE_EMAIL':
            return { ...state, user: { ...state.user, email: action.payload, emailVerified: false } };
        case 'DELETE_USER':
            return { ...state, user: null };
        case 'CREATE_PASSWORD_FOR_EXISTING_USER':
            return { ...state, hasPassword: true }
        default: return { ...state };
    }
}

// Wrapper component for context ease of use. We wrap the entire "App" component in this. See App.js.
export const AuthContextProvider = props => {

    // Declare the authState with 'authIsReady' set to null. This is so we can block the loading of any data until Firebase has confirmed wether a user is already logged in or not. This helps keep restricted data restricted.
    const [authState, dispatchAuthState] = useReducer(authStateReducer, { user: null, authIsReady: false, hasPassword: null });

    // 'onAuthStateChanged' checks to see wether a user is already logged in upon load and 'dispatchAuth' updates the state accordingly. This is so that if a user refreshes the page and is already logged in, the state will update accordingly keeping Firebase and the clients local state, insync.
    useEffect(() => {
        firebaseAuth.onAuthStateChanged((user) => {
            if(user){
                dispatchAuthState({type: 'AUTH_STATE_IS_READY', payload: {...user}});
            }else{
                dispatchAuthState({type: 'AUTH_STATE_IS_READY', payload: user});
            }
        });
    }, []);


    return (
        // to stop it from being user.user I just need to change it here from authState to authState.user
        <AuthContext.Provider value={{ user: authState, dispatchAuthState }}>
            {props.children}
        </AuthContext.Provider>
    )
}

