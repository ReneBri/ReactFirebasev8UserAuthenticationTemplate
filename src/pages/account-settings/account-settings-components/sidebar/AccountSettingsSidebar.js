// styles
import styles from './AccountSettingsSidebar.module.css';

// config

// hooks

// context

// components


const AccountSettingsSidebar = ({ setInformationSelection }) => {

    return (
        <div className={styles['account-settings-sidebar']}>
            <ul>
                <li>
                    <div className={styles.title}>
                        <h3>Account Settings</h3>
                    </div>
                </li>
                <li><p onClick={() => setInformationSelection('general-settings')}>General Settings</p></li>
                <li><p onClick={() => setInformationSelection('change-password')}>Change Password</p></li>
                <li><p onClick={() => setInformationSelection('delete-account')}>Delete Account</p></li>
            </ul>
            
        </div>
    )
}

export default AccountSettingsSidebar;