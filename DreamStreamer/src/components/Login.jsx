import { assets } from "../assets/assets";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "./Account";
import { useDispatch } from "react-redux";
import {LOGIN_SUCCESS} from "../../store";

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { authenticate } = useContext(AccountContext);
	const dispatch = useDispatch(); 

	const onSubmit = (event) => {
		event.preventDefault();

		authenticate(email, password)
			.then((data) => {
				console.log("logged In",data);

				//token
				const token = data.getIdToken().getJwtToken();
				localStorage.setItem('token', token);
				console.log(token);

				dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        email,
                        token
                    },
                });


				navigate("/home");
			})
			.catch((err) => {
				console.error("failed to log In",err);
			});
	};

	return (
		<div className="h-screen bg-[#4b1842] relative">
			<img
				src={assets.login}
				className="h-full w-full object-cover absolute inset-0"
				alt="Login"
			/>
			<div className="flex items-center justify-center h-full relative">
				<form
					onSubmit={onSubmit}
					className="login-form border flex flex-col border-white rounded-2xl p-12 w-full max-w-lg bg-[rgba(253,251,252,0.3)] "
				>
					<h2 className="font-bold text-center text-[30px] text-[#4b1842]">
						Dreamstreamer
					</h2>

					<label
						className="text-white mb-4 text-lg font-semibold"
						htmlFor="email"
					></label>
					<input
						className="text-white mb-6 p-2 rounded border border-purple-600"
						type="email"
						placeholder="Email"
						id="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>

					<label
						className="text-white mb-4 text-lg font-semibold"
						htmlFor="password"
					></label>
					<input
						className="text-white mb-6 p-2 rounded border border-purple-600"
						type="password"
						placeholder="Password"
						id="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>

					<button
						type="submit"
						id="Login"
						className="bg-[#4b1842] text-white px-6 py-3 rounded-full text-lg w-[50%] mx-auto"
					>
						Login
					</button>

					<h3
						onClick={() => navigate("/signUp")}
						className="text-center mt-3 cursor-pointer text-white"
					>
						No account? Sign Up
					</h3>
				</form>
			</div>
		</div>
	);
};

export default Login;
