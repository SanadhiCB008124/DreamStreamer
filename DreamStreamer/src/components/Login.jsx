import { assets } from "../assets/assets";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "./Account";
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../../store";

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { authenticate } = useContext(AccountContext);
	const dispatch = useDispatch();
	const [error,setError]=useState("");

	const onSubmit = (event) => {
		event.preventDefault();

		authenticate(email, password)
			.then((data) => {
				console.log("logged In", data);

				//token
				const token = data.getIdToken().getJwtToken();
				localStorage.setItem("token", token);
				console.log(token);

				dispatch({
					type: LOGIN_SUCCESS,
					payload: {
						email,
						token,
					},
				});

				navigate("/home");
			})
			.catch((err) => {
				console.error("failed to log In", err);
				setError(err.message);
			});
	};

	return (
		<div className="h-screen bg-[#17153B] relative">
			<div className="h-screen bg-[#390F0B] relative flex">
				<div className="relative w-2/3">
					<img
						src={assets.bg}
						className="h-full w-full object-cover"
						alt="Login"
					/>
					<div className="absolute inset-0 flex justify-center items-center">
						<h1 className="text-white bg-black p-10 text-4xl font-bold">
							Welcome to Dreamstreamer
						</h1>
					</div>
				</div>
				<div className="w-1/2 flex justify-center items-center  bg-[#17153B]">
					<form
						onSubmit={onSubmit}
						className="login-form  mr-45 flex flex-col  rounded-2xl p-12 w-full max-w-lg bg-[#17153B]"
					>
						<h2 className="font-bold text-center text-[30px] text-[#ffffff]">
							Please Login
						</h2>

						{error && (
							<div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
								{error}
							</div>
						)}

						<label
							className="text-white mb-4 text-lg font-semibold"
							htmlFor="email"
						></label>
						<input
							className="text-black mb-6 p-2 rounded border  bg-white"
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
							className="text-black mb-6 p-2 rounded border  bg-white"
							type="password"
							placeholder="Password"
							id="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>

						<button
							type="submit"
							id="Login"
							className="bg-[#0c080c] text-white px-6 py-3 rounded-full text-lg w-[50%] mx-auto"
						>
							Login
						</button>

						<h3
							onClick={() => navigate("/signUp")}
							className="text-center mt-3 cursor-pointer text-white hover:underline"
						>
							No account? Sign Up
						</h3>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
