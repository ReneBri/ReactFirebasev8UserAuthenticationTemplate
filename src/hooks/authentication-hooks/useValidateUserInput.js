// styles

// config

// hooks
import { useState } from "react";

// context

// components


export const useValidateUserInput = () => {

    const [userInputErrorMessage, setUserInputErrorMessage] = useState(null);

    const validateDisplayName = (displayName) => {
        if (displayName.trim().match(/^[A-Za-z]+$/) && displayName.trim().length > 0 && displayName.trim().length < 15){
            setUserInputErrorMessage(null);
            return true;
        }else{
            setUserInputErrorMessage('Name must only contain alphabetic characters and be between 1 & 15 letters long.')
            return false;
        }
    }

    const validateEmail = (email) => {
        if (email.trim().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
            setUserInputErrorMessage(null);
            return true;
        }else{
            setUserInputErrorMessage('Must be a valid email address.')
            return false;
        }
    }

    const validatePassword = (password) => {
        if (password.length !== 0){
            setUserInputErrorMessage(null);
            return true;
        }else{
            setUserInputErrorMessage('Please enter a password.')
            return false;
        }
    }

    const validatePasswordForSignup = (password) => {
        if (password.length > 5){
            setUserInputErrorMessage(null);
            return true;
        }else{
            setUserInputErrorMessage('Password must be at least 5 characters long.')
            return false;
        }
    }

    const validateMatchingPasswordForSignup = (passwordOne, passwordTwo) => {
        if (passwordOne.length === 0 || passwordTwo.length === 0){
            return false;
        }
        if (passwordOne === passwordTwo){
            setUserInputErrorMessage(null);
            return true;
        }else{
            setUserInputErrorMessage('Passwords must match.')
            return false;
        }
    }

    return { validateDisplayName, validateEmail, validatePassword, validatePasswordForSignup, validateMatchingPasswordForSignup, userInputErrorMessage }
}