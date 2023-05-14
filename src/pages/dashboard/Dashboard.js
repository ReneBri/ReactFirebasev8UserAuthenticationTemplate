// styles

// config

// context
import { AuthContext } from '../../context/authContext';

// hooks
import { useContext } from 'react';
import { useLogout } from '../../hooks/authentication-hooks/useLogout';

// components


const Dashboard = () => {
    
    const { logout } = useLogout();
    const { user } = useContext(AuthContext);

    return (
        <div>
            Dashboard when user is signed in.
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Dashboard;