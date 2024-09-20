import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { trackClick } from "./trackClicks";
import Navbar from "./Navbar";

const DisplayGenre = () => {
	const [genres, setGenres] = useState([]); // Fix useState syntax
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchGenres = async () => {
			try {
				const response = await fetch(
					"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/",
					{
						method: "GET",
					},
						"https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/"
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const rawData = await response.text();
				console.log("Raw API response:", rawData);

				const data = JSON.parse(rawData);

				console.log("Parsed API data:", data);

				if (data.body) {
					const parsedData = JSON.parse(data.body);
					setGenres(parsedData);
				} else {
					setGenres(data);
				}
			} catch (error) {
				setError(error.message);
			}
		};

		fetchGenres();
	}, []);

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
			<div className="w-full m-2 px-6 pt-4 rounded bg-[#390F0B] text-white overflow-auto lg:ml-0">
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
					  className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-500 cursor-pointer transition-transform transform hover:scale-105"
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
