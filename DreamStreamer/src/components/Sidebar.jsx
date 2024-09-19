
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'

const Sidebar = () => {
  
  const navigate=useNavigate();

  
  return (
    <div className='w-[20%] h-screen  p-2  flex-col gap-2 text-white hidden lg:flex'>
      <div className='bg-[#390F0B] h-[100%] flex flex-col justify-around p-4 rounded'>
    
        <div onClick={()=>navigate(`/home`)} className='flex items-center  rounded-full gap-3 pl-8 cursor-pointer hover:bg-[#000000] h-[10%]'>
          <img src={assets.home} alt="Home" className='h-6 w-6' />
          <p className='font-bold'>Home</p>
        </div>

        <div  onClick={()=>navigate(`/genres`)} className='flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#000000] rounded-full h-[10%]'>
          <img src={assets.genre} alt="Search" className='h-6 w-6' />
          <p className='font-bold'>Genres</p>
        </div>

        <div onClick={()=>navigate(`/displayAlbums`)} className='flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#000000] rounded-full h-[10%]'>
          <img src={assets.album} alt="Search" className='h-6 w-6' />
          <p className='font-bold'>Albums</p>
        </div>


        <div onClick={()=>navigate(`/displayArtists`)} className='flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#000000] rounded-full h-[10%]'>
          <img src={assets.artist} alt="Search" className='h-6 w-6' />
          <p className='font-bold'>Artists</p>
        </div>

      </div>
    
    
    </div>
  );
}

export default Sidebar;

