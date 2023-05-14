// styles
import styles from '../../AccountSettings.module.css';

// config

// context
import { ModalContext } from '../../../../context/modalContext';
import { AuthContext } from '../../../../context/authContext';

// hooks
import { useContext } from 'react';
import { useDeleteUser } from '../../../../hooks/authentication-hooks/useDeleteUser';

// components
import ReauthenticateUser from '../../../../components/modals/authentication-modals/reauthenticate-user/ReauthenticateUser';

const DeleteAccount = () => {

    const { setModalState } = useContext(ModalContext);

    const { user } = useContext(AuthContext);

    const { deleteUser, deleteUserState } = useDeleteUser();

    const handleDeleteUser = () => {
        deleteUser();
    }

    // So here I can add a ternary pperator and render a different version of the Reauth but for google.
    const handleClick = () => {
        setModalState(<ReauthenticateUser 
            message1='Are you sure you want to delete your account?'
            message2='Deleting your account means all your user data will be lost! This is irreversible!'
            buttonText='Delete Account'
            onSuccessfulCompletion={handleDeleteUser}
            deleteUserState={deleteUserState}
            successModalMessage='Account successfully deleted.'
            email={user.user.email}
        />);
    }

    return(
        <div className={styles['account-settings-content']}>
            <h2>Delete your Account</h2>
            <p>Deleting your account means all your user data will be lost! This is irreversible!</p>
            {!deleteUserState.isPending ? <button onClick={handleClick}>Delete</button> : <button disabled>pending...</button>}
        </div>
    )
}

export default DeleteAccount;