import { useSelector } from "react-redux"; // Import useSelector
import { useContext } from "react";
import { AccountContext } from "./Account";

const Status = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); 
    const { logout } = useContext(AccountContext);

    return (
        <div className="hidden">
            {isAuthenticated ? (
                <button onClick={logout}>Logout</button>
            ) : (
                "Please Login"
            )}
        </div>
    );
};

export default Status;
