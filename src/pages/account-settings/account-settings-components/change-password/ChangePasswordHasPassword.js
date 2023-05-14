// styles

// config

// hooks
import { useSendPasswordResetEmail } from '../../../../hooks/authentication-hooks/useSendPasswordResetEmail';

// context
import { AuthContext } from '../../../../context/authContext';
import { useContext } from 'react';

// components


const ChangePasswordHasPassword = () => {

    const { sendPasswordResetEmail, passwordResetEmailState } = useSendPasswordResetEmail();

    const { user } = useContext(AuthContext);

    const handleClick = () => {
        sendPasswordResetEmail(user.user.email);
    }

    return (
        <>
            {passwordResetEmailState.success === null && <p>Click button to send password reset email.</p>}
            {passwordResetEmailState.success && <p>{`Password reset email sent to ${user.user.email}`}</p>}
            {passwordResetEmailState.success === false && <p className='error'>Password reset email failed to send.</p>}
            {!passwordResetEmailState.isPending ? <button onClick={handleClick}>Send</button> : <button disabled>Sending</button>}
        </>
    )
}

export default ChangePasswordHasPassword;