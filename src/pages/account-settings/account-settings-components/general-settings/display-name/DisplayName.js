// styles
import styles from '../../../AccountSettings.module.css';

// config
import firebaseAuth from '../../../../../config/firebaseConfig';

// context
import { AuthContext } from '../../../../../context/authContext';

// hooks
import { useContext, useReducer } from 'react';
import { useValidateUserInput } from '../../../../../hooks/authentication-hooks/useValidateUserInput';

// components


const DisplayName = ({ infoToChange, setInfoToChange, displayName }) => {

    // use AuthContext
    const { dispatchAuthState } = useContext(AuthContext);

    // This validates the newly chosen display name
    const { validateDisplayName, userInputErrorMessage } = useValidateUserInput();

    // Reducer for the user input
    const reduceCurrentDisplayName = (state, action) => {
        switch(action.type){
            case 'UPDATE_CURRENT_DISPLAY_NAME':
                return { value: action.payload, isValid: validateDisplayName(action.payload) };
            default:
                return { ...state };
        }
    }

    // State for the display name shown on the page which is linked to the input field
    const [currentDisplayNameState, dispatchCurrentDisplayName] = useReducer(reduceCurrentDisplayName, { 
        value: displayName, 
        isValid: true
    });

    // Update the displayName property in the Firebase system
    const updateFirebaseDisplayName = async () => {
        try{
            await firebaseAuth.currentUser.updateProfile({
                displayName: currentDisplayNameState.value
            });
            console.log('success');
            return;
        }
        catch(err){
            console.log(err.message);
            console.log('fail');
        }
    }

    // Triggered when clicking the save button
    const handleSubmit = (e) => {
        e.preventDefault();
        if(currentDisplayNameState.value === displayName){
            setInfoToChange(null);
            return;
        }
        if(currentDisplayNameState.isValid){
            updateFirebaseDisplayName();
            setInfoToChange(null);
            dispatchAuthState({ 
                type: 'UPDATE_DISPLAY_NAME', 
                payload: currentDisplayNameState.value
            });
        }
    }


    return (
        <>
            {infoToChange !== 'display-name' ? (
                <div className={styles['info-wrapper']}>
                    <div className={styles['info-label-wrapper']}>
                        <label htmlFor='display-name'>Display Name:</label>
                        <p id='display-name'>{displayName}</p>
                    </div>
                    <div className={styles['button-wrapper']}>
                        <button onClick={() => setInfoToChange('display-name')}>Edit</button>
                    </div>
                </div>
            ) : ( 
                <>
                    <form className={styles['info-wrapper']}>
                        <div className={styles['info-label-wrapper']}>
                            <label htmlFor='display-name'>Display Name:</label>
                            <input 
                                id='display-name'
                                type='text'
                                value={currentDisplayNameState.value}
                                onChange={(e) => dispatchCurrentDisplayName({ 
                                type: 'UPDATE_CURRENT_DISPLAY_NAME', 
                                payload: e.target.value 
                                })} 
                                autoFocus
                            />
                        </div>
                        <div className={styles['button-wrapper']}>
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={(e) => {
                                e.preventDefault();
                                dispatchCurrentDisplayName({ 
                                type: 'UPDATE_CURRENT_DISPLAY_NAME', 
                                payload: displayName 
                                });
                                setInfoToChange(null)}
                                }
                            >Cancel
                            </button>
                        </div>
                    </form>
                    {userInputErrorMessage && (<p className='error'>{userInputErrorMessage}</p>)}
                </>
            )}
        </>
    )
}

export default DisplayName;