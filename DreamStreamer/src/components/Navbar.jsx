import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AccountContext } from "./Account";
import { useState, useContext, useEffect } from "react";
import SearchBar from "./SearchBar";

const Navbar = () => {
	const navigate = useNavigate();
	const [status, setStatus] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const { getSession, logout } = useContext(AccountContext);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		getSession().then((session) => {
			console.log("Session", session);
			const email = session.idToken.payload.email;
			const groups = session.idToken.payload["cognito:groups"];
			setUserEmail(email);
			setStatus(true);
			if (groups && groups.includes("Admin")) {
				setIsAdmin(true);
			}
		});
	}, [getSession]);

	return (
		<div className="w-full flex justify-between items-center font-semibold">
			<div className="flex items-center gap-2">
				<img
					onClick={() => navigate(-1)}
					src={assets.leftArrow}
					alt="Back"
					className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
				/>
				<img
					onClick={() => navigate(+1)}
					src={assets.rightArrow}
					alt="Forward"
					className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
				/>
			</div>


			<div className="flex items-center gap-4">
				{/*{isAdmin && (
					<p
						onClick={() => navigate("/admin")}
						className="bg-red-800 text-white text-[15px] px-4 py-1 hidden md:block cursor-pointer"
					>
						Admin panel
					</p>
				)}
*/}
				{userEmail && (
					<span className="text-white">Welcome, {userEmail}</span>
				)}

				{status ? (
					<button
						className="bg-red-800 text-white text-[15px] px-4 py-1 hover:bg-red-500  hidden md:block shadow-xl rounded cursor-pointer"
						onClick={logout}
					>
						Logout
					</button>
				) : (
					"Please Login"
				)}
			</div>
		</div>
	);
};

export default Navbar;
