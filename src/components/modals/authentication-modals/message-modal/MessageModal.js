// styles

// config

// context
import { ModalContext } from "../../../../context/modalContext";

// hooks
import { useContext } from "react";

// components
import Login from "../login/Login";
import ModalBackground from "../../modal-background/ModalBackground";
import ModalCard from "../../modal-card/ModalCard";


const MessageModal = ({ message, includeLoginButton }) => {

    const { setModalState } = useContext(ModalContext);

        return (
            <>
                <ModalBackground />
                <ModalCard>
    
                    <h3>{message}</h3>
    
                    {includeLoginButton && <button onClick={() => setModalState(<Login />)}>Back to Login</button>}
    
                </ModalCard>
            </>
        )
    
}

export default MessageModal;