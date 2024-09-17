import Navbar from "./Navbar";
import { albumsData, ArtistsData } from "../assets/assets";
import AlbumItem from "./AlbumItem";
import { songsData } from "../assets/assets";
import SongItem from "./SongItem";
import ArtistItem from "./ArtistManagement";

const DisplayHome = () => {
	return (
		<>
			<Navbar />
			<div className="mb-4 ">
				<h1 className="my-5 font-bold text-2xl">Top Artists</h1>
				<div className="flex rounded-full ">
					{ArtistsData.map((item, index) => (
						<ArtistItem
							key={index}
							name={item.name}
							id={item.id}
							image={item.image}
						/>
					))}
				</div>
			</div>
			<div className="mb-4">
				<h1 className="my-5 font-bold text-2xl">Top Albums</h1>
				<div className="flex overflow-auto">
					{albumsData.map((item, index) => (
						<AlbumItem
							key={index}
							name={item.name}
							desc={item.desc}
							id={item.id}
							image={item.image}
							likes={item.likes}
							streams={item.streams}
						/>
					))}
				</div>
			</div>

			<div className="mb-4">
				<h1 className="my-5 font-bold text-2xl">New Releases</h1>
				<div className="flex overflow-auto">
					{songsData.map((item, index) => (
						<SongItem
							key={index}
							name={item.name}
							image={item.image}
							desc={item.desc}
							duration={item.duration}
							file={item.file}
							id={item.id}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default DisplayHome;
