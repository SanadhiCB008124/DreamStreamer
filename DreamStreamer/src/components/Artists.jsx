import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { trackClick } from "./trackClicks";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbums, fetchArtists, fetchGenres } from "../../actions/dataActions";

const Artists = () => {


	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {artists, error } = useSelector((state) => state.data);
	useEffect(() => {
		dispatch(fetchAlbums());
		dispatch(fetchArtists());
		dispatch(fetchGenres());
	}, [dispatch]);

	



	const handleArtistClick=(artistId)=>{
		trackClick('artist',artistId);
		console.log('Artist clicked:',artistId);
		navigate(`/artist/${artistId}`)
	}
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
				
				<h1 className="text-white text-3xl mb-3 mt-3 font-bold">All artists</h1>
				{error && <p className="text-red-500">Error: {error}</p>}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5">
					{Array.isArray(artists) &&
						artists.map((artist) => (
							<div
								key={artist.id}
								onClick={() => handleArtistClick(artist.id)}
								className=" w-3/4 cursor-pointer transition-transform transform hover:scale-105"
							>
								<figure className="h-40 w-40  rounded-full overflow-hidden">
									{artist.artist_profile_image ? (
										<img
											src={artist.artist_profile_image}
											alt={artist.artist_name}
												className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
											No image available
										</div>
									)}
								</figure>
								<div className="mt-2 px-2 py-2">
									<p className="text-[13px] font-bold">{artist.artist_name}</p>
									<p className="text-[13px] ">Artist</p>
								
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
		</div>
	);
};

export default Artists;
