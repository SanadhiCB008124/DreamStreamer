import { useState } from "react";
import UserPool from "../../UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";


const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const navigate=useNavigate();

	const onSubmit = (event) => {
		event.preventDefault();

		const user = new CognitoUser({
			Username: email,
			Pool: UserPool,
		});

		const authDetails = new AuthenticationDetails({
			Username: email,
			Password: password,
		});

		user.authenticateUser(authDetails, {
			onSuccess: (data) => {
				console.log("OnSuccess: ", data);
                navigate('/home');
			},
			onFailure: (err) => {
				console.log("onFailure :", err);
			},
			newPasswordRequired: (data) => {
				console.log("newPasswordRequired : ", data);
			},
		});
	};

	return (
		<div className="flex h-screen flex-row  flex-wrap  ">
              <img src={assets.login} className="h-screen w-[50%] object-cover   "/>
         
            <div className="w-[50%] flex justify-center items-center ">
                <form className="login-form  border flex flex-col border-white rounded-2xl p-12 w-full max-w-lg bg-gray-800" onSubmit={onSubmit}>
                    <h2 className="font-bold text-center text-[25px]">Login</h2>
                    <label className="text-black mb-4 text-lg font-semibold" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="text-black mb-6 p-2 rounded border border-purple-600"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        id="email"
                        required
                    />

                    <label className="text-black mb-4 text-lg font-semibold" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="text-black mb-6 p-2 rounded border border-purple-600"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        id="password"
                        required
                    />
                    <button
                        type="submit"
                        id="Login"
                        className="Login text-white  px-6 py-3 rounded text-lg w-[50%] center ml-[25%] "
                    >
                        Login
                    </button>
                    <h3 onClick={()=>navigate('/signUp')} className="text-center mt-3 cursor-pointer">
                        Already have an account? Login
                    </h3>
                </form>
            </div>
		</div>
	);
};
export default Login;
