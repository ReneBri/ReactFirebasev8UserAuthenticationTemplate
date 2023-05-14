// styles

// config

// context

// hooks
import React, { useState } from 'react';

// components



const initialModalContext = {
    modalName: null
}

// Initialize the context
export const ModalContext = React.createContext(initialModalContext);

// Wrapper component for context ease of use. We wrap the entire "App" component in this. See App.js.
const ModalContextProvider = props => {

    const [modalState, setModalState] = useState(null);

    return (
        <ModalContext.Provider value={{ modalState, setModalState }}>
            {props.children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider;