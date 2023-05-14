// styles
import './index.css';

// config

// context
import { AuthContextProvider } from './context/authContext';
import ModalContextProvider from './context/modalContext';

// hooks
import React from 'react';

// routes & other
import ReactDOM from 'react-dom/client';

// components
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AuthContextProvider>
        <ModalContextProvider>
            <App />
        </ModalContextProvider>
    </AuthContextProvider>
  // </React.StrictMode>
);

