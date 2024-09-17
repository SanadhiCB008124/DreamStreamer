import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Sidebar from "./Sidebar";
import { assets } from "../assets/assets";

const DisplayAlbum = () => {
	const { id } = useParams();
	const [albumData, setAlbumData] = useState(null);
	const [error, setError] = useState(null);
	const { playWithId } = useContext(PlayerContext);
	const [artists, setArtists] = useState([]);
	const [genres, setGenres] = useState([]);
	const [tracks, setTracks] = useState([]);

	useEffect(() => {
		const fetchAlbumDetails = async () => {
			try {
				// Fetch album, artists, genres, and tracks
				const [albumResponse, artistsResponse, genresResponse, tracksResponse] =
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
						fetch(
							"https://q6b4jpy70l.execute-api.us-east-1.amazonaws.com/dev/tracks/"
						),
					]);

				if (
					!albumResponse.ok ||
					!artistsResponse.ok ||
					!genresResponse.ok ||
					!tracksResponse.ok
				) {
					throw new Error("Network response was not ok");
				}

				const albumData = await albumResponse.json();
				const artistsData = await artistsResponse.json();
				const genresData = await genresResponse.json();
				const tracksData = await tracksResponse.json();

				// Set state with the fetched data
				setAlbumData(albumData);
				setArtists(artistsData);
				setGenres(genresData);

				// Filter tracks to include only those from the current album
				const albumTracks = tracksData.filter(
					(track) => track.album_id === parseInt(id)
				);
				setTracks(albumTracks);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchAlbumDetails();
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
					<div className="flex flex-col text-white">
						<h2 className="text-5xl font-bold mb-4 md:text-7xl">
							{albumData.album_name}
						</h2>
						<p className="text-2xl mb-4">
							{getArtistNameById(albumData.artist_id)}
						</p>
						<p>Tracks: {albumData.no_of_tracks}</p>
						<p className="text-2xl">{getGenreNameById(albumData.genre_id)}</p>
						<p className="text-2xl">{albumData.year}</p>
						<button className="bg-black">Play all</button>
					</div>
				</div>

				<div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 text-[#a7a7a7]">
					<p>
				Track Title
					</p>
					<p>Album</p>
			<p></p>
				</div>
				<hr />

				{/*  the tracks for the  album */}
				{tracks.map((track, index) => (
					<div
						onClick={() => playWithId(track.id)}
						key={track.id}
						className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] "
					>
						<div className="cursor-pointer">
						<img src={assets.play} alt="" height={50} width={20} />
						</div>
					
						<p className="text-white">
							<b className="mr-4 text-[#a7a7a7] hidden">{index + 1}</b>
							{track.track_name}
						</p>
						<p className="text-[15px]">{albumData.album_name}</p>
						
					</div>
				))}
			</div>
		</div>
	);
};

export default DisplayAlbum;
