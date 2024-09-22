
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbums, fetchArtists, fetchGenres } from "../../actions/dataActions";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { trackClick } from "./trackClicks";

const Album = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { albums, artists, genres, error } = useSelector((state) => state.data);

	useEffect(() => {
		dispatch(fetchAlbums());
		dispatch(fetchArtists());
		dispatch(fetchGenres());
	}, [dispatch]);

	const getArtistNameById = (artistId) => {
		const artist = artists.find((artist) => artist.id === artistId);
		return artist ? artist.artist_name : "Unknown Artist";
	};

	const getGenreNameById = (genreId) => {
		const genre = genres.find((genre) => genre.id === genreId);
		return genre ? genre.genre_name : "Unknown Genre";
	};

	const handleAlbumClick = (albumId) => {
		trackClick("album", albumId);
		console.log("Album clicked:", albumId);
		navigate(`/album/${albumId}`);
	};

	const handleSearch = (e) => {
		if (e.key === 'Enter') {
			const query = e.target.value;
			navigate(`/search?query=${query}`);
		}
	};

	return (
		<div className="h-screen bg-black">
			<div className="h-[100%] flex">
				<Sidebar />
				<div className="w-full m-2 px-6 pt-4 rounded bg-[#4d4a4a] text-white overflow-auto lg:ml-0">
					<Navbar />
					<input
						type="text"
						placeholder="Search for artists, albums, or tracks"
						className="searchTerm p-10 w-3/5 mt-6"
						onKeyDown={handleSearch}
					/>
					<h1 className="text-white text-3xl mb-3 mt-3 font-bold">All albums</h1>
					{error && <p className="text-red-500">Error: {error}</p>}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{Array.isArray(albums) && albums.map((album) => (
							<div
								key={album.id}
								onClick={() => handleAlbumClick(album.id)}
								className="w-3/4 cursor-pointer transition-transform transform hover:scale-105"
							>
								<figure>
									{album.album_art ? (
										<img src={album.album_art} alt={album.album_name} className="h-56 bg-red-950" />
									) : (
										<div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
											No image available
										</div>
									)}
								</figure>
								<div className="mt-2 px-2 py-2">
									<p className="text-[13px] font-bold">{album.album_name}</p>
									<p className="text-[12px]">{getArtistNameById(album.artist_id)}</p>
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
