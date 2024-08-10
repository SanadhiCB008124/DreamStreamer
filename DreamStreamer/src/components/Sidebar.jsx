
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[25%] h-full p-2 flex flex-col gap-2 text-white hidden lg:flex'>
      <div className='bg-[#121212] h-[15%] flex flex-col justify-around p-4 rounded'>
        
        <div className='flex items-center gap-3 pl-8 cursor-pointer'>
          <img src={assets.home} alt="Home" className='h-6 w-6' />
          <p className='font-bold'>Home</p>
        </div>

        <div className='flex items-center gap-3 pl-8 cursor-pointer'>
          <img src={assets.search} alt="Search" className='h-6 w-6' />
          <p className='font-bold'>Search</p>
        </div>
      </div>
      <div className='bg-[#121212] flex-grow rounded'>
        <div className='p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img src={assets.stack} alt="Your Library" className='w-8' />
            <p className='font-semibold'>Your Library</p>
          </div>
          <div className='flex items-center gap-3'>
            <img src={assets.rightArrow} alt="" className='w-5' />
            <img src={assets.plus} alt="" className='w-5' />
          </div>
        </div>
        <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
           <h1> Create your first playlist </h1> 
           <p className='font-light'>its easy we will help you </p>
           <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 '>Create Playlist</button>
        </div>

        <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4'>
           <h1> Lets find some podcasts to follow  </h1> 
           <p className='font-light'>we will keep you updates on new episodes </p>
           <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 '>Browse Podcasts</button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

