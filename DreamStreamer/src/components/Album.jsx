import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Album = () => {
	const [albums, setAlbums] = useState([]);
	const [artists, setArtists] = useState([]);
	const [genres, setGenres] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAlbumsAndArtistsAndGenres = async () => {
			try {
				// Fetch all necessary data
				const [albumsResponse, artistsResponse, genresResponse] =
					await Promise.all([
						fetch(
							"https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/"
						),
						fetch(
							"https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/"
						),
						fetch(
							"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/"
						),
					]);

				// Check if responses are okay
				if (!albumsResponse.ok || !artistsResponse.ok || !genresResponse.ok) {
					throw new Error("Network response was not ok");
				}

				// Parse responses
				const albumsData = await albumsResponse.json();
				const artistsData = await artistsResponse.json();
				const genresData = await genresResponse.json();

				console.log("Albums API data:", albumsData);
				console.log("Artists API data:", artistsData);
				console.log("Genres API data:", genresData);

				// Set state with parsed data
				setAlbums(albumsData);
				setArtists(artistsData);
				setGenres(genresData);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchAlbumsAndArtistsAndGenres();
	}, []);

	const getArtistNameById = (artistId) => {
		const artist = artists.find((artist) => artist.id === artistId);
		return artist ? artist.artist_name : "Unknown Artist";
	};

	const getGenreNameById = (genreId) => {
		const genre = genres.find((genre) => genre.id === genreId);
		return genre ? genre.genre_name : "Unknown Genre";
	};

	const navigate = useNavigate();

	return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="p-4 flex-1">
				{error && <p className="text-red-500">Error: {error}</p>}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{Array.isArray(albums) &&
						albums.map((album) => (
							<div
								key={album.id}
								onClick={() => navigate(`/album/${album.id}`)}
								className="card card-compact bg-base-100 shadow-xl cursor-pointer transition-transform transform hover:scale-105"
							>
								<figure>
									{album.album_art ? (
										<img
											src={album.album_art}
											alt={album.album_name}
											className="w-full h-48 object-cover"
										/>
									) : (
										<div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
											No image available
										</div>
									)}
								</figure>
								<div className="card-body">
									<h2 className="card-title">{album.album_name}</h2>

									<h2 className="card-title">{album.artist_name}</h2>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default Album;
