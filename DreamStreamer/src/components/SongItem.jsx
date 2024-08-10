import { useContext } from "react"
import { PlayerContext } from "../context/PlayerContext"

const SongItem = ({name, image,file, desc, duration,id}) => {

    const {playWithId}=useContext(PlayerContext)

  return (
    <div onClick={()=>playWithId(id)} className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
    <img className="rounded h-[200px] w-[180px]  " src={image} alt="" />
    <p className="font-bold mt-2 mb-1">{name}</p>
    <p className="text-slate-200 text-sm ">{desc}</p>
    <p className="text-slate-200 text-sm ">{duration}</p>
  
</div>
  )
}

export default SongItem
