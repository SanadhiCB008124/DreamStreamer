/* eslint-disable react/prop-types */
import { createContext, useEffect, useRef, useState } from "react";


export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
	const audioRef = useRef();
	const seekBg = useRef();
	const seekBar = useRef();

	//state variables

	const [track, setTrack] = useState();
	const [playStatus, setPlayStatus] = useState(false);
	const [time, setTime] = useState({
		currentTime: {
			second: 0,
			min: 0,
		},
		totalTime: {
			second: 0,
			min: 0,
		},
	});

    const play=()=>{
        audioRef.current.play();
        setPlayStatus(true);
    }

    const pause=()=>{
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const playWithId=async(id)=>{
       await setTrack(songsData[id]);
       await audioRef.current.play();
       setPlayStatus(true);
    }

    const previous= async()=>{
        if(track.id>0){
            await setTrack(songsData[track.id-1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }

    }

    const next=async()=>{
     
    }

    const seekSong=async(e)=>{
        audioRef.current.currentTime=((e.nativeEvent.offsetX/seekBg.current.offsetWidth)*audioRef.current.duration);
        seekBar.current.style.width=(e.nativeEvent.offsetX)+"px";
        

    }


    useEffect(() => {
        setTimeout(()=>{
      audioRef.current.ontimeupdate=()=>{

        seekBar.current.style.width=(Math.floor((audioRef.current.currentTime/audioRef.current.duration)*100))+"%";
        setTime({
            currentTime: {
                second: Math.floor(audioRef.current.currentTime % 60),
                min: Math.floor(audioRef.current.currentTime / 60),
            },
            totalTime: {
                second: Math.floor(audioRef.current.duration % 60),
                min:Math.floor(audioRef.current.duration / 60),
            },
        })
      }
        },1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },{audioRef}
)



	const contextValue = {
		audioRef,
		seekBar,
		seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,pause,
        playWithId,
        previous,
        next,
        seekSong
	};
  
	return (
		<PlayerContext.Provider value={contextValue}>
			{props.children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
