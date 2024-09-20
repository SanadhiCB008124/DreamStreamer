import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AccountContext } from "./Account";
import { useState, useContext, useEffect } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
	const [status, setStatus] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const { getSession } = useContext(AccountContext);
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
    <div className='w-full h-screen p-2 flex-col gap-2 text-white lg:w-[20%] lg:flex'>
      <div className='bg-[#390F0B] h-full flex flex-col justify-around p-4 rounded'>
        
        <div onClick={() => navigate(`/home`)} className='flex items-center rounded-full gap-3 pl-8 cursor-pointer hover:bg-[#000000] h-[10%]'>
          <img src={assets.home} alt="Home" className='h-6 w-6' />
          <p className='font-bold'>Home</p>
        </div>

        <div onClick={() => navigate(`/genres`)} className='flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#000000] rounded-full h-[10%]'>
          <img src={assets.genre} alt="Genres" className='h-6 w-6' />
          <p className='font-bold'>Genres</p>
        </div>

        <div onClick={() => navigate(`/displayAlbums`)} className='flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#000000] rounded-full h-[10%]'>
          <img src={assets.album} alt="Albums" className='h-6 w-6' />
          <p className='font-bold'>Albums</p>
        </div>

        <div onClick={() => navigate(`/displayArtists`)} className='flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#000000] rounded-full h-[10%]'>
          <img src={assets.artist} alt="Artists" className='h-6 w-6' />
          <p className='font-bold'>Artists</p>
        </div>
        {isAdmin && (
        <div onClick={() => navigate(`/admin`)} className='flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#000000] rounded-full h-[10%]'>
          <img src={assets.plus} alt="Artists" className='h-6 w-6' />
          <p className='font-bold'>Admin Panel</p>
        </div>
        )}

      </div>
    </div>
  );
};

export default Sidebar;
