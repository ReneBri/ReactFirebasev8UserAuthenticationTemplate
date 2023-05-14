// styles

// config

// context
import { ModalContext } from "../../context/modalContext";

// hooks
import { useContext } from "react";

// components
import Login from "../../components/modals/authentication-modals/login/Login";
import Signup from "../../components/modals/authentication-modals/sign-up/Signup";


const Home = () => {

    const { setModalState } = useContext(ModalContext);

    return (
        <div>
            Homepage without user signed in.
            <button onClick={() => setModalState(<Signup />)}>Signup</button>
            <button onClick={() => setModalState(<Login />)}>Login</button>
        </div>
    )
}

export default Home;