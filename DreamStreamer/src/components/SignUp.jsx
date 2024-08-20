import { useState } from "react";
import UserPool from "../../UserPool";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const navigate=useNavigate()

	const onSubmit = (event) => {
		event.preventDefault();

		UserPool.signUp(email, password, [], null, (err, data) => {
			if (err) {
				console.error(err);
			}
			console.log(data);
            navigate('/home');
		});
	};

	return (
		<div className="flex h-screen flex-row  ">
			<img src={assets.login} className="h-screen w-[50%] object-cover" />

			<div className="w-[50%] flex justify-center items-center">
				<form
					className="SignUp-form  border flex flex-col border-white rounded-2xl p-12 w-full max-w-lg bg-gray-800"
					onSubmit={onSubmit}
				>
					<h2 className="font-bold text-center text-[25px]">Sign Up</h2>
					<label
						className="text-black mb-4 text-lg font-semibold"
						htmlFor="email"
					>
						Email
					</label>
					<input
						className="text-black mb-6 p-2 rounded border border-purple-600"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>

					<label
						className="text-black mb-4 text-lg font-semibold"
						htmlFor="password"
					>
						Password
					</label>
					<input
						className="text-black mb-6 p-2 rounded border border-purple-600"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
					<button
						type="submit"
						className="SignUp text-white  px-6 py-3 rounded text-lg w-[50%] center ml-[25%] "
					>
						Sign Up
					</button>
                    <h3 onClick={()=>navigate('/login')} className="text-center mt-3 cursor-pointer">
                        Already have an account? Login
                    </h3>
				</form>
			</div>
		</div>
	);
};
export default SignUp;
