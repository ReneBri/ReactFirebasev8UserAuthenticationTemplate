// styles
import styles from '../../AccountSettings.module.css';

// config

// hooks
import { useContext } from 'react';

// context
import { AuthContext } from '../../../../context/authContext';

// components
import ChangePasswordHasPassword from './ChangePasswordHasPassword';
import ChangePasswordCreatePassword from './ChangePasswordCreatePassword';


const ChangePassword = () => {

    const { user } = useContext(AuthContext);

    return (
        <div className={styles['account-settings-content']}>
            <h2>Change Password</h2>
            {user.hasPassword ? <ChangePasswordHasPassword /> : <ChangePasswordCreatePassword />}
        </div>
    )
}

export default ChangePassword;