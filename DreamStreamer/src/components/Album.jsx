import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackClick } from "./trackClicks";
import Navbar from "./Navbar";

const Album = () => {
	const [albums, setAlbums] = useState([]);
	const [artists, setArtists] = useState([]);
	const [genres, setGenres] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAlbumsAndArtistsAndGenres = async () => {
			try {
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

				if (!albumsResponse.ok || !artistsResponse.ok || !genresResponse.ok) {
					throw new Error("Network response was not ok");
				}

				const albumsData = await albumsResponse.json();
				const artistsData = await artistsResponse.json();
				const genresData = await genresResponse.json();

				console.log("Albums API data:", albumsData);
				console.log("Artists API data:", artistsData);
				console.log("Genres API data:", genresData);

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

	const handleAlbumClick = (albumId) => {
		trackClick("album", albumId);
		console.log("Album clicked:", albumId);
		navigate(`/album/${albumId}`);
	};

	return (
		<div className="h-screen bg-black">
		  <div className="h-[100%] flex">
			<Sidebar />
			<div className="w-full m-2 px-6 pt-4 rounded bg-[#390F0B] text-white overflow-auto lg:ml-0">
			  <Navbar />
			  <h1 className="text-white text-3xl mb-3 mt-3 font-bold">All albums</h1>
			  {error && <p className="text-red-500">Error: {error}</p>}
			  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{Array.isArray(albums) &&
				  albums.map((album) => (
					<div
					  key={album.id}
					  onClick={() => handleAlbumClick(album.id)}
					  className=" w-3/4  cursor-pointer transition-transform transform hover:scale-105"
					>
					  <figure>
						{album.album_art ? (
						  <img
							src={album.album_art}
							alt={album.album_name}
							className="h-56 bg-red-950"
						  />
						) : (
						  <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
							No image available
						  </div>
						)}
					  </figure>
					  <div className="mt-2 px-2 py-2">
						<p className="text-[13px] font-bold">{album.album_name}</p>
						<p className="text-[12px]">
						  {getArtistNameById(album.artist_id)}
						</p>
					  </div>
					</div>
				  ))}
			  </div>
			</div>
		  </div>
		</div>
	  );
	
	
};

export default Album;
