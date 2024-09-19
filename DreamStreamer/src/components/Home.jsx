import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { albumsData, ArtistsData } from "../assets/assets";
import Player from "./Player";

const Home = () => {
	const { audioRef, track } = useContext(PlayerContext);

	return (
		<div className="h-screen bg-black">
			<div className="h-[100%] flex">
				<Sidebar />
				<div className="w-full m-2 px-6 pt-4 rounded bg-[#390F0B] text-white overflow-auto lg:ml-0">
					<Navbar />
					{/* Mapping Albums Data */}
					<div className="albums-section mt-6">
						<h2 className="text-2xl mb-4 font-bold">New Releases</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{albumsData.map((album) => (
								<div
									key={album.id}
									className=" w-3/4  cursor-pointer transition-transform transform hover:scale-105"
								>
									<figure className="h-56 bg-red-950">
										{" "}
										{/* Increase the height of the image */}
										<img
											src={album.image}
											alt={album.name}
											className="w-full h-full object-cover"
										/>
									</figure>
									<div className="mt-2 px-2 py-2">
										<p className="text-[13px] font-bold">{album.name}</p>
										<p className="text-[12px]">{album.artist}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Mapping Artists Data */}
					<div className="albums-section mt-10">
						<h2 className="font-bold text-2xl mb-4">Your Favourite Artists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5">
							{ArtistsData.map((artist) => (
								<div
									key={artist.id}
									className=" w-3/4 cursor-pointer transition-transform transform hover:scale-105"
								>
									<figure className="h-40 w-40  rounded-full overflow-hidden">
										<img
											src={artist.image}
											alt={artist.name}
											className="w-full h-full object-cover"
										/>
									</figure>
									<div className="mt-2 px-2 py-2">
										<p className="text-[13px] font-bold">{artist.name}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{/*<Player />*/}
			<audio ref={audioRef} src={track?.file} preload="auto"></audio>
		</div>
	);
};

export default Home;
