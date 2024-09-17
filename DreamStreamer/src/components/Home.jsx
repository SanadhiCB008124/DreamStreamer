import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext"; 
import Display from "./Display";
import Sidebar from "./Sidebar";

const Home = () => {
  const { audioRef, track } = useContext(PlayerContext);

  return (
    <div className="h-screen bg-black">
      <div className="h-[100%] flex">
        <Sidebar />
        <Display />
      </div>
   {/*}
      <Player />*/}
      <audio ref={audioRef} src={track.file} preload="auto"></audio>
    </div>
  );
};

export default Home;
