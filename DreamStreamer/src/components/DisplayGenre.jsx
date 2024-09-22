import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trackClick } from "./trackClicks";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbums, fetchArtists, fetchGenres } from "../../actions/dataActions";

import Navbar from "./Navbar";

const DisplayGenre = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {  genres, error } = useSelector((state) => state.data);


	useEffect(() => {
		dispatch(fetchAlbums());
		dispatch(fetchArtists());
		dispatch(fetchGenres());
	}, [dispatch]);

	const handleGenreClick = (genreId) => {
		trackClick("genre", genreId);
		console.log("Genre clicked:", genreId);
		navigate(`/genre/${genreId}`);
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
			<div className="w-full m-2 px-6 pt-4 rounded bg-[#BF2EF0] text-white overflow-auto lg:ml-0">
			  <Navbar />
			  <input
						type="text"
						placeholder="Search for artists, albums, or tracks"
						className="searchTerm p-10 w-3/5 mt-6 "
						onKeyDown={handleSearch}
					/>
			  <h1 className="text-white text-3xl mb-3 mt-3 font-bold">All genres</h1>
			  {error && <p>Error: {error}</p>}
			  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{Array.isArray(genres) &&
				  genres.map((genre) => (
					<div
					  className="bg-[#FEECB3] text-black p-4 rounded-lg  cursor-pointer transition-transform transform hover:scale-105"
					  onClick={() => handleGenreClick(genre.id)}
					  key={genre.id}
					>
					  <p className="text-[13px] font-semibold">{genre.genre_name}</p>
					</div>
				  ))}
			  </div>
			</div>
		  </div>
		</div>
	  );
	
};

export default DisplayGenre;
