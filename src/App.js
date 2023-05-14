// styles
import './App.css';

// routes & other
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom';

// config

// context
import { AuthContext } from './context/authContext';
import { ModalContext } from './context/modalContext';

// hooks
import { useContext } from 'react';

// components & pages
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import AccountSettings from './pages/account-settings/AccountSettings';
import UnverifiedEmail from './components/modals/authentication-modals/unverified-email/UnverifiedEmail';
import Navbar from './components/UI/navbar/Navbar';
import PreLoader from './components/UI/pre-loader/PreLoader';


function App() {

    const { user } = useContext(AuthContext);

    const { modalState } = useContext(ModalContext);

    return (

        <div className="App">

            {modalState && ReactDOM.createPortal(modalState, document.getElementById('modal-root'))}

            {!modalState && user.user !== null && !user.user.emailVerified && ReactDOM.createPortal(<UnverifiedEmail />, document.getElementById('modal-root'))}

            {!user.authIsReady && <PreLoader />}
            {user.authIsReady && (
                <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={ !user.user ? <Home /> : <Dashboard /> } />
                    <Route path="/account-settings" element={ !user.user ? <Navigate replace to='/' /> : <AccountSettings /> } />
                </Routes>
                </BrowserRouter>
            )}

        </div>
    );
}

export default App;
