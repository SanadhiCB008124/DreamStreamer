import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AccountContext } from "./Account";
import { useState, useContext, useEffect } from "react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { getSession, logout } = useContext(AccountContext);

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
    <>
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

        <div className="flex flex-row justify-center items-center gap-2 w-full">
          {isAdmin && (
            <>
              <p
                onClick={() => navigate("/genreManagement")}
                id="navItems"
                className="cursor-pointer"
              >
                Genres
              </p>
              <p
                onClick={() => navigate("/albumManagement")}
                id="navItems"
                className="cursor-pointer"
              >
                Albums
              </p>
              <p
                onClick={() => navigate("/artistManagement")}
                id="navItems"
                className="cursor-pointer"
              >
                Artists
              </p>
              <p
                onClick={() => navigate("/tracks")}
                id="navItems"
                className="cursor-pointer"
              >
                Tracks
              </p>
              <p
                onClick={() => navigate("/admin")}
                id="navItems"
                className="cursor-pointer"
              >
                Analytics
              </p>
              <p id="navItems"
               onClick={() => navigate("/users")}
               className="cursor-pointer">
                Users
              </p>
            </>
          )}
        </div>

   
        <div className="flex items-center gap-2">
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
					<span className="text-white">{userEmail}</span>
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
    </>
  );
};

export default AdminNavbar;
