import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Sidebar from "./Sidebar";
import { assets } from "../assets/assets";
import { songsData } from "../assets/assets";

const DisplayAlbum = () => {
	const { id } = useParams();
	const [albumData, setAlbumData] = useState(null);
	const [error, setError] = useState(null);
	const { playWithId } = useContext(PlayerContext);
	const [artists, setArtists] = useState([]);
	const [genres, setGenres] = useState([]);

	useEffect(() => {
		const fetchAlbumsAndArtistsAndGenres = async () => {
			try {
				// Fetch all necessary data
				const [albumResponse, artistsResponse, genresResponse] =
					await Promise.all([
						fetch(
							`https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/${id}/`
						),
						fetch(
							"https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/"
						),
						fetch(
							"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/"
						),
					]);

				// Check if responses are okay
				if (!albumResponse.ok || !artistsResponse.ok || !genresResponse.ok) {
					throw new Error("Network response was not ok");
				}

				// Parse responses
				const albumData = await albumResponse.json();
				const artistsData = await artistsResponse.json();
				const genresData = await genresResponse.json();

				console.log("Album API data:", albumData);
				console.log("Artists API data:", artistsData);
				console.log("Genres API data:", genresData);

				// Set state with parsed data
				setAlbumData(albumData);
				setArtists(artistsData);
				setGenres(genresData);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchAlbumsAndArtistsAndGenres();
	}, [id]);

	const getArtistNameById = (artistId) => {
		const artist = artists.find((artist) => artist.id === artistId);
		return artist ? artist.artist_name : "Unknown Artist";
	};

	const getGenreNameById = (genreId) => {
		const genre = genres.find((genre) => genre.id === genreId);
		return genre ? genre.genre_name : "Unknown Genre";
	};

	if (error) {
		return <p>Error: {error}</p>;
	}

	if (!albumData) {
		return <p>Loading...</p>;
	}

	return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="flex-1 bg-[#4b1842] p-4 overflow-auto mt-2 mb-2 mr-2">
				<div className="flex gap-6 align-middle items-center">
					{error && <p className="text-red-500">{error}</p>}{" "}
					{/* Display error if any */}
					{albumData ? (
						<div>
							{albumData.album_art ? (
								<img
									src={albumData.album_art}
									alt={albumData.album_name}
									className="w-full h-48 object-cover"
								/>
							) : (
								<div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
									No image available
								</div>
							)}
						</div>
					) : (
						<p>Loading album details...</p> // Display while data is being fetched
					)}
					<div className="flex flex-col text-white">
						<p>Playlist</p>
						<h2 className="text-5xl font-bold mb-4 md:text-7xl">
							{albumData.album_name}
						</h2>
						<p className="text-2xl mb-4">
							{getArtistNameById(albumData.artist_id)}
						</p>
						<p>
						 tracks: {albumData.no_of_tracks}
						</p>
						<p className="text-2xl">{getGenreNameById(albumData.genre_id)}</p>
						<button className="mt-5 bg-black rounded h-[40px] w-1/2">
							Play Now
						</button>
					</div>
				</div>

				<div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 text-[#a7a7a7]">
					<p>
						<b className="mr-4">#</b> Title
					</p>
					<p>Album</p>
					<p className="hidden sm:block"> Year</p>
					<img className="m-auto w-4" src={assets.clock} alt="" />
				</div>
				<hr />
				{/* Assume songsData is fetched separately */}
				{songsData.map((item, index) => (
					<div
						onClick={() => playWithId(item.id)}
						key={index}
						className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
					>
						<p className="text-white">
							<b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
							<img className="inline w-10 mr-5" src={item.image} alt="" />
							{item.name}
						</p>
						<p className="text-[15px]">{albumData.album_name}</p>
						<p className="text-[15px] hidden sm:block">{albumData.year}</p>
						<p className="text-[15px] text-center"></p>
					</div>
				))}
			</div>
		</div>
	);
};

export default DisplayAlbum;
