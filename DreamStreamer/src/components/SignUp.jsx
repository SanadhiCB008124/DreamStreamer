import { assets } from "../assets/assets";
import { useState,useContext } from "react";
import userPool from "../../userPool";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "./Account";
import { useDispatch } from "react-redux";
import {LOGIN_SUCCESS} from "../../store";

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { authenticate } = useContext(AccountContext);
    const dispatch = useDispatch(); 

    const onSubmit = (event) => {
        event.preventDefault();
        userPool.signUp(email, password, [], null, async (err, data) => {
            if (err) {
                console.error(err);
                alert("Sign-up failed: " + err.message); // Display error to the user
            } else {
                console.log("Sign-up successful:", data);
                
                // After successful signup, log in the user automatically
                try {
                    const authData = await authenticate(email, password);
                    const token = authData.getIdToken().getJwtToken();
                    console.log("Token:", token);

                    localStorage.setItem("token", token);

                    // Dispatch to Redux store
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: {
                            email,
                            token,
                        },
                    });

                    navigate("/home"); // Redirect to home after successful signup
                } catch (authErr) {
                    console.error("Authentication failed:", authErr);
                    alert("Authentication failed after sign-up: " + authErr.message);
                }
            }
        });
    };

    return (
        <div className="h-screen bg-[#4b1842] relative">
            <img src={assets.login} className="h-full w-full object-cover absolute inset-0" alt="Login" />
            <div className="flex items-center justify-center h-full relative">
                <form onSubmit={onSubmit} className="signup-form border flex flex-col border-white rounded-2xl p-12 w-full max-w-lg bg-[rgba(253,251,252,0.3)] ">
                    <h2 className="font-bold text-center text-[30px] text-[#4b1842]">Dreamstreamer</h2>
                    
                    <label className="text-white mb-4 text-lg font-semibold" htmlFor="email"></label>
                    <input
                        className="text-white mb-6 p-2 rounded border border-purple-600 "
                        type="email"
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={(event)=>setEmail(event.target.value)}
                    />

                    <label className="text-white mb-4 text-lg font-semibold" htmlFor="password"></label>
                    <input
                        className="text-white mb-6 p-2 rounded border border-purple-600"
                        type="password"
                        placeholder="Password"
                        id="password"
                        value={password}
                        onChange={(event)=>setPassword(event.target.value)}
                    />

                    <button
                        type="submit"
                        id="signup"
                        className="bg-[#4b1842] text-white px-6 py-3 rounded-full text-lg w-[50%] mx-auto"
                      
                    >
                        Sign Up
                    </button>

                    <h3 onClick={() => navigate('/login')} className="text-center mt-3 cursor-pointer text-white">
                    Already have an account? Login
                    </h3>
                </form>
            </div>
        </div>
    );
};

export default SignUp;

